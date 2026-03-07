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
                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: \`8px solid \${color}\`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
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

// ... more Dashboard ...
