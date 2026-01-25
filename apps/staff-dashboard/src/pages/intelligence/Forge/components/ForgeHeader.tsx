/**
 * Ticker Forge: Header & Global Controls
 * Path: src/pages/intelligence/Forge/components/ForgeHeader.tsx
 * Purpose: Navigation and commit orchestration for score certifications.
 */

import { useNavigate } from "react-router-dom";
import { ChevronLeft, Save } from "lucide-react";

interface ForgeHeaderProps {
  ticker: string;
  name: string;
  sector: string;
  lastAudit: string;
  onCommit: () => void;
  isSaving: boolean;
}

export const ForgeHeader = ({
  ticker,
  name,
  sector,
  lastAudit,
  onCommit,
  isSaving
}: ForgeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center gap-5">
        <button 
          onClick={() => navigate("/intelligence/search")}
          className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-300 border border-slate-100 bg-white cursor-pointer hover:text-emerald-600 transition-colors"
        >
          <ChevronLeft />
        </button>
        <div className="text-left">
          <h2 className="text-2xl font-black text-slate-900 leading-none flex items-center gap-3 uppercase tracking-tight">
            {ticker} <span className="text-slate-300 font-medium">/</span> {name}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Sector: {sector} • Last Audit: {lastAudit}
          </p>
        </div>
      </div>

      <button 
        onClick={onCommit}
        disabled={isSaving}
        className="px-8 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-800 transition-all border-none cursor-pointer shadow-xl disabled:opacity-50"
      >
        {isSaving ? "Syncing..." : <><Save /> Commit Certification</>}
      </button>
    </header>
  );
};

export default ForgeHeader;