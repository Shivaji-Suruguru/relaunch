import React, { useState } from 'react';
import { 
  RotateCcw, Sparkles, LogOut, BarChart, Target, Brain, 
  FileText, MessageSquare, Briefcase
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { OverviewTab } from './dashboard/OverviewTab';
import { RoadmapTab } from './dashboard/RoadmapTab';
import { SkillsTab } from './dashboard/SkillsTab';
import { ResumeTab } from './dashboard/ResumeTab';
import { ChatTab } from './dashboard/ChatTab';
import { JobsTab } from './dashboard/JobsTab';

export const DashboardPage = ({ user, analysis, onboardingData, initialTab, onLogout, onRetakeOnboarding }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'overview');
  const [rmExpandedNode, setRmExpandedNode] = useState(null);
  const [rmCheckedNodes, setRmCheckedNodes] = useState([]);
  const [rmActiveSection, setRmActiveSection] = useState('s0');

  const score = analysis?.readinessScore || 0;
  const firstName = user?.name?.split(' ')[0] || 'there';
  const today = new Date();
  const todaySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const pseudo = (offset) => ((todaySeed * 9301 + 49297 * (offset + 1)) % 233280) / 233280;

  const dailyApplications = Math.floor(pseudo(1) * 5) + 2;
  const dailyStreak = Math.floor(pseudo(2) * 14) + 3;
  const dailyNetworkGrowth = Math.floor(pseudo(3) * 12) + 1;
  const weeklyStudyHours = Math.floor(pseudo(4) * 6) + (onboardingData?.studyHours ? parseInt(onboardingData.studyHours) / 7 : 2);
  const profileViews = Math.floor(pseudo(5) * 45) + 10;
  const interviewReadiness = Math.min(100, score + Math.floor(pseudo(6) * 15));
  const jobMatchCount = analysis?.topRoles?.length ? analysis.topRoles.length + Math.floor(pseudo(7) * 8) + 3 : 12;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart size={20} /> },
    { id: 'roadmap', label: 'My Roadmap', icon: <Target size={20} /> },
    { id: 'skills', label: 'Skill Analysis', icon: <Brain size={20} /> },
    { id: 'resume', label: 'Resume Builder', icon: <FileText size={20} /> },
    { id: 'chat', label: 'AI Mentor Chat', icon: <MessageSquare size={20} /> },
    { id: 'jobs', label: 'Job Matches', icon: <Briefcase size={20} /> }
  ];

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
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.6)', background: activeTab === tab.id ? 'rgba(255,255,255,0.12)' : 'transparent', textAlign: 'left', fontWeight: activeTab === tab.id ? 600 : 400, transition: 'all 0.2s', border: activeTab === tab.id ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent' }}>
              <span style={{ color: activeTab === tab.id ? 'var(--gold)' : 'inherit' }}>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)', marginBottom: '8px' }}>
            <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>🔥 {dailyStreak}-day streak</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Keep it up!</div>
          </div>
          <button onClick={onRetakeOnboarding} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: 'var(--gold)', width: '100%', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}>
            <RotateCcw size={18} /> Retake Onboarding
          </button>
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: 'rgba(255,255,255,0.5)', width: '100%', textAlign: 'left', borderRadius: '8px' }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '40px 48px', minHeight: '100vh' }} className="main-content">
        <div style={{ marginBottom: '32px' }}>
          <h1 className="serif" style={{ fontSize: '32px', marginBottom: '4px' }}>Welcome back, {firstName}! 👋</h1>
          <p style={{ color: 'var(--muted)' }}>
            Today is {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} &nbsp;·&nbsp; Week {Math.max(1, Math.ceil((todaySeed % 12) + 1))} of your comeback journey
          </p>
        </div>

        {activeTab === 'overview' && (
          <OverviewTab 
            score={score} 
            jobMatchCount={jobMatchCount} 
            dailyApplications={dailyApplications} 
            profileViews={profileViews} 
            dailyStreak={dailyStreak} 
            dailyNetworkGrowth={dailyNetworkGrowth} 
            interviewReadiness={interviewReadiness} 
            weeklyStudyHours={weeklyStudyHours} 
            onboardingData={onboardingData} 
            analysis={analysis} 
          />
        )}
        {activeTab === 'roadmap' && <RoadmapTab onboardingData={onboardingData} analysis={analysis} />}
        {activeTab === 'skills' && <SkillsTab analysis={analysis} onboardingData={onboardingData} />}
        {activeTab === 'resume' && <ResumeTab onboardingData={onboardingData} />}
        {activeTab === 'chat' && <ChatTab user={user} analysis={analysis} onboardingData={onboardingData} />}
        {activeTab === 'jobs' && <JobsTab onboardingData={onboardingData} />}
      </main>
    </div>
  );
};
