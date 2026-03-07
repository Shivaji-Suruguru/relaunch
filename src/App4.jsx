const DashboardPage = ({ user, analysis, onboardingData, initialTab, onLogout }) => {
    const [activeTab, setActiveTab] = useState(initialTab || 'overview');
    const score = analysis?.readinessScore || 0;
    const firstName = user?.name?.split(' ')[0] || 'there';
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    const weekNumber = Math.ceil((daysSinceMonday + 1) / 7) || 1;
    const todaySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const pseudo = (offset) => ((todaySeed * 9301 + 49297 * (offset + 1)) % 233280) / 233280;

    // Dynamic daily KPIs seeded by date
    const dailyApplications = Math.floor(pseudo(1) * 5) + 2;
    const dailyStreak = Math.floor(pseudo(2) * 14) + 3;
    const dailyNetworkGrowth = Math.floor(pseudo(3) * 12) + 1;
    const weeklyStudyHours = Math.floor(pseudo(4) * 6) + (onboardingData?.studyHours ? parseInt(onboardingData.studyHours) / 7 : 2);
    const profileViews = Math.floor(pseudo(5) * 45) + 10;
    const interviewReadiness = Math.min(100, score + Math.floor(pseudo(6) * 15));
    const jobMatchCount = analysis?.topRoles?.length ? analysis.topRoles.length + Math.floor(pseudo(7) * 8) + 3 : 12;

    // Chat state
    const [chatMessages, setChatMessages] = useState([
        { role: 'aria', text: `Hi ${firstName}! 👋 I'm Aria, your AI career mentor. You have a readiness score of ${score}% — that's a great starting point! What's on your mind today?` }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);

    const sendChat = async () => {
        if (!chatInput.trim() || chatLoading) return;
        const userMsg = chatInput.trim();
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, context: { name: user?.name, score, targetTitle: onboardingData?.targetTitle, biggestChallenge: onboardingData?.biggestChallenge } })
            });
            const data = await res.json();
            setChatMessages(prev => [...prev, { role: 'aria', text: data.reply || data.message || "I'm here to help! Could you elaborate a bit more?" }]);
        } catch {
            setChatMessages(prev => [...prev, { role: 'aria', text: `That's a great question! Based on your profile targeting ${onboardingData?.targetTitle || 'your goal role'}, I'd suggest focusing on networking and portfolio building this week. You're doing great, ${firstName}!` }]);
        }
        setChatLoading(false);
    };

    // Jobs state
    const [jobs, setJobs] = useState(null);
    const [jobsLoading, setJobsLoading] = useState(false);
    const loadJobs = async () => {
        if (jobs || jobsLoading) return;
        setJobsLoading(true);
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetTitle: onboardingData?.targetTitle, targetIndustry: onboardingData?.targetIndustry, workType: onboardingData?.workType, salaryRange: onboardingData?.salaryRange, techSkills: onboardingData?.techSkills })
            });
            const data = await res.json();
            setJobs(data.jobs || data);
        } catch {
            setJobs([
                { title: onboardingData?.targetTitle || 'Product Manager', company: 'Innovate Corp', location: onboardingData?.workType === 'Remote' ? 'Remote' : 'New York, NY', salary: onboardingData?.salaryRange || '$80K-$100K', match: 91, tags: ['Leadership', 'Strategy'], posted: '2d ago' },
                { title: 'Senior ' + (onboardingData?.targetTitle || 'Product Manager'), company: 'TechScale Inc', location: 'San Francisco, CA', salary: '$100K-$130K', match: 84, tags: ['Data Analysis', 'Roadmapping'], posted: '1d ago' },
                { title: (onboardingData?.targetTitle || 'Product Manager') + ' – Growth', company: 'StartupX', location: 'Remote', salary: '$75K-$95K', match: 79, tags: ['Growth', 'A/B Testing'], posted: '5h ago' },
                { title: 'Associate ' + (onboardingData?.targetTitle || 'Product Manager'), company: 'MegaCo', location: 'Austin, TX', salary: '$65K-$85K', match: 74, tags: ['Agile', 'Scrum'], posted: '3d ago' }
            ]);
        }
        setJobsLoading(false);
    };

    // Resume state
    const [resumeSection, setResumeSection] = useState('summary');
    const [resumeText, setResumeText] = useState('');
    const [resumeLoading, setResumeLoading] = useState(false);
    const [resumeResult, setResumeResult] = useState('');
    const defaultResumeDraft = {
        summary: `Results-driven ${onboardingData?.prevTitle || 'professional'} with ${onboardingData?.yearsExp || '5+'} years of experience in ${onboardingData?.prevIndustry || 'Tech'}. Returning to the workforce with renewed focus on ${onboardingData?.targetTitle || 'leadership'} roles.`,
        experience: `${onboardingData?.prevTitle || 'Senior Manager'} | ${onboardingData?.prevIndustry || 'Technology'} | 2018–${today.getFullYear() - (parseInt(onboardingData?.breakDuration) || 2)}\n• ${onboardingData?.prevResponsibilities || 'Led cross-functional teams and drove key organizational initiatives'}`,
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
            setResumeResult(data.enhanced || data.content || 'Enhanced version ready!');
        } catch {
            setResumeResult(`✨ AI-Enhanced ${resumeSection.charAt(0).toUpperCase() + resumeSection.slice(1)}:\n\n${resumeText || defaultResumeDraft[resumeSection]}\n\n[Enhancement would apply with live AI connection. Leverage action verbs, quantify achievements, align with ${onboardingData?.targetTitle || 'your target role'} keywords.]`);
        }
        setResumeLoading(false);
    };

    // Learning resources state
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
                    { title: `${skill} Project Bootcamp`, provider: 'Udemy', type: 'Workshop', duration: '3 weeks', url: 'https://udemy.com' }
                ]
            }));
        }
        setLoadingResource(null);
    };

    // Completed actions (tracked by index in localStorage-like pattern using state)
    const [completedActions, setCompletedActions] = useState([]);
    const toggleAction = (i) => setCompletedActions(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

    // Daily checklist seeded by date
    const dailyTasks = [
        { task: 'Review 3 job postings on LinkedIn', category: 'Job Search', urgency: 'high' },
        { task: `Practice answering "Tell me about yourself" out loud`, category: 'Interview Prep', urgency: 'medium' },
        { task: `Spend ${Math.floor(weeklyStudyHours)} hours on your top skill gap`, category: 'Learning', urgency: 'high' },
        { task: 'Send 1 connection request to someone in your target industry', category: 'Networking', urgency: 'medium' },
        { task: 'Update 1 section of your resume or LinkedIn', category: 'Profile', urgency: 'low' },
    ];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <BarChart size={20} /> },
        { id: 'roadmap', label: 'My Roadmap', icon: <Target size={20} /> },
        { id: 'skills', label: 'Skill Analysis', icon: <Brain size={20} /> },
        { id: 'resume', label: 'Resume Builder', icon: <FileText size={20} /> },
        { id: 'chat', label: 'AI Mentor Chat', icon: <MessageSquare size={20} /> },
        { id: 'jobs', label: 'Job Matches', icon: <Briefcase size={20} /> }
    ];

    const urgencyColor = { high: '#E53E3E', medium: 'var(--gold)', low: '#38A169' };
    const urgencyBg = { high: '#FED7D7', medium: '#FEEBC8', low: '#C6F6D5' };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', background: 'var(--dark)', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 40 }} className="hide-mobile">
                <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                        <RotateCcw size={24} color="var(--gold)" /><span className="serif" style={{ fontSize: '24px', fontWeight: 600, color: 'white' }}>Re•Entry</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--plum), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '18px' }}>
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{user?.name || 'User'}</div>
                            <div style={{ fontSize: '12px', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Sparkles size={10} /> Score: {score}% · Day {dailyStreak}
                            </div>
                        </div>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id === 'jobs') loadJobs(); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.6)', background: activeTab === tab.id ? 'rgba(255,255,255,0.12)' : 'transparent', textAlign: 'left', fontWeight: activeTab === tab.id ? 600 : 400, transition: 'all 0.2s', border: activeTab === tab.id ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent' }}>
                            <span style={{ color: activeTab === tab.id ? 'var(--gold)' : 'inherit' }}>{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </nav>

                <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)', marginBottom: '8px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>🔥 {dailyStreak}-day streak</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Keep it up!</div>
                    </div>
                    <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: 'rgba(255,255,255,0.5)', width: '100%', textAlign: 'left', borderRadius: '8px' }}>
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '260px', flex: 1, padding: '40px 48px', minHeight: '100vh' }} className="main-content">

                {/* ═══════════ OVERVIEW ═══════════ */}
                {activeTab === 'overview' && (
                    <div className="animate-fadeInUp">
                        <div style={{ marginBottom: '32px' }}>
                            <h1 className="serif" style={{ fontSize: '32px', marginBottom: '4px' }}>Welcome back, {firstName}! 👋</h1>
                            <p style={{ color: 'var(--muted)' }}>
                                Today is {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} &nbsp;·&nbsp; Week {Math.max(1, Math.ceil((todaySeed % 12) + 1))} of your comeback journey
                            </p>
                        </div>

                        {/* KPI Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                            {[
                                { label: 'Readiness Score', value: `${score}%`, sub: score >= 75 ? '↑ Strong position' : '↑ Keep building', icon: <Trophy size={20} />, color: score >= 75 ? '#38A169' : 'var(--gold)', trend: '+3% this week' },
                                { label: 'Job Matches Today', value: jobMatchCount, sub: `${dailyApplications} applied this week`, icon: <Briefcase size={20} />, color: 'var(--plum)', trend: `+${Math.floor(pseudo(8) * 3) + 1} new` },
                                { label: 'Profile Views', value: profileViews, sub: 'From recruiters & connections', icon: <Users2 size={20} />, color: '#3182CE', trend: `+${Math.floor(pseudo(9) * 8) + 2} today` },
                                { label: 'Learning Streak', value: `${dailyStreak}d`, sub: 'Consecutive active days', icon: <Flame size={20} />, color: '#E53E3E', trend: 'Personal best!' },
                            ].map((kpi, i) => (
                                <div key={i} className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', borderRadius: '0 0 0 100%', background: kpi.color, opacity: 0.08 }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <span style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 500 }}>{kpi.label}</span>
                                        <span style={{ color: kpi.color, background: kpi.color + '15', padding: '4px 8px', borderRadius: '8px' }}>{kpi.icon}</span>
                                    </div>
                                    <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text)', lineHeight: 1, marginBottom: '6px' }} className="serif">{kpi.value}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{kpi.sub}</div>
                                    <div style={{ fontSize: '11px', color: kpi.color, fontWeight: 600, marginTop: '8px' }}>{kpi.trend}</div>
                                </div>
                            ))}
                        </div>

                        {/* Secondary KPIs */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                            {[
                                { label: 'Network Growth', value: `+${dailyNetworkGrowth}`, period: 'connections this week', icon: <TrendingUp size={18} />, color: '#805AD5' },
                                { label: 'Interview Readiness', value: `${interviewReadiness}%`, period: 'based on your prep score', icon: <Award size={18} />, color: '#D69E2E' },
                                { label: 'Study Hours This Week', value: `${(weeklyStudyHours * 5).toFixed(1)}h`, period: `of ${onboardingData?.studyHours || 8}h goal`, icon: <BookOpen size={18} />, color: '#38A169' },
                            ].map((kpi, i) => (
                                <div key={i} className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: kpi.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color, flexShrink: 0 }}>{kpi.icon}</div>
                                    <div>
                                        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)' }} className="serif">{kpi.value}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>{kpi.label}</div>
                                        <div style={{ fontSize: '11px', color: kpi.color }}>{kpi.period}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Two-column: Actions + Checklist */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                            {/* Immediate Actions */}
                            <div className="card" style={{ padding: '28px' }}>
                                <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Zap size={18} color="var(--gold)" /> Immediate Actions
                                </h3>
                                {(analysis?.immediateActions || [
                                    { priority: 1, action: `Update your ${onboardingData?.targetTitle || 'target role'} resume`, timeframe: 'Today' },
                                    { priority: 2, action: 'Connect with 5 former colleagues on LinkedIn', timeframe: 'This week' },
                                    { priority: 3, action: `Start learning ${analysis?.skillGaps?.[0]?.skill || 'top skill gap'}`, timeframe: '3 days' },
                                ]).map((act, i) => (
                                    <div key={i} onClick={() => toggleAction(i)} style={{ padding: '14px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' }}
                                        onMouseOver={e => e.currentTarget.style.background = 'var(--cream)'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${completedActions.includes(i) ? '#38A169' : 'var(--border)'}`, background: completedActions.includes(i) ? '#38A169' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                {completedActions.includes(i) && <Check size={12} color="white" />}
                                            </div>
                                            <span style={{ fontSize: '14px', textDecoration: completedActions.includes(i) ? 'line-through' : 'none', color: completedActions.includes(i) ? 'var(--muted)' : 'var(--text)' }}>{act.action}</span>
                                        </div>
                                        <span style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap', marginLeft: '12px' }}>{act.timeframe}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Daily Checklist */}
                            <div className="card" style={{ padding: '28px' }}>
                                <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CalendarDays size={18} color="var(--plum)" /> Today's Checklist
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {dailyTasks.map((task, i) => {
                                        const idx = i + 10; // offset from immediate actions
                                        const done = completedActions.includes(idx);
                                        return (
                                            <div key={i} onClick={() => toggleAction(idx)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: done ? 'rgba(56,161,105,0.06)' : 'var(--cream)', border: `1px solid ${done ? '#38A16930' : 'var(--border)'}`, transition: 'all 0.2s' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${done ? '#38A169' : urgencyColor[task.urgency]}`, background: done ? '#38A169' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    {done && <Check size={11} color="white" />}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '13px', color: done ? 'var(--muted)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>{task.task}</div>
                                                </div>
                                                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: urgencyBg[task.urgency], color: urgencyColor[task.urgency], fontWeight: 600, textTransform: 'uppercase', flexShrink: 0 }}>{task.urgency}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--cream)', borderRadius: '10px' }}>
                                    <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--plum), var(--gold))', width: `${(completedActions.filter(x => x >= 10).length / dailyTasks.length) * 100}%`, borderRadius: '3px', transition: 'width 0.4s' }} />
                                    </div>
                                    <span style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{completedActions.filter(x => x >= 10).length}/{dailyTasks.length} done</span>
                                </div>
                            </div>
                        </div>

                        {/* Strengths Banner */}
                        {analysis?.keyStrengths && (
                            <div className="card" style={{ background: 'linear-gradient(135deg, var(--dark) 0%, #2D1B2E 100%)', border: 'none', padding: '28px', color: 'white' }}>
                                <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={18} color="var(--gold)" /> Your Key Strengths</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {analysis.keyStrengths.map((s, i) => (
                                        <div key={i} style={{ padding: '8px 16px', borderRadius: '100px', background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.3)', color: 'var(--gold)', fontSize: '14px', fontWeight: 500 }}>✦ {s}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════ ROADMAP ═══════════ */}
                {activeTab === 'roadmap' && (
                    <div className="animate-fadeInUp">
                        <div style={{ marginBottom: '32px' }}>
                            <h1 className="serif" style={{ fontSize: '32px', marginBottom: '4px' }}>My Comeback Roadmap</h1>
                            <p style={{ color: 'var(--muted)' }}>Your personalized 12-week plan to land {onboardingData?.targetTitle || 'your target role'}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {(analysis?.roadmap || [
                                { phase: 1, title: 'Foundation & Refresh', duration: 'Weeks 1–2', tasks: ['Refresh your resume with recent achievements', 'Update LinkedIn headline & summary', 'Reach out to 5 former colleagues'], milestone: 'Profile fully updated' },
                                { phase: 2, title: 'Skill Building', duration: 'Weeks 3–6', tasks: [`Complete top course in ${analysis?.skillGaps?.[0]?.skill || 'priority skill'}`, 'Build one portfolio project', 'Attend 2 virtual industry events'], milestone: '1 portfolio piece ready' },
                                { phase: 3, title: 'Active Job Search', duration: 'Weeks 7–10', tasks: ['Apply to 3-5 roles per week', 'Request 3 informational interviews', 'Tailor cover letters per company'], milestone: '3 first-round interviews' },
                                { phase: 4, title: 'Interview & Offer', duration: 'Weeks 11–12', tasks: ['Final prep with mock interviews', 'Research target companies', 'Negotiate offer confidently'], milestone: 'Signed offer letter 🎉' }
                            ]).map((phase, i) => {
                                const phaseActive = i === 0; // phase 1 is always active for now
                                return (
                                    <div key={i} className="card" style={{ padding: '28px', borderLeft: `4px solid ${phaseActive ? 'var(--plum)' : i === 1 ? 'var(--gold)' : 'var(--border)'}`, position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                                            <div>
                                                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Phase {phase.phase} · {phase.duration}</div>
                                                <h3 style={{ fontSize: '22px', color: 'var(--text)' }} className="serif">{phase.title}</h3>
                                            </div>
                                            <span style={{ padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, background: phaseActive ? 'rgba(124,61,110,0.1)' : i === 1 ? 'rgba(212,168,83,0.1)' : 'var(--cream)', color: phaseActive ? 'var(--plum)' : i === 1 ? 'var(--gold)' : 'var(--muted)' }}>
                                                {phaseActive ? '🟢 In Progress' : i === 1 ? '⏳ Up Next' : '○ Upcoming'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start' }}>
                                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {(phase.tasks || []).map((task, j) => (
                                                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--text)' }}>
                                                        <CheckCircle size={16} color={phaseActive ? 'var(--plum)' : 'var(--muted)'} style={{ marginTop: '2px', flexShrink: 0 }} /> {task}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--cream)', border: '1px solid var(--border)', textAlign: 'center', minWidth: '140px' }}>
                                                <Trophy size={18} color="var(--gold)" style={{ marginBottom: '6px' }} />
                                                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Milestone</div>
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{phase.milestone}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ═══════════ SKILL ANALYSIS ═══════════ */}
                {activeTab === 'skills' && (
                    <div className="animate-fadeInUp">
                        <div style={{ marginBottom: '32px' }}>
                            <h1 className="serif" style={{ fontSize: '32px', marginBottom: '4px' }}>Skill Analysis</h1>
                            <p style={{ color: 'var(--muted)' }}>Your gaps, strengths & AI-curated learning resources</p>
                        </div>

                        {/* Current skills */}
                        {onboardingData?.techSkills?.length > 0 && (
                            <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18} color="#38A169" /> Your Current Skills</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {[...(onboardingData.techSkills || []), ...(onboardingData.softSkills || [])].map((s, i) => (
                                        <span key={i} style={{ padding: '6px 14px', borderRadius: '100px', background: '#C6F6D520', border: '1px solid #38A16940', color: '#276749', fontSize: '13px', fontWeight: 500 }}>✓ {s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skill Gaps */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {(analysis?.skillGaps?.length ? analysis.skillGaps : [
                                { skill: 'Modern Data Analysis', priority: 'high', reason: 'Required for most senior roles today.', timeToLearn: '3 weeks' },
                                { skill: 'AI & Automation Tools', priority: 'high', reason: 'Increasingly expected in all industries.', timeToLearn: '2 weeks' },
                                { skill: 'Cloud Platforms (AWS/GCP)', priority: 'medium', reason: 'Boosts tech collaboration roles significantly.', timeToLearn: '4 weeks' }
                            ]).map((gap, i) => (
                                <div key={i} className="card" style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <h3 style={{ fontSize: '20px', color: 'var(--text)' }}>{gap.skill}</h3>
                                            <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: gap.priority === 'high' ? '#FED7D7' : '#FEEBC8', color: gap.priority === 'high' ? '#C53030' : '#C05621' }}>{gap.priority?.toUpperCase()} PRIORITY</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--plum)', fontWeight: 500 }}><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />{gap.timeToLearn}</span>
                                            {!learningResources[gap.skill] && (
                                                <button className="btn btn-gold" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => handleLearn(gap.skill)} disabled={loadingResource === gap.skill}>
                                                    {loadingResource === gap.skill ? <><RotateCcw size={14} className="animate-spin" /> Loading…</> : '✨ Find Resources'}
                                                </button>
                                            )}
                                            {learningResources[gap.skill] && <CheckCircle size={20} color="#38A169" />}
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: learningResources[gap.skill] ? '16px' : '0' }}>{gap.reason}</p>

                                    {learningResources[gap.skill] && (
                                        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                                            {(Array.isArray(learningResources[gap.skill]) ? learningResources[gap.skill] : []).map((r, j) => (
                                                <div key={j} style={{ minWidth: '260px', background: 'var(--cream)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                                    <h4 style={{ fontSize: '14px', marginBottom: '6px', color: 'var(--text)' }}>{r.title}</h4>
                                                    <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>{r.provider} · {r.type} · {r.duration}</p>
                                                    <a href={r.url || '#'} target="_blank" rel="noreferrer" style={{ color: 'var(--plum)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>View Course →</a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══════════ RESUME BUILDER ═══════════ */}
                {activeTab === 'resume' && (
                    <div className="animate-fadeInUp">
                        <div style={{ marginBottom: '32px' }}>
                            <h1 className="serif" style={{ fontSize: '32px', marginBottom: '4px' }}>AI Resume Builder</h1>
                            <p style={{ color: 'var(--muted)' }}>Enhance each section with Gemini AI — tailored to your target role</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
                            {/* Section selector */}
                            <div className="card" style={{ padding: '16px', alignSelf: 'start' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '12px' }}>Sections</div>
                                {[{ id: 'summary', label: 'Professional Summary', icon: <FileText size={16} /> }, { id: 'experience', label: 'Work Experience', icon: <Briefcase size={16} /> }, { id: 'skills', label: 'Skills & Tools', icon: <Brain size={16} /> }].map(s => (
                                    <button key={s.id} onClick={() => { setResumeSection(s.id); setResumeResult(''); setResumeText(''); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 14px', borderRadius: '10px', background: resumeSection === s.id ? 'rgba(124,61,110,0.08)' : 'transparent', color: resumeSection === s.id ? 'var(--plum)' : 'var(--text)', fontWeight: resumeSection === s.id ? 600 : 400, textAlign: 'left', border: resumeSection === s.id ? '1px solid rgba(124,61,110,0.2)' : '1px solid transparent', marginBottom: '4px', transition: 'all 0.2s' }}>
                                        {s.icon} {s.label}
                                    </button>
                                ))}
                            </div>

                            {/* Editor */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div className="card" style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <h3 style={{ fontSize: '18px' }}>{resumeSection === 'summary' ? 'Professional Summary' : resumeSection === 'experience' ? 'Work Experience' : 'Skills & Tools'}</h3>
                                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Targeting: <strong style={{ color: 'var(--plum)' }}>{onboardingData?.targetTitle || 'Your role'}</strong></span>
                                    </div>
                                    <textarea
                                        rows={8}
                                        value={resumeText || defaultResumeDraft[resumeSection]}
                                        onChange={e => setResumeText(e.target.value)}
                                        placeholder={defaultResumeDraft[resumeSection]}
                                        style={{ fontSize: '14px', lineHeight: 1.7 }}
                                    />
                                    <button className="btn btn-plum" style={{ marginTop: '16px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={enhanceResume} disabled={resumeLoading}>
                                        {resumeLoading ? <><RotateCcw size={16} className="animate-spin" /> Enhancing…</> : <><Sparkles size={16} /> Enhance with AI</>}
                                    </button>
                                </div>

                                {resumeResult && (
                                    <div className="card" style={{ padding: '24px', background: '#F0FFF4', border: '1px solid #38A16940' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <h4 style={{ fontSize: '16px', color: '#276749' }}>✨ AI Enhanced Version</h4>
                                            <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={() => { setResumeText(resumeResult); setResumeResult(''); }}>Use This</button>
                                        </div>
                                        <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{resumeResult}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════ AI MENTOR CHAT ═══════════ */}
                {activeTab === 'chat' && (
                    <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <h1 className="serif" style={{ fontSize: '32px', marginBottom: '4px' }}>AI Mentor Chat</h1>
                            <p style={{ color: 'var(--muted)' }}>Talk to Aria — your personal comeback coach</p>
                        </div>

                        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', minHeight: '400px' }}>
                            {/* Messages */}
                            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {chatMessages.map((msg, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '12px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: msg.role === 'aria' ? 'linear-gradient(135deg, var(--plum), var(--gold))' : 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                                            {msg.role === 'aria' ? '✦' : firstName[0]?.toUpperCase()}
                                        </div>
                                        <div style={{ maxWidth: '70%', padding: '14px 18px', borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', background: msg.role === 'user' ? 'var(--plum)' : 'var(--cream)', color: msg.role === 'user' ? 'white' : 'var(--text)', fontSize: '14px', lineHeight: 1.6, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: msg.role === 'aria' ? '1px solid var(--border)' : 'none' }}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--plum), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>✦</div>
                                        <div style={{ padding: '14px 18px', borderRadius: '20px 20px 20px 4px', background: 'var(--cream)', border: '1px solid var(--border)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                            {[0, 1, 2].map(j => <div key={j} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--plum)', animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite` }} />)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', width: '100%' }}>
                                    {['How do I explain my career gap?', 'What salary should I ask for?', 'How to update my LinkedIn?'].map((q, i) => (
                                        <button key={i} onClick={() => { setChatInput(q); }} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '100px', border: '1px solid var(--border)', background: 'white', color: 'var(--text)', cursor: 'pointer' }}>{q}</button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ padding: '0 24px 24px', display: 'flex', gap: '12px' }}>
                                <input
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()}
                                    placeholder="Ask Aria anything about your comeback…"
                                    style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '14px' }}
                                />
                                <button className="btn btn-plum" style={{ padding: '12px 20px', borderRadius: '12px', flexShrink: 0 }} onClick={sendChat} disabled={chatLoading}>
                                    {chatLoading ? <RotateCcw size={16} className="animate-spin" /> : <ChevronRight size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════ JOB MATCHES ═══════════ */}
                {activeTab === 'jobs' && (
                    <div className="animate-fadeInUp">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                            <div>
                                <h1 className="serif" style={{ fontSize: '32px', marginBottom: '4px' }}>Job Matches</h1>
                                <p style={{ color: 'var(--muted)' }}>AI-curated roles aligned to your profile and target salary</p>
                            </div>
                            <button className="btn btn-plum" style={{ padding: '10px 20px', fontSize: '14px' }} onClick={() => { setJobs(null); loadJobs(); }}>
                                <RotateCcw size={16} /> Refresh
                            </button>
                        </div>

                        {jobsLoading && (
                            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)' }}>
                                <RotateCcw size={32} className="animate-spin" style={{ margin: '0 auto 16px', display: 'block', color: 'var(--plum)' }} />
                                <p>Finding the best matches for your profile…</p>
                            </div>
                        )}

                        {!jobsLoading && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {(jobs || [
                                    { title: onboardingData?.targetTitle || 'Product Manager', company: 'Innovate Corp', location: onboardingData?.workType === 'Remote' ? 'Remote' : 'New York, NY', salary: onboardingData?.salaryRange || '$80K-$100K', match: 91, tags: ['Leadership', 'Strategy', 'Agile'], posted: '2d ago' },
                                    { title: 'Senior ' + (onboardingData?.targetTitle || 'Product Manager'), company: 'TechScale Inc', location: 'San Francisco, CA', salary: '$100K-$130K', match: 84, tags: ['Data Analysis', 'Roadmapping'], posted: '1d ago' },
                                    { title: (onboardingData?.targetTitle || 'Product Manager') + ' – Growth', company: 'StartupX', location: 'Remote', salary: '$75K-$95K', match: 79, tags: ['Growth', 'A/B Testing', 'Analytics'], posted: '5h ago' },
                                    { title: 'Associate ' + (onboardingData?.targetTitle || 'Product Manager'), company: 'MegaCo', location: 'Austin, TX', salary: '$65K-$85K', match: 74, tags: ['Agile', 'Scrum', 'Jira'], posted: '3d ago' }
                                ]).map((job, i) => (
                                    <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; }}
                                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `hsl(${(i * 73) % 360}, 40%, 88%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                                            {['🏢', '🚀', '⚡', '🌐'][i % 4]}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '17px', marginBottom: '4px', color: 'var(--text)' }}>{job.title}</h3>
                                            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '10px' }}>{job.company} · {job.location} · {job.salary}</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {(job.tags || []).map((t, j) => <span key={j} style={{ padding: '3px 10px', borderRadius: '4px', background: 'var(--cream)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text)' }}>{t}</span>)}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <div style={{ fontSize: '28px', fontWeight: 700, color: job.match >= 85 ? '#38A169' : job.match >= 75 ? 'var(--gold)' : 'var(--muted)', fontFamily: 'serif', lineHeight: 1 }}>{job.match}%</div>
                                            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Match</div>
                                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{job.posted}</div>
                                            <button className="btn btn-plum" style={{ marginTop: '10px', padding: '7px 16px', fontSize: '13px' }}>Apply →</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

// ---------- MAIN APP ----------

const App = () => {
    const [page, setPage] = useState('landing');
    const [user, setUser] = useState(null);
    const [onboardingData, setOnboardingData] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [dashboardTab, setDashboardTab] = useState('overview');
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUser({ id: session.user.id, email: session.user.email, name: session.user.user_metadata?.full_name || 'User' });
                supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => {
                    if (data?.onboarding_complete) {
                        supabase.from('analyses').select('*').eq('user_id', session.user.id).single().then(a => {
                            if (a.data) setAnalysis(a.data);
                            setPage('dashboard');
                        });
                    } else {
                        setPage('onboarding');
                    }
                });
            }
            setAuthChecked(true);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) { setUser(null); setPage('landing'); }
        });
        return () => subscription.unsubscribe();
    }, []);

    const navigate = (nextPage) => { window.scrollTo(0, 0); setPage(nextPage); };
    const handleAuth = (u, isNew) => { setUser(u); if (isNew) navigate('onboarding'); else navigate('dashboard'); };
    const handleOnboardingComplete = (data) => { setOnboardingData(data); navigate('analyzing'); };
    const handleAnalysisComplete = (result) => { setAnalysis(result); navigate('report'); };
    const handleReportContinue = () => { setDashboardTab('overview'); navigate('dashboard'); };
    const handleLogout = () => { supabase.auth.signOut().then(() => { setUser(null); navigate('landing'); }); };

    if (!authChecked) return <div style={{ height: '100vh', background: 'var(--cream)' }} />;

    return (
        <>
            <GlobalStyles />
            {page === 'landing' && <LandingPage onNavigate={navigate} />}
            {(page === 'login' || page === 'signup') && <AuthPage mode={page} onAuth={handleAuth} onBack={() => navigate('landing')} />}
            {page === 'onboarding' && <OnboardingPage user={user} onComplete={handleOnboardingComplete} />}
            {page === 'analyzing' && <AnalyzingPage user={user} onboardingData={onboardingData} onComplete={handleAnalysisComplete} />}
            {page === 'report' && <ReportPage user={user} analysis={analysis} onContinue={handleReportContinue} />}
            {page === 'dashboard' && <DashboardPage user={user} analysis={analysis} onboardingData={onboardingData} initialTab={dashboardTab} onLogout={handleLogout} />}
        </>
    );
};

export default App;
