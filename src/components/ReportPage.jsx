import React from 'react';
import { 
  CheckCircle, ChevronRight, Target, Brain, 
  Trophy, Star, Sparkles, TrendingUp, Clock, AlertCircle
} from 'lucide-react';

export const ReportPage = ({ user, analysis, onContinue }) => {
  console.log("🎨 [ReportPage] Rendering with analysis:", analysis);
  if (!analysis) return null;
  const score = analysis.readinessScore;
  const color = score >= 75 ? '#D4A853' : score >= 50 ? '#D4A853' : '#E53E3E';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: '64px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* Header Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1A1014', fontWeight: 600, fontSize: '14px', background: 'white', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '100px', alignSelf: 'center' }} className="animate-fadeInUp">
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38A169' }}></div>
          AI Strategy Generated for {user?.name || 'User'}
        </div>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h1 className="serif animate-fadeInUp" style={{ fontSize: '56px', color: 'var(--dark)', lineHeight: 1, marginBottom: '24px' }}>
            Your Career <span className="text-gradient">Comeback Strategy</span>
          </h1>
          <p className="animate-fadeInUp d1" style={{ fontSize: '19px', color: 'var(--muted)', maxWidth: '700px', margin: '0 auto' }}>
            We've analyzed your {analysis.yearsExp || ''} background and crafted a personalized roadmap to your target role as a {analysis.topRoles?.[0]?.title || 'Professional'}.
          </p>
        </div>

        {/* Score & Summary Card */}
        <div className="card animate-fadeInUp d2" style={{ background: 'var(--dark)', color: 'white', padding: '48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.05))' }}></div>
          
          <div style={{ display: 'flex', gap: '64px', alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '160px', height: '160px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', width: '140px', height: '140px', borderRadius: '50%', border: `10px solid ${color}`, borderTopColor: 'transparent', transform: 'rotate(-45deg)' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="serif" style={{ fontSize: '56px', fontWeight: 700, color: 'white' }}>{score}%</span>
                  <span style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '-5px' }}>Readiness</span>
                </div>
              </div>
            </div>
            
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ color: 'var(--gold)', fontWeight: 600, marginBottom: '12px', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Expert Analysis</div>
              <h2 className="serif" style={{ fontSize: '36px', marginBottom: '20px', color: 'white' }}>{analysis.headline}</h2>
              <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>{analysis.summary}</p>
            </div>
          </div>
        </div>

        {/* Strengths & Gap Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
          <div className="card animate-fadeInUp d3">
            <h3 className="serif" style={{ fontSize: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={24} color="var(--gold)" /> Your Core Strengths
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {analysis.keyStrengths?.map((s, i) => (
                <div key={i} style={{ background: 'var(--cream)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="#38A169" /> {s}
                </div>
              ))}
            </div>
          </div>

          <div className="card animate-fadeInUp d4">
            <h3 className="serif" style={{ fontSize: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Target size={24} color="var(--plum)" /> Skill Gaps to Bridge
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analysis.skillGaps?.map((g, i) => (
                <div key={i} style={{ borderBottom: i !== analysis.skillGaps.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{g.skill}</span>
                    <span style={{ fontSize: '12px', color: 'var(--plum)', fontWeight: 600, background: 'rgba(124, 61, 110, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{g.priority}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {g.timeToLearn} &nbsp;·&nbsp; {g.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap Preview */}
        <div className="card animate-fadeInUp d5" style={{ background: 'white' }}>
          <h3 className="serif" style={{ fontSize: '28px', marginBottom: '32px', textAlign: 'center' }}>Your 12-Week Roadmap Preview</h3>
          <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px' }}>
            {analysis.roadmap?.map((step, i) => (
              <div key={i} style={{ minWidth: '240px', flex: 1, padding: '24px', background: 'var(--cream)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--plum)', fontWeight: 700, fontSize: '12px', marginBottom: '8px' }}>PHASE {step.phase}</div>
                <h4 style={{ fontSize: '18px', marginBottom: '12px' }}>{step.title}</h4>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>{step.duration}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {step.tasks?.slice(0, 2).map((t, j) => (
                    <div key={j} style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                      <div style={{ marginTop: '4px', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }}></div>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Boost */}
        <div className="animate-fadeInUp d6" style={{ background: 'linear-gradient(135deg, var(--plum), #4A2542)', borderRadius: '24px', padding: '40px', color: 'white', textAlign: 'center' }}>
          <Trophy size={48} color="var(--gold)" style={{ marginBottom: '24px' }} />
          <p style={{ fontSize: '20px', fontStyle: 'italic', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto' }}>
            "{analysis.confidenceBoost}"
          </p>
        </div>

        {/* Footer Action */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button className="btn btn-gold animate-fadeInUp d7" style={{ padding: '20px 64px', fontSize: '19px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 30px rgba(212, 168, 83, 0.3)' }} onClick={onContinue}>
            Go to My Interactive Dashboard <ChevronRight size={24} />
          </button>
        </div>

      </div>
    </div>
  );
};
