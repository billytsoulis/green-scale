"use client";

import React from "react";

/**
 * Audit Sub-component: AuditProgressHeader
 * Path: greenscale/apps/client-portal/src/components/theme/blocks/audit/components/AuditHeader.tsx
 * Purpose: Displays current step progress, user intent, and dynamic localized titles.
 */

interface Props {
  step: number;
  total: number;
  isGreek: boolean;
  intent: string;
  title: string;
}

export const AuditProgressHeader = ({ 
  step, 
  total, 
  isGreek, 
  intent, 
  title 
}: Props) => {
  return (
    <header className="text-center space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-3">
          {/* Step Indicator Badge */}
          <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 bg-emerald-50 text-emerald-800 shadow-sm transition-all">
            {isGreek ? `Βήμα ${step + 1} από ${total}` : `Step ${step + 1} of ${total}`}
          </span>
          
          <div className="h-4 w-px bg-slate-200" />
          
          {/* Active Intent Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm hover:border-emerald-200 transition-colors">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {isGreek ? 'Για:' : 'Focus:'} <span className="text-emerald-950">{intent}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Localized Title */}
      <h2 className="text-7xl font-serif font-black text-slate-900 tracking-tight leading-[0.9] max-w-3xl mx-auto">
        {title}
      </h2>
    </header>
  );
};

export default AuditProgressHeader;