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

  const { name, prevTitle, prevIndustry, yearsExp, prevResponsibilities, breakDuration, breakReason, breakActivities, targetTitle, targetIndustry, workType, techSkills, softSkills, tools, confidence, timeline, salaryRange, studyHours, biggestChallenge } = req.body;

  const prompt = `
You are an expert AI career coach specializing in helping women professionals return to work after career breaks. Analyze the following user profile and return a detailed, personalized career comeback plan.

USER PROFILE:
- Name: ${name || 'User'}
- Previous Role: ${prevTitle} in ${prevIndustry}
- Years of Experience: ${yearsExp}
- Key Responsibilities: ${prevResponsibilities}
- Career Break Duration: ${breakDuration}
- Reason for Break: ${breakReason}
- Activities During Break: ${breakActivities}
- Target Role: ${targetTitle} in ${targetIndustry}
- Work Preference: ${workType}
- Technical Skills: ${Array.isArray(techSkills) ? techSkills.join(', ') : techSkills}
- Soft Skills: ${Array.isArray(softSkills) ? softSkills.join(', ') : softSkills}
- Tools Used: ${tools}
- Self-Confidence Level: ${confidence}/10
- Return Timeline: ${timeline}
- Expected Salary: ${salaryRange}
- Weekly Study Hours Available: ${studyHours}
- Biggest Challenge: ${biggestChallenge}

Return ONLY a pure JSON object string without any markdown fences or formatting with this exact structure:
{
  "readinessScore": 85,
  "headline": "short professional headline",
  "summary": "2-3 sentence personalized career summary",
  "keyStrengths": ["strength 1","strength 2","strength 3","strength 4"],
  "skillGaps": [
    { "skill": "", "priority": "high", "timeToLearn": "", "reason": "" }
  ],
  "topRoles": [
    { "title": "", "matchScore": 85, "industry": "", "salaryRange": "", "reason": "" }
  ],
  "roadmap": [
    { "phase": 1, "title": "Foundation & Refresh", "duration": "Weeks 1-2", "tasks": ["","",""], "milestone": "" }
  ],
  "immediateActions": [
    { "priority": 1, "action": "", "timeframe": "Today" }
  ],
  "confidenceBoost": "personalized motivational message that directly addresses the user's stated biggest challenge"
}
`;

  try {
    const result = await callGemini(prompt);
    
    if (!result.readinessScore || !result.headline) {
        throw new Error("Invalid structure");
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(200).json({ 
        readinessScore: 78,
        headline: `Strategic ${targetTitle} returning from purposeful break`,
        summary: `Your ${yearsExp} background in ${prevIndustry} gives you a unique edge. Combining your deep expertise with the resilience gained during your break makes you uniquely positioned for ${targetIndustry} roles.`,
        keyStrengths: ["Cross-functional communication", "Adaptability under pressure", "Strategic planning", "Empathy and team leadership"],
        skillGaps: [
          { skill: "Advanced Industry Tools", priority: "high", timeToLearn: "2 weeks", reason: "Standard requirement for target role" },
          { skill: "Modern API Integrations", priority: "high", timeToLearn: "3 weeks", reason: "Core domain knowledge needed" }
        ],
        topRoles: [
          { title: targetTitle, matchScore: 88, industry: targetIndustry, salaryRange: salaryRange, reason: "Direct skill transfer from past roles." }
        ],
        roadmap: [
          { phase: 1, title: "Foundation & Refresh", duration: "Weeks 1-2", tasks: ["Resume optimization", "LinkedIn update", "Network reaching out"], milestone: "Profile ready for views" },
          { phase: 2, title: "Skill Building", duration: "Weeks 3-6", tasks: ["Complete foundational courses", "Build portfolio project", "Mock interviews"], milestone: "1 polished project" },
          { phase: 3, title: "Active Job Search", duration: "Weeks 7-10", tasks: ["Apply to targeted roles", "Attend 3 intro calls", "Tailor cover letters"], milestone: "3 first-round interviews" },
          { phase: 4, title: "Interview & Offer", duration: "Weeks 11-12", tasks: ["Final round prep", "Offer negotiation", "Acceptance setup"], milestone: "Signed offer letter" }
        ],
        immediateActions: [
          { priority: 1, action: "Finalize your " + targetTitle + " resume", timeframe: "Today" },
          { priority: 2, action: "Connect with 5 former colleagues", timeframe: "This week" }
        ],
        confidenceBoost: `You've managed complex situations with grace during your break. Your concern about '${biggestChallenge}' is valid, but your proven track record speaks louder. You are ready.`
    });
  }
}
