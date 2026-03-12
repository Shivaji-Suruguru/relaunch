import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const JWT_SECRET = 'relaunch-super-secret-key-123';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const profile = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
    const onboarding = await pool.query('SELECT * FROM onboarding_data WHERE user_id = $1', [userId]);
    const analysis = await pool.query('SELECT * FROM analyses WHERE user_id = $1', [userId]);

    return res.status(200).json({
      profile: profile.rows[0] || null,
      onboardingData: onboarding.rows[0]?.data || null,
      analysis: analysis.rows[0]?.result || null
    });
  } catch (err) {
    console.error('User data error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  } finally {
    await pool.end();
  }
}
