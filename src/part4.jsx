// ---------- PAGE: REPORT ----------
const ReportPage = ({ user, analysis, onContinue }) => {
    if (!analysis) return null;
    const scoreBadgeColor = analysis.readinessScore >= 75 ? '#2F855A' : (analysis.readinessScore >= 50 ? 'var(--gold)' : '#C53030');

    return (
        <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: '64px 24px' }}>
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                <div className="animate-fadeInUp d1" style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(47, 133, 90, 0.1)', color: '#2F855A', borderRadius: '100px', fontWeight: 600, marginBottom: '24px' }}>
                        <CheckCircle size={18} /> Analysis Complete
                    </div>
                    <h1 className="serif" style={{ fontSize: '48px', color: 'var(--text)', marginBottom: '16px' }}>Your Comeback Report is Ready, {user.name.split(' ')[0]}!</h1>
                </div>

                <div className="card animate-fadeInUp d2" style={{ background: 'var(--dark)', color: 'white', padding: '48px', marginBottom: '32px', display: 'flex', gap: '48px', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 160px', textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                            <svg viewBox="0 0 36 36" className="circular-chart" style={{ width: '100%', height: '100%' }}>
                                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="rgba(255,255,255,0.1)" />
                                <path className="circle" strokeDasharray={\`\${analysis.readinessScore}, 100\`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke={scoreBadgeColor} />
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <h2 className="serif" style={{ fontSize: '48px', lineHeight: 1, color: scoreBadgeColor }}>{analysis.readinessScore}</h2>
                                <span style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>Readiness</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 className="serif" style={{ fontSize: '28px', marginBottom: '16px', color: 'var(--gold)' }}>{analysis.headline}</h3>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{analysis.summary}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px', marginBottom: '48px' }}>
                    <div className="card animate-fadeInUp d3">
                        <h4 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Star size={24} color="var(--plum)" /> Key Strengths</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {analysis.keyStrengths.map((str, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ color: '#2F855A' }}><CheckCircle size={20} /></div>
                                    <span style={{ fontWeight: 500 }}>{str}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card animate-fadeInUp d4">
                        <h4 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Target size={24} color="var(--gold)" /> Priority Skill Gaps</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {analysis.skillGaps.slice(0, 3).map((gap, i) => (
                                <div key={i} style={{ padding: '16px', background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 600 }}>{gap.skill}</span>
                                        <span style={{ padding: '4px 8px', background: gap.priority === 'high' ? 'rgba(197, 48, 48, 0.1)' : 'rgba(212, 168, 83, 0.1)', color: gap.priority === 'high' ? '#C53030' : 'var(--gold)', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{gap.timeToLearn}</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: 'var(--muted)' }}>{gap.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card animate-fadeInUp d5" style={{ marginBottom: '48px' }}>
                    <h4 style={{ fontSize: '24px', marginBottom: '32px' }}>Top Role Matches</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {analysis.topRoles.map((role, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingBottom: '24px', borderBottom: i < analysis.topRoles.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--dark)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600 }}>#{i + 1}</div>
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ fontSize: '20px', marginBottom: '8px' }}>{role.title}</h5>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'var(--muted)', marginBottom: '8px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={16} /> {role.industry}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BarChart size={16} /> {role.salaryRange}</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: 'var(--text)' }}>{role.reason}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="serif" style={{ fontSize: '32px', color: role.matchScore >= 80 ? '#2F855A' : 'var(--plum)', fontWeight: 600 }}>{role.matchScore}%</span>
                                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--muted)' }}>Match</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card animate-fadeInUp d6" style={{ background: 'linear-gradient(135deg, var(--plum), #4A2542)', color: 'white', border: 'none', marginBottom: '48px' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                        <Heart size={48} color="var(--gold)" />
                        <div>
                            <h4 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--gold)' }}>We believe in you.</h4>
                            <p style={{ fontSize: '18px', fontStyle: 'italic', lineHeight: 1.6, opacity: 0.9 }}>"{analysis.confidenceBoost}"</p>
                        </div>
                    </div>
                </div>

                <div className="animate-fadeInUp" style={{ textAlign: 'center', animationDelay: '0.8s' }}>
                    <button className="btn btn-gold" style={{ padding: '20px 48px', fontSize: '20px' }} onClick={onContinue}>
                        Continue to My Dashboard <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ---------- PAGE: DASHBOARD ----------
const DashboardPage = ({ user, analysis, onboardingData, initialTab, onLogout }) => {
    const [activeTab, setActiveTab] = useState(initialTab || 'overview');
    const [data, setData] = useState(analysis || {
        readinessScore: 78,
        headline: 'Ready for Next Step',
        summary: 'You are well positioned.',
        skillGaps: [],
        roadmap: [],
        immediateActions: [],
        topRoles: []
    });

    // Resume state
    const [resumeData, setResumeData] = useState({
        summary: data.summary,
        experience: onboardingData?.prevResponsibilities || '',
        skills: onboardingData?.techSkills?.join(', ') || '',
        break: onboardingData?.breakActivities || \`Career Sabbatical (\${onboardingData?.breakDuration || '1 year'})\`
  });
  const [resumeLoading, setResumeLoading] = useState({});

  const enhanceResume = async (sectionKey, sectionName) => {
    setResumeLoading(prev => ({...prev, [sectionKey]: true}));
    const prompt = \`
You are a professional resume writer specializing in career re-entry.
Target role: \${onboardingData?.targetTitle || 'Professional'}
Background: \${onboardingData?.prevTitle || 'Experienced'}, \${onboardingData?.yearsExp || 'years'} experience.
Improve the following "\${sectionName}" resume section. Make it confident, ATS-friendly, and highlight transferable value.
Return ONLY the specific improved text as a plain string, no JSON, no formatting, no labels.

Current text:
\${resumeData[sectionKey]}\`;

    const improved = await callGeminiText(prompt);
    if(improved) setResumeData(prev => ({...prev, [sectionKey]: improved}));
    setResumeLoading(prev => ({...prev, [sectionKey]: false}));
  };

  const [resourceLoading, setResourceLoading] = useState({});
  const [resources, setResources] = useState({});

  const fetchResources = async (skillName) => {
    setResourceLoading(prev => ({...prev, [skillName]: true}));
    const prompt = \`
The user is a \${onboardingData?.prevTitle || 'Professional'} returning to work, targeting \${onboardingData?.targetTitle || 'new role'}.
They need to learn: \${skillName}

Return ONLY a pure JSON object string without any markdown fences or formatting with this exact structure:
[
  {
    "title": "<course/resource title>",
    "provider": "<provider>",
    "type": "Course",
    "duration": "<e.g. 4 hours>",
    "level": "Intermediate",
    "url": "<realistic URL hint>",
    "why": "<1 sentence why>"
  },
  {
    "title": "<course/resource title>",
    "provider": "<provider>",
    "type": "Course",
    "duration": "<e.g. 4 hours>",
    "level": "Intermediate",
    "url": "<realistic URL hint>",
    "why": "<1 sentence why>"
  },
  {
    "title": "<course/resource title>",
    "provider": "<provider>",
    "type": "Course",
    "duration": "<e.g. 4 hours>",
    "level": "Intermediate",
    "url": "<realistic URL hint>",
    "why": "<1 sentence why>"
  }
]\`;
    const res = await callGemini(prompt);
    if(res && Array.isArray(res)) setResources(prev => ({...prev, [skillName]: res}));
    else setResources(prev => ({...prev, [skillName]: [
      { title: "Essential " + skillName, provider: "Coursera", type: "Course", duration: "10 hours", level: "Beginner", why: "Covers all the basics." },
      { title: skillName + " for Professionals", provider: "LinkedIn Learning", type: "Video", duration: "2 hours", level: "Intermediate", why: "Quick refresher." },
      { title: "Advanced " + skillName, provider: "YouTube", type: "Video", duration: "5 hours", level: "Advanced", why: "Deep dive into complex topics." }
    ]}));
    setResourceLoading(prev => ({...prev, [skillName]: false}));
  };

  const navItems = [
    { id: 'overview', icon: <BarChart size={20}/>, label: 'Overview' },
    { id: 'roadmap', icon: <Target size={20}/>, label: 'My Roadmap' },
    { id: 'skills', icon: <Brain size={20}/>, label: 'Skill Analysis' },
    { id: 'resume', icon: <FileText size={20}/>, label: 'Resume Builder' },
    { id: 'practice', icon: <CheckCircle size={20}/>, label: 'Practice Tests' },
    { id: 'jobs', icon: <Briefcase size={20}/>, label: 'Job Matches' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }} className="hide-mobile">
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color:'var(--plum)', marginBottom:'32px' }}>
            <RotateCcw size={24} /><span className="serif" style={{ fontSize: '24px', fontWeight:600, color:'var(--text)' }}>Re•Entry</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border)', color: 'var(--plum)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '20px' }}>
              {user.name.charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 600 }}>{user.name}</p>
              <p style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: 600 }}>Score: {data.readinessScore}/100</p>
            </div>
          </div>
        </div>
        <nav style={{ padding: '24px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                background: activeTab === item.id ? 'var(--plum)' : 'transparent',
                color: activeTab === item.id ? 'white' : 'var(--muted)',
                fontWeight: activeTab === item.id ? 600 : 500
              }}>
              <div style={{ opacity: activeTab === item.id ? 1 : 0.7 }}>{item.icon}</div> {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '24px' }}>
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--muted)', width: '100%' }}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '40px' }}>
          <h1 className="serif" style={{ fontSize: '36px', color: 'var(--text)' }}>
            {navItems.find(i => i.id === activeTab)?.label}
          </h1>
        </header>

        {activeTab === 'overview' && (
          <div className="animate-fadeInUp">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', marginBottom: '16px' }}>Readiness Score <BarChart size={20}/></div>
                <div><h3 className="serif" style={{ fontSize:'48px', color: data.readinessScore > 70 ? '#2F855A' : 'var(--gold)', lineHeight:1 }}>{data.readinessScore}</h3><span style={{color:'var(--muted)', fontSize:'14px'}}>Top 15% of cohort</span></div>
              </div>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', marginBottom: '16px' }}>Skills Refresh <Brain size={20}/></div>
                <div><h3 className="serif" style={{ fontSize:'48px', color: 'var(--plum)', lineHeight:1 }}>1/{data.skillGaps?.length || 3}</h3><span style={{color:'var(--muted)', fontSize:'14px'}}>In progress</span></div>
              </div>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', marginBottom: '16px' }}>Job Matches <Briefcase size={20}/></div>
                <div><h3 className="serif" style={{ fontSize:'48px', color: 'var(--gold)', lineHeight:1 }}>{data.topRoles?.length || 2}</h3><span style={{color:'var(--muted)', fontSize:'14px'}}>Highly relevant</span></div>
              </div>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', marginBottom: '16px' }}>Roadmap Week <Target size={20}/></div>
                <div><h3 className="serif" style={{ fontSize:'48px', color: 'var(--text)', lineHeight:1 }}>Wk 1</h3><span style={{color:'var(--muted)', fontSize:'14px'}}>Foundation Phase</span></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div className="card">
                <h4 style={{ fontSize: '20px', marginBottom: '24px' }}>Immediate Actions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {data.immediateActions?.map((act, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                      <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--plum)' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 500, marginBottom: '4px' }}>{act.action}</p>
                        <span style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--cream)', padding: '2px 8px', borderRadius: '4px' }}>{act.timeframe}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h4 style={{ fontSize: '20px', marginBottom: '24px' }}>Top Matches</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {data.topRoles?.slice(0,3).map((role, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                      <div style={{ width: '48px', height: '48px', background: 'var(--cream)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontWeight: 600 }}>{role.matchScore}%</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, marginBottom: '4px' }}>{role.title}</p>
                        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{role.industry}</span>
                      </div>
                      <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setActiveTab('jobs')}>View</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="animate-fadeInUp">
            <div style={{ display: 'flex', gap: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '15px', top: '20px', bottom: '0', width: '2px', background: 'var(--border)', zIndex: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', flex: 1 }}>
                {(data.roadmap || []).map((phase, i) => (
                  <div key={i} style={{ display: 'flex', gap: '32px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: i === 0 ? 'var(--plum)' : 'white', border: \`2px solid \${i === 0 ? 'var(--plum)' : 'var(--border)'}\`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginTop: '24px' }}>
                      {i === 0 ? <RotateCcw size={16} className="animate-spin" /> : <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--border)'}}/>}
                    </div>
                    <div className="card" style={{ flex: 1, padding: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                          <span style={{ fontSize: '14px', color: 'var(--plum)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Phase {phase.phase}</span>
                          <h3 className="serif" style={{ fontSize: '28px', marginTop: '4px' }}>{phase.title}</h3>
                        </div>
                        <span style={{ padding: '8px 16px', background: 'var(--cream)', borderRadius: '100px', fontSize: '14px', fontWeight: 600, border: '1px solid var(--border)' }}>{phase.duration}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        {phase.tasks.map((task, j) => (
                          <label key={j} style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}>
                            <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--plum)' }} />
                            <span style={{ color: 'var(--text)' }}>{task}</span>
                          </label>
                        ))}
                      </div>
                      <div style={{ padding: '16px', background: 'rgba(212, 168, 83, 0.1)', borderRadius: '8px', border: '1px solid rgba(212, 168, 83, 0.3)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Trophy size={20} color="var(--gold)" />
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>Milestone: {phase.milestone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="animate-fadeInUp">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '32px' }}>
              <div>
                <h4 style={{ fontSize: '24px', marginBottom: '24px' }}>Gaps to Close</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {(data.skillGaps || []).map((gap, i) => (
                    <div key={i} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                          <h5 style={{ fontSize: '20px', marginBottom: '4px' }}>{gap.skill}</h5>
                          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>{gap.reason}</p>
                        </div>
                        <span style={{ padding: '6px 12px', background: gap.priority === 'high' ? 'rgba(197, 48, 48, 0.1)' : 'rgba(212, 168, 83, 0.1)', color: gap.priority === 'high' ? '#C53030' : 'var(--gold)', borderRadius: '100px', fontSize: '12px', fontWeight: 600, height: 'max-content' }}>{gap.timeToLearn}</span>
                      </div>
                      
                      {resources[gap.skill] ? (
                        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                          <h6 style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>AI Recommended Resources</h6>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {resources[gap.skill].map((res, j) => (
                              <div key={j} style={{ padding: '16px', background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <p style={{ fontWeight: 600, marginBottom: '4px' }}>{res.title}</p>
                                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--muted)' }}>
                                    <span>{res.provider}</span> • <span>{res.duration}</span> • <span>{res.level}</span>
                                  </div>
                                </div>
                                <button className="btn btn-plum" style={{ padding: '8px 16px', fontSize: '13px' }}>View</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginTop: '24px' }}>
                          <button className="btn btn-outline" onClick={() => fetchResources(gap.skill)} disabled={resourceLoading[gap.skill]}>
                            {resourceLoading[gap.skill] ? <><RotateCcw size={16} className="animate-spin"/> Finding Courses...</> : <><Sparkles size={16} color="var(--gold)"/> Start Learning</>}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="card" style={{ position: 'sticky', top: '24px' }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '24px' }}>Your Strengths</h4>
                  <div style={{ width: '100%', height: '8px', background: 'var(--cream)', borderRadius: '4px', marginBottom: '24px' }}>
                    <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, var(--plum), var(--gold))', borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(data.keyStrengths || []).map((str, i) => (
                      <div key={i} className="chip selected" style={{ fontSize: '12px', padding: '4px 12px' }}>{str}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="animate-fadeInUp">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 1fr', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '18px' }}>Professional Summary</h4>
                    <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => enhanceResume('summary', 'Summary')} disabled={resumeLoading.summary}>
                      {resumeLoading.summary ? <RotateCcw size={16} className="animate-spin"/> : <Sparkles size={16} color="var(--gold)"/>} Enhance
                    </button>
                  </div>
                  <textarea rows={5} value={resumeData.summary} onChange={e => setResumeData({...resumeData, summary: e.target.value})} />
                </div>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '18px' }}>Experience</h4>
                    <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => enhanceResume('experience', 'Experience')} disabled={resumeLoading.experience}>
                      {resumeLoading.experience ? <RotateCcw size={16} className="animate-spin"/> : <Sparkles size={16} color="var(--gold)"/>} Enhance
                    </button>
                  </div>
                  <textarea rows={6} value={resumeData.experience} onChange={e => setResumeData({...resumeData, experience: e.target.value})} />
                </div>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '18px' }}>Career Break Explanation</h4>
                    <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => enhanceResume('break', 'Career Break Explanation')} disabled={resumeLoading.break}>
                      {resumeLoading.break ? <RotateCcw size={16} className="animate-spin"/> : <Sparkles size={16} color="var(--gold)"/>} Enhance
                    </button>
                  </div>
                  <textarea rows={4} value={resumeData.break} onChange={e => setResumeData({...resumeData, break: e.target.value})} />
                </div>
              </div>
              <div>
                <div className="card" style={{ position: 'sticky', top: '24px', background: 'white', border: '1px solid var(--border)', minHeight: '600px', padding: '48px', boxShadow: '0 24px 48px rgba(0,0,0,0.05)' }}>
                  <div style={{ borderBottom: '2px solid var(--text)', paddingBottom: '24px', marginBottom: '24px', textAlign: 'center' }}>
                    <h2 className="serif" style={{ fontSize: '36px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>{user.name}</h2>
                    <p style={{ color: 'var(--muted)' }}>{user.email} • LinkedIn Profile</p>
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--plum)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px' }}>Professional Summary</h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{resumeData.summary}</p>
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--plum)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px' }}>Experience</h3>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                        <span>{onboardingData?.prevTitle || 'Previous Role'}</span>
                        <span>Prior to break</span>
                      </div>
                      <p style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: 1.6, color: 'var(--text)' }}>{resumeData.experience}</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--plum)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px' }}>Career Break</h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{resumeData.break}</p>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '48px' }}>
                    <button className="btn btn-gold" onClick={() => window.print()}><Download size={18}/> Download PDF</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="animate-fadeInUp">
            <h4 style={{ fontSize: '24px', marginBottom: '24px' }}>Mock Interviews</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {(data.topRoles?.length ? data.topRoles : [{title: 'Product Manager'}, {title: 'Business Analyst'}]).map((role, i) => (
                <div key={i} className="card">
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--cream)', color: 'var(--plum)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <Target size={24} />
                  </div>
                  <h5 style={{ fontSize: '20px', marginBottom: '8px' }}>{role.title} Simulator</h5>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>4 behavioral and technical questions based on standard industry interviews.</p>
                  <button className="btn btn-plum" style={{ width: '100%' }} onClick={() => alert('Starting mock interview simulator...')}>Start Quiz <PlayCircle size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="animate-fadeInUp">
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--muted)' }} />
                <input type="text" placeholder="Search roles..." style={{ paddingLeft: '48px' }} />
              </div>
              <select style={{ width: '200px' }}><option>All Industries</option></select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Briefcase size={24} color="var(--plum)"/></div>
                      <div>
                        <h5 style={{ fontSize: '18px', marginBottom: '4px' }}>{onboardingData?.targetTitle || 'Senior Manager'}</h5>
                        <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Partner Company • Remote</span>
                      </div>
                    </div>
                    <div>
                      <span className="serif" style={{ fontSize: '28px', color: '#2F855A', fontWeight: 600 }}>{95 - i*4}%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <span style={{ padding: '6px 12px', background: 'var(--cream)', borderRadius: '100px', fontSize: '12px', fontWeight: 500 }}>$120k-$140k</span>
                    <span style={{ padding: '6px 12px', background: 'var(--cream)', borderRadius: '100px', fontSize: '12px', fontWeight: 500 }}>Full-time</span>
                    <span style={{ padding: '6px 12px', background: 'rgba(212, 168, 83, 0.1)', color: 'var(--gold)', borderRadius: '100px', fontSize: '12px', fontWeight: 600 }}>Returnship</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-outline" style={{ flex: 1 }}>Save</button>
                    <button className="btn btn-plum" style={{ flex: 2 }}>Easy Apply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
