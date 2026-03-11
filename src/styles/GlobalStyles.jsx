import React from 'react';

export const GlobalStyles = () => (
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
