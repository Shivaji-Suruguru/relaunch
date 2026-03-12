import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const { Pool } = pg;
const JWT_SECRET = 'relaunch-super-secret-key-123';

function getPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}

async function sendWelcomeEmail(email, name) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"RelaunchAI" <onboarding@suhask.dev>',
      to: email,
      subject: 'Welcome to Re•Entry!',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h1 style="color:#6B4C8B;">Hi ${name || 'there'}! 👋</h1>
          <p>Welcome to <strong>Re•Entry</strong> — your AI-powered comeback platform.</p>
          <p>Complete your onboarding to get your personalized AI roadmap.</p>
          <a href="https://relaunch-nine.vercel.app" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#6B4C8B;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Go to Dashboard →</a>
        </div>
      `
    });
  } catch (err) {
    console.warn('Welcome email failed (non-blocking):', err.message);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, email, password, name, confirm } = req.body;

  if (!type || !['signup', 'login'].includes(type)) {
    return res.status(400).json({ error: 'Invalid auth type. Use "signup" or "login".' });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const pool = getPool();

  try {
    // ── SIGNUP ──────────────────────────────────────────────────────────────
    if (type === 'signup') {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userResult = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
        [email, hashedPassword]
      );
      const userId = userResult.rows[0].id;

      await pool.query(
        'INSERT INTO profiles (user_id, full_name, email) VALUES ($1, $2, $3)',
        [userId, name || '', email]
      );

      const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

      // Send welcome email (non-blocking)
      sendWelcomeEmail(email, name);

      return res.status(200).json({ user: { id: userId, email, name }, token });
    }

    // ── LOGIN ───────────────────────────────────────────────────────────────
    if (type === 'login') {
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: 'No account found with this email' });
      }

      const user = userResult.rows[0];
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      const profileResult = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [user.id]);
      const profile = profileResult.rows[0];
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        user: { id: user.id, email: user.email, name: profile?.full_name },
        token,
        onboarding_complete: profile?.onboarding_complete || false
      });
    }

  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(500).json({ error: err.message || 'Authentication failed' });
  } finally {
    await pool.end();
  }
}
