import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, name } = req.body;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"RelaunchAI" <onboarding@suhask.dev>',
      to: email,
      subject: 'Welcome to Re•Entry!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6B4C8B;">Hi ${name || 'there'}! 👋</h1>
          <p style="font-size: 16px; color: #333;">Welcome to <strong>Re•Entry</strong> — your AI-powered comeback platform.</p>
          <p style="font-size: 16px; color: #333;">Your personalized career journey starts now. Complete your onboarding to get your AI-powered roadmap.</p>
          <a href="https://relaunch-nine.vercel.app" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#6B4C8B;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Go to Dashboard →</a>
          <p style="margin-top: 32px; font-size: 14px; color: #999;">You're receiving this because you signed up at Re•Entry.</p>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Welcome email error:', err.message);
    // Don't fail the signup if email fails
    return res.status(200).json({ success: false, warning: err.message });
  }
}
