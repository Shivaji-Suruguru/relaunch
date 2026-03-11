import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, RotateCcw } from 'lucide-react';

export const AnalyzingPage = ({ user, onboardingData, onComplete }) => {
  const [phase, setPhase] = useState(0);
  const phases = [
    "Analyzing your career background", "Identifying transferable skills", "Mapping skill gaps to market demand",
    "Generating your personalized roadmap", "Matching you with relevant opportunities", "Crafting your comeback strategy", "Finalizing your profile report"
  ];

  useEffect(() => {
    let interval = setInterval(() => {
      setPhase(p => { if (p < phases.length - 1) return p + 1; clearInterval(interval); return p; });
    }, 1800);

    const performAnalysis = async () => {
      console.log("🎨 [AnalyzingPage] Starting AI analysis with data:", onboardingData);
      try {
        const payload = { ...onboardingData, name: user?.name, user_id: user?.id };
        console.log("📤 [AnalyzingPage] Sending payload to /api/analyze...");
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`API returned ${response.status}: ${errText}`);
        }
        
        const result = await response.json();
        console.log("📥 [AnalyzingPage] AI Response received:", result);

        console.log("🚀 [AnalyzingPage] Analysis complete. Notifying App...");
        onComplete(result);
      } catch (err) {
        console.error("❌ [AnalyzingPage] Analysis process failed:", err);
        const fallbackData = {
          readinessScore: 75,
          headline: "Ready for Re-Entry",
          summary: "Your background provides a strong base for your return journey.",
          keyStrengths: ["Adaptability", "Prior Industry Knowledge", "Transferable Skills"],
          skillGaps: [{ skill: "Modern Technical Stack", priority: "high", reason: "Tech has evolved.", timeToLearn: "2-4 weeks" }],
          topRoles: [{ title: onboardingData?.targetTitle || "Professional", industry: onboardingData?.targetIndustry || "Target Industry", salaryRange: onboardingData?.salaryRange || "$60K-$80K", matchScore: 80 }],
          confidenceBoost: "You have the resilience and skills to succeed in your comeback!"
        };
        console.log("⚠️ [AnalyzingPage] Switching to fallback data due to error.");
        onComplete(fallbackData);
      }
    };
    performAnalysis();

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-mid) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '24px' }}>
      <div style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '48px' }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid rgba(124, 61, 110, 0.3)', animation: 'pulse-ring 2s infinite' }} />
          <div style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', border: '2px solid rgba(212, 168, 83, 0.4)', animation: 'pulse-ring 2s infinite 0.5s' }} />
          <div style={{ position: 'absolute', width: '60%', height: '60%', borderRadius: '50%', background: 'linear-gradient(135deg, var(--plum), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 0 40px rgba(124, 61, 110, 0.6)' }}>
            <Brain size={48} color="white" />
          </div>
        </div>

        <h2 className="serif animate-fadeInUp" style={{ fontSize: '36px', marginBottom: '16px', textAlign: 'center' }}>
          Analyzing Your Profile<span className="animate-pulse">...</span>
        </h2>
        <p className="animate-fadeInUp d1" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', marginBottom: '48px', textAlign: 'center' }}>
          Our AI is crafting your personalized comeback strategy
        </p>

        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {phases.map((text, i) => (
            <div key={i} className="animate-fadeInUp" style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: phase >= i ? 1 : 0.3, transition: 'opacity 0.5s' }}>
              <div style={{ width: '24px', height: '24px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {phase > i ? <CheckCircle size={20} color="var(--gold)" /> : phase === i ? <RotateCcw size={20} className="animate-spin" color="var(--plum-light)" /> : <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />}
              </div>
              <span style={{ fontSize: '16px', color: phase >= i ? 'white' : 'rgba(255,255,255,0.5)' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
