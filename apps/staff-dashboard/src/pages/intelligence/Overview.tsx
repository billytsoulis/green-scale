import { useState, useEffect } from "react";

/**
 * Global Intelligence Overview (Phase 6)
 * Path: apps/staff-dashboard/src/pages/intelligence/Overview.tsx
 * Purpose: High-level visualization of the 10,000-ticker institutional universe.
 * Logic: Integrates Recharts for Scatter Plots and Heatmaps, driven by the Python ML Engine.
 */
import { motion } from "framer-motion";
import { Card, Badge } from "@repo/ui";

const ML_ENGINE_URL = "http://localhost:8000";

export default function IntelligenceOverview() {
  const [loading, setLoading] = useState(true);
  
  // State for real analytical data from Python
  const [stats, setStats] = useState({ 
    total_indexed: 0, 
    anomalies: 0, 
    drift_24h: 0,
    sync_state: "CONNECTING..." 
  });
  
  const [sectorData, setSectorData] = useState<any[]>([]);
  const [scatterData, setScatterData] = useState<any[]>([]);

  /**
   * Data Hydration Lifecycle
   * Logic: Executes concurrent fetches to the Python FastAPI modular service.
   */
  useEffect(() => {
    const hydrateIntelligence = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Global Stats, Sector Risk, and Market Matrix concurrently
        const [statsRes, sectorRes, matrixRes] = await Promise.all([
          fetch(`${ML_ENGINE_URL}/ml/stats`),
          fetch(`${ML_ENGINE_URL}/ml/overview/sectors`),
          fetch(`${ML_ENGINE_URL}/ml/overview/matrix`)
        ]);

        if (statsRes.ok && sectorRes.ok && matrixRes.ok) {
          const statsJson = await statsRes.json();
          const sectorJson = await sectorRes.json();
          const matrixJson = await matrixRes.json();

          setStats(statsJson);
          setSectorData(sectorJson);
          setScatterData(matrixJson);
        }
      } catch (err) {
        console.error("❌ [Overview] Failed to hydrate analytical layer:", err);
      } finally {
        // Institutional delay to emphasize Big Data aggregation
        setTimeout(() => setLoading(false), 600);
      }
    };

    hydrateIntelligence();
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
          <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100" showDot animate>
            {stats.sync_state} Active
          </Badge>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">Market Intelligence</h1>
          <p className="text-slate-500 font-medium text-lg italic">Real-time analytical mapping of the 10,000 ticker institutional universe.</p>
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
        
        {/* Sector Anomaly Heatmap */}
        <div className="lg:col-span-7">
           <Card 
             title="Sector Anomaly Density" 
             description="Concentration of ethical drift flags per industry, processed via FastAPI."
             className="h-full"
           >
              <div className="h-95 w-full mt-4 flex items-center justify-center bg-slate-50 rounded-[2.5rem] border border-slate-100">
                 <div className="space-y-5 w-full px-10">
                    {sectorData.map(s => (
                      <div key={s.name} className="space-y-1.5 group">
                         <div className="flex justify-between items-end">
                            <span className="text-slate-900 font-black uppercase text-[11px] tracking-tight">{s.name}</span>
                            <span className={`text-[10px] font-black ${s.risk > 30 ? 'text-red-500' : 'text-emerald-600'}`}>{s.risk}% RISK</span>
                         </div>
                         <div className="h-2.5 w-full bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                            {/* @ts-ignore */}
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${s.risk}%` }}
                               className={`h-full transition-all duration-1000 ${s.risk > 30 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                            />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </Card>
        </div>

        {/* Valuation vs Impact Matrix */}
        <div className="lg:col-span-5">
           <Card 
             title="Valuation vs Impact Matrix" 
             description="Real-time distribution of Market Cap (X) vs AI-Predicted ESG Drift (Y)."
             className="h-full"
           >
              <div className="h-95 w-full mt-4 relative bg-slate-900 rounded-[2.5rem] overflow-hidden p-8 shadow-inner">
                 <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center text-[10rem] font-black text-white italic select-none">AI CORE</div>
                 <div className="relative w-full h-full border-l border-b border-white/5">
                    {scatterData.map((p, i) => (
                      <div 
                        key={i} 
                        title={`Ticker: ${p.ticker}`}
                        className={`absolute rounded-full transition-all hover:scale-150 cursor-pointer ${p.anomaly ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-emerald-400'}`}
                        style={{ 
                          left: `${(p.x / 500) * 100}%`, 
                          bottom: `${p.y}%`,
                          width: `${Math.max(4, p.z / 15)}px`,
                          height: `${Math.max(4, p.z / 15)}px`,
                          opacity: p.anomaly ? 0.9 : 0.4
                        }}
                      />
                    ))}
                 </div>
              </div>
              <div className="mt-6 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-300">
                 <span>$1.5B Cap</span>
                 <div className="flex gap-4">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Stable</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Drift Flag</span>
                 </div>
                 <span>$500B Cap</span>
              </div>
           </Card>
        </div>

      </div>

      {/* Critical Discovery Feed */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden text-left">
         <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div>
               <h3 className="text-xl font-black text-slate-900">Active Governance Anomalies</h3>
               <p className="text-slate-400 text-sm font-medium italic">Detected via Isolation Forest Vectoring.</p>
            </div>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-950 transition-colors cursor-pointer border-none shadow-lg">
               Export Audit Log
            </button>
         </div>
         <div className="divide-y divide-slate-50">
            {scatterData.filter(p => p.anomaly).slice(0, 4).map((item) => (
              <div key={item.ticker} className="px-10 py-6 flex items-center justify-between hover:bg-emerald-50/10 transition-colors">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center font-black shadow-lg uppercase">{item.ticker}</div>
                    <div>
                       <p className="font-black text-slate-900 leading-none">Security Flag: {item.ticker}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Valuation: ${item.x}B • Drift: {item.y}%</p>
                    </div>
                 </div>
                 <Badge 
                   variant="danger"
                   className="bg-red-50 text-red-700 border-red-100"
                 >
                    CRITICAL SEVERITY
                 </Badge>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}