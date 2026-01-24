import { useState, useEffect } from "react";

/**
 * Institutional Intelligence Hub (Phase 6 Entry)
 * Path: apps/staff-dashboard/src/pages/intelligence/Hub.tsx
 * Purpose: Central navigation for ML Analytics, Search, and Forecasting.
 * UX: Bento-grid with Framer-motion entrance and magnetic hover cards.
 */

// --- PREVIEW SAFETY IMPORTS (Commented for Canvas Stability) ---
/*
*/
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// import { BarChart3, Search, Database, FlaskConical, ShieldAlert } from "lucide-react";

// Custom Premium SVG Icons for the Hub
const OverviewIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

const DiscoveryIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);

const SandboxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2v7.5m4-7.5v7.5m-9 5h14c1 0 2 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2c0-1 1-2 2-2z" />
  </svg>
);

const ML_ENGINE_URL = "http://localhost:8000";

export default function IntelligenceHub() {
  const [systemStats, setSystemStats] = useState({
    total_indexed: 0,
    sync_state: "CONNECTING",
    latency: "..."
  });

  /**
   * System Health Lifecycle
   * Logic: Polls the FastAPI /ml/stats endpoint to verify index integrity.
   */
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const start = performance.now();
        const res = await fetch(`${ML_ENGINE_URL}/ml/stats`);
        const end = performance.now();
        
        if (res.ok) {
          const data = await res.json();
          setSystemStats({
            total_indexed: data.total_indexed,
            sync_state: data.sync_state,
            latency: `${Math.round(end - start)}ms`
          });
        }
      } catch (err) {
        setSystemStats(prev => ({ ...prev, sync_state: "OFFLINE" }));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Pulse check every 30s
    return () => clearInterval(interval);
  }, []);

  const tools = [
    {
      id: "overview",
      title: "Market Overview",
      desc: "Visual ESG risk distribution across 10,000+ institutional tickers.",
      path: "/intelligence/overview",
      icon: <OverviewIcon />,
      color: "text-emerald-500",
      bg: "bg-emerald-50/50"
    },
    {
      id: "search",
      title: "Ticker Discovery",
      desc: "High-speed analytical search powered by Elasticsearch clusters.",
      path: "/intelligence/search",
      icon: <DiscoveryIcon />,
      color: "text-blue-500",
      bg: "bg-blue-50/50"
    },
    {
      id: "sandbox",
      title: "Simulation Sandbox",
      desc: "Historical backtesting and predictive ethical drift modeling.",
      path: "/intelligence/sandbox",
      icon: <SandboxIcon />,
      color: "text-amber-500",
      bg: "bg-amber-50/50",
      locked: true 
    }
  ];

  // Animation variants logic
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 text-left">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-xl">
             Intelligence Layer
          </span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
          Institutional <br/> <span className="text-emerald-600">Intelligence.</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium max-w-2xl mt-4">
          Access deep-tier ESG analytics and ML-driven company insights. 
          The engine is currently indexing <span className="text-slate-900 font-bold">{systemStats.total_indexed.toLocaleString()} active tickers</span>.
        </p>
      </header>

      {/* Bento Grid Layout */}
      {/* @ts-ignore */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6"
      >
        {tools.map((tool) => (
          /* @ts-ignore */
          <Link 
            key={tool.id} 
            to={tool.path}
            className="group no-underline"
          >
            {/* @ts-ignore */}
            <motion.div 
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="h-full bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group-hover:shadow-2xl group-hover:border-emerald-100 transition-all flex flex-col items-center text-center space-y-6 relative overflow-hidden"
            >
              {/* Box Content */}
              <div className={`w-24 h-24 ${tool.bg} ${tool.color} rounded-4xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                 {tool.icon}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed px-4">
                  {tool.desc}
                </p>
              </div>

              <div className="pt-4">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-emerald-600 transition-colors">
                    Access Terminal →
                 </span>
              </div>

              {/* Status / Lock Indicator */}
              {tool.locked && (
                <div className="absolute top-6 right-6">
                   <span className="px-3 py-1 bg-slate-50 text-slate-300 border border-slate-100 rounded-full text-[9px] font-black uppercase">Alpha Build</span>
                </div>
              )}

              {/* Decorative Background Glow */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-50 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* System Health Footer */}
      <footer className="pt-20">
         <div className="p-8 bg-slate-900 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-2xl">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${systemStats.sync_state === 'OFFLINE' ? 'bg-red-500 text-red-500' : 'bg-emerald-500 text-emerald-500'}`} />
               </div>
               <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">FastAPI Connection</p>
                  <p className="font-bold text-white uppercase tracking-tight">
                    ML-Engine v1.0.4 {systemStats.sync_state === 'OFFLINE' ? 'Disconnected' : 'Operational'}
                  </p>
               </div>
            </div>
            <div className="flex gap-8">
               <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Index State</p>
                  <p className={`font-mono font-bold ${systemStats.sync_state === 'OFFLINE' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {systemStats.sync_state}
                  </p>
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Latency</p>
                  <p className="font-mono text-white font-bold">{systemStats.latency}</p>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}