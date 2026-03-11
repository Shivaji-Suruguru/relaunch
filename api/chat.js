export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

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

  const { message, conversationHistory = [], userContext = {} } = req.body;
  const { prevTitle, targetTitle, biggestChallenge } = userContext;

  const prompt = `
You are a warm, empowering AI career mentor for women professionals returning to work after a career break. Your name is Aria.

Speak like a trusted mentor — not a bot. Be specific, actionable, and encouraging. Never make the user feel their break was a mistake.

User context:
- Background: ${prevTitle}
- Target role: ${targetTitle}
- Biggest challenge: ${biggestChallenge}

Conversation history:
${conversationHistory.map((m) => `${m.role === 'user' ? 'User' : 'Aria'}: ${m.content}`).join('\n')}

User's new message: ${message}

Respond naturally in 2-4 sentences. Be specific to their background. Do not wrap response in markdown.
`;

  try {
    const result = await callGeminiText(prompt);
    res.status(200).json({ text: result || "I'm here to support you anytime!" });
  } catch (err) {
    console.error(err);
    res.status(200).json({ text: "I'm having a little trouble connecting right now, but your journey is so important. Try again in a moment!" });
  }
}
