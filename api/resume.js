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
        generationConfig: { temperature: 0.6, maxOutputTokens: 512 }
      })
    });
    const data = await response.json();
    console.log("🤖 [GEMINI RESPONSE DATA]:", JSON.stringify(data, null, 2));
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }

  const { sectionName, currentText, targetTitle, prevTitle, yearsExp } = req.body;

  const prompt = `
You are a professional resume writer specializing in career re-entry for women professionals.

User's target role: ${targetTitle || 'Professional'}
User's background: ${prevTitle || 'Experienced'}, ${yearsExp || 'years'}

Improve the following "${sectionName}" resume section. Make it confident, ATS-friendly, and highlight transferable value. Do not add fake experience. Return only the improved plain text — no JSON, no labels, no markdown.

Current text: ${currentText}
`;

  try {
    const result = await callGeminiText(prompt);
    res.status(200).json({ text: result || currentText });
  } catch (err) {
    console.error(err);
    res.status(200).json({ text: currentText }); 
  }
}
