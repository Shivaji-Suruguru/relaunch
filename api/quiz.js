export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  async function callGemini(prompt) {
    console.log("🤖 [GEMINI REQUEST]:", prompt);
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          responseMimeType: "application/json"
        }
      })
    });
    const data = await response.json();
    console.log("🤖 [GEMINI RESPONSE DATA]:", JSON.stringify(data, null, 2));
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean || "[]");
  }

  const { roleTitle, difficulty } = req.body;

  const prompt = `
You are an interview coach creating a practice quiz.

Generate 4 multiple choice interview questions for: ${roleTitle}
Difficulty: ${difficulty}

Return ONLY a pure JSON array string without markdown of 4 questions:
[
  {
    "question": "",
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "explanation": "why the correct answer is right"
  }
]
`;

  try {
    const result = await callGemini(prompt);
    
    if (!Array.isArray(result) || result.length === 0) {
      throw new Error("Invalid structure");
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(200).json([
        { question: "How would you handle a sudden change in priority?", options: ["Ignore it", "Communicate with stakeholders", "Quit", "Complain"], correct: 1, explanation: "Communication is key." },
        { question: "What is your greatest strength?", options: ["I work too hard", "My resilience", "Nothing", "Sleeping"], correct: 1, explanation: "Resilience shows character." },
        { question: "How do you stay updated in your field?", options: ["I don't", "Social Media", "Industry blogs and courses", "TV"], correct: 2, explanation: "Continuous learning matters." },
        { question: "Can you explain the gap in your resume?", options: ["No", "I took a purposeful break and upskilled", "I was lazy", "I forgot"], correct: 1, explanation: "Framing the break positively is important." }
    ]);
  }
}
