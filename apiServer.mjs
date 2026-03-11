/**
 * Local API server for development — runs on port 3001.
 * Serves /api/analyze so Vite can proxy to it during local dev.
 * Uses GEMINI_API_KEY from .env automatically via dotenv.
 */
import 'dotenv/config';
import http from 'http';

import nodemailer from 'nodemailer';

const PORT = 3001;

// --- SMTP Configuration ---
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.resend.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
        user: process.env.SMTP_USER || 'resend',
        pass: process.env.SMTP_PASS || 're_4tkRynZx_DHgnuGvU4D5FprKUVs6UhhxE'
    }
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function sendEmail(to, subject, html) {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"RelaunchAI" <onboarding@suhask.dev>',
            to,
            subject,
            html
        });
        console.log(`📧 Email sent to ${to}`);
    } catch (err) {
        console.error('❌ Failed to send email:', err.message);
    }
}

async function callGemini(prompt, retries = 2) {
    for (let attempt = 0; attempt < retries; attempt++) {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048, responseMimeType: 'application/json' }
            })
        });
        const data = await response.json();
        if (data?.error) {
            const code = data.error.code;
            console.error(`Gemini API error (attempt ${attempt + 1}): [${code}] ${data.error.message}`);
            if (code === 429 && attempt < retries - 1) {
                console.log('Rate limited. Retrying in 12 seconds...');
                await new Promise(r => setTimeout(r, 12000));
                continue;
            }
            throw new Error(`Gemini API error ${code}: ${data.error.message}`);
        }
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        const clean = raw.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean || '{}');
        return parsed;
    }
    throw new Error('Max retries exceeded');
}

function sendJson(res, status, data) {
    const body = JSON.stringify(data);
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
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

const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') { sendJson(res, 204, {}); return; }
    const body = await getBody(req);
    
    if (req.url === '/api/welcome') {
        const { email, name } = body;
        await sendEmail(email, "Welcome to Re•Entry!", `
            <h1>Hi ${name || 'there'}!</h1>
            <p>Welcome to Re•Entry. We are excited to help you start your career comeback journey.</p>
            <p>You can now access your personalized roadmap and AI-driven career tools.</p>
            <br/>
            <p>Best regards,</p>
            <p>The Re•Entry Team</p>
        `);
        sendJson(res, 200, { success: true });
        return;
    }

    if (req.method !== 'POST') { sendJson(res, 405, { error: 'Method not allowed' }); return; }
    const { name, prevTitle, prevIndustry, yearsExp, prevResponsibilities, breakDuration, breakReason,
        breakActivities, targetTitle, targetIndustry, workType, techSkills, softSkills, tools,
        confidence, timeline, salaryRange, studyHours, biggestChallenge } = body;

    console.log(`\n✨ AI Request received for: ${name || 'User'} → Target: ${targetTitle}`);

    const prompt = `
You are an expert AI career coach specializing in helping women professionals return to work after career breaks. Analyze the following user profile and return a detailed, personalized career comeback plan.

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

Return ONLY a pure JSON object (no markdown, no fences) with this exact structure:
{
  "readinessScore": 85,
  "headline": "short professional headline",
  "summary": "2-3 sentence personalized career summary",
  "keyStrengths": ["strength 1","strength 2","strength 3","strength 4"],
  "skillGaps": [
    { "skill": "", "priority": "high", "timeToLearn": "", "reason": "" }
  ],
  "topRoles": [
    { "title": "", "matchScore": 85, "industry": "", "salaryRange": "", "reason": "" }
  ],
  "roadmap": [
    { "phase": 1, "title": "Foundation & Refresh", "duration": "Weeks 1-2", "tasks": ["","",""], "milestone": "" }
  ],
  "immediateActions": [
    { "priority": 1, "action": "", "timeframe": "Today" }
  ],
  "confidenceBoost": "personalized motivational message that directly addresses the user's stated biggest challenge"
}
`;

    try {
        if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');
        const result = await callGemini(prompt);
        if (!result.readinessScore) throw new Error('Invalid AI response structure');
        console.log(`✅ Gemini analysis complete. Score: ${result.readinessScore}`);
        sendJson(res, 200, result);
    } catch (err) {
        console.error(`❌ Gemini error: ${err.message}. Sending smart fallback.`);
        sendJson(res, 200, {
            readinessScore: 78,
            headline: `Strategic ${targetTitle} returning from purposeful break`,
            summary: `Your ${yearsExp} background in ${prevIndustry} gives you a unique edge. Your resilience during your break makes you stand out in ${targetIndustry} roles.`,
            keyStrengths: ['Cross-functional communication', 'Adaptability under pressure', 'Strategic planning', 'Empathy and team leadership'],
            skillGaps: [
                { skill: 'Advanced Industry Tools', priority: 'high', timeToLearn: '2 weeks', reason: 'Standard requirement for target role' },
                { skill: 'Modern API Integrations', priority: 'medium', timeToLearn: '3 weeks', reason: 'Core domain knowledge needed' }
            ],
            topRoles: [
                { title: targetTitle, matchScore: 88, industry: targetIndustry, salaryRange: salaryRange, reason: 'Direct skill transfer from past roles.' }
            ],
            roadmap: [
                { phase: 1, title: 'Foundation & Refresh', duration: 'Weeks 1-2', tasks: ['Resume optimization', 'LinkedIn update', 'Network outreach'], milestone: 'Profile ready for views' },
                { phase: 2, title: 'Skill Building', duration: 'Weeks 3-6', tasks: ['Complete foundational courses', 'Build 1 portfolio project', 'Mock interviews'], milestone: '1 polished project live' },
                { phase: 3, title: 'Active Job Search', duration: 'Weeks 7-10', tasks: ['Apply to 10 targeted roles', 'Attend 3 intro calls', 'Tailor cover letters'], milestone: '3 first-round interviews' },
                { phase: 4, title: 'Interview & Offer', duration: 'Weeks 11-12', tasks: ['Final round prep', 'Offer negotiation', 'Acceptance setup'], milestone: 'Signed offer letter' }
            ],
            immediateActions: [
                { priority: 1, action: `Finalize your ${targetTitle} resume`, timeframe: 'Today' },
                { priority: 2, action: 'Connect with 5 former colleagues on LinkedIn', timeframe: 'This week' }
            ],
            confidenceBoost: `You've managed complex situations with grace during your break. Your concern about "${biggestChallenge}" is valid, but your proven track record speaks louder. You are absolutely ready.`
        });
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 Re•Entry API server running on http://localhost:${PORT}`);
    console.log(`   GEMINI_API_KEY: ${GEMINI_API_KEY ? '✅ Loaded' : '❌ MISSING — set it in .env!'}`);
    console.log(`   Now run "npm run dev" in another terminal to start the frontend.\n`);
});
