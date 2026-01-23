"use client";

import { useState, useEffect } from "react";

/**
 * Global Intelligence Overview (Phase 6)
 * Path: apps/staff-dashboard/src/pages/intelligence/Overview.tsx
 * Purpose: High-level visualization of the 10,000-ticker institutional universe.
 * Logic: Integrates Recharts for Scatter Plots and Heatmaps, driven by the Python ML Engine.
 */

// --- PREVIEW SAFETY IMPORTS (Commented for Canvas Stability) ---
/*
*/
// import { 
//   ResponsiveContainer, 
//   ScatterChart, 
//   Scatter, 
//   XAxis, 
//   YAxis, 
//   ZAxis, 
//   Tooltip, 
//   Cell, 
//   BarChart, 
//   Bar 
// } from "recharts";
// import { motion } from "framer-motion";
// import { AlertTriangle, Zap, TrendingUp, ShieldCheck } from "lucide-react";
import { Card, Badge } from "@repo/ui";

export default function IntelligenceOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_indexed: 10000, anomalies: 142, drift_24h: 18 });

  // 1. Mock Data for Scatter Plot (Market Cap vs ESG Score)
  const scatterData = Array.from({ length: 50 }).map((_, i) => ({
    x: Math.random() * 500, // Market Cap
    y: 20 + Math.random() * 70, // ESG Score
    z: Math.random() * 100, // Risk factor (size)
    anomaly: Math.random() > 0.8
  }));

  // 2. Mock Data for Sector Distribution (Aggregated via Python)
  const sectorData = [
    { name: 'Tech', count: 2400, risk: 12 },
    { name: 'Energy', count: 1800, risk: 42 },
    { name: 'Finance', count: 2100, risk: 8 },
    { name: 'Health', count: 1200, risk: 15 },
    { name: 'Industrial', count: 2500, risk: 28 },
  ];

  useEffect(() => {
    // Logic: In prod, this calls GET http://localhost:8000/ml/overview
    setTimeout(() => setLoading(false), 800);
  }, []);

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
    <div className="animate-in fade-in duration-700 space-y-12">
      {/* Dynamic Header & Global Monitor */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
        <div className="space-y-2">
          <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100" showDot animate>ML-Engine Sync Active</Badge>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Market Intelligence</h1>
          <p className="text-slate-500 font-medium text-lg italic">Real-time analytical mapping of the global institutional universe.</p>
        </div>

        <div className="flex gap-4">
           <div className="px-6 py-4 bg-slate-900 rounded-3xl text-white shadow-xl flex items-center gap-6">
              <div className="text-left">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Global Drift</p>
                 <p className="text-2xl font-black text-emerald-400 tracking-tighter leading-none">+{stats.drift_24h}</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-left">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Anomalies</p>
                 <p className="text-2xl font-black text-red-400 tracking-tighter leading-none">{stats.anomalies}</p>
              </div>
           </div>
        </div>
      </header>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sector Anomaly Heatmap (Conceptual implementation via BarChart) */}
        <div className="lg:col-span-7">
           <Card 
             title="Sector Anomaly Density" 
             description="Percentage of companies in each sector flagged for greenwashing or governance risks."
             className="h-full"
           >
              <div className="h-75 w-full mt-4 flex items-center justify-center bg-slate-50 rounded-3xl text-slate-300 font-bold uppercase text-[10px] tracking-widest">
                 {/* Recharts BarChart would go here in Production */}
                 <div className="space-y-4 w-full px-10">
                    {sectorData.map(s => (
                      <div key={s.name} className="space-y-1.5">
                         <div className="flex justify-between items-end">
                            <span className="text-slate-900 font-bold">{s.name}</span>
                            <span className={s.risk > 30 ? 'text-red-500' : 'text-emerald-600'}>{s.risk}% Risk</span>
                         </div>
                         <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                            <div className={`h-full transition-all duration-1000 ${s.risk > 30 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${s.risk}%` }} />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </Card>
        </div>

        {/* Global Scatter View */}
        <div className="lg:col-span-5">
           <Card 
             title="Valuation vs Impact Matrix" 
             description="Correlation between Market Cap (X) and ESG Maturity (Y)."
             className="h-full"
           >
              <div className="h-75 w-full mt-4 relative bg-slate-900 rounded-3xl overflow-hidden p-6">
                 {/* Mocking the Scatter Nodes visually for the preview */}
                 <div className="absolute inset-0 opacity-10 flex items-center justify-center text-[10rem] font-black text-white italic select-none">DATA</div>
                 <div className="relative w-full h-full border-l border-b border-white/10 flex items-center justify-center">
                    {scatterData.slice(0, 20).map((p, i) => (
                      <div 
                        key={i} 
                        className={`absolute rounded-full transition-all hover:scale-150 cursor-pointer ${p.anomaly ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-emerald-400'}`}
                        style={{ 
                          left: `${(p.x / 500) * 100}%`, 
                          bottom: `${(p.y / 100) * 100}%`,
                          width: `${p.z / 10}px`,
                          height: `${p.z / 10}px`,
                          opacity: 0.6
                        }}
                      />
                    ))}
                 </div>
              </div>
              <div className="mt-6 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-300">
                 <span>$0B Cap</span>
                 <div className="flex gap-4">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Stable</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Outlier</span>
                 </div>
                 <span>$500B Cap</span>
              </div>
           </Card>
        </div>

      </div>

      {/* Anomaly Discovery Feed (Footer Layer) */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden text-left">
         <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
            <div>
               <h3 className="text-xl font-black text-slate-900">Critical Governance Anomalies</h3>
               <p className="text-slate-400 text-sm font-medium">Real-time Isolation Forest detection results.</p>
            </div>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-950 transition-colors cursor-pointer border-none shadow-lg">
               Export Audit Log
            </button>
         </div>
         <div className="divide-y divide-slate-50">
            {[
              { ticker: "BRKB", name: "Berkshire Hathaway", type: "Executive Turnover", risk: "HIGH" },
              { ticker: "XOM", name: "Exxon Mobil", type: "Reporting Conflict", risk: "CRITICAL" },
              { ticker: "TSLA", name: "Tesla, Inc.", type: "Board Independence", risk: "MEDIUM" }
            ].map((item) => (
              <div key={item.ticker} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-emerald-900">{item.ticker}</div>
                    <div>
                       <p className="font-bold text-slate-900">{item.name}</p>
                       <p className="text-xs text-slate-400 font-medium">{item.type}</p>
                    </div>
                 </div>
                 <Badge 
                   variant={item.risk === 'CRITICAL' ? 'danger' : item.risk === 'HIGH' ? 'warning' : 'info'}
                   className={item.risk === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}
                 >
                    {item.risk} SEVERITY
                 </Badge>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}