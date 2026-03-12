export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  async function callGeminiText(prompt) {
    console.log("🤖 [GEMINI REQUEST]:", prompt);
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 8192 }
      })
    });
    const data = await response.json();
    console.log("🤖 [GEMINI RESPONSE DATA]:", JSON.stringify(data, null, 2));
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }

  const { jobTitle, company, jobDescription, userBackground } = req.body;
  const { prevTitle, yearsExp, breakDuration } = userBackground || {};

  const prompt = `
You are a professional cover letter writer for career re-entry.

Write a confident, warm, ATS-friendly cover letter for a woman returning to work.

Job: ${jobTitle} at ${company}
Job description: ${jobDescription}
Applicant background: ${prevTitle}, ${yearsExp} experience, returning after ${breakDuration} break
Target to highlight: transferable skills, growth during break, enthusiasm for role

Return only the cover letter text. No labels. No JSON. No markdown. 3 paragraphs.
`;

  try {
    const result = await callGeminiText(prompt);
    res.status(200).json({ text: result || "Dear Hiring Manager..." });
  } catch (err) {
    console.error(err);
    res.status(200).json({ text: "Dear Hiring Team,\n\nI am writing to express my strong interest in the role at your company. With my background and renewed focus after a purposeful career break, I am ready to add significant value to your team.\n\nThank you for your consideration." });
  }
}
