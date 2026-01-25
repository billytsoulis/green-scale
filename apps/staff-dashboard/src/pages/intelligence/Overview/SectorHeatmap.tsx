/**
 * Institutional Intelligence: Sector Risk Heatmap
 * Path: src/pages/intelligence/Overview/SectorHeatmap.tsx
 * Purpose: Visualizes anomaly density across industrial categories.
 * Logic: Renders a high-density bar-chart list with animated risk vectors.
 * Update: Optimized Tailwind 4 spacing (h-95) and type-safe data mapping.
 */

import { motion } from "framer-motion";
import type { SectorAnalysis } from "../shared/types";

interface SectorHeatmapProps {
  data: SectorAnalysis[];
}

export const SectorHeatmap = ({ data }: SectorHeatmapProps) => {
  return (
    <div 
      className="h-95 w-full flex items-center justify-center bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden" 
      data-component="SectorHeatmap"
    >
      <div className="space-y-5 w-full px-10">
        {data.length > 0 ? (
          data.map((s) => (
            <div key={s.name} className="space-y-1.5 group">
              <div className="flex justify-between items-end">
                <span className="text-slate-900 font-black uppercase text-[11px] tracking-tight">
                  {s.name}
                </span>
                <span className={`text-[10px] font-black ${s.risk > 30 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {s.risk}% RISK
                </span>
              </div>
              
              <div className="h-2.5 w-full bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                {/* @ts-ignore - Institutional progress bar animation */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${s.risk}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full transition-all ${
                    s.risk > 40 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 
                    s.risk > 20 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} 
                />
              </div>
              
              <div className="flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">
                  Total Entities: {s.count.toLocaleString()}
                </p>
                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter italic">
                  ML-Verified Drift Density
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center space-y-2">
            <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hydrating Sector Vectors...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectorHeatmap;