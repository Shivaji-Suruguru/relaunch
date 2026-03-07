import React, { useState, useEffect } from 'react';
import {
  RotateCcw, Brain, Briefcase, Clock, Target, Trophy,
  Heart, CheckCircle, ChevronRight, PlayCircle, BarChart,
  BookOpen, FileText, Settings, LogOut, ChevronLeft,
  Sparkles, Check, Search, Download, Star, MapPin, MessageSquare, BriefcaseBusiness,
  Users2, Flame, TrendingUp, Award, Zap, CalendarDays, Award as Users
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    :root {
      --plum: #7C3D6E;
      --plum-light: #A0517F;
      --gold: #D4A853;
      --gold-light: #E8C070;
      --dark: #1A1014;
      --dark-mid: #2D1F2A;
      --cream: #FDFAF8;
      --border: #EBD8E0;
      --text: #2D1F2A;
      --muted: #7A6572;
      --pale: #B09BA8;
      
      --font-display: 'Cormorant Garamond', serif;
      --font-body: 'Plus Jakarta Sans', sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-body); color: var(--text); background-color: var(--cream); overflow-x: hidden; }
    h1, h2, h3, h4, .serif { font-family: var(--font-display); }
    button { font-family: var(--font-body); cursor: pointer; border: none; background: none; transition: all 0.2s ease; }
    input, textarea, select { font-family: var(--font-body); width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 14px; background: white; transition: all 0.2s ease; font-size: 15px; }
    input:focus, textarea:focus, select:focus { outline: none; border-color: var(--plum); box-shadow: 0 0 0 3px rgba(124, 61, 110, 0.1); }
    
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 12px 24px; border-radius: 100px; font-weight: 600; font-size: 15px; gap: 8px; }
    .btn-plum { background: var(--plum); color: white; }
    .btn-plum:hover { background: var(--plum-light); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(124, 61, 110, 0.2); }
    .btn-gold { background: var(--gold); color: white; }
    .btn-gold:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(212, 168, 83, 0.2); }
    .btn-outline { border: 2px solid var(--border); color: var(--text); background: white; }
    .btn-outline:hover { border-color: var(--plum); color: var(--plum); }
    .btn-ghost-dark { color: white; border: 2px solid rgba(255,255,255,0.2); }
    .btn-ghost-dark:hover { background: rgba(255,255,255,0.1); }
    .btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }

    .card { background: white; border-radius: 20px; border: 1px solid var(--border); padding: 24px; transition: all 0.3s ease; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(45, 31, 42, 0.05); }
    .glass-card { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 24px; }

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes pulse-ring { 0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(124, 61, 110, 0.5); } 70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(124, 61, 110, 0); } 100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(124, 61, 110, 0); } }

    .animate-fadeInUp { animation: fadeInUp 0.8s ease forwards; opacity: 0; }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-scaleIn { animation: scaleIn 0.5s ease forwards; opacity: 0; }
    .animate-spin { animation: spin 1s linear infinite; }
    .d1 { animation-delay: 0.1s; } .d2 { animation-delay: 0.2s; } .d3 { animation-delay: 0.3s; } .d4 { animation-delay: 0.4s; }

    .text-gradient { background: linear-gradient(to right, #D4A853, #A0517F); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .chip { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 100px; font-size: 14px; font-weight: 500; cursor: pointer; border: 1px solid var(--border); background: white; transition: all 0.2s; }
    .chip.selected { background: var(--plum); color: white; border-color: var(--plum); }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--cream); }
    ::-webkit-scrollbar-thumb { background: var(--pale); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--muted); }

    .progress-bar-container { width: 100%; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, var(--plum), var(--gold)); transition: width 0.5s ease; }
    .nav-glass { background: rgba(253, 250, 248, 0.8) !important; backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
    @media (max-width: 768px) { .hide-mobile { display: none !important; } .mb-stack { flex-direction: column; } .desktop-nav { display: none; } }
    @media (min-width: 769px) { .hide-desktop { display: none !important; } }
  `}</style>
);

const LandingPage = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, transition: 'all 0.3s' }} className={scrolled ? "nav-glass" : ""}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RotateCcw style={{ color: scrolled ? "var(--plum)" : "var(--gold)" }} size={24} />
            <span style={{ fontSize: '24px', fontWeight: 600, color: scrolled ? "var(--text)" : "white" }} className="serif">Re•Entry</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', color: scrolled ? "var(--text)" : "white", fontWeight: 500 }} className="desktop-nav">
            <span style={{ cursor: 'pointer' }}>How It Works</span>
            <span style={{ cursor: 'pointer' }}>Features</span>
            <span style={{ cursor: 'pointer' }}>Stories</span>
            <span style={{ cursor: 'pointer' }}>Resources</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className={scrolled ? "btn btn-outline" : "btn btn-ghost-dark"} onClick={() => onNavigate('login')}>Log In</button>
            <button className="btn btn-gold" onClick={() => onNavigate('signup')}>Get Started Free</button>
          </div>
        </div>
      </nav>

      <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--dark) 0%, #3D1F35 100%)', padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'var(--plum)', filter: 'blur(100px)', opacity: 0.3, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', background: 'var(--gold)', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%' }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '64px', alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
          <div style={{ flex: '1 1 500px' }} className="animate-fadeInUp d1">
            <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', color: 'white', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '24px' }}>
              ✨ AI-Powered Career Comeback Platform
            </div>
            <h1 className="serif" style={{ fontSize: '68px', color: 'white', lineHeight: 1.1, marginBottom: '24px' }}>
              Your Career Break <br /> Is Not the End. <br />
              <span className="text-gradient">It's Your Reset.</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '40px' }}>
              Re•Entry transforms your pause into power. Our AI analyzes your skills, closes gaps, and connects you directly with companies hiring returning women professionals.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <button className="btn btn-gold" style={{ fontSize: '18px', padding: '16px 32px' }} onClick={() => onNavigate('signup')}>Start Your Comeback <ChevronRight size={20} /></button>
              <button className="btn btn-ghost-dark" style={{ fontSize: '18px', padding: '16px 32px' }} onClick={() => onNavigate('login')}>I have an account</button>
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
                  <div><h4 style={{ color: 'white', margin: 0 }}>Sarah M.</h4><span style={{ color: 'var(--gold)', fontSize: '14px' }}>Readiness: 92%</span></div>
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
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
              <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '14px' }}>92% Match Found ✨</span>
            </div>
            <div style={{ position: 'absolute', bottom: '40px', left: '-30px', background: 'var(--gold)', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
              <span style={{ color: 'var(--dark)', fontWeight: 600, fontSize: '14px' }}>Interview Scheduled!</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '32px 24px', background: 'var(--border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontWeight: 600, letterSpacing: '1px', fontSize: '14px', marginBottom: '16px' }}>HIRED BY TOP COMPANIES</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', opacity: 0.6 }}>
          <span className="serif" style={{ fontSize: '24px', fontWeight: 600 }}>Google</span>
          <span className="serif" style={{ fontSize: '24px', fontWeight: 600 }}>Microsoft</span>
          <span className="serif" style={{ fontSize: '24px', fontWeight: 600 }}>Salesforce</span>
          <span className="serif" style={{ fontSize: '24px', fontWeight: 600 }}>Amazon</span>
        </div>
      </section>

      <section style={{ padding: '120px 24px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="serif" style={{ fontSize: '48px', color: 'var(--text)' }}>How Re•Entry Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            {[
              { num: '01', title: 'Create Profile', desc: 'Tell us about your background and break.', icon: <BookOpen size={24} color="var(--plum)" /> },
              { num: '02', title: 'AI Analyzes', desc: 'Our engine finds your transferable skills.', icon: <Brain size={24} color="var(--plum)" /> },
              { num: '03', title: 'Get Comeback Plan', desc: 'A custom plan to bridge any gaps.', icon: <Target size={24} color="var(--plum)" /> },
              { num: '04', title: 'Land Your Role', desc: 'Match with exclusive partner opportunities.', icon: <Trophy size={24} color="var(--plum)" /> }
            ].map((step, i) => (
              <div key={i} className="card animate-fadeInUp" style={{ animationDelay: `${0.2 * i}s` }}>
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

      <section style={{ padding: '120px 24px', background: 'var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="serif" style={{ fontSize: '48px', color: 'var(--text)' }}>Platform Features</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              "AI Skill Gap Analysis", "Personalized Roadmap", "Smart Job Matching",
              "AI Resume Transformer", "Practice & Mock Tests", "AI Mentor Chat"
            ].map((f, i) => (
              <div key={i} style={{ background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-mid) 100%)', padding: '32px', borderRadius: '20px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                <CheckCircle size={24} color="var(--gold)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{f}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Leverage cutting edge AI tailored for professional reentry, designed specifically for women.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '120px 24px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="serif" style={{ fontSize: '48px', color: 'var(--text)' }}>Success Stories</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', color: 'var(--gold)' }}>
                  <Star size={16} fill="var(--gold)" /><Star size={16} fill="var(--gold)" /><Star size={16} fill="var(--gold)" /><Star size={16} fill="var(--gold)" /><Star size={16} fill="var(--gold)" />
                </div>
                <p style={{ fontStyle: 'italic', marginBottom: '24px', color: 'var(--text)' }}>"After a 4-year break for my children, Re•Entry helped me translate my household management skills into project management terms. I landed a senior role in 10 weeks."</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontWeight: 600 }}>Elena R.</h4>
                    <p style={{ fontSize: '14px', color: 'var(--muted)' }}>Project Manager • 4 Yr Break</p>
                  </div>
                  <div style={{ fontSize: '32px', color: 'var(--plum)', fontWeight: 600 }} className="serif">98%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, var(--plum) 0%, #4A2542 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="serif" style={{ fontSize: '48px', color: 'white', marginBottom: '24px' }}>Ready to rewrite your career story?</h2>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-gold" onClick={() => onNavigate('signup')} style={{ padding: '16px 32px', fontSize: '18px' }}>Get Started Free</button>
            <button className="btn btn-outline" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)', padding: '16px 32px', fontSize: '18px' }} onClick={() => onNavigate('login')}>Log In</button>
          </div>
        </div>
      </section>

      <footer style={{ background: 'var(--dark)', padding: '64px 24px', color: 'rgba(255,255,255,0.7)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
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
      </footer>
    </div >
  );
};


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
      setTimeout(() => onAuth({ name: `${provider} User`, email: 'user@example.com', id: 'mock-id' }, mode === 'signup'), 1500);
    } catch (err) {
      console.warn('OAuth Error:', err.message);
      setTimeout(() => onAuth({ name: `${provider} User`, email: 'user@example.com', id: 'mock-id' }, mode === 'signup'), 1500);
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


const OptionCard = ({ label, selected, onClick }) => (
  <div onClick={onClick} style={{ padding: '16px', borderRadius: '12px', border: `2px solid ${selected ? 'var(--plum)' : 'var(--border)'}`, background: selected ? 'rgba(124, 61, 110, 0.05)' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}>
    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: selected ? 'var(--plum)' : 'var(--border)', background: selected ? 'var(--plum)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {selected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }} />}
    </div>
    <span style={{ fontWeight: 500, color: selected ? 'var(--plum)' : 'var(--text)' }}>{label}</span>
  </div>
);

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
        } catch (e) {
          console.warn("Failed to save to Supabase", e);
        }
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
        } catch (e) { }
      }
      onComplete(data);
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
                <div><label>Previous Job Title*</label><input type="text" value={data.prevTitle} onChange={e => setData({ ...data, prevTitle: e.target.value })} />{errors.prevTitle && <span style={{ color: 'red' }}>{errors.prevTitle}</span>}</div>
                <div>
                  <label>Industry*</label>
                  <select value={data.prevIndustry} onChange={e => setData({ ...data, prevIndustry: e.target.value })}>
                    <option value="">Select Industry...</option><option value="Technology">Technology</option><option value="Finance">Finance</option><option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <label>Years of Experience*</label>
                  <select value={data.yearsExp} onChange={e => setData({ ...data, yearsExp: e.target.value })}>
                    <option value="">Select...</option><option value="1-3">1-3 years</option><option value="4-7">4-7 years</option><option value="8-12">8-12 years</option>
                  </select>
                </div>
                <div><label>Key Responsibilities & Achievements*</label><textarea rows={4} value={data.prevResponsibilities} onChange={e => setData({ ...data, prevResponsibilities: e.target.value })} /></div>
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
                  <select value={data.breakDuration} onChange={e => setData({ ...data, breakDuration: e.target.value })}>
                    <option value="">Select duration...</option><option value="< 1 year">Less than 1 year</option><option value="1-3 years">1-3 years</option><option value="3-5 years">3-5 years</option>
                  </select>
                </div>
                <div>
                  <label>Primary Reason*</label>
                  <select value={data.breakReason} onChange={e => setData({ ...data, breakReason: e.target.value })}>
                    <option value="">Select reason...</option><option value="Caregiving (Children)">Caregiving (Children)</option><option value="Personal Health">Personal Health</option><option value="Other">Other</option>
                  </select>
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
                <div><label>Target Job Title*</label><input type="text" value={data.targetTitle} onChange={e => setData({ ...data, targetTitle: e.target.value })} /></div>
                <div>
                  <label>Target Industry*</label>
                  <select value={data.targetIndustry} onChange={e => setData({ ...data, targetIndustry: e.target.value })}>
                    <option value="">Select Industry...</option><option value="Technology">Technology</option><option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label>Work Preference*</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="mb-stack">
                    <OptionCard label="Remote" selected={data.workType === 'Remote'} onClick={() => setData({ ...data, workType: 'Remote' })} />
                    <OptionCard label="Hybrid" selected={data.workType === 'Hybrid'} onClick={() => setData({ ...data, workType: 'Hybrid' })} />
                    <OptionCard label="On-site" selected={data.workType === 'On-site'} onClick={() => setData({ ...data, workType: 'On-site' })} />
                  </div>
                </div>
                <div>
                  <label>Open to Relocation?*</label>
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
                  <label>Technical Skills* {errors.techSkills && <span style={{ color: 'red' }}>{errors.techSkills}</span>}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {['Python', 'SQL', 'Excel', 'React', 'Project Management', 'Agile/Scrum', 'Salesforce', 'Figma'].map(s => (
                      <div key={s} className={`chip ${data.techSkills.includes(s) ? 'selected' : ''} `} onClick={() => toggleSkill('techSkills', s)}>{s}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <label>Soft Skills</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {['Leadership', 'Communication', 'Problem Solving', 'Adaptability'].map(s => (
                      <div key={s} className={`chip ${data.softSkills.includes(s) ? 'selected' : ''} `} onClick={() => toggleSkill('softSkills', s)}>{s}</div>
                    ))}
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
                  <label>Return Timeline*</label>
                  <select value={data.timeline} onChange={e => setData({ ...data, timeline: e.target.value })}>
                    <option value="">Select...</option><option value="1-3 months">1-3 months</option><option value="3-6 months">3-6 months</option>
                  </select>
                </div>
                <div>
                  <label>Salary Range*</label>
                  <select value={data.salaryRange} onChange={e => setData({ ...data, salaryRange: e.target.value })}>
                    <option value="">Select...</option><option value="$60K-$80K">$60K-$80K</option><option value="$80K-$100K">$80K-$100K</option>
                  </select>
                </div>
                <div>
                  <label>Weekly Study Hours: {data.studyHours}</label>
                  <input type="range" min="2" max="20" value={data.studyHours} onChange={e => setData({ ...data, studyHours: e.target.value })} style={{ padding: 0, height: '4px', background: 'var(--border)' }} />
                </div>
                <div><label>Biggest Challenge Right Now*</label><textarea rows={3} value={data.biggestChallenge} onChange={e => setData({ ...data, biggestChallenge: e.target.value })} /></div>
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
        console.log('🚀 Sending to /api/analyze:', payload);
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        const result = await response.json();
        console.log('✅ Gemini result:', result);

        if (user?.id) {
          try {
            await supabase.from('analyses').upsert({ user_id: user.id, ...result });
          } catch (dbErr) {
            console.warn('Supabase save failed (non-critical):', dbErr.message);
          }
        }

        setTimeout(() => onComplete(result), 1000);
      } catch (err) {
        console.error("Analysis via API failed, using fallback:", err);
        const fallbackData = {
          readinessScore: 75,
          headline: "Ready for Re-Entry",
          summary: "Your past experience provides a solid foundation for your return to the workforce.",
          keyStrengths: ["Adaptability", "Prior Industry Knowledge", "Transferable Skills"],
          skillGaps: [{ skill: "Modern Technical Stack", priority: "high", reason: "Technologies have evolved since your break.", timeToLearn: "2-4 weeks" }],
          topRoles: [{ title: "Targeted Professional", industry: "Various", salaryRange: "$60K-$80K", matchScore: 80 }],
          confidenceBoost: "Your break is an asset, not a gap. You have the resilience to succeed!"
        };
        setTimeout(() => onComplete(fallbackData), 1000);
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


const ReportPage = ({ user, analysis, onContinue }) => {
  if (!analysis) return null;
  const score = analysis.readinessScore;
  const color = score >= 75 ? '#38A169' : score >= 50 ? 'var(--gold)' : '#E53E3E';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: '64px 24px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#38A169', fontWeight: 600, fontSize: '14px', background: 'rgba(56, 161, 105, 0.1)', padding: '8px 16px', borderRadius: '100px', alignSelf: 'flex-start' }}>
          <CheckCircle size={16} /> Analysis Complete
        </div>

        <h1 className="serif animate-fadeInUp" style={{ fontSize: '48px', color: 'var(--text)', lineHeight: 1.1 }}>
          Your Comeback Report is Ready, {user?.name?.split(' ')[0] || 'there'}!
        </h1>

        <div className="card animate-fadeInUp d1" style={{ background: 'var(--dark)', color: 'white', padding: '48px' }}>
          <div style={{ display: 'flex', gap: '48px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: `8px solid ${color} `, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <span className="serif" style={{ fontSize: '48px', fontWeight: 700, color: 'white' }}>{score}</span>
              </div>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>Readiness Score</span>
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h2 className="serif" style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--gold)' }}>{analysis.headline}</h2>
              <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>{analysis.summary}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          <div className="card animate-fadeInUp d2">
            <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={20} color="var(--plum)" /> Key Strengths</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analysis.keyStrengths.map((str, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px' }}>
                  <CheckCircle size={18} color="#38A169" style={{ marginTop: '2px' }} /> <span style={{ color: 'var(--text)' }}>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card animate-fadeInUp d3">
            <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={20} color="var(--gold)" /> Priority Skill Gaps</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analysis.skillGaps.map((gap, i) => (
                <li key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '16px', color: 'var(--text)' }}>{gap.skill}</h4>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, background: gap.priority === 'high' ? '#FED7D7' : '#FEEBC8', color: gap.priority === 'high' ? '#C53030' : '#C05621' }}>{gap.priority.toUpperCase()} Priority</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--muted)' }}>{gap.reason}</p>
                  <div style={{ fontSize: '12px', color: 'var(--plum)', fontWeight: 500 }}><Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />{gap.timeToLearn}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card animate-fadeInUp d4">
          <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Top Role Matches</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analysis.topRoles.map((role, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', border: '1px solid var(--border)', borderRadius: '16px', transition: 'all 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--plum)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={{ width: '48px', height: '48px', border: '3px solid var(--plum)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--plum)', fontWeight: 700 }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '4px', color: 'var(--text)' }}>{role.title}</h4>
                  <p style={{ fontSize: '14px', color: 'var(--muted)' }}>{role.industry} • {role.salaryRange}</p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className="serif" style={{ fontSize: '28px', color: 'var(--gold)', fontWeight: 600 }}>{role.matchScore}%</span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Match</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card animate-fadeInUp d5" style={{ background: 'linear-gradient(135deg, var(--plum) 0%, #4A2542 100%)', color: 'white', border: 'none', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Heart size={24} color="var(--gold)" /></div>
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>A note from Aria</h3>
              <p style={{ fontStyle: 'italic', fontSize: '16px', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>"{analysis.confidenceBoost}"</p>
            </div>
          </div>
        </div>

        <div className="animate-fadeInUp d6" style={{ marginTop: '24px', textAlign: 'center' }}>
          <button className="btn btn-gold" style={{ padding: '20px 48px', fontSize: '18px', width: '100%', maxWidth: '400px' }} onClick={onContinue}>
            Continue to My Dashboard <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div >
  );
};


const DashboardPage = ({ user, analysis, onboardingData, initialTab, onLogout }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'overview');
  // Roadmap state — must be at top level (Rules of Hooks)
  const [rmExpandedNode, setRmExpandedNode] = useState(null);
  const [rmCheckedNodes, setRmCheckedNodes] = useState([]);
  const [rmActiveSection, setRmActiveSection] = useState('s0');

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

  useEffect(() => {
    if (activeTab === 'jobs') loadJobs();
  }, [activeTab]);

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
        {activeTab === 'roadmap' && (() => {
          // Build roadmap based on user's target role from analysis/onboarding
          const targetRole = onboardingData?.targetTitle || 'Professional';
          const skillGap0 = analysis?.skillGaps?.[0]?.skill || 'Data Analysis';
          const skillGap1 = analysis?.skillGaps?.[1]?.skill || 'Cloud Tools';

          const roadmapSections = [
            {
              id: 's0', phase: 'Phase 1', label: 'Foundation & Re-Entry Basics', color: '#F6D860', weeks: 'Weeks 1–2', status: 'active', icon: '🌱',
              description: 'Rebuild your professional presence and mindset',
              nodes: [
                { id: 'n0', label: 'Career Gap Narrative', sub: ['Tell your story confidently', 'Frame break as growth', 'Prepare 60-sec elevator pitch'], optional: false },
                { id: 'n1', label: 'Resume / Profile Refresh', sub: ['Update with recent experience', 'ATS-optimize keywords', 'Add break-period projects'], optional: false },
                { id: 'n2', label: 'LinkedIn Optimization', sub: ['Headline & summary rewrite', 'Skills section update', 'Request 2 recommendations'], optional: false },
                { id: 'n3', label: 'Mindset & Confidence', sub: ['Imposter syndrome tactics', 'Daily journaling', 'Find an accountability buddy'], optional: true },
              ]
            },
            {
              id: 's1', phase: 'Phase 2', label: 'Skill Assessment & Upskilling', color: '#6C63FF', weeks: 'Weeks 3–6', status: 'next', icon: '📚',
              description: 'Close your skill gaps with targeted learning',
              nodes: [
                { id: 'n4', label: skillGap0, sub: ['Take a structured course', 'Complete 2 practical exercises', 'Get a micro-certification'], optional: false },
                { id: 'n5', label: skillGap1, sub: ['Watch intro tutorials', 'Practice with free tools', 'Build a mini project'], optional: false },
                { id: 'n6', label: 'Industry Trends', sub: [`Read 3 articles/week on ${targetRole} trends`, 'Follow 10 industry leaders', 'Join 1 relevant Slack community'], optional: false },
                { id: 'n7', label: 'Portfolio Project', sub: ['Pick a real-world problem', 'Document your process', 'Publish on GitHub / Notion'], optional: false },
              ]
            },
            {
              id: 's2', phase: 'Phase 3', label: 'Mastering Tools & Craft', color: '#48BB78', weeks: 'Weeks 5–8', status: 'upcoming', icon: '⚙️',
              description: 'Deepen hands-on expertise in core tools',
              nodes: [
                { id: 'n8', label: 'Core Tool Mastery', sub: ['Excel / Google Sheets', 'SQL basics', 'Python or R for analysis'], optional: false },
                { id: 'n9', label: 'Data Visualization', sub: ['Tableau or Power BI', 'Matplotlib / Seaborn', 'Charting best practices'], optional: false },
                { id: 'n10', label: 'Statistical Concepts', sub: ['Descriptive statistics', 'Hypothesis testing', 'Regression basics'], optional: true },
                { id: 'n11', label: 'Automation & Productivity', sub: ['Automate repetitive tasks', 'Learn Notion/Asana/Jira', 'Time-boxing techniques'], optional: true },
              ]
            },
            {
              id: 's3', phase: 'Phase 4', label: 'Active Job Search', color: '#F6AD55', weeks: 'Weeks 7–10', status: 'upcoming', icon: '🎯',
              description: 'Strategic outreach and application engine',
              nodes: [
                { id: 'n12', label: 'Target Company List', sub: ['Build list of 30+ companies', 'Research culture & missions', 'Find warm contacts inside'], optional: false },
                { id: 'n13', label: 'Application System', sub: ['Apply to 3–5 roles/week', 'Tailor each cover letter', 'Track in a spreadsheet'], optional: false },
                { id: 'n14', label: 'Networking Outreach', sub: ['3 coffee chats/week', 'Attend 2 industry events', 'LinkedIn voice notes'], optional: false },
                { id: 'n15', label: 'Recruiter Strategy', sub: ['Connect with 5 recruiters', 'Share portfolio link', 'Follow up after 1 week'], optional: true },
              ]
            },
            {
              id: 's4', phase: 'Phase 5', label: 'Interview & Negotiation', color: '#FC8181', weeks: 'Weeks 9–12', status: 'upcoming', icon: '🏆',
              description: 'Land and negotiate your best offer',
              nodes: [
                { id: 'n16', label: 'Technical Interview Prep', sub: ['Role-specific mock questions', 'Case study walkthroughs', 'STAR method practice'], optional: false },
                { id: 'n17', label: 'Behavioral Questions', sub: ['Career gap explanation', 'Strength & weakness answers', 'Culture-fit stories'], optional: false },
                { id: 'n18', label: 'Salary Negotiation', sub: [`Know your market rate (${onboardingData?.salaryRange || '$80K+'})`, 'Counter-offer script', 'Benefits negotiation'], optional: false },
                { id: 'n19', label: 'Offer & Onboarding', sub: ['Evaluate total compensation', '30/60/90 day plan', 'First week success habits'], optional: false },
              ]
            },
          ];

          // Use top-level state (renamed with rm prefix to avoid collision)
          const expandedNode = rmExpandedNode;
          const setExpandedNode = setRmExpandedNode;
          const checkedNodes = rmCheckedNodes;
          const activeSection = rmActiveSection;
          const setActiveSection = setRmActiveSection;

          const totalNodes = roadmapSections.reduce((a, s) => a + s.nodes.length, 0);
          const completedCount = checkedNodes.length;
          const progressPct = Math.round((completedCount / totalNodes) * 100);

          const toggleCheck = (nodeId) => setRmCheckedNodes(prev => prev.includes(nodeId) ? prev.filter(n => n !== nodeId) : [...prev, nodeId]);

          const statusLabel = { active: '🟢 In Progress', next: '⏳ Up Next', upcoming: '○ Upcoming' };
          const statusBg = { active: 'rgba(56,161,105,0.1)', next: 'rgba(212,168,83,0.1)', upcoming: 'var(--cream)' };
          const statusColor = { active: '#276749', next: '#744210', upcoming: 'var(--muted)' };



          return (
            <div className="animate-fadeInUp">
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 className="serif" style={{ fontSize: '32px', marginBottom: '4px' }}>Interactive Career Roadmap</h1>
                  <p style={{ color: 'var(--muted)' }}>Step-by-step guide to landing <strong style={{ color: 'var(--plum)' }}>{targetRole}</strong> — click any topic to expand</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="card" style={{ padding: '12px 20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '120px', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, var(--plum), var(--gold))', borderRadius: '4px', transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--plum)', whiteSpace: 'nowrap' }}>{progressPct}% done · {completedCount}/{totalNodes}</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                {[{ color: '#F6D860', label: 'Required step' }, { color: '#6C63FF', label: 'Task complete', check: true }, { color: 'var(--border)', label: 'Optional', dashed: true }].map((l, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--muted)' }}>
                    <div style={{ width: '28px', height: '14px', borderRadius: '4px', background: l.check ? '#38A169' : 'transparent', border: `2px ${l.dashed ? 'dashed' : 'solid'} ${l.color}` }} />
                    {l.label}
                  </div>
                ))}
              </div>

              {/* Two-column layout: mini nav + main content */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Phase nav */}
                <div style={{ position: 'sticky', top: '24px' }}>
                  <div className="card" style={{ padding: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', padding: '8px 12px 4px' }}>Jump to Phase</div>
                    {roadmapSections.map(s => (
                      <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', background: activeSection === s.id ? s.color + '20' : 'transparent', border: activeSection === s.id ? `1px solid ${s.color}60` : '1px solid transparent', textAlign: 'left', marginBottom: '4px', transition: 'all 0.2s', cursor: 'pointer' }}>
                        <span style={{ fontSize: '18px' }}>{s.icon}</span>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>{s.phase}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text)', fontWeight: activeSection === s.id ? 600 : 400, lineHeight: 1.3 }}>{s.label.split(' ').slice(0, 3).join(' ')}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main roadmap — vertical spine layout */}
                <div style={{ position: 'relative' }}>
                  {/* Vertical spine line */}
                  <div style={{ position: 'absolute', left: '19px', top: '40px', bottom: '40px', width: '2px', background: 'linear-gradient(to bottom, var(--plum), var(--gold), #38A169, #F6AD55, #FC8181)', opacity: 0.3, borderRadius: '2px' }} />

                  {roadmapSections.map((section, si) => (
                    <div key={section.id} id={section.id} style={{ marginBottom: '40px', position: 'relative' }}>
                      {/* Section header bubble */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: section.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, zIndex: 1, boxShadow: `0 0 0 4px ${section.color}30`, position: 'relative' }}>
                          {section.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{section.phase} · {section.weeks}</span>
                            <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, background: statusBg[section.status], color: statusColor[section.status] }}>{statusLabel[section.status]}</span>
                          </div>
                          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: '2px 0 2px' }} className="serif">{section.label}</h2>
                          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>{section.description}</p>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {section.nodes.filter(n => checkedNodes.includes(n.id)).length}/{section.nodes.length} done
                        </div>
                      </div>

                      {/* Nodes grid */}
                      <div style={{ marginLeft: '56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {section.nodes.map((node) => {
                          const isChecked = checkedNodes.includes(node.id);
                          const isExpanded = expandedNode === node.id;
                          return (
                            <div key={node.id} style={{ border: `2px ${node.optional ? 'dashed' : 'solid'} ${isChecked ? '#38A169' : section.color + '80'}`, borderRadius: '14px', background: isChecked ? '#F0FFF4' : 'white', overflow: 'hidden', transition: 'all 0.25s', boxShadow: isExpanded ? '0 4px 20px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}>
                              {/* Node header */}
                              <div onClick={() => setExpandedNode(isExpanded ? null : node.id)} style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                                  <div onClick={(e) => { e.stopPropagation(); toggleCheck(node.id); }} style={{ width: '22px', height: '22px', borderRadius: '6px', border: `2px solid ${isChecked ? '#38A169' : section.color}`, background: isChecked ? '#38A169' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                                    {isChecked && <Check size={12} color="white" />}
                                  </div>
                                  <div>
                                    <span style={{ fontSize: '14px', fontWeight: 600, color: isChecked ? '#276749' : 'var(--text)', textDecoration: isChecked ? 'line-through' : 'none', display: 'block', lineHeight: 1.3 }}>{node.label}</span>
                                    {node.optional && <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 500 }}>Optional</span>}
                                  </div>
                                </div>
                                <ChevronRight size={16} color="var(--muted)" style={{ flexShrink: 0, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                              </div>

                              {/* Expanded subtopics */}
                              {isExpanded && (
                                <div style={{ padding: '0 16px 14px', borderTop: `1px solid ${section.color}30` }}>
                                  <div style={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {node.sub.map((s, si2) => (
                                      <div key={si2} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text)' }}>
                                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: section.color, marginTop: '6px', flexShrink: 0 }} />
                                        {s}
                                      </div>
                                    ))}
                                  </div>
                                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
                                    <button onClick={() => toggleCheck(node.id)} style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: isChecked ? '#FED7D7' : '#C6F6D5', color: isChecked ? '#C53030' : '#276749', border: 'none', cursor: 'pointer' }}>
                                      {isChecked ? '↩ Mark Incomplete' : '✓ Mark Complete'}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Connector to next section */}
                      {si < roadmapSections.length - 1 && (
                        <div style={{ marginLeft: '19px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '2px', height: '20px', background: `linear-gradient(to bottom, ${section.color}60, ${roadmapSections[si + 1].color}60)` }} />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Done banner */}
                  {completedCount === totalNodes && (
                    <div className="card" style={{ background: 'linear-gradient(135deg, var(--plum), #2D1B2E)', color: 'white', padding: '28px', textAlign: 'center', border: 'none' }}>
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
                      <h3 style={{ fontSize: '24px', color: 'white', marginBottom: '8px' }} className="serif">You've completed your roadmap!</h3>
                      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>Incredible work, {firstName}. You're ready to land {targetRole}.</p>
                      <div style={{ fontWeight: 600, color: 'var(--gold)' }}>✦ Now go get that offer ✦</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}



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
