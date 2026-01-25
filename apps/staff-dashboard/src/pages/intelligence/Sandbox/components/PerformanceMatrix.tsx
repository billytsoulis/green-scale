import React from "react";

/**
 * Simulation Sandbox: Performance Matrix
 * Path: src/pages/intelligence/Sandbox/components/PerformanceMatrix.tsx
 * Purpose: Comparison visualization between Benchmark and Ethical portfolios.
 */

import { TrendingUp, Activity } from "lucide-react";

interface MatrixProps {
  results: any;
  isVisible: boolean;
}

export const PerformanceMatrix = ({ results, isVisible }: MatrixProps) => {
  if (!isVisible) return (
    <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50 text-slate-300">
       <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Simulation Parameters</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. ROI Comparison */}
      <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl space-y-8 flex flex-col justify-between overflow-hidden relative">
        <div className="relative z-10 space-y-2">
           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Cumulative Returns</p>
           <h3 className="text-4xl font-black tracking-tighter">ROI Performance</h3>
        </div>
        <div className="relative z-10 flex items-end gap-10">
           <div className="text-left">
              <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Benchmark</p>
              <p className="text-2xl font-black text-slate-300 tracking-tighter">+{results.benchmark_roi}%</p>
           </div>
           <div className="text-left">
              <p className="text-[9px] font-black text-emerald-500 uppercase mb-2">Ethical Alpha</p>
              <p className="text-5xl font-black text-white tracking-tighter leading-none">+{results.ethical_roi}%</p>
           </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black italic text-white/2 pointer-events-none">ROI</div>
      </div>

      {/* 2. Volatility Analysis */}
      <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-8 flex flex-col justify-between">
         <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Profiling</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Volatility Delta</h3>
         </div>
         <div className="space-y-6">
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
               <span className="text-[10px] font-black text-slate-400 uppercase">Sharpe Ratio</span>
               <span className="text-lg font-black text-emerald-700">{results.sharpe}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
               <span className="text-[10px] font-black text-slate-400 uppercase">Max Drawdown</span>
               <span className="text-lg font-black text-red-500">-{results.drawdown}%</span>
            </div>
         </div>
      </div>

      {/* 3. Alpha Interpretation */}
      <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-8 flex flex-col justify-between">
         <div className="space-y-2 text-emerald-600">
            <TrendingUp />
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Predictive Insight</h3>
         </div>
         <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
            The ethical mandate demonstrates a <span className="text-emerald-700 font-bold">{results.ethical_roi - results.benchmark_roi}% improvement</span> over the benchmark, primarily driven by the avoidance of stranded assets in the energy sector.
         </p>
         <div className="pt-4 border-t border-slate-50">
            <button className="text-[10px] font-black uppercase tracking-widest text-emerald-950 flex items-center gap-2 hover:gap-3 transition-all cursor-pointer bg-transparent border-none">
               Export Prediction Report <Activity />
            </button>
         </div>
      </div>
    </div>
  );
};

export default PerformanceMatrix;