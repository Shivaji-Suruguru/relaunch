import React, { useState } from 'react';
import { Trophy, Briefcase, Users2, Flame, TrendingUp, Award, BookOpen, Zap, CalendarDays, Check, Sparkles } from 'lucide-react';

export const OverviewTab = ({ score, jobMatchCount, dailyApplications, profileViews, dailyStreak, dailyNetworkGrowth, interviewReadiness, weeklyStudyHours, onboardingData, analysis }) => {
  const [completedActions, setCompletedActions] = useState([]);
  const toggleAction = (i) => setCompletedActions(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const dailyTasks = [
    { task: 'Review 3 job postings on LinkedIn', category: 'Job Search', urgency: 'high' },
    { task: `Practice answering "Tell me about yourself" out loud`, category: 'Interview Prep', urgency: 'medium' },
    { task: `Spend ${Math.floor(weeklyStudyHours)} hours on your top skill gap`, category: 'Learning', urgency: 'high' },
    { task: 'Send 1 connection request to someone in your target industry', category: 'Networking', urgency: 'medium' },
    { task: 'Update 1 section of your resume or LinkedIn', category: 'Profile', urgency: 'low' },
  ];

  const urgencyColor = { high: '#E53E3E', medium: '#D4A853', low: '#38A169' };
  const urgencyBg = { high: '#FED7D7', medium: '#FEEBC8', low: '#C6F6D5' };

  return (
    <div className="animate-fadeInUp">
      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Readiness Score', value: `${score}%`, sub: score >= 75 ? '↑ Strong position' : '↑ Keep building', icon: <Trophy size={20} />, color: score >= 75 ? '#38A169' : 'var(--gold)', trend: '+3% this week' },
          { label: 'Job Matches Today', value: jobMatchCount, sub: `${dailyApplications} applied this week`, icon: <Briefcase size={20} />, color: 'var(--plum)', trend: `+3 new` },
          { label: 'Profile Views', value: profileViews, sub: 'From recruiters', icon: <Users2 size={20} />, color: '#3182CE', trend: `+12 today` },
          { label: 'Learning Streak', value: `${dailyStreak}d`, sub: 'Active days', icon: <Flame size={20} />, color: '#E53E3E', trend: 'Personal best!' },
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Network Growth', value: `+${dailyNetworkGrowth}`, period: 'connections', icon: <TrendingUp size={18} />, color: '#805AD5' },
          { label: 'Interview Readiness', value: `${interviewReadiness}%`, period: 'readiness', icon: <Award size={18} />, color: '#D69E2E' },
          { label: 'Study Hours', value: `${(weeklyStudyHours * 5).toFixed(1)}h`, period: `of ${onboardingData?.studyHours || 8}h goal`, icon: <BookOpen size={18} />, color: '#38A169' },
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="var(--gold)" /> Immediate Actions
          </h3>
          {(analysis?.immediateActions || [
            { priority: 1, action: `Update your ${onboardingData?.targetTitle || 'role'} resume`, timeframe: 'Today' },
            { priority: 2, action: 'Connect with former colleagues', timeframe: 'This week' },
            { priority: 3, action: `Study ${analysis?.skillGaps?.[0]?.skill || 'top skill'}`, timeframe: '3 days' },
          ]).map((act, i) => (
            <div key={i} onClick={() => toggleAction(i)} style={{ padding: '14px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${completedActions.includes(i) ? '#38A169' : 'var(--border)'}`, background: completedActions.includes(i) ? '#38A169' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {completedActions.includes(i) && <Check size={12} color="white" />}
                </div>
                <span style={{ fontSize: '14px', textDecoration: completedActions.includes(i) ? 'line-through' : 'none' }}>{act.action}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{act.timeframe}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarDays size={18} color="var(--plum)" /> Today's Checklist
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dailyTasks.map((task, i) => {
              const idx = i + 10;
              const done = completedActions.includes(idx);
              return (
                <div key={i} onClick={() => toggleAction(idx)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: done ? 'rgba(56,161,105,0.06)' : 'var(--cream)', border: `1px solid ${done ? '#38A16930' : 'var(--border)'}` }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${done ? '#38A169' : urgencyColor[task.urgency]}`, background: done ? '#38A169' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {done && <Check size={11} color="white" />}
                  </div>
                  <div style={{ fontSize: '13px', flex: 1, textDecoration: done ? 'line-through' : 'none' }}>{task.task}</div>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: urgencyBg[task.urgency], color: urgencyColor[task.urgency], fontWeight: 600 }}>{task.urgency.toUpperCase()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
  );
};
