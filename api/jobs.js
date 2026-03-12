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
          maxOutputTokens: 2048,
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

  const { targetTitle, targetIndustry, workType, techSkills, salaryRange } = req.body;

  const prompt = `
You are a job market expert and career coach.

Generate 8 realistic job listings for a woman returning to work after a career break.
Target role: ${targetTitle}
Industry: ${targetIndustry}
Work preference: ${workType}
Skills: ${Array.isArray(techSkills) ? techSkills.join(', ') : techSkills}
Salary expectation: ${salaryRange}

Return ONLY a pure JSON array string without markdown of 8 jobs:
[
  {
    "id": 1,
    "title": "",
    "company": "",
    "industry": "",
    "matchScore": 85,
    "salaryRange": "",
    "workType": "Remote | Hybrid | On-site",
    "location": "",
    "skills": ["","",""],
    "description": "3 sentence job description",
    "whyMatch": "1 sentence why this fits the user's background",
    "postedDate": "e.g. 2 days ago"
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
        { id: 1, title: targetTitle || "Senior Manager", company: "TechNova", industry: targetIndustry || "Technology", matchScore: 92, salaryRange: salaryRange || "$100k-$120k", workType: workType || "Remote", location: "Global", skills: ["Leadership", "Agile", "Strategy"], description: "Lead teams through complex delivery cycles. We welcome diverse backgrounds.", whyMatch: "Excellent match for your transferable skills.", postedDate: "2 days ago" },
        { id: 2, title: "Director of " + (targetTitle || "Operations"), company: "GrowthScale", industry: targetIndustry || "Finance", matchScore: 88, salaryRange: salaryRange || "$100k-$120k", workType: "Hybrid", location: "New York", skills: ["Operations", "Scaling", "Budgeting"], description: "Help scale our operations.", whyMatch: "Your strong background is ideal.", postedDate: "5 hours ago" }
    ]);
  }
}
