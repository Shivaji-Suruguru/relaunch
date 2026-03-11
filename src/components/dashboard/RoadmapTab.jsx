import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';

export const RoadmapTab = ({ onboardingData, analysis }) => {
  const [expandedNode, setExpandedNode] = useState(null);
  const [checkedNodes, setCheckedNodes] = useState([]);
  const [activeSection, setActiveSection] = useState('s0');

  const targetRole = onboardingData?.targetTitle || 'Professional';
  const skillGap0 = analysis?.skillGaps?.[0]?.skill || 'Data Analysis';
  const skillGap1 = analysis?.skillGaps?.[1]?.skill || 'Cloud Tools';

  const roadmapSections = [
    {
      id: 's0', phase: 'Phase 1', label: 'Foundation & Re-Entry Basics', color: '#F6D860', weeks: 'Weeks 1–2', status: 'active', icon: '🌱',
      description: 'Rebuild your professional presence and mindset',
      nodes: [
        { id: 'n0', label: 'Career Gap Narrative', sub: ['Tell your story confidently', 'Frame break as growth'], optional: false },
        { id: 'n1', label: 'Resume Refresh', sub: ['ATS-optimize keywords', 'Add break-period projects'], optional: false },
        { id: 'n2', label: 'LinkedIn Optimization', sub: ['Headline rewrite', 'Request recommendations'], optional: false },
      ]
    },
    {
      id: 's1', phase: 'Phase 2', label: 'Skill Assessment & Upskilling', color: '#6C63FF', weeks: 'Weeks 3–6', status: 'next', icon: '📚',
      description: 'Close your skill gaps with targeted learning',
      nodes: [
        { id: 'n4', label: skillGap0, sub: ['Take a course', 'Get a certification'], optional: false },
        { id: 'n5', label: skillGap1, sub: ['Practice tools', 'Build a mini project'], optional: false },
      ]
    }
  ];

  const toggleCheck = (id) => setCheckedNodes(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);

  return (
    <div className="animate-fadeInUp">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '32px', marginBottom: '4px' }}>Interactive Career Roadmap</h1>
          <p style={{ color: 'var(--muted)' }}>Step-by-step guide to landing your role</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
        <aside className="card" style={{ padding: '12px', height: 'fit-content' }}>
          {roadmapSections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: activeSection === s.id ? s.color + '20' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px', marginRight: '8px' }}>{s.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: activeSection === s.id ? 600 : 400 }}>{s.label}</span>
            </button>
          ))}
        </aside>

        <section style={{ position: 'relative' }}>
          {roadmapSections.filter(s => s.id === activeSection).map(section => (
            <div key={section.id}>
              <h2 className="serif" style={{ fontSize: '24px', marginBottom: '16px' }}>{section.label}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {section.nodes.map(node => (
                  <div key={node.id} className="card" style={{ padding: '16px', background: checkedNodes.includes(node.id) ? '#F0FFF4' : 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}>
                      <div onClick={(e) => { e.stopPropagation(); toggleCheck(node.id); }} style={{ width: '22px', height: '22px', borderRadius: '6px', border: `2px solid ${section.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: checkedNodes.includes(node.id) ? '#38A169' : 'white' }}>
                        {checkedNodes.includes(node.id) && <Check size={12} color="white" />}
                      </div>
                      <span style={{ flex: 1, fontWeight: 600 }}>{node.label}</span>
                      <ChevronRight size={16} style={{ transform: expandedNode === node.id ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
                    </div>
                    {expandedNode === node.id && (
                      <div style={{ marginTop: '12px', paddingLeft: '34px', fontSize: '14px', color: 'var(--muted)' }}>
                        {node.sub.map((s, i) => <div key={i}>• {s}</div>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
