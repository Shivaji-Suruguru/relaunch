// ---------- PAGE: LANDING ----------
const LandingPage = ({ onNavigate }) => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            {/* Navbar */}
            <nav style={{
                position: 'fixed', top: 0, width: '100%', zIndex: 50, transition: 'all 0.3s'
            }} className={scrolled ? "nav-glass" : ""}>
                <div style={{
                    maxWidth: '1200px', margin: '0 auto', padding: '16px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RotateCcw style={{ color: scrolled ? "var(--plum)" : "var(--gold)" }} size={24} />
                        <span style={{ fontSize: '24px', fontWeight: 600, color: scrolled ? "var(--text)" : "white" }} className="serif">Re•Entry</span>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', color: scrolled ? "var(--text)" : "white", fontWeight: 500 }} className="desktop-nav">
                        <span style={{ cursor: 'pointer' }}>How It Works</span>
                        <span style={{ cursor: 'pointer' }}>Features</span>
                        <span style={{ cursor: 'pointer' }}>Stories</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className={scrolled ? "btn btn-outline" : "btn btn-ghost-dark"} onClick={() => onNavigate('login')}>Log In</button>
                        <button className="btn btn-gold" onClick={() => onNavigate('signup')}>Get Started Free</button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section style={{
                minHeight: '100vh', background: 'linear-gradient(135deg, var(--dark) 0%, #3D1F35 100%)',
                padding: '120px 24px', position: 'relative', overflow: 'hidden'
            }}>
                {/* Orbs */}
                <div style={{
                    position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px',
                    background: 'var(--plum)', filter: 'blur(100px)', opacity: 0.3, borderRadius: '50%'
                }}></div>
                <div style={{
                    position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px',
                    background: 'var(--gold)', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%'
                }}></div>

                <div style={{
                    maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '64px', alignItems: 'center',
                    flexWrap: 'wrap', position: 'relative', zIndex: 10
                }}>
                    <div style={{ flex: '1 1 500px' }} className="animate-fadeInUp d1">
                        <div style={{
                            display: 'inline-block', padding: '8px 16px', background: 'rgba(255,255,255,0.1)',
                            borderRadius: '100px', color: 'white', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '24px'
                        }}>
                            ✨ AI-Powered Career Comeback Platform
                        </div>
                        <h1 className="serif" style={{ fontSize: '64px', color: 'white', lineHeight: 1.1, marginBottom: '24px' }}>
                            Your Career Break <br /> Is Not the End. <br />
                            <span className="text-gradient">It's Your Reset.</span>
                        </h1>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '40px' }}>
                            Re•Entry transforms your pause into power. Our AI analyzes your skills, closes gaps, and connects you directly with companies hiring returning women professionals.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
                            <button className="btn btn-gold" style={{ fontSize: '18px', padding: '16px 32px' }} onClick={() => onNavigate('signup')}>
                                Start Your Comeback <ChevronRight size={20} />
                            </button>
                            <button className="btn btn-ghost-dark" style={{ fontSize: '18px', padding: '16px 32px' }} onClick={() => onNavigate('login')}>
                                I have an account
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '32px', color: 'white' }}>
                            <div><h4 className="serif" style={{ fontSize: '28px' }}>12,000+</h4><span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Women Helped</span></div>
                            <div><h4 className="serif" style={{ fontSize: '28px' }}>89%</h4><span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Placement Rate</span></div>
                            <div><h4 className="serif" style={{ fontSize: '28px' }}>2.4x</h4><span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Salary Growth</span></div>
                        </div>
                    </div>

                    <div style={{ flex: '1 1 400px', position: 'relative' }} className="animate-fadeInUp d2 animate-float">
                        <div className="glass-card" style={{ width: '100%', height: '400px', padding: '0' }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--plum)' }} />
                                    <div>
                                        <h4 style={{ color: 'white', margin: 0 }}>Sarah M.</h4>
                                        <span style={{ color: 'var(--gold)', fontSize: '14px' }}>Readiness: 92%</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                    <div style={{ width: '92%', height: '100%', background: 'var(--plum)', borderRadius: '4px' }}></div>
                                </div>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <CheckCircle size={16} color="var(--gold)" />
                                        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Interview Prep Complete</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Floating badges */}
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                            <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '14px' }}>92% Match Found ✨</span>
                        </div>
                        <div style={{ position: 'absolute', bottom: '40px', left: '-30px', background: 'var(--gold)', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                            <span style={{ color: 'var(--dark)', fontWeight: 600, fontSize: '14px' }}>Interview Scheduled!</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By */}
            <section style={{ padding: '32px 24px', background: 'var(--border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--muted)', fontWeight: 600, letterSpacing: '1px', fontSize: '14px', marginBottom: '16px' }}>HIRED BY TOP COMPANIES</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', opacity: 0.6 }}>
                    <span className="serif" style={{ fontSize: '24px', fontWeight: 600 }}>Google</span>
                    <span className="serif" style={{ fontSize: '24px', fontWeight: 600 }}>Microsoft</span>
                    <span className="serif" style={{ fontSize: '24px', fontWeight: 600 }}>Salesforce</span>
                    <span className="serif" style={{ fontSize: '24px', fontWeight: 600 }}>Amazon</span>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '120px 24px', background: 'var(--cream)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <h2 className="serif" style={{ fontSize: '48px', color: 'var(--text)' }}>How Re•Entry Works</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
                        {[
                            { num: '01', title: 'Create Profile', desc: 'Tell us about your background and break.', icon: <BookOpen size={24} color="var(--plum)" /> },
                            { num: '02', title: 'AI Analyzes', desc: 'Our engine finds your transferable skills.', icon: <Brain size={24} color="var(--plum)" /> },
                            { num: '03', title: 'Get Roadmap', desc: 'A custom plan to bridge any gaps.', icon: <Target size={24} color="var(--plum)" /> },
                            { num: '04', title: 'Land Role', desc: 'Match with exclusive partner opportunities.', icon: <Trophy size={24} color="var(--plum)" /> },
                        ].map((step, i) => (
                            <div key={i} className="card animate-fadeInUp" style={{ animationDelay: \`\${0.2 * i}s\` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{step.icon}</div>
                            <span className="serif" style={{ fontSize: '32px', color: 'var(--muted)', opacity: 0.5 }}>{step.num}</span>
                        </div>
                        <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text)' }}>{step.title}</h3>
                        <p style={{ color: 'var(--muted)', lineHeight: 1.5 }}>{step.desc}</p>
                    </div>
            ))}
                </div>
        </div>
      </section >

    {/* CTA Section */ }
    < section style = {{ padding: '100px 24px', background: 'linear-gradient(135deg, var(--plum) 0%, #4A2542 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="serif" style={{ fontSize: '48px', color: 'white', marginBottom: '24px' }}>Ready to rewrite your career story?</h2>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-gold" onClick={() => onNavigate('signup')} style={{ padding: '16px 32px', fontSize: '18px' }}>Start Free Trial</button>
                <button className="btn btn-outline" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)', padding: '16px 32px', fontSize: '18px' }} onClick={() => onNavigate('login')}>Log In</button>
            </div>
        </div>
      </section >

    {/* Footer */ }
    < footer style = {{ background: 'var(--dark)', padding: '64px 24px', color: 'rgba(255,255,255,0.7)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px' }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '16px' }}>
                    <RotateCcw size={20} /><span className="serif" style={{ fontSize: '20px', fontWeight: 600 }}>Re•Entry</span>
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.6 }}>Your career break is not the end. It's your reset.</p>
            </div>
            <div><h4 style={{ color: 'white', marginBottom: '16px' }}>Platform</h4><p>Features</p><p>Pricing</p><p>Stories</p></div>
            <div><h4 style={{ color: 'white', marginBottom: '16px' }}>Resources</h4><p>Blog</p><p>Guides</p><p>Webinars</p></div>
            <div><h4 style={{ color: 'white', marginBottom: '16px' }}>Company</h4><p>About</p><p>Contact</p><p>Privacy</p></div>
        </div>
      </footer >
    </div >
  );
};

// ---------- PAGE: AUTH ----------
const AuthPage = ({ mode: initialMode, onAuth, onBack }) => {
    const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (mode === 'signup' && !formData.name) return setError('Name is required');
        if (!formData.email.includes('@')) return setError('Valid email is required');
        if (formData.password.length < 6) return setError('Password min 6 chars');
        if (mode === 'signup' && formData.password !== formData.confirm) return setError('Passwords do not match');

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onAuth({ name: formData.name || 'User', email: formData.email }, mode === 'signup');
        }, 1200);
    };

    const handleSocial = () => {
        setLoading(true);
        setTimeout(() => {
            onAuth({ name: 'Google User', email: 'user@gmail.com' }, mode === 'signup');
        }, 1500);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)' }}>
            {/* Left Panel */}
            <div style={{
                flex: '0 0 45%', background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-mid) 100%)',
                padding: '48px', display: 'flex', flexDirection: 'column', color: 'white'
            }} className="hide-mobile">
                <button className="btn" style={{ color: 'rgba(255,255,255,0.7)', padding: 0, justifyContent: 'flex-start' }} onClick={onBack}>
                    <ChevronLeft size={20} /> Back to home
                </button>
                <div style={{ margin: 'auto 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--plum)', marginBottom: '24px' }}>
                        <RotateCcw size={32} /><span className="serif" style={{ fontSize: '32px', fontWeight: 600, color: 'white' }}>Re•Entry</span>
                    </div>
                    <h2 className="serif" style={{ fontSize: '48px', lineHeight: 1.2, marginBottom: '48px' }}>Welcome to your <br /><span style={{ color: 'var(--gold)' }}>comeback journey.</span></h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {[{ i: <CheckCircle size={20} />, t: 'Private & Secure' }, { i: <CheckCircle size={20} />, t: 'AI ready in 3 min' }, { i: <CheckCircle size={20} />, t: 'Built for women' }].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}>
                                <div style={{ color: 'var(--gold)' }}>{item.i}</div> {item.t}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div style={{ flex: 1, padding: '48px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '400px' }} className="animate-fadeInUp">
                    <button className="btn hide-desktop" style={{ color: 'var(--muted)', padding: 0, justifyContent: 'flex-start', marginBottom: '24px' }} onClick={onBack}>
                        <ChevronLeft size={20} /> Back
                    </button>
                    <h2 className="serif" style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--text)' }}>
                        {mode === 'signup' ? 'Create your account' : 'Welcome back'}
                    </h2>
                    <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>
                        {mode === 'signup' ? 'Start your personalized comeback today.' : 'Enter your details to access your dashboard.'}
                    </p>

                    <button className="btn btn-outline" style={{ width: '100%', marginBottom: '16px', borderRadius: '12px' }} onClick={handleSocial}>
                        <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" style={{ width: 20 }} />
                        Continue with Google
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0', color: 'var(--muted)', fontSize: '14px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                        or with email
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {mode === 'signup' && (
                            <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={loading} />
                        )}
                        <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={loading} />
                        <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} disabled={loading} />
                        {mode === 'signup' && (
                            <input type="password" placeholder="Confirm Password" value={formData.confirm} onChange={e => setFormData({ ...formData, confirm: e.target.value })} disabled={loading} />
                        )}

                        {error && <p style={{ color: '#E53E3E', fontSize: '14px' }}>{error}</p>}

                        <button type="submit" className="btn btn-plum" style={{ width: '100%', marginTop: '8px', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                            {loading ? <span className="animate-spin"><RotateCcw size={20} /></span> : (mode === 'signup' ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: 'var(--muted)' }}>
                        {mode === 'signup' ? 'Already have an account? ' : 'New to Re•Entry? '}
                        <button style={{ color: 'var(--plum)', fontWeight: 600, textDecoration: 'underline' }} onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
                            {mode === 'signup' ? 'Sign in' : 'Create account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
