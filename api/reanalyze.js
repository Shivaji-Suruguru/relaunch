export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  async function callGemini(prompt) {
    console.log("🤖 [GEMINI REQUEST]:", prompt);
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
    console.log("🤖 [GEMINI RESPONSE DATA]:", JSON.stringify(data, null, 2));
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean || "{}");
  }

  const { completedTaskCount, totalTaskCount, skillProgressMap, onboardingData } = req.body;

  const prompt = `
You are an expert AI career coach updating a user's readiness score.

The user has completed ${completedTaskCount} out of ${totalTaskCount} tasks on their roadmap.
Their skill progress is: ${JSON.stringify(skillProgressMap || {})}
Their original target role was: ${onboardingData?.targetTitle}

Return ONLY a pure JSON object string without any markdown with:
{
  "readinessScore": integer 0-100 (should be higher now),
  "immediateActions": [
    { "priority": 1, "action": "new action", "timeframe": "Today" }
  ]
}
`;

  try {
    const result = await callGemini(prompt);
    
    if (!result.readinessScore) {
      throw new Error("Invalid structure");
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(200).json({
        readinessScore: 92,
        immediateActions: [
            { priority: 1, action: "Apply to top 3 matching roles", timeframe: "Today" },
            { priority: 2, action: "Update LinkedIn bio", timeframe: "This week" }
        ]
    });
  }
}
