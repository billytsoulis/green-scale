"use client";

import React from "react";
// @ts-ignore - Direct Lucide-React usage as requested for settings module
import { User } from "lucide-react";
import { Badge } from "@repo/ui";

/**
 * Settings Sub-component: ProfileSection
 * Path: greenscale/apps/client-portal/src/components/dashboard/settings/ProfileSection.tsx
 * Purpose: Encapsulates investor identity and Discovery Audit metrics from Phase 1.
 */

// Shared Badge logic maintained for consistency in the canvas environment
// const Badge = ({ children, variant = "info", showDot = false, animate = false, className = "" }: any) => {
//   const variants: any = {
//     success: "bg-emerald-50 text-emerald-700 border-emerald-100",
//     warning: "bg-amber-50 text-amber-700 border-amber-100",
//     danger: "bg-red-50 text-red-700 border-red-100",
//     info: "bg-slate-50 text-slate-600 border-slate-200",
//     gold: "bg-amber-50 text-amber-600 border-amber-200 shadow-sm",
//   };
//   const dotColors: any = { success: "#10b981", warning: "#f59e0b", danger: "#ef4444", info: "#94a3b8", gold: "#fbbf24" };

//   return (
//     <span className={`inline-flex items-center font-bold tracking-tight rounded-full uppercase transition-all whitespace-nowrap border px-2 py-1 text-[10.4px] ${variants[variant]} ${className}`}>
//       {showDot && (
//         <span 
//           style={{ backgroundColor: dotColors[variant] }}
//           className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 inline-block ${animate ? "animate-pulse" : ""}`} 
//         />
//       )}
//       {children}
//     </span>
//   );
// };

interface ProfileSectionProps {
  formData: { name: string; email: string; intent: string };
  setFormData: (data: any) => void;
  scores: { climate: number; social: number; governance: number };
  valueIntent: string;
  isGreek: boolean;
}

export const ProfileSection = ({ 
  formData, 
  setFormData, 
  scores, 
  valueIntent, 
  isGreek 
}: ProfileSectionProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500" data-component="ProfileSection">
      {/* 1. Identity Details Card */}
      <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-10 text-left">
        <div className="flex justify-between items-center">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
            {isGreek ? "ΣΤΟΙΧΕΙΑ ΤΑΥΤΟΤΗΤΑΣ" : "Identity Details"}
          </h3>
          <Badge variant="info">Verified Account</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              {isGreek ? "Ονοματεπώνυμο" : "Legal Name"}
            </label>
            <input 
              type="text" 
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all focus:bg-white"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              {isGreek ? "Email Λογαριασμού" : "Registered Email"}
            </label>
            <input 
              type="email" 
              disabled 
              className="w-full p-5 bg-slate-100 border border-slate-100 rounded-2xl font-bold text-slate-400 cursor-not-allowed" 
              value={formData.email} 
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
              {isGreek ? "Επενδυτική Πρόθεση (Impact Focus)" : "Impact Intent (Focus)"}
            </label>
            <input 
              type="text" 
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-emerald-800 outline-none focus:border-emerald-500 transition-all focus:bg-white"
              value={formData.intent}
              onChange={(e) => setFormData({...formData, intent: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* 2. Discovery Scores (Persistent from Phase 1) */}
      <div className="bg-emerald-950 p-12 rounded-[4rem] text-left relative overflow-hidden shadow-2xl border border-emerald-800">
        <div className="relative z-10 space-y-8">
           <Badge variant="gold" showDot animate>
             {isGreek ? "ΕΝΕΡΓΟ ΠΡΟΦΙΛ ΦΑΣΗΣ 1" : "Phase 1 Ethical Persona: ACTIVE"}
           </Badge>
           <div className="space-y-3">
              <h4 className="text-3xl font-serif font-black text-white leading-tight">
                {isGreek ? "Η Επενδυτική σας Πρόθεση" : "Discovery Audit Metrics"}
              </h4>
              <p className="text-emerald-100/60 text-lg font-medium leading-relaxed max-w-xl">
                {isGreek 
                  ? `Με βάση τον έλεγχο αξιών σας για το "${valueIntent}".`
                  : `These values were prioritized during your interactive audit for "${valueIntent}".`}
              </p>
           </div>
           <div className="flex gap-6 pt-4">
              {Object.entries(scores).map(([key, val]) => (
                <div key={key} className="bg-white/5 px-8 py-6 rounded-[2rem] border border-white/5 flex flex-col items-center gap-1 group hover:bg-white/10 transition-colors">
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{key}</span>
                   <span className="text-3xl font-black text-emerald-400 tracking-tighter">{val}%</span>
                </div>
              ))}
           </div>
        </div>
        <div className="absolute -top-10 -right-10 p-20 opacity-5 text-[15rem] leading-none select-none pointer-events-none text-white italic font-black">GS</div>
      </div>
    </div>
  );
};