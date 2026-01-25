/**
 * Institutional Intelligence: Market Overview Entry Point
 * Path: src/pages/intelligence/Overview/index.tsx
 * Purpose: Orchestrates the multi-dimensional analytical view of the ticker universe.
 * Logic: Leverages the 'useOverviewData' hook for state and delegates rendering 
 * to atomic visual components.
 */

import { motion } from "framer-motion";
import { StatCard } from "../components/StatCard";
import { AnalyticsBadge } from "../components/AnalyticsBadge";
import { useOverviewData } from "./useOverviewData";
import { SectorHeatmap } from "./SectorHeatmap.tsx";
import { MarketMatrix } from "./MarketMatrix.tsx";
import { OverviewIcon } from "../shared/icons";

export default function IntelligenceOverview() {
  const { loading, stats, sectorData, scatterData } = useOverviewData();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="text-center space-y-4">
           <div className="w-12 h-12 border-t-2 border-emerald-500 rounded-full animate-spin mx-auto" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Aggregating 10,000 Data Points...</p>
        </div>
      </div>
    );
  }

  return (
    /* @ts-ignore - Utilizing motion for a refined entrance sequence */
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-12 text-left"
    >
      {/* 1. Dynamic Header & Global Monitor */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <AnalyticsBadge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100" showDot animate>
            {stats.sync_state} Active
          </AnalyticsBadge>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">Market Intelligence</h1>
          <p className="text-slate-500 font-medium text-lg italic leading-tight">Real-time analytical mapping of the global institutional universe.</p>
        </div>

        <div className="flex gap-4">
           <StatCard 
              label="Global Drift" 
              value={`+${stats.drift_24h}`} 
              variant="dark"
              icon={<OverviewIcon />}
           />
           <StatCard 
              label="Critical Anomalies" 
              value={stats.anomalies} 
              variant="dark"
              statusColor="red"
              icon={<OverviewIcon />}
           />
        </div>
      </header>

      {/* 2. Primary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sector Anomaly Density (Delegated Component) */}
        <div className="lg:col-span-7">
           <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <header className="space-y-1">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sector Anomaly Density</h4>
                 <p className="text-sm text-slate-500 font-medium">Concentration of ethical drift flags per industry.</p>
              </header>
              <SectorHeatmap data={sectorData} />
           </div>
        </div>

        {/* Valuation vs Impact Matrix (Delegated Component) */}
        <div className="lg:col-span-5">
           <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <header className="space-y-1">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Valuation vs Impact Matrix</h4>
                 <p className="text-sm text-slate-500 font-medium">Market Cap (X) vs AI-Predicted ESG Drift (Y).</p>
              </header>
              <MarketMatrix data={scatterData} />
           </div>
        </div>

      </div>

      {/* 3. Real-time Anomaly Discovery Feed */}
      <section className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
         <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div>
               <h3 className="text-xl font-black text-slate-900">Critical Intelligence Feed</h3>
               <p className="text-slate-400 text-sm font-medium italic">High-velocity monitoring of institutional drift patterns.</p>
            </div>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-950 transition-colors cursor-pointer border-none shadow-lg">
               Export Global Audit
            </button>
         </div>
         <div className="p-20 text-center text-slate-300 font-black uppercase text-xs tracking-widest">
            Detailed Feed Logic (Next Steps)
         </div>
      </section>
    </motion.div>
  );
}