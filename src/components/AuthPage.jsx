import React, { useState } from 'react';
import { ChevronLeft, RotateCcw, CheckCircle } from 'lucide-react';

export const AuthPage = ({ mode: initialMode, onAuth, onBack }) => {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (mode === 'signup' && !formData.name) return setError('Name is required');
    if (!formData.email.includes('@')) return setError('Valid email is required');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');
    if (mode === 'signup' && formData.password !== formData.confirm) return setError('Passwords do not match');

    setLoading(true);
    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Authentication failed');

      if (mode === 'signup') {
        // Send welcome email (non-blocking)
        fetch('/api/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, name: formData.name })
        }).catch(err => console.warn("Welcome email failed:", err));
        
        onAuth(data, true); // true = needs onboarding
      } else {
        onAuth(data, !data.onboarding_complete);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Full Name</label>
                <input type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={loading} required />
              </div>
            )}
            
            <div>
              <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Email Address</label>
              <input type="email" placeholder="email@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={loading} required />
            </div>

            <div>
              <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Password</label>
              <input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} disabled={loading} required />
              {mode === 'login' && (
                <div style={{ textAlign: 'right', marginTop: '4px' }}>
                  <button type="button" style={{ fontSize: '12px', color: 'var(--plum)' }} onClick={() => alert('Please contact support')}>Forgot password?</button>
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Confirm Password</label>
                <input type="password" placeholder="••••••••" value={formData.confirm} onChange={e => setFormData({ ...formData, confirm: e.target.value })} disabled={loading} required />
              </div>
            )}

            {error && <p style={{ color: '#E53E3E', fontSize: '14px', background: '#FFF5F5', padding: '10px', borderRadius: '8px', border: '1px solid #FED7D7' }}>{error}</p>}
            {message && <p style={{ color: '#2F855A', fontSize: '14px', background: '#F0FFF4', padding: '10px', borderRadius: '8px', border: '1px solid #C6F6D5' }}>{message}</p>}
            
            <button type="submit" className="btn btn-plum" style={{ width: '100%', marginTop: '8px', height: '48px' }} disabled={loading}>
              {loading ? <RotateCcw size={20} className="animate-spin" /> : (mode === 'signup' ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: 'var(--muted)' }}>
            {mode === 'signup' ? 'Already have an account? ' : 'New to Re•Entry? '}
            <button style={{ color: 'var(--plum)', fontWeight: 600, textDecoration: 'underline' }} onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); setMessage(''); }}>
              {mode === 'signup' ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
