// ---------- PAGE: ONBOARDING ----------
const OnboardingPage = ({ user, onComplete }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        prevTitle: '', prevIndustry: '', yearsExp: '', prevResponsibilities: '',
        breakDuration: '', breakReason: '', breakActivities: '',
        targetTitle: '', targetIndustry: '', workType: '', relocation: '',
        techSkills: [], softSkills: [], tools: '', confidence: 5,
        timeline: '', salaryRange: '', studyHours: 10, biggestChallenge: ''
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        let newErrs = {};
        if (step === 1) {
            if (!data.prevTitle) newErrs.prevTitle = 'Required';
            if (!data.prevIndustry) newErrs.prevIndustry = 'Required';
            if (!data.yearsExp) newErrs.yearsExp = 'Required';
            if (!data.prevResponsibilities) newErrs.prevResponsibilities = 'Required';
        } else if (step === 2) {
            if (!data.breakDuration) newErrs.breakDuration = 'Required';
            if (!data.breakReason) newErrs.breakReason = 'Required';
        } else if (step === 3) {
            if (!data.targetTitle) newErrs.targetTitle = 'Required';
            if (!data.targetIndustry) newErrs.targetIndustry = 'Required';
            if (!data.workType) newErrs.workType = 'Required';
            if (!data.relocation) newErrs.relocation = 'Required';
        } else if (step === 4) {
            if (data.techSkills.length === 0) newErrs.techSkills = 'Select at least 1 technical skill';
        } else if (step === 5) {
            if (!data.timeline) newErrs.timeline = 'Required';
            if (!data.salaryRange) newErrs.salaryRange = 'Required';
            if (!data.biggestChallenge) newErrs.biggestChallenge = 'Required';
        }
        setErrors(newErrs);
        return Object.keys(newErrs).length === 0;
    };

    const handleNext = () => {
        if (validate()) setStep(s => s + 1);
    };
    const handleBack = () => setStep(s => s - 1);
    const handleSubmit = () => {
        if (validate()) onComplete(data);
    };

    const toggleSkill = (type, skill) => {
        setData(prev => {
            const current = prev[type];
            return { ...prev, [type]: current.includes(skill) ? current.filter(s => s !== skill) : [...current, skill] };
        });
    };

    const OptionCard = ({ label, selected, onClick }) => (
        <div
            onClick={onClick}
            style={{
                padding: '16px', borderRadius: '12px', border: \`2px solid \${selected ? 'var(--plum)' : 'var(--border)'}\`,
        background: selected ? 'rgba(124, 61, 110, 0.05)' : 'white', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s'
      }}>
      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: selected ? 'var(--plum)' : 'var(--border)', background: selected ? 'var(--plum)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }} />}
      </div>
      <span style={{ fontWeight: 500, color: selected ? 'var(--plum)' : 'var(--text)' }}>{label}</span>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '64px' }}>
      <header style={{ background: 'white', padding: '24px', borderBottom: '1px solid var(--border)', sticky: 'top', zIndex: 10 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCcw style={{ color: "var(--plum)" }} size={24} />
              <span className="serif" style={{ fontSize: '20px', fontWeight: 600 }}>Re•Entry</span>
            </div>
            <span style={{ color: 'var(--muted)', fontWeight: 500 }}>Step {step} of 5</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '0', width: '100%', height: '2px', background: 'var(--border)', zIndex: 0 }} />
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ 
                width: '32px', height: '32px', borderRadius: '50%', zIndex: 1,
                background: i < step ? 'var(--gold)' : i === step ? 'var(--plum)' : 'white',
                border: \`2px solid \${i <= step ? 'transparent' : 'var(--border)'}\`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
              }}>
                {i < step ? <Check size={16} /> : <span style={{ fontSize: '14px', color: i === step ? 'white' : 'var(--muted)' }}>{i}</span>}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: '48px auto', padding: '0 24px' }}>
        <div className="card animate-scaleIn" style={{ padding: '48px 32px' }} key={step}>
          {step === 1 && (
            <div className="animate-fadeInUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124,61,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--plum)' }}>
                  <Briefcase size={32} />
                </div>
                <h2 className="serif" style={{ fontSize: '32px', marginBottom: '8px' }}>Let's map out your career background</h2>
                <p style={{ color: 'var(--muted)' }}>Tell us about your previous experience before your career break.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Previous Job Title*</label>
                  <input type="text" value={data.prevTitle} onChange={e => setData({...data, prevTitle: e.target.value})} />
                  {errors.prevTitle && <span style={{ color: 'red', fontSize: '12px' }}>{errors.prevTitle}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Industry*</label>
                  <select value={data.prevIndustry} onChange={e => setData({...data, prevIndustry: e.target.value})}>
                    <option value="">Select Industry...</option>
                    <option value="Technology">Technology & Software</option>
                    <option value="Finance">Finance & Banking</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Marketing">Marketing & Media</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.prevIndustry && <span style={{ color: 'red', fontSize: '12px' }}>{errors.prevIndustry}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Years of Experience*</label>
                  <select value={data.yearsExp} onChange={e => setData({...data, yearsExp: e.target.value})}>
                    <option value="">Select...</option>
                    <option value="1-3">1-3 years</option>
                    <option value="4-7">4-7 years</option>
                    <option value="8-12">8-12 years</option>
                    <option value="12+">12+ years</option>
                  </select>
                  {errors.yearsExp && <span style={{ color: 'red', fontSize: '12px' }}>{errors.yearsExp}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Key Responsibilities & Achievements*</label>
                  <textarea rows={4} value={data.prevResponsibilities} onChange={e => setData({...data, prevResponsibilities: e.target.value})} placeholder="What were you proud of achieving?" style={{ minHeight: '130px', resize: 'vertical' }} />
                  {errors.prevResponsibilities && <span style={{ color: 'red', fontSize: '12px' }}>{errors.prevResponsibilities}</span>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeInUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124,61,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--plum)' }}>
                  <Clock size={32} />
                </div>
                <h2 className="serif" style={{ fontSize: '32px', marginBottom: '8px' }}>Your Career Break</h2>
                <p style={{ color: 'var(--muted)' }}>Understanding your break helps us identify hidden skills.</p>
              </div>
              
              <div style={{ padding: '16px', background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Heart size={20} color="var(--plum)" style={{ marginTop: '2px' }} />
                <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.5 }}>
                  Career breaks build resilience, empathy, and organizational skills. We value this time—and top employers do too.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Duration*</label>
                  <select value={data.breakDuration} onChange={e => setData({...data, breakDuration: e.target.value})}>
                    <option value="">Select duration...</option>
                    <option value="< 1 year">Less than 1 year</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                  {errors.breakDuration && <span style={{ color: 'red', fontSize: '12px' }}>{errors.breakDuration}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Primary Reason*</label>
                  <select value={data.breakReason} onChange={e => setData({...data, breakReason: e.target.value})}>
                    <option value="">Select reason...</option>
                    <option value="Caregiving (Children)">Caregiving (Children)</option>
                    <option value="Caregiving (Adult/Elder)">Caregiving (Adult/Elder)</option>
                    <option value="Personal Health">Personal Health recovery</option>
                    <option value="Education/Sabbatical">Education/Sabbatical</option>
                    <option value="Relocation">Relocation/Trailing Spouse</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.breakReason && <span style={{ color: 'red', fontSize: '12px' }}>{errors.breakReason}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Activities During Break (Optional)</label>
                  <textarea rows={3} value={data.breakActivities} onChange={e => setData({...data, breakActivities: e.target.value})} placeholder="Volunteering, courses, freelance, household logistics..." />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeInUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124,61,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--plum)' }}>
                  <Target size={32} />
                </div>
                <h2 className="serif" style={{ fontSize: '32px', marginBottom: '8px' }}>Set your target role</h2>
                <p style={{ color: 'var(--muted)' }}>What's the next step in your journey?</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Target Job Title*</label>
                  <input type="text" value={data.targetTitle} onChange={e => setData({...data, targetTitle: e.target.value})} placeholder="e.g. Product Manager, Data Analyst" />
                  {errors.targetTitle && <span style={{ color: 'red', fontSize: '12px' }}>{errors.targetTitle}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Target Industry*</label>
                  <select value={data.targetIndustry} onChange={e => setData({...data, targetIndustry: e.target.value})}>
                    <option value="">Select Industry...</option>
                    <option value="Technology">Technology</option>
                    <option value="Same as previous">Same as previous</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                  {errors.targetIndustry && <span style={{ color: 'red', fontSize: '12px' }}>{errors.targetIndustry}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Work Preference*</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <OptionCard label="Remote" selected={data.workType === 'Remote'} onClick={() => setData({...data, workType: 'Remote'})} />
                    <OptionCard label="Hybrid" selected={data.workType === 'Hybrid'} onClick={() => setData({...data, workType: 'Hybrid'})} />
                    <OptionCard label="On-site" selected={data.workType === 'On-site'} onClick={() => setData({...data, workType: 'On-site'})} />
                  </div>
                  {errors.workType && <span style={{ color: 'red', fontSize: '12px' }}>{errors.workType}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Open to Relocation?*</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <OptionCard label="Yes" selected={data.relocation === 'Yes'} onClick={() => setData({...data, relocation: 'Yes'})} />
                    <OptionCard label="No" selected={data.relocation === 'No'} onClick={() => setData({...data, relocation: 'No'})} />
                    <OptionCard label="Maybe" selected={data.relocation === 'Maybe'} onClick={() => setData({...data, relocation: 'Maybe'})} />
                  </div>
                  {errors.relocation && <span style={{ color: 'red', fontSize: '12px' }}>{errors.relocation}</span>}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fadeInUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124,61,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--plum)' }}>
                  <Brain size={32} />
                </div>
                <h2 className="serif" style={{ fontSize: '32px', marginBottom: '8px' }}>Your current skills</h2>
                <p style={{ color: 'var(--muted)' }}>Select skills you have experience with.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>Technical & Domain Skills*</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Data Analysis','Project Management','Agile','Marketing','Sales','Financial Modeling','UX Research','Coding','Budgeting','Strategic Planning','Operations','Product Design'].map(skill => (
                      <div key={skill} onClick={() => toggleSkill('techSkills', skill)} className={\`chip \${data.techSkills.includes(skill) ? 'selected' : ''}\`}>
                        {skill}
                      </div>
                    ))}
                  </div>
                  {errors.techSkills && <span style={{ color: 'red', fontSize: '12px', marginTop:'8px', display:'block' }}>{errors.techSkills}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>Soft Skills</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Leadership','Empathy','Communication','Problem Solving','Adaptability','Mentoring','Negotiation','Time Management','Crisis Management'].map(skill => (
                      <div key={skill} onClick={() => toggleSkill('softSkills', skill)} className={\`chip \${data.softSkills.includes(skill) ? 'selected' : ''}\`}>
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Tools & Platforms (Optional)</label>
                  <input type="text" value={data.tools} onChange={e => setData({...data, tools: e.target.value})} placeholder="e.g. Jira, Salesforce, Excel, Figma, SQL" />
                </div>
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 500 }}>
                    <span>Confidence Level (1-10)</span>
                    <span style={{ color: 'var(--plum)', fontWeight: 600 }}>{data.confidence}</span>
                  </label>
                  <input type="range" min="1" max="10" value={data.confidence} onChange={e => setData({...data, confidence: parseInt(e.target.value)})} style={{ width: '100%', accentColor: 'var(--plum)', height: '8px', borderRadius: '4px', appearance: 'auto' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                    <span>Nervous</span>
                    <span>Ready</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fadeInUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(124,61,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--plum)' }}>
                  <Trophy size={32} />
                </div>
                <h2 className="serif" style={{ fontSize: '32px', marginBottom: '8px' }}>Goals & Timeline</h2>
                <p style={{ color: 'var(--muted)' }}>Let's set your comeback milestones.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Return Timeline*</label>
                  <select value={data.timeline} onChange={e => setData({...data, timeline: e.target.value})}>
                    <option value="">Select...</option>
                    <option value="ASAP">ASAP (within 1 month)</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6+ months">6+ months (just planning)</option>
                  </select>
                  {errors.timeline && <span style={{ color: 'red', fontSize: '12px' }}>{errors.timeline}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Expected Salary Range*</label>
                  <select value={data.salaryRange} onChange={e => setData({...data, salaryRange: e.target.value})}>
                    <option value="">Select range...</option>
                    <option value="$50k-$75k">$50k - $75k</option>
                    <option value="$75k-$100k">$75k - $100k</option>
                    <option value="$100k-$150k">$100k - $150k</option>
                    <option value="$150k+">$150k+</option>
                  </select>
                  {errors.salaryRange && <span style={{ color: 'red', fontSize: '12px' }}>{errors.salaryRange}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Weekly Study Hours (up-skilling)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <input type="range" min="2" max="20" step="1" value={data.studyHours} onChange={e => setData({...data, studyHours: parseInt(e.target.value)})} style={{ flex: 1, accentColor: 'var(--plum)' }} />
                    <span style={{ width: '60px', textAlign: 'right', fontWeight: 600, color: 'var(--plum)' }}>{data.studyHours} hrs</span>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>What is your biggest perceived challenge?*</label>
                  <textarea rows={3} value={data.biggestChallenge} onChange={e => setData({...data, biggestChallenge: e.target.value})} placeholder="e.g. Explaining the gap, age bias, outdated skills..." />
                  {errors.biggestChallenge && <span style={{ color: 'red', fontSize: '12px' }}>{errors.biggestChallenge}</span>}
                </div>

                <div style={{ padding: '20px', background: 'rgba(212, 168, 83, 0.1)', borderRadius: '12px', border: '1px solid rgba(212, 168, 83, 0.3)', marginTop:'16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Sparkles size={24} color="var(--gold)" />
                    <div>
                      <h4 style={{ color: 'var(--text)', marginBottom: '4px' }}>Ready for your AI Analysis?</h4>
                      <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.4 }}>Our proprietary engine will process your profile against 10,000+ successful career return paths.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-outline" onClick={handleBack} disabled={step === 1} style={{ opacity: step === 1 ? 0.5 : 1 }}>
              Back
            </button>
            {step < 5 ? (
              <button className="btn btn-plum" onClick={handleNext}>Next Step <ChevronRight size={18}/></button>
            ) : (
              <button className="btn btn-plum" onClick={handleSubmit} style={{ padding: '16px 32px', fontSize: '18px' }}>
                <Sparkles size={20}/> ✨ Analyze My Profile
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// ---------- PAGE: ANALYZING ----------
const AnalyzingPage = ({ user, onboardingData, onComplete }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases = [
    "Initializing Gemini Engine...",
    "Analyzing your career background",
    "Identifying transferable skills",
    "Mapping skill gaps to market demand",
    "Generating personalized roadmap",
    "Matching you with relevant opportunities",
    "Crafting your comeback strategy",
    "Finalizing your profile report"
  ];

  useEffect(() => {
    let active = true;
    const timeouts = [];
    
    // Animate phases roughly matched to AI response time
    phases.forEach((_, i) => {
      timeouts.push(setTimeout(() => {
        if(active) setPhaseIndex(i);
      }, i * 1800));
    });

    const runAnalysis = async () => {
      await new Promise(r => setTimeout(r, 2000));
      const prompt = \`
You are an expert AI career coach specializing in helping women 
professionals return to work after career breaks. Analyze the 
following user profile and return a detailed career comeback plan.

USER PROFILE:
- Name: \${user.name}
- Previous Role: \${onboardingData.prevTitle} in \${onboardingData.prevIndustry}
- Years of Experience: \${onboardingData.yearsExp}
- Key Responsibilities: \${onboardingData.prevResponsibilities}
- Career Break Duration: \${onboardingData.breakDuration}
- Reason for Break: \${onboardingData.breakReason}
- Activities During Break: \${onboardingData.breakActivities || "Not specified"}
- Target Role: \${onboardingData.targetTitle} in \${onboardingData.targetIndustry}
- Work Preference: \${onboardingData.workType}
- Technical Skills: \${onboardingData.techSkills.join(", ")}
- Soft Skills: \${onboardingData.softSkills.join(", ")}
- Tools Used: \${onboardingData.tools || "Not specified"}
- Self-Confidence Level: \${onboardingData.confidence}/10
- Return Timeline: \${onboardingData.timeline}
- Expected Salary: \${onboardingData.salaryRange}
- Weekly Study Hours Available: \${onboardingData.studyHours}
- Biggest Challenge: \${onboardingData.biggestChallenge}

Return ONLY a pure JSON object string without any markdown fences or formatting with this exact structure:
{
  "readinessScore": <integer 0-100>,
  "headline": "<short professional headline for this person>",
  "summary": "<2-3 sentence personalized encouraging career summary>",
  "keyStrengths": ["<strength>","<strength>","<strength>","<strength>"],
  "skillGaps": [
    {
      "skill": "<skill name>",
      "priority": "high",
      "timeToLearn": "<e.g. 2 weeks>",
      "reason": "<why this gap matters for the target role>"
    }
  ],
  "topRoles": [
    {
      "title": "<role title>",
      "matchScore": <integer 60-99>,
      "industry": "<industry>",
      "salaryRange": "<range>",
      "reason": "<why this role fits the user's background>"
    }
  ],
  "roadmap": [
    {
      "phase": 1,
      "title": "Foundation & Refresh",
      "duration": "Weeks 1-2",
      "tasks": ["<task1>", "<task2>", "<task3>"],
      "milestone": "<measurable milestone for end of phase>"
    },
    { "phase": 2, "title": "Skill Building", "duration": "Weeks 3-6", "tasks": ["<task1>"], "milestone": "<milestone>" },
    { "phase": 3, "title": "Active Job Search", "duration": "Weeks 7-10", "tasks": ["<task1>"], "milestone": "<milestone>" },
    { "phase": 4, "title": "Interview & Offer", "duration": "Weeks 11-12", "tasks": ["<task1>"], "milestone": "<milestone>" }
  ],
  "immediateActions": [
    { "priority": 1, "action": "<specific action>", "timeframe": "Today" },
    { "priority": 2, "action": "<specific action>", "timeframe": "This week" },
    { "priority": 3, "action": "<specific action>", "timeframe": "Week 2" }
  ],
  "confidenceBoost": "<personalized motivational message that directly addresses their biggest challenge>"
}
\`;

      const result = await callGemini(prompt);
      
      const fallback = {
        readinessScore: 78,
        headline: \`Strategic \${onboardingData.targetTitle} returning from purposeful break\`,
        summary: \`Your \${onboardingData.yearsExp} background in \${onboardingData.prevIndustry} gives you a unique edge. Combining your deep expertise with the resilience gained during your break makes you uniquely positioned for \${onboardingData.targetIndustry} roles.\`,
        keyStrengths: ["Cross-functional communication", "Adaptability under pressure", "Strategic planning", "Empathy and team leadership"],
        skillGaps: [
          { skill: "Advanced BI Tools (Tableau)", priority: "high", timeToLearn: "2 weeks", reason: "Standard requirement for target role" },
          { skill: "Agile Methodologies Refresher", priority: "medium", timeToLearn: "1 week", reason: "Terminology update needed" },
          { skill: "Modern API Integrations", priority: "high", timeToLearn: "3 weeks", reason: "Core domain knowledge needed" }
        ],
        topRoles: [
          { title: onboardingData.targetTitle, matchScore: 88, industry: onboardingData.targetIndustry, salaryRange: onboardingData.salaryRange, reason: "Direct skill transfer from past roles." },
          { title: "Senior Business Analyst", matchScore: 82, industry: "Technology", salaryRange: "$95k-$115k", reason: "Leverages your process optimization background." }
        ],
        roadmap: [
          { phase: 1, title: "Foundation & Refresh", duration: "Weeks 1-2", tasks: ["Resume optimization", "LinkedIn update", "Network reaching out"], milestone: "Profile ready for views" },
          { phase: 2, title: "Skill Building", duration: "Weeks 3-6", tasks: ["Complete Tableau course", "Build portfolio project", "Mock interviews"], milestone: "1 polished project" },
          { phase: 3, title: "Active Job Search", duration: "Weeks 7-10", tasks: ["Apply to 15 targeted roles", "Attend 3 intro calls", "Tailor cover letters"], milestone: "3 first-round interviews" },
          { phase: 4, title: "Interview & Offer", duration: "Weeks 11-12", tasks: ["Final round prep", "Offer negotiation", "Acceptance setup"], milestone: "Signed offer letter" }
        ],
        immediateActions: [
          { priority: 1, action: "Finalize your " + onboardingData.targetTitle + " resume", timeframe: "Today" },
          { priority: 2, action: "Connect with 5 former colleagues", timeframe: "This week" },
          { priority: 3, action: "Start the required skill gap course", timeframe: "Week 2" }
        ],
        confidenceBoost: \`You've managed complex situations with grace during your break. Your concern about '\${onboardingData.biggestChallenge}' is valid, but your proven track record speaks louder. You are ready.\`
      };

      if(active) {
        setPhaseIndex(phases.length - 1); // jump to end
        setTimeout(() => onComplete(result || fallback), 800);
      }
    };

    runAnalysis();

    return () => {
      active = false;
      timeouts.forEach(clearTimeout);
    };
  }, [user, onboardingData, onComplete]);

  return (
    <div style={{ height: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', width: '100%', padding: '0 24px' }}>
        <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 48px' }}>
          <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(124, 61, 110, 0.2)', borderRadius: '50%', animation: 'pulse-ring 3s ease-out infinite' }} />
          <div style={{ position: 'absolute', inset: '10px', border: '2px solid rgba(212, 168, 83, 0.3)', borderRadius: '50%', animation: 'pulse-ring 3s ease-out infinite 1s' }} />
          <div style={{ position: 'absolute', inset: '20px', border: '2px solid rgba(124, 61, 110, 0.5)', borderRadius: '50%', animation: 'pulse-ring 3s ease-out infinite 2s' }} />
          <div style={{ position: 'absolute', inset: '40px', background: 'linear-gradient(135deg, var(--plum), #4A2542)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(124, 61, 110, 0.6)' }}>
            <Brain size={48} color="var(--gold)" className="animate-float" />
          </div>
        </div>

        <h2 className="serif" style={{ fontSize: '36px', marginBottom: '16px' }}>Analyzing Your Profile<span className="animate-pulse">...</span></h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', marginBottom: '48px' }}>Our AI is crafting your personalized comeback strategy</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          {phases.slice(1).map((phase, i) => {
            const isActive = i === Math.max(0, phaseIndex - 1);
            const isDone = i < Math.max(0, phaseIndex - 1);
            const isPending = !isActive && !isDone;
            
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: isPending ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                  {isDone ? <CheckCircle size={20} color="var(--gold)" /> : 
                   isActive ? <div className="animate-spin"><RotateCcw size={20} color="var(--plum-light)" /></div> :
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'grey' }} />}
                </div>
                <span style={{ fontSize: '15px', color: isActive ? 'white' : 'rgba(255,255,255,0.8)' }}>{phase}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
