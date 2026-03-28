import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import { LayoutDashboard, MessageSquarePlus, Globe } from 'lucide-react';

function App() {
  const [lang, setLang] = useState('EN');

  return (
    <Router>
      <nav className="glass sticky top-0 z-50 px-6 py-4 mb-4 border-b border-white/5 flex justify-between items-center bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-8">
           <Link to="/" className="text-xl font-black text-white hover:text-accent transition-colors flex items-center gap-2">
              CivicFix <span className="text-accent underline decoration-2 underline-offset-4">AI</span>
           </Link>
           <div className="hidden md:flex gap-6">
              <Link to="/" className="text-sm font-bold text-slate-400 hover:text-accent transition-colors flex items-center gap-2 uppercase tracking-widest">
                <MessageSquarePlus className="w-4 h-4" /> Reports
              </Link>
              <Link to="/analytics" className="text-sm font-bold text-slate-400 hover:text-accent transition-colors flex items-center gap-2 uppercase tracking-widest">
                <LayoutDashboard className="w-4 h-4" /> Analytics
              </Link>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setLang(l => l === 'EN' ? 'HI' : 'EN')}
             className="btn icon-btn text-xs font-bold uppercase tracking-widest px-3 py-1.5 flex items-center gap-1.5"
           >
              <Globe className="w-3.5 h-3.5" /> {lang}
           </button>
           <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent">YA</div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>

      <footer className="container py-12 text-center text-muted">
         <p className="text-sm font-bold uppercase tracking-widest mb-2">Developed for Civic Resilience</p>
         <p className="text-xs opacity-50">© 2026 CivicFix AI Production Hub. Built with Gemini & React.</p>
      </footer>
    </Router>
  );
}

export default App;
