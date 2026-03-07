export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_URL = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=\${GEMINI_API_KEY}\`;

  async function callGemini(prompt) {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "application/json"
        }
      })
    });
    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const clean = raw.replace(/\`\`\`json|\`\`\`/g, "").trim();
    return JSON.parse(clean || "[]");
  }

  const { skillName, prevTitle, targetTitle } = req.body;

  const prompt = \`
You are a learning advisor for professional upskilling.

The user is a \${prevTitle} returning to work, targeting a \${targetTitle} role. They need to learn: \${skillName}

Return ONLY a pure JSON array string without any markdown fences or formatting of exactly 3 learning resources:
[
  {
    "title": "",
    "provider": "e.g. Coursera, YouTube, LinkedIn Learning",
    "type": "Course | Video | Article | Certification",
    "duration": "e.g. 4 hours, 2 weeks",
    "level": "Beginner | Intermediate | Advanced",
    "url": "realistic URL hint",
    "why": "1 sentence why this is perfect for this user"
  }
]
\`;

  try {
    const result = await callGemini(prompt);
    
    if (!Array.isArray(result) || result.length === 0) {
      throw new Error("Invalid structure");
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(200).json([
      { title: "Essential " + skillName, provider: "Coursera", type: "Course", duration: "10 hours", level: "Beginner", url: "https://coursera.org", why: "Covers all the basics." },
      { title: skillName + " for Professionals", provider: "LinkedIn Learning", type: "Video", duration: "2 hours", level: "Intermediate", url: "https://linkedin.com/learning", why: "Quick refresher." },
      { title: "Advanced " + skillName, provider: "YouTube", type: "Video", duration: "5 hours", level: "Advanced", url: "https://youtube.com", why: "Deep dive into complex topics." }
    ]);
  }
}
