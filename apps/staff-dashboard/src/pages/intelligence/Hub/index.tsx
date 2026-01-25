import { useState, useEffect } from "react";

/**
 * Institutional Intelligence: Hub Entry Point
 * Path: src/pages/intelligence/Hub/index.tsx
 * Purpose: Central navigation and real-time health monitoring orchestrator.
 * Logic: Hydrates system-wide metadata from the Python ML Engine.
 */

import { motion } from "framer-motion";
// import { StatCard } from "../components/StatCard";
import { AnalyticsBadge } from "../components/AnalyticsBadge";
import { HubCard } from "./HubCard";
import { 
  OverviewIcon, 
  DiscoveryIcon, 
  SandboxIcon,
  TerminalIcon 
} from "../shared/icons";
// import { GlobalStats } from "../shared/types";

const ML_ENGINE_URL = "http://localhost:8000";

export default function IntelligenceHub() {
  const [stats, setStats] = useState({
    total_indexed: 0,
    sync_state: "CONNECTING",
    latency: "..."
  });

  /**
   * Handshake Lifecycle
   * Logic: Periodically verify the connection integrity with the Python engine.
   */
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const start = performance.now();
        const res = await fetch(`${ML_ENGINE_URL}/ml/stats`);
        const end = performance.now();
        
        if (res.ok) {
          const data = await res.json();
          setStats({
            total_indexed: data.total_indexed,
            sync_state: data.sync_state,
            latency: `${Math.round(end - start)}ms`
          });
        }
      } catch (err) {
        setStats(prev => ({ ...prev, sync_state: "OFFLINE" }));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
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

  // Animation variants logic for the Bento-grid entrance
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
      {/* 1. Module Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <AnalyticsBadge variant="info" className="bg-slate-900 text-white border-none shadow-xl">
             Intelligence Layer
          </AnalyticsBadge>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
          Institutional <br/> <span className="text-emerald-600">Intelligence.</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium max-w-2xl mt-4">
          Access deep-tier ESG analytics and ML-driven insights. 
          Currently indexing <span className="text-slate-900 font-bold">{stats.total_indexed.toLocaleString()} active tickers</span>.
        </p>
      </header>

      {/* 2. Bento Grid Tool Navigation */}
      {/* @ts-ignore */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6"
      >
        {tools.map((tool) => (
          <HubCard 
            key={tool.id}
            {...tool}
            variants={item}
          />
        ))}
      </motion.div>

      {/* 3. Global System Health Monitor */}
      <footer className="pt-20">
         <div className="p-8 bg-slate-900 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-6 relative z-10">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${stats.sync_state === 'OFFLINE' ? 'bg-red-500 text-red-500' : 'bg-emerald-500 text-emerald-500'}`} />
               </div>
               <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">FastAPI Connection</p>
                  <p className="font-bold text-white uppercase tracking-tight">
                    ML-Engine v1.0.4 {stats.sync_state === 'OFFLINE' ? 'Disconnected' : 'Operational'}
                  </p>
               </div>
            </div>

            <div className="flex gap-12 relative z-10">
               <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest">Index State</p>
                  <p className={`font-mono font-bold ${stats.sync_state === 'OFFLINE' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {stats.sync_state}
                  </p>
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest">Latency</p>
                  <p className="font-mono text-white font-bold">{stats.latency}</p>
               </div>
            </div>

            {/* Decorative Background Icon */}
            <div className="absolute right-10 -bottom-6 opacity-5 text-white pointer-events-none transform rotate-12">
               <TerminalIcon size={120} />
            </div>
         </div>
      </footer>
    </div>
  );
}