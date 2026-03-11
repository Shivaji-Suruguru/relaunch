import React from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';

export const ReportPage = ({ user, analysis, onContinue }) => {
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

        <div className="animate-fadeInUp d6" style={{ marginTop: '24px', textAlign: 'center' }}>
          <button className="btn btn-gold" style={{ padding: '20px 48px', fontSize: '18px', width: '100%', maxWidth: '400px' }} onClick={onContinue}>
            Continue to My Dashboard <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div >
  );
};
