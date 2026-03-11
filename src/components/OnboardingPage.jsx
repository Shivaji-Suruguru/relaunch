import React, { useState } from 'react';
import { RotateCcw, Check, Briefcase, Clock, Target, Brain, Trophy, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const OptionCard = ({ label, selected, onClick }) => (
  <div onClick={onClick} style={{ padding: '16px', borderRadius: '12px', border: `2px solid ${selected ? 'var(--plum)' : 'var(--border)'}`, background: selected ? 'rgba(124, 61, 110, 0.05)' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}>
    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: selected ? 'var(--plum)' : 'var(--border)' , background: selected ? 'var(--plum)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {selected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }} />}
    </div>
    <span style={{ fontWeight: 500, color: selected ? 'var(--plum)' : 'var(--text)' }}>{label}</span>
  </div>
);

export const OnboardingPage = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    prevTitle: '', prevIndustry: '', yearsExp: '', prevResponsibilities: '',
    breakDuration: '', breakReason: '', breakActivities: '',
    targetTitle: '', targetIndustry: '', workType: [], relocation: '',
    techSkills: [], softSkills: [], tools: '', confidence: 5,
    timeline: '', salaryRange: '', studyHours: 8, biggestChallenge: ''
  });
  const [otherInputs, setOtherInputs] = useState({
    prevIndustry: '', breakDuration: '', breakReason: '', 
    targetIndustry: '', timeline: '', salaryRange: ''
  });
  const [customTech, setCustomTech] = useState('');
  const [customSoft, setCustomSoft] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const addCustomSkill = (type) => {
    const skill = type === 'techSkills' ? customTech : customSoft;
    if (skill.trim() && !data[type].includes(skill.trim())) {
      setData(prev => ({ ...prev, [type]: [...prev[type], skill.trim()] }));
      if (type === 'techSkills') setCustomTech('');
      else setCustomSoft('');
    }
  };

  const validate = () => {
    let newErrs = {};
    setGeneralError('');
    if (step === 1) {
      if (!data.prevTitle) newErrs.prevTitle = 'Required';
      if (!data.prevIndustry) newErrs.prevIndustry = 'Required';
      if (!data.yearsExp) {
        newErrs.yearsExp = 'Required';
      } else if (isNaN(data.yearsExp) || parseFloat(data.yearsExp) < 0) {
        newErrs.yearsExp = 'Enter a valid number of years';
      }
      if (!data.prevResponsibilities) newErrs.prevResponsibilities = 'Required';
    } else if (step === 2) {
      if (!data.breakDuration) newErrs.breakDuration = 'Required';
      if (!data.breakReason) newErrs.breakReason = 'Required';
    } else if (step === 3) {
      if (!data.targetTitle) newErrs.targetTitle = 'Required';
      if (!data.targetIndustry) newErrs.targetIndustry = 'Required';
      if (data.workType.length === 0) newErrs.workType = 'Select at least 1 preference';
      if (!data.relocation) newErrs.relocation = 'Required';
    } else if (step === 4) {
      if (data.techSkills.length === 0) newErrs.techSkills = 'Select at least 1 technical skill';
    } else if (step === 5) {
      if (!data.timeline) newErrs.timeline = 'Required';
      if (!data.salaryRange) newErrs.salaryRange = 'Required';
      if (!data.biggestChallenge) newErrs.biggestChallenge = 'Required';
    }

    // Validation for "Other" fields
    Object.keys(otherInputs).forEach(key => {
      if (data[key] === 'Other' && (!otherInputs[key] || !otherInputs[key].trim())) {
        newErrs[key] = 'Please specify details';
      }
    });

    setErrors(newErrs);
    if (Object.keys(newErrs).length > 0) {
      setGeneralError('Please fill in all required fields marked with *');
    }
    return Object.keys(newErrs).length === 0;
  };

  const handleNext = async () => {
    if (validate()) {
      setStep(s => s + 1);
    }
  };

  const handleSubmit = async () => {
    if (validate()) {
      if (user?.id) {
        try {
          const submissionData = { ...data };
          Object.keys(otherInputs).forEach(key => {
            if (data[key] === 'Other') {
              submissionData[key] = otherInputs[key].trim();
            }
          });

          await supabase.from('onboarding_data').insert({ 
            user_id: user.id, 
            ...submissionData, 
            created_at: new Date().toISOString() 
          });
          
          await supabase.from('profiles').upsert({ 
            id: user.id, 
            full_name: user.name, 
            email: user.email, 
            onboarding_complete: true 
          });

          onComplete(submissionData);
        } catch (e) {
          console.warn("Failed to save onboarding session:", e);
          onComplete(data); 
        }
      } else {
        onComplete(data);
      }
    }
  };

  const toggleSkill = (type, skill) => {
    setData(prev => ({ ...prev, [type]: prev[type].includes(skill) ? prev[type].filter(s => s !== skill) : [...prev[type], skill] }));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '64px' }}>
      <header style={{ background: 'white', padding: '24px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <RotateCcw style={{ color: "var(--plum)" }} size={24} /><span className="serif" style={{ fontSize: '20px', fontWeight: 600 }}>Re•Entry</span>
            </div>
            <span style={{ color: 'var(--muted)', fontWeight: 500 }}>Step {step} of 5</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '0', width: '100%', height: '2px', background: 'var(--border)', zIndex: 0 }} />
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', zIndex: 1, background: i < step ? 'var(--gold)' : i === step ? 'var(--plum)' : 'white', border: `2px solid ${i <= step ? 'transparent' : 'var(--border)'} `, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {i < step ? <Check size={16} /> : <span style={{ fontSize: '14px', color: i === step ? 'white' : 'var(--muted)' }}>{i}</span>}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: '48px auto', padding: '0 24px' }}>
        {generalError && (
          <div style={{ background: '#FED7D7', color: '#C53030', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>⚠️</span> {generalError}
          </div>
        )}
        <div className="card animate-scaleIn" style={{ padding: '48px 32px' }} key={step}>

          {step === 1 && (
            <div className="animate-fadeInUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124,61,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--plum)' }}><Briefcase size={32} /></div>
                <h2 className="serif" style={{ fontSize: '32px', marginBottom: '8px' }}>Let's map out your career background</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div><label>Previous Job Title* {errors.prevTitle && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.prevTitle}</span>}</label><input type="text" value={data.prevTitle} onChange={e => setData({ ...data, prevTitle: e.target.value })} /></div>
                <div>
                  <label>Industry* {errors.prevIndustry && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.prevIndustry}</span>}</label>
                  <select value={data.prevIndustry} onChange={e => setData({ ...data, prevIndustry: e.target.value })}>
                    <option value="">Select Industry...</option><option value="Technology">Technology</option><option value="Finance">Finance</option><option value="Healthcare">Healthcare</option><option value="Other">Other</option>
                  </select>
                  {data.prevIndustry === 'Other' && (
                    <input type="text" placeholder="Specify industry..." value={otherInputs.prevIndustry} onChange={e => setOtherInputs({ ...otherInputs, prevIndustry: e.target.value })} style={{ marginTop: '8px' }} />
                  )}
                </div>
                <div>
                  <label>Total Experience (Years)* {errors.yearsExp && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.yearsExp}</span>}</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    placeholder="e.g. 5.5 (for 5 years and 6 months)" 
                    value={data.yearsExp} 
                    onChange={e => setData({ ...data, yearsExp: e.target.value })} 
                  />
                </div>
                <div><label>Key Responsibilities & Achievements* {errors.prevResponsibilities && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.prevResponsibilities}</span>}</label><textarea rows={4} value={data.prevResponsibilities} onChange={e => setData({ ...data, prevResponsibilities: e.target.value })} /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeInUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124,61,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--plum)' }}><Clock size={32} /></div>
                <h2 className="serif" style={{ fontSize: '32px', marginBottom: '8px' }}>Your Career Break</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label>Duration* {errors.breakDuration && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.breakDuration}</span>}</label>
                  <select value={data.breakDuration} onChange={e => setData({ ...data, breakDuration: e.target.value })}>
                    <option value="">Select duration...</option><option value="< 1 year">Less than 1 year</option><option value="1-3 years">1-3 years</option><option value="3-5 years">3-5 years</option><option value="Other">Other</option>
                  </select>
                  {data.breakDuration === 'Other' && (
                    <input type="text" placeholder="Specify duration..." value={otherInputs.breakDuration} onChange={e => setOtherInputs({ ...otherInputs, breakDuration: e.target.value })} style={{ marginTop: '8px' }} />
                  )}
                </div>
                <div>
                  <label>Primary Reason* {errors.breakReason && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.breakReason}</span>}</label>
                  <select value={data.breakReason} onChange={e => setData({ ...data, breakReason: e.target.value })}>
                    <option value="">Select reason...</option><option value="Caregiving (Children)">Caregiving (Children)</option><option value="Personal Health">Personal Health</option><option value="Other">Other</option>
                  </select>
                  {data.breakReason === 'Other' && (
                    <input type="text" placeholder="Specify reason..." value={otherInputs.breakReason} onChange={e => setOtherInputs({ ...otherInputs, breakReason: e.target.value })} style={{ marginTop: '8px' }} />
                  )}
                </div>
                <div><label>Activities During Break (Optional)</label><textarea rows={3} value={data.breakActivities} onChange={e => setData({ ...data, breakActivities: e.target.value })} /></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeInUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124,61,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--plum)' }}><Target size={32} /></div>
                <h2 className="serif" style={{ fontSize: '32px', marginBottom: '8px' }}>Set your target role</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div><label>Target Job Title* {errors.targetTitle && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.targetTitle}</span>}</label><input type="text" value={data.targetTitle} onChange={e => setData({ ...data, targetTitle: e.target.value })} /></div>
                <div>
                  <label>Target Industry* {errors.targetIndustry && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.targetIndustry}</span>}</label>
                  <select value={data.targetIndustry} onChange={e => setData({ ...data, targetIndustry: e.target.value })}>
                    <option value="">Select Industry...</option><option value="Technology">Technology</option><option value="Finance">Finance</option><option value="Other">Other</option>
                  </select>
                  {data.targetIndustry === 'Other' && (
                    <input type="text" placeholder="Specify industry..." value={otherInputs.targetIndustry} onChange={e => setOtherInputs({ ...otherInputs, targetIndustry: e.target.value })} style={{ marginTop: '8px' }} />
                  )}
                </div>
                <div>
                  <label>Work Preference* (Select all that apply) {errors.workType && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.workType}</span>}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="mb-stack">
                    <OptionCard label="Remote" selected={data.workType.includes('Remote')} onClick={() => toggleSkill('workType', 'Remote')} />
                    <OptionCard label="Hybrid" selected={data.workType.includes('Hybrid')} onClick={() => toggleSkill('workType', 'Hybrid')} />
                    <OptionCard label="On-site" selected={data.workType.includes('On-site')} onClick={() => toggleSkill('workType', 'On-site')} />
                  </div>
                </div>
                <div>
                  <label>Open to Relocation?* {errors.relocation && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.relocation}</span>}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="mb-stack">
                    <OptionCard label="Yes" selected={data.relocation === 'Yes'} onClick={() => setData({ ...data, relocation: 'Yes' })} />
                    <OptionCard label="No" selected={data.relocation === 'No'} onClick={() => setData({ ...data, relocation: 'No' })} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fadeInUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124,61,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--plum)' }}><Brain size={32} /></div>
                <h2 className="serif" style={{ fontSize: '32px', marginBottom: '8px' }}>Let's assess your skillset</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label>Technical Skills* {errors.techSkills && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.techSkills}</span>}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {['Python', 'SQL', 'Excel', 'React', 'Project Management', 'Agile/Scrum', 'Salesforce', 'Figma'].map(s => (
                      <div key={s} className={`chip ${data.techSkills.includes(s) ? 'selected' : ''} `} onClick={() => toggleSkill('techSkills', s)}>{s}</div>
                    ))}
                    {data.techSkills.filter(s => !['Python', 'SQL', 'Excel', 'React', 'Project Management', 'Agile/Scrum', 'Salesforce', 'Figma'].includes(s)).map(s => (
                      <div key={s} className="chip selected" onClick={() => toggleSkill('techSkills', s)}>{s} ✕</div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <input type="text" placeholder="Add custom tech skill..." value={customTech} onChange={e => setCustomTech(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSkill('techSkills'))} style={{ height: '38px', fontSize: '14px' }} />
                    <button type="button" onClick={() => addCustomSkill('techSkills')} className="btn btn-outline" style={{ height: '38px', padding: '0 16px' }}>Add</button>
                  </div>
                </div>
                <div>
                  <label>Soft Skills</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {['Leadership', 'Communication', 'Problem Solving', 'Adaptability'].map(s => (
                      <div key={s} className={`chip ${data.softSkills.includes(s) ? 'selected' : ''} `} onClick={() => toggleSkill('softSkills', s)}>{s}</div>
                    ))}
                    {data.softSkills.filter(s => !['Leadership', 'Communication', 'Problem Solving', 'Adaptability'].includes(s)).map(s => (
                      <div key={s} className="chip selected" onClick={() => toggleSkill('softSkills', s)}>{s} ✕</div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <input type="text" placeholder="Add custom soft skill..." value={customSoft} onChange={e => setCustomSoft(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSkill('softSkills'))} style={{ height: '38px', fontSize: '14px' }} />
                    <button type="button" onClick={() => addCustomSkill('softSkills')} className="btn btn-outline" style={{ height: '38px', padding: '0 16px' }}>Add</button>
                  </div>
                </div>
                <div><label>Tools & Platforms</label><input type="text" value={data.tools} onChange={e => setData({ ...data, tools: e.target.value })} placeholder="e.g. Jira, Slack, HubSpot" /></div>
                <div>
                  <label>Confidence Level: {data.confidence}/10</label>
                  <input type="range" min="1" max="10" value={data.confidence} onChange={e => setData({ ...data, confidence: e.target.value })} style={{ padding: 0, height: '4px', background: 'var(--border)' }} />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fadeInUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124,61,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--plum)' }}><Trophy size={32} /></div>
                <h2 className="serif" style={{ fontSize: '32px', marginBottom: '8px' }}>Set your comeback goals</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label>Return Timeline* {errors.timeline && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.timeline}</span>}</label>
                  <select value={data.timeline} onChange={e => setData({ ...data, timeline: e.target.value })}>
                    <option value="">Select...</option><option value="1-3 months">1-3 months</option><option value="3-6 months">3-6 months</option><option value="Other">Other</option>
                  </select>
                  {data.timeline === 'Other' && (
                    <input type="text" placeholder="Specify timeline..." value={otherInputs.timeline} onChange={e => setOtherInputs({ ...otherInputs, timeline: e.target.value })} style={{ marginTop: '8px' }} />
                  )}
                </div>
                <div>
                  <label>Salary Range* {errors.salaryRange && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.salaryRange}</span>}</label>
                  <select value={data.salaryRange} onChange={e => setData({ ...data, salaryRange: e.target.value })}>
                    <option value="">Select...</option><option value="$60K-$80K">$60K-$80K</option><option value="$80K-$100K">$80K-$100K</option><option value="Other">Other</option>
                  </select>
                  {data.salaryRange === 'Other' && (
                    <input type="text" placeholder="Specify salary range..." value={otherInputs.salaryRange} onChange={e => setOtherInputs({ ...otherInputs, salaryRange: e.target.value })} style={{ marginTop: '8px' }} />
                  )}
                </div>
                <div>
                  <label>Weekly Study Hours: {data.studyHours}</label>
                  <input type="range" min="2" max="20" value={data.studyHours} onChange={e => setData({ ...data, studyHours: e.target.value })} style={{ padding: 0, height: '4px', background: 'var(--border)' }} />
                </div>
                <div><label>Biggest Challenge Right Now* {errors.biggestChallenge && <span style={{ color: 'red', fontSize: '12px' }}> - {errors.biggestChallenge}</span>}</label><textarea rows={3} value={data.biggestChallenge} onChange={e => setData({ ...data, biggestChallenge: e.target.value })} /></div>
              </div>
              <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(124, 61, 110, 0.05)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--plum)', fontWeight: 500, fontSize: '14px', textAlign: 'center' }}>Your answers are about to be analyzed by our AI. You'll receive a Readiness Score, personalized skill gap report, top job matches, and a 12-week roadmap.</p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
            {step > 1 ? <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>Back</button> : <div></div>}
            {step < 5 ? (
              <button className="btn btn-plum" onClick={handleNext}>Continue <ChevronRight size={18} /></button>
            ) : (
              <button className="btn btn-plum" style={{ flex: 1, padding: '16px', fontSize: '18px' }} onClick={handleSubmit}>✨ Analyze My Profile</button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
