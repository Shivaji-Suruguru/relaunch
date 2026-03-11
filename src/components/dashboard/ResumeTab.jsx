import React, { useState } from 'react';
import { Sparkles, RotateCcw, Copy, Check } from 'lucide-react';

export const ResumeTab = ({ onboardingData }) => {
  const [resumeSection, setResumeSection] = useState('summary');
  const [resumeText, setResumeText] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeResult, setResumeResult] = useState('');
  const [copied, setCopied] = useState(false);

  const defaultResumeDraft = {
    summary: `Results-driven ${onboardingData?.prevTitle || 'professional'} with ${onboardingData?.yearsExp || '5+'} years of experience in ${onboardingData?.prevIndustry || 'Tech'}. Returning to the workforce with renewed focus on ${onboardingData?.targetTitle || 'leadership'} roles.`,
    experience: `${onboardingData?.prevTitle || 'Senior Manager'} | ${onboardingData?.prevIndustry || 'Technology'} | 2018–2022\n• ${onboardingData?.prevResponsibilities || 'Led cross-functional teams and drove key organizational initiatives'}`,
    skills: (onboardingData?.techSkills?.join(', ') || 'Leadership, Project Management') + (onboardingData?.softSkills?.length ? ', ' + onboardingData.softSkills.join(', ') : '')
  };

  const enhanceResume = async () => {
    setResumeLoading(true);
    try {
      const res = await fetch('/api/resume', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: resumeSection, content: resumeText || defaultResumeDraft[resumeSection], targetTitle: onboardingData?.targetTitle, targetIndustry: onboardingData?.targetIndustry })
      });
      const data = await res.json();
      setResumeResult(data.enhanced || data.content);
    } catch {
      setResumeResult(`✨ Enhanced ${resumeSection.toUpperCase()} for ${onboardingData?.targetTitle || 'your goal'}:\n\n${resumeText || defaultResumeDraft[resumeSection]}\n\n(Note: This is a placeholder as the API is currently unavailable)`);
    }
    setResumeLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resumeResult || resumeText || defaultResumeDraft[resumeSection]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fadeInUp">
      <div style={{ marginBottom: '32px' }}>
        <h1 className="serif" style={{ fontSize: '32px', marginBottom: '4px' }}>AI Resume Transformer</h1>
        <p style={{ color: 'var(--muted)' }}>Turn your career gap into a value proposition</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--cream)', padding: '4px', borderRadius: '12px' }}>
            {['summary', 'experience', 'skills'].map(s => (
              <button key={s} onClick={() => { setResumeSection(s); setResumeText(''); setResumeResult(''); }} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: resumeSection === s ? 'white' : 'transparent', color: resumeSection === s ? 'var(--plum)' : 'var(--muted)', boxShadow: resumeSection === s ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>

          <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>Current Content</label>
          <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder={defaultResumeDraft[resumeSection]} style={{ height: '300px', resize: 'none', marginBottom: '24px' }} />

          <button onClick={enhanceResume} disabled={resumeLoading} className="btn btn-plum" style={{ width: '100%', gap: '12px' }}>
            {resumeLoading ? <RotateCcw size={18} className="animate-spin" /> : <><Sparkles size={18} /> Transform with AI</>}
          </button>
        </div>

        <div className="card" style={{ padding: '32px', background: 'var(--cream)', border: '2px dashed var(--border)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>AI Suggested Content</h3>
            {(resumeResult || resumeText || defaultResumeDraft[resumeSection]) && (
              <button onClick={copyToClipboard} style={{ padding: '8px 12px', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {copied ? <Check size={14} color="#38A169" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <div style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-line' }}>
            {resumeResult || <div style={{ color: 'var(--pale)', textAlign: 'center', marginTop: '100px' }}>Your AI-optimized content will appear here...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
