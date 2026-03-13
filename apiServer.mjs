/**
 * RE-ENTRY BACKEND SERVER (Neon/PostgreSQL + Gemini + Resend)
 * This server replaces all Supabase functionality.
 */
import 'dotenv/config';
import http from 'http';
import nodemailer from 'nodemailer';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const PORT = 3001;
const JWT_SECRET = 'relaunch-super-secret-key-123';

// --- Database Connection (Neon) ---
const dbUrl = new URL(process.env.DATABASE_URL || 'postgres://localhost:5432/postgres');
dbUrl.searchParams.set('sslmode', 'verify-full');
const pool = new Pool({
  connectionString: dbUrl.toString(),
});

// --- SMTP Configuration (Resend) ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// --- Helper Functions ---
function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

async function getBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
  });
}

async function callGemini(prompt) {
  console.log(`🤖 [GEMINI REQUEST]`);
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048, responseMimeType: 'application/json' }
    })
  });
  const data = await response.json();
  if (data?.error) throw new Error(data.error.message);
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean || '{}');
}

// --- Main Server ---
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { sendJson(res, 204, {}); return; }
  
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const body = await getBody(req);

  try {
    // 1. Database Initialization (Manual trigger if needed)
    if (url.pathname === '/api/init-db') {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS profiles (
          user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          full_name TEXT,
          email TEXT,
          onboarding_complete BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS onboarding_data (
          id SERIAL PRIMARY KEY,
          user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          data JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS analyses (
          id SERIAL PRIMARY KEY,
          user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          result JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      return sendJson(res, 200, { message: "Database tables initialized!" });
    }

    // 2. Authentication: Signup
    if (url.pathname === '/api/auth/signup') {
      const { email, password, name } = body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const userResult = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
        [email, hashedPassword]
      );
      const userId = userResult.rows[0].id;
      await pool.query(
        'INSERT INTO profiles (user_id, full_name, email) VALUES ($1, $2, $3)',
        [userId, name, email]
      );
      const token = jwt.sign({ userId, email }, JWT_SECRET);
      return sendJson(res, 200, { user: { id: userId, email, name }, token });
    }

    // 3. Authentication: Login
    if (url.pathname === '/api/auth/login') {
      const { email, password } = body;
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userResult.rows.length === 0) return sendJson(res, 401, { error: "User not found" });
      
      const user = userResult.rows[0];
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return sendJson(res, 401, { error: "Invalid password" });

      const profileResult = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [user.id]);
      const profile = profileResult.rows[0];
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      
      return sendJson(res, 200, { 
        user: { id: user.id, email: user.email, name: profile?.full_name }, 
        token,
        onboarding_complete: profile?.onboarding_complete 
      });
    }

    // 4. Get User Profile & Analysis
    if (url.pathname === '/api/user/data') {
      const authHeader = req.headers.authorization;
      if (!authHeader) return sendJson(res, 401, { error: "Unauthorized" });
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const userId = decoded.userId;
      const profile = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
      const onboarding = await pool.query('SELECT * FROM onboarding_data WHERE user_id = $1', [userId]);
      const analysis = await pool.query('SELECT * FROM analyses WHERE user_id = $1', [userId]);

      return sendJson(res, 200, {
        profile: profile.rows[0],
        onboardingData: onboarding.rows[0]?.data,
        analysis: analysis.rows[0]?.result
      });
    }

    if (url.pathname === '/api/welcome') {
      const { email, name } = body;
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"RelaunchAI" <onboarding@suhask.dev>',
        to: email,
        subject: "Welcome to Re•Entry!",
        html: `<h1>Hi ${name || 'there'}!</h1><p>Welcome to Re•Entry. Your comeback starts now.</p>`
      });
      return sendJson(res, 200, { success: true });
    }

    // 5. Onboarding & AI Analysis
    if (url.pathname === '/api/analyze') {
      const { user_id, name, ...onboardingPayload } = body;
      const { prevTitle, prevIndustry, yearsExp, prevResponsibilities, breakDuration, breakReason, breakActivities, targetTitle, targetIndustry, workType, techSkills, softSkills, tools, confidence, timeline, salaryRange, studyHours, biggestChallenge } = onboardingPayload;
      
      console.log(`\n✨ AI Request for: ${name || 'User'} → Target: ${targetTitle}`);

      const prompt = `
You are an expert AI career coach specializing in helping women professionals return to work after career breaks. Analyze the profile and return a detailed, personalized career comeback plan.

USER PROFILE:
- Name: ${name || 'User'}
- Previous Role: ${prevTitle} in ${prevIndustry}
- Years of Experience: ${yearsExp}
- Key Responsibilities: ${prevResponsibilities}
- Career Break Duration: ${breakDuration}
- Reason for Break: ${breakReason}
- Activities During Break: ${breakActivities}
- Target Role: ${targetTitle} in ${targetIndustry}
- Work Preference: ${workType}
- Technical Skills: ${Array.isArray(techSkills) ? techSkills.join(', ') : techSkills}
- Soft Skills: ${Array.isArray(softSkills) ? softSkills.join(', ') : softSkills}
- Tools Used: ${tools}
- Self-Confidence Level: ${confidence}/10
- Return Timeline: ${timeline}
- Expected Salary: ${salaryRange}
- Weekly Study Hours Available: ${studyHours}
- Biggest Challenge: ${biggestChallenge}

Return ONLY a pure JSON object string without any markdown fences or formatting with this exact structure:
{
  "readinessScore": 85,
  "headline": "",
  "summary": "",
  "keyStrengths": [],
  "skillGaps": [{ "skill": "", "priority": "high", "timeToLearn": "", "reason": "" }],
  "topRoles": [{ "title": "", "matchScore": 85, "industry": "", "salaryRange": "", "reason": "" }],
  "roadmap": [{ "phase": 1, "title": "", "duration": "", "tasks": [], "milestone": "" }],
  "immediateActions": [{ "priority": 1, "action": "", "timeframe": "" }],
  "confidenceBoost": ""
}
`;

      let result;
      try {
        result = await callGemini(prompt);
        if (!result.readinessScore) throw new Error("Invalid AI structure");
      } catch (err) {
        console.error("AI Error, using fallback:", err.message);
        result = {
          readinessScore: 78,
          headline: `Strategic ${targetTitle} returning from purposeful break`,
          summary: `Your background in ${prevIndustry} gives you a unique edge.`,
          keyStrengths: ["Leadership", "Adaptability"],
          skillGaps: [{ skill: "Modern Tools", priority: "high", timeToLearn: "2 weeks", reason: "Market requirement" }],
          topRoles: [{ title: targetTitle, matchScore: 88, industry: targetIndustry, salaryRange, reason: "Direct skill transfer." }],
          roadmap: [{ phase: 1, title: "Foundation", duration: "Weeks 1-2", tasks: ["Resume optimization"], milestone: "Ready" }],
          immediateActions: [{ priority: 1, action: "Finalize resume", timeframe: "Today" }],
          confidenceBoost: `You are ready to face '${biggestChallenge}'.`
        };
      }

      // Save to Neon
      if (user_id) {
        try {
          await pool.query(
            'INSERT INTO onboarding_data (user_id, data) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET data = $2',
            [user_id, onboardingPayload]
          );
          await pool.query(
            'INSERT INTO analyses (user_id, result) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET result = $2',
            [user_id, result]
          );
          await pool.query(
            'UPDATE profiles SET onboarding_complete = TRUE WHERE user_id = $1',
            [user_id]
          );
        } catch (dbErr) {
          console.error("DB Save error:", dbErr.message);
        }
      }

      return sendJson(res, 200, result);
    }

    sendJson(res, 404, { error: "Endpoint not found" });

  } catch (err) {
    console.error("❌ Server Error:", err.message);
    sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, async () => {
    console.log(`\n🚀 Neon API Server running on http://localhost:${PORT}`);
    console.log(`📡 Connecting to Neon...`);
    try {
        await pool.query('SELECT NOW()');
        console.log(`✅ Database Connected!`);
        // Force a clean start to fix type mismatches (UUID vs Serial)
        console.log(`📦 Re-initializing tables for custom Auth...`);
        await pool.query(`
            DROP TABLE IF EXISTS analyses CASCADE;
            DROP TABLE IF EXISTS onboarding_data CASCADE;
            DROP TABLE IF EXISTS profiles CASCADE;
            DROP TABLE IF EXISTS users CASCADE;

            CREATE TABLE users (
                id SERIAL PRIMARY KEY, 
                email TEXT UNIQUE NOT NULL, 
                password TEXT NOT NULL, 
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            CREATE TABLE profiles (
                user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, 
                full_name TEXT, 
                email TEXT, 
                onboarding_complete BOOLEAN DEFAULT FALSE, 
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            CREATE TABLE onboarding_data (
                id SERIAL PRIMARY KEY, 
                user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE, 
                data JSONB, 
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            CREATE TABLE analyses (
                id SERIAL PRIMARY KEY, 
                user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE, 
                result JSONB, 
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log(`✨ Database Ready!`);
    } catch (e) {
        console.error(`❌ DB Connection failed: ${e.message}`);
    }
});
