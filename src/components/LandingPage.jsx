import React, { useState, useEffect } from 'react';
import { RotateCcw, ChevronRight, BookOpen, Brain, Target, Trophy, CheckCircle, Star } from 'lucide-react';

export const LandingPage = ({ onNavigate }) => {
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
