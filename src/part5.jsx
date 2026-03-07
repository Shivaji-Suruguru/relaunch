// ---------- APP ROOT (STATE MACHINE) ----------
const App = () => {
    const [page, setPage] = useState('landing');
    const [user, setUser] = useState(null);
    const [onboardingData, setOnboardingData] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [dashboardTab, setDashboardTab] = useState('overview');

    const navigate = (nextPage) => {
        window.scrollTo(0, 0);
        setPage(nextPage);
    };

    const handleAuth = (loggedInUser, isNew) => {
        setUser(loggedInUser);
        if (isNew) navigate('onboarding');
        else navigate('dashboard');
    };

    const handleOnboardingComplete = (data) => {
        setOnboardingData(data);
        navigate('analyzing');
    };

    const handleAnalysisComplete = (result) => {
        setAnalysis(result);
        navigate('report');
    };

    const handleReportContinue = () => {
        setDashboardTab('roadmap');
        navigate('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        setOnboardingData(null);
        setAnalysis(null);
        navigate('landing');
    };

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
