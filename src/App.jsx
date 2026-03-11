import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
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
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchProfileAndSetState(session.user);
      } else {
        setUser(null);
        setPage('landing');
      }
    });

    return () => {
      if (authListener?.subscription) authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    console.log("🔍 Checking user session...");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("👤 Session found for:", session.user.email);
        await fetchProfileAndSetState(session.user);
      } else {
        console.log("📭 No session found.");
      }
    } catch (err) {
      console.error("❌ Session check failed:", err.message);
    }
    setLoading(false);
  };

  const fetchProfileAndSetState = async (authUser) => {
    console.log("📄 Fetching profile for ID:", authUser.id);
    try {
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (pError && pError.code !== 'PGRST116') {
        console.warn("⚠️ Profile table error:", pError.message);
      }

      const { data: latestAnalysis } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setUser({ 
        id: authUser.id, 
        email: authUser.email, 
        name: profile?.full_name || authUser.user_metadata?.full_name || 'User' 
      });

      if (profile?.onboarding_complete) {
        console.log("✅ Onboarding complete, navigating to dashboard.");
        setAnalysis(latestAnalysis);
        setPage('dashboard');
      } else {
        console.log("📝 Onboarding incomplete, navigating to onboarding.");
        setPage('onboarding');
      }
    } catch (err) {
      console.warn("❗ Error in fetchProfileAndSetState:", err.message);
      setPage('onboarding');
    }
  };

  const navigate = (to, tab = 'overview') => {
    console.log(`🧭 Navigating to page: ${to}${tab !== 'overview' ? ' (Tab: ' + tab + ')' : ''}`);
    setPage(to);
    if (to === 'dashboard') setDashboardTab(tab);
    window.scrollTo(0, 0);
  };

  const handleAuth = (userData, needsOnboarding) => {
    setUser(userData);
    if (needsOnboarding) {
      navigate('onboarding');
    } else {
      navigate('dashboard');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPage('landing');
  };

  const handleOnboardingComplete = (data) => {
    setOnboardingData(data);
    navigate('analyzing');
  };

  const handleAnalysisComplete = (result) => {
    console.log("📊 handleAnalysisComplete called with result:", result);
    setAnalysis(result);
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
