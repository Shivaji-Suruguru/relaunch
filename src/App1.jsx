import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    RotateCcw, Brain, Briefcase, Clock, Target, Trophy,
    Heart, CheckCircle, ChevronRight, PlayCircle, BarChart,
    BookOpen, FileText, Settings, LogOut, ChevronLeft,
    Sparkles, Check, Search, Download, Star, MapPin, MessageSquare, BriefcaseBusiness
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
             {[1,2,3].map((_, i) => (
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
