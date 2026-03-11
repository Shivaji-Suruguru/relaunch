import React, { useState } from 'react';
import { Target, BookOpen, Clock, ExternalLink, RotateCcw } from 'lucide-react';

export const SkillsTab = ({ analysis, onboardingData }) => {
  const [learningResources, setLearningResources] = useState({});
  const [loadingResource, setLoadingResource] = useState(null);

  const handleLearn = async (skill) => {
    setLoadingResource(skill);
    try {
      const res = await fetch('/api/learn', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillName: skill, prevTitle: onboardingData?.prevTitle, targetTitle: onboardingData?.targetTitle })
      });
      const data = await res.json();
      setLearningResources(prev => ({ ...prev, [skill]: Array.isArray(data) ? data : data.resources || [] }));
    } catch {
      setLearningResources(prev => ({
        ...prev, [skill]: [
          { title: `${skill} Fundamentals`, provider: 'Coursera', type: 'Course', duration: '4 weeks', url: 'https://coursera.org' },
          { title: `Advanced ${skill}`, provider: 'LinkedIn Learning', type: 'Video', duration: '6h', url: 'https://linkedin.com/learning' },
        ]
      }));
    }
    setLoadingResource(null);
  };

  return (
    <div className="animate-fadeInUp">
      <div style={{ marginBottom: '32px' }}>
        <h1 className="serif" style={{ fontSize: '32px', marginBottom: '4px' }}>Skill Gap Analysis</h1>
        <p style={{ color: 'var(--muted)' }}>Closing the distance between where you are and your next role</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {analysis?.skillGaps?.map((gap, i) => (
          <div key={i} className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', background: 'rgba(124, 61, 110, 0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="serif" style={{ fontSize: '24px' }}>{gap.skill}</h3>
                <span style={{ padding: '4px 12px', borderRadius: '100px', background: gap.priority === 'high' ? '#FED7D7' : '#FEEBC8', color: gap.priority === 'high' ? '#E53E3E' : '#D69E2E', fontSize: '12px', fontWeight: 700 }}>{gap.priority.toUpperCase()} PRIORITY</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>{gap.reason}</p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--muted)' }}><Clock size={16} /> {gap.timeToLearn}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--muted)' }}><Target size={16} /> Proficiency needed: {gap.level || 'Intermediate'}</div>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <button onClick={() => handleLearn(gap.skill)} disabled={loadingResource === gap.skill} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
                {loadingResource === gap.skill ? <RotateCcw size={18} className="animate-spin" /> : <><BookOpen size={18} /> Find Learning Resources</>}
              </button>

              {learningResources[gap.skill] && (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {learningResources[gap.skill].map((res, j) => (
                    <a key={j} href={res.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderRadius: '10px', background: 'var(--cream)', textDecoration: 'none', color: 'var(--text)', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{res.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{res.provider} · {res.duration}</div>
                      </div>
                      <ExternalLink size={16} color="var(--pale)" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
