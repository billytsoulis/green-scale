"use client";

import React from "react";

/**
 * Audit Sub-component: ResultsSummary
 * Path: src/components/theme/blocks/audit/components/ResultsSummary.tsx
 */

interface Props {
  scores: {
    climate: number;
    social: number;
    governance: number;
  };
  isGreek: boolean;
}

export const ResultsSummary = ({ scores, isGreek }: Props) => (
  <div className="grid grid-cols-3 gap-6 w-full py-10 border-y border-white/10">
    {[
      { label: isGreek ? 'Κλίμα' : 'Climate', val: scores.climate, color: 'text-emerald-400' },
      { label: isGreek ? 'Κοινωνία' : 'Social', val: scores.social, color: 'text-blue-400' },
      { label: isGreek ? 'Gov' :'Gov', val: scores.governance, color: 'text-amber-400' }
    ].map((item, idx) => (
      <div key={idx} className="bg-white/5 p-4 rounded-3xl border border-white/5 space-y-2">
        <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{item.label}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-2xl font-black ${item.color}`}>{item.val}%</span>
        </div>
      </div>
    ))}
  </div>
);