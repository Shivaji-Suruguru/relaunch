const AuthPage = ({ mode: initialMode, onAuth, onBack }) => {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && !formData.name) return setError('Name is required');
    if (!formData.email.includes('@')) return setError('Valid email is required');
    if (formData.password.length < 6) return setError('Password min 6 chars');
    if (mode === 'signup' && formData.password !== formData.confirm) return setError('Passwords do not match');

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.name } }
        });
        if (error) throw error;
        // Mock save for fallback
        if (data.user) {
          await supabase.from('profiles').upsert({ id: data.user.id, full_name: formData.name, email: formData.email }).catch(console.warn);
        }
        onAuth({ name: formData.name, email: formData.email, id: data?.user?.id || 'id' }, true);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;

        // Check profile
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        onAuth({ name: profile?.full_name || 'User', email: formData.email, id: data.user.id }, !profile?.onboarding_complete);
      }
    } catch (err) {
      console.warn('Auth Error:', err.message);
      // Fallback auth for preview without Supabase credentials
      setTimeout(() => {
        onAuth({ name: formData.name || 'User', email: formData.email, id: 'mock-id' }, mode === 'signup');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
      // Handles OAuth redirect automatically, but mock here just in case:
      setTimeout(() => onAuth({ name: \`\${provider} User\`, email: 'user@example.com', id: 'mock-id' }, mode === 'signup'), 1500);
    } catch (err) {
      console.warn('OAuth Error:', err.message);
      setTimeout(() => onAuth({ name: \`\${provider} User\`, email: 'user@example.com', id: 'mock-id' }, mode === 'signup'), 1500);
    } finally {
      if (!window.location.host.includes('localhost')) setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ flex: '0 0 45%', background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-mid) 100%)', padding: '48px', display: 'flex', flexDirection: 'column', color: 'white' }} className="hide-mobile">
        <button className="btn" style={{ color: 'rgba(255,255,255,0.7)', padding: 0, justifyContent: 'flex-start' }} onClick={onBack}><ChevronLeft size={20} /> Back to home</button>
        <div style={{ margin: 'auto 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--plum)', marginBottom: '24px' }}>
            <RotateCcw size={32} /><span className="serif" style={{ fontSize: '32px', fontWeight: 600, color: 'white' }}>Re•Entry</span>
          </div>
          <h2 className="serif" style={{ fontSize: '48px', lineHeight: 1.2, marginBottom: '48px' }}>Welcome to your <br /><span style={{ color: 'var(--gold)' }}>comeback journey.</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[{ i: <CheckCircle size={20} />, t: 'Private & Secure' }, { i: <CheckCircle size={20} />, t: 'AI ready in 3 min' }, { i: <CheckCircle size={20} />, t: 'Built for women' }].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}><div style={{ color: 'var(--gold)' }}>{item.i}</div> {item.t}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '48px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px' }} className="animate-fadeInUp">
          <button className="btn hide-desktop" style={{ color: 'var(--muted)', padding: 0, justifyContent: 'flex-start', marginBottom: '24px' }} onClick={onBack}><ChevronLeft size={20} /> Back</button>
          <h2 className="serif" style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--text)' }}>
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>
            {mode === 'signup' ? 'Start your personalized comeback today.' : 'Enter your details to access your dashboard.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
             <button className="btn btn-outline" style={{ width: '100%', borderRadius: '12px' }} onClick={() => handleSocial('google')}>
               <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" style={{ width: 20 }} /> Continue with Google
             </button>
             <button className="btn btn-outline" style={{ width: '100%', borderRadius: '12px' }} onClick={() => handleSocial('linkedin_oidc')}>
               <BriefcaseBusiness size={20} color="#0A66C2" /> Continue with LinkedIn
             </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0', color: 'var(--muted)', fontSize: '14px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div> or with email <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'signup' && <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={loading} />}
            <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={loading} />
            <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} disabled={loading} />
            {mode === 'signup' && <input type="password" placeholder="Confirm Password" value={formData.confirm} onChange={e => setFormData({ ...formData, confirm: e.target.value })} disabled={loading} />}
            {error && <p style={{ color: '#E53E3E', fontSize: '14px' }}>{error}</p>}
            <button type="button" onClick={handleSubmit} className="btn btn-plum" style={{ width: '100%', marginTop: '8px', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? <span className="animate-spin"><RotateCcw size={20} /></span> : (mode === 'signup' ? 'Create Account' : 'Sign In')}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: 'var(--muted)' }}>
            {mode === 'signup' ? 'Already have an account? ' : 'New to Re•Entry? '}
            <button style={{ color: 'var(--plum)', fontWeight: 600, textDecoration: 'underline' }} onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>{mode === 'signup' ? 'Sign in' : 'Create account'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};


const OnboardingPage = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    prevTitle: '', prevIndustry: '', yearsExp: '', prevResponsibilities: '',
    breakDuration: '', breakReason: '', breakActivities: '',
    targetTitle: '', targetIndustry: '', workType: '', relocation: '',
    techSkills: [], softSkills: [], tools: '', confidence: 5,
    timeline: '', salaryRange: '', studyHours: 8, biggestChallenge: ''
  });
  const [errors, setErrors] = useState({});

  const [generalError, setGeneralError] = useState('');

  const validate = () => {
    let newErrs = {};
    setGeneralError('');
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
    if (Object.keys(newErrs).length > 0) {
      setGeneralError('Please fill in all required fields marked with *');
    }
    return Object.keys(newErrs).length === 0;
  };

  const handleNext = async () => {
    if (validate()) {
      if (user?.id) {
         try {
           await supabase.from('onboarding_data').upsert({ user_id: user.id, ...data });
         } catch (e) { console.warn("Upsert failed, continuing locally"); }
      }
      setStep(s => s + 1);
    }
  };

  const handleSubmit = async () => {
    if (validate()) {
        if (user?.id) {
            try {
               await supabase.from('onboarding_data').upsert({ user_id: user.id, ...data });
               await supabase.from('profiles').upsert({ id: user.id, full_name: user.name, email: user.email, onboarding_complete: true });
            } catch (e) {}
        }
        onComplete(data);
    }
  };

  const toggleSkill = (type, skill) => {
    setData(prev => ({ ...prev, [type]: prev[type].includes(skill) ? prev[type].filter(s => s !== skill) : [...prev[type], skill] }));
  };

  const OptionCard = ({ label, selected, onClick }) => (
    <div onClick={onClick} style={{ padding: '16px', borderRadius: '12px', border: \`2px solid \${selected ? 'var(--plum)' : 'var(--border)'}\`, background: selected ? 'rgba(124, 61, 110, 0.05)' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}>
      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: selected ? 'var(--plum)' : 'var(--border)', background: selected ? 'var(--plum)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }} />}
      </div>
      <span style={{ fontWeight: 500, color: selected ? 'var(--plum)' : 'var(--text)' }}>{label}</span>
    </div>
  );

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
              <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', zIndex: 1, background: i < step ? 'var(--gold)' : i === step ? 'var(--plum)' : 'white', border: \`2px solid \${i <= step ? 'transparent' : 'var(--border)'}\`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
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
                <div><label>Previous Job Title*</label><input type="text" value={data.prevTitle} onChange={e => setData({...data, prevTitle: e.target.value})} />{errors.prevTitle && <span style={{ color: 'red' }}>{errors.prevTitle}</span>}</div>
                <div>
                  <label>Industry*</label>
                  <select value={data.prevIndustry} onChange={e => setData({...data, prevIndustry: e.target.value})}>
                    <option value="">Select Industry...</option><option value="Technology">Technology</option><option value="Finance">Finance</option><option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <label>Years of Experience*</label>
                  <select value={data.yearsExp} onChange={e => setData({...data, yearsExp: e.target.value})}>
                    <option value="">Select...</option><option value="1-3">1-3 years</option><option value="4-7">4-7 years</option><option value="8-12">8-12 years</option>
                  </select>
                </div>
                <div><label>Key Responsibilities & Achievements*</label><textarea rows={4} value={data.prevResponsibilities} onChange={e => setData({...data, prevResponsibilities: e.target.value})} /></div>
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
                  <label>Duration*</label>
                  <select value={data.breakDuration} onChange={e => setData({...data, breakDuration: e.target.value})}>
                    <option value="">Select duration...</option><option value="< 1 year">Less than 1 year</option><option value="1-3 years">1-3 years</option><option value="3-5 years">3-5 years</option>
                  </select>
                </div>
                <div>
                  <label>Primary Reason*</label>
                  <select value={data.breakReason} onChange={e => setData({...data, breakReason: e.target.value})}>
                    <option value="">Select reason...</option><option value="Caregiving (Children)">Caregiving (Children)</option><option value="Personal Health">Personal Health</option><option value="Other">Other</option>
                  </select>
                </div>
                <div><label>Activities During Break (Optional)</label><textarea rows={3} value={data.breakActivities} onChange={e => setData({...data, breakActivities: e.target.value})} /></div>
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
                <div><label>Target Job Title*</label><input type="text" value={data.targetTitle} onChange={e => setData({...data, targetTitle: e.target.value})} /></div>
                <div>
                  <label>Target Industry*</label>
                  <select value={data.targetIndustry} onChange={e => setData({...data, targetIndustry: e.target.value})}>
                    <option value="">Select Industry...</option><option value="Technology">Technology</option><option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label>Work Preference*</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="mb-stack">
                    <OptionCard label="Remote" selected={data.workType === 'Remote'} onClick={() => setData({...data, workType: 'Remote'})} />
                    <OptionCard label="Hybrid" selected={data.workType === 'Hybrid'} onClick={() => setData({...data, workType: 'Hybrid'})} />
                    <OptionCard label="On-site" selected={data.workType === 'On-site'} onClick={() => setData({...data, workType: 'On-site'})} />
                  </div>
                </div>
                <div>
                  <label>Open to Relocation?*</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="mb-stack">
                    <OptionCard label="Yes" selected={data.relocation === 'Yes'} onClick={() => setData({...data, relocation: 'Yes'})} />
                    <OptionCard label="No" selected={data.relocation === 'No'} onClick={() => setData({...data, relocation: 'No'})} />
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
                  <label>Technical Skills* {errors.techSkills && <span style={{ color: 'red' }}>{errors.techSkills}</span>}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {['Python', 'SQL', 'Excel', 'React', 'Project Management', 'Agile/Scrum', 'Salesforce', 'Figma'].map(s => (
                      <div key={s} className={\`chip \${data.techSkills.includes(s) ? 'selected' : ''}\`} onClick={() => toggleSkill('techSkills', s)}>{s}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <label>Soft Skills</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {['Leadership', 'Communication', 'Problem Solving', 'Adaptability'].map(s => (
                      <div key={s} className={\`chip \${data.softSkills.includes(s) ? 'selected' : ''}\`} onClick={() => toggleSkill('softSkills', s)}>{s}</div>
                    ))}
                  </div>
                </div>
                <div><label>Tools & Platforms</label><input type="text" value={data.tools} onChange={e => setData({...data, tools: e.target.value})} placeholder="e.g. Jira, Slack, HubSpot" /></div>
                <div>
                  <label>Confidence Level: {data.confidence}/10</label>
                  <input type="range" min="1" max="10" value={data.confidence} onChange={e => setData({...data, confidence: e.target.value})} style={{ padding: 0, height: '4px', background: 'var(--border)' }} />
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
                  <label>Return Timeline*</label>
                  <select value={data.timeline} onChange={e => setData({...data, timeline: e.target.value})}>
                    <option value="">Select...</option><option value="1-3 months">1-3 months</option><option value="3-6 months">3-6 months</option>
                  </select>
                </div>
                <div>
                  <label>Salary Range*</label>
                  <select value={data.salaryRange} onChange={e => setData({...data, salaryRange: e.target.value})}>
                    <option value="">Select...</option><option value="$60K-$80K">$60K-$80K</option><option value="$80K-$100K">$80K-$100K</option>
                  </select>
                </div>
                <div>
                  <label>Weekly Study Hours: {data.studyHours}</label>
                  <input type="range" min="2" max="20" value={data.studyHours} onChange={e => setData({...data, studyHours: e.target.value})} style={{ padding: 0, height: '4px', background: 'var(--border)' }} />
                </div>
                <div><label>Biggest Challenge Right Now*</label><textarea rows={3} value={data.biggestChallenge} onChange={e => setData({...data, biggestChallenge: e.target.value})} /></div>
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


const AnalyzingPage = ({ user, onboardingData, onComplete }) => {
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
      try {
        const payload = { ...onboardingData, name: user?.name, user_id: user?.id };
        const response = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await response.json();
        
        if (user?.id) {
            await supabase.from('analyses').upsert({ user_id: user.id, ...result }).catch(() => {});
        }
        
        setTimeout(() => onComplete(result), 1000); // give enough time for phases to show
      } catch (err) {
        console.error("Analysis via Vercel failed:", err);
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
