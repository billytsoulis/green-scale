import React from "react";

/**
 * Simulation Sandbox: Header & Global Controls
 * Path: src/pages/intelligence/Sandbox/components/SandboxHeader.tsx
 * Purpose: Title, metadata summary, and simulation execution trigger.
 */

import { Play, RotateCcw } from "lucide-react";
import { AnalyticsBadge } from "../../components/AnalyticsBadge.tsx";

interface SandboxHeaderProps {
  isSimulating: boolean;
  onRun: () => void;
  onReset: () => void;
  lastSimResult?: string;
}

export const SandboxHeader = ({
  isSimulating, 
  onRun, 
  onReset,
  lastSimResult 
}: SandboxHeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
      <div className="space-y-2">
        <AnalyticsBadge variant="success" showDot animate>
          Engine v1.0.4 - Sandbox Ready
        </AnalyticsBadge>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
          Simulation <span className="text-emerald-600">Sandbox</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg italic leading-tight">
          Backtest ethical mandates against 5 years of historical market drift.
        </p>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onReset}
          className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-300 border border-slate-100 bg-white cursor-pointer hover:text-emerald-600 transition-colors shadow-sm"
        >
          <RotateCcw />
        </button>
        <button 
          onClick={onRun}
          disabled={isSimulating}
          className="px-8 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-800 transition-all border-none cursor-pointer shadow-xl disabled:opacity-50"
        >
          {isSimulating ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : <Play />}
          {isSimulating ? "Processing Vectors..." : "Execute Simulation"}
        </button>
      </div>
    </header>
  );
};

export default SandboxHeader;