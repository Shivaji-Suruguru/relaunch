import React, { useState, useEffect } from 'react';
import { GlobalStyles } from './styles/GlobalStyles';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { OnboardingPage } from './components/OnboardingPage';
import { AnalyzingPage } from './components/AnalyzingPage';
import { ReportPage } from './components/ReportPage';
import { DashboardPage } from './components/DashboardPage';

const App = () => {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [onboardingData, setOnboardingData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardTab, setDashboardTab] = useState('overview');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async (preventNavigation = false) => {
    const token = localStorage.getItem('reentry_token');
    if (token) {
      try {
        const res = await fetch('/api/user/data', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.profile ? { id: data.profile.user_id, email: data.profile.email, name: data.profile.full_name } : null);
          setAnalysis(data.analysis);
          setOnboardingData(data.onboardingData);
          if (!preventNavigation) {
            if (data.profile?.onboarding_complete) {
              setPage('dashboard');
            } else {
              setPage('onboarding');
            }
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err.message);
      }
    }
    setLoading(false);
  };

  const navigate = (to, tab = 'overview') => {
    setPage(to);
    if (to === 'dashboard') setDashboardTab(tab);
    window.scrollTo(0, 0);
  };

  const handleAuth = (authData, needsOnboarding) => {
    setUser(authData.user);
    localStorage.setItem('reentry_token', authData.token);
    if (needsOnboarding) {
      navigate('onboarding');
    } else {
      navigate('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('reentry_token');
    setUser(null);
    setPage('landing');
  };

  const handleOnboardingComplete = (data) => {
    setOnboardingData(data);
    navigate('analyzing');
  };

  const handleAnalysisComplete = (result) => {
    setAnalysis(result);
    // Refresh user data after analysis to ensure dashboard is ready, but prevent it from navigating away from 'report'
    checkUser(true);
    navigate('report');
  };

  const handleReportContinue = () => {
    navigate('dashboard');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--plum)', borderRadius: '50%' }}></div>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles />
      {page === 'landing' && <LandingPage onNavigate={navigate} />}
      {(page === 'login' || page === 'signup') && <AuthPage mode={page} onAuth={handleAuth} onBack={() => navigate('landing')} />}
      {page === 'onboarding' && <OnboardingPage user={user} onComplete={handleOnboardingComplete} />}
      {page === 'analyzing' && <AnalyzingPage user={user} onboardingData={onboardingData} onComplete={handleAnalysisComplete} />}
      {page === 'report' && <ReportPage user={user} analysis={analysis} onContinue={handleReportContinue} />}
      {page === 'dashboard' && <DashboardPage user={user} analysis={analysis} onboardingData={onboardingData} initialTab={dashboardTab} onLogout={handleLogout} onRetakeOnboarding={() => navigate('onboarding')} />}
    </>
  );
};

export default App;
