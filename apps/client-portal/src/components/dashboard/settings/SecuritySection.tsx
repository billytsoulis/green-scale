"use client";

import React from "react";
// @ts-ignore - Direct Lucide-React usage for settings module consistency
import { Lock, ShieldCheck, LogOut, Clock } from "lucide-react";

/**
 * Settings Sub-component: SecuritySection
 * Path: greenscale/apps/client-portal/src/components/dashboard/settings/SecuritySection.tsx
 * Purpose: Manages multi-factor authentication, hardware keys, and active session governance.
 */

interface SecuritySectionProps {
  isGreek: boolean;
}

export const SecuritySection = ({ isGreek }: SecuritySectionProps) => {
  return (
    <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-10 text-left animate-in fade-in slide-in-from-right-4 duration-500" data-component="SecuritySection">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
        <ShieldCheck size={20} className="text-emerald-600" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
          {isGreek ? "ΠΡΟΣΤΑΣΙΑ & ΕΞΟΥΣΙΟΔΟΤΗΣΗ" : "Access & Authorization"}
        </h3>
      </div>

      <div className="space-y-6">
        {/* Multi-Factor Authentication (MFA) */}
        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-emerald-200 transition-all">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Lock size={16} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
              <p className="font-black text-slate-900 text-lg uppercase tracking-tight leading-none">
                {isGreek ? "Ταυτοποίηση Δύο Παραγόντων" : "Multi-Factor Authentication"}
              </p>
            </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-md mt-2">
              {isGreek 
                ? "Προστατέψτε το κεφάλαιό σας με βιομετρικά στοιχεία ή φυσικά κλειδιά ασφαλείας." 
                : "Protect your capital with biometrics or physical hardware security keys."}
            </p>
          </div>
          <button className="w-full md:w-auto px-8 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-emerald-950 hover:text-white hover:border-emerald-950 transition-all shadow-sm active:scale-95">
            {isGreek ? "ΡΥΘΜΙΣΗ MFA" : "Configure MFA"}
          </button>
        </div>

        {/* Session Management */}
        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-red-100 transition-all">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-black text-red-600 text-lg uppercase tracking-tight leading-none">
              {isGreek ? "Ενεργές Συνεδρίες" : "Active Sessions"}
            </p>
            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-md mt-2">
              {isGreek 
                ? "Αυτή τη στιγμή η διαχείριση γίνεται μέσω 1 θεσμικού τερματικού στην Αθήνα." 
                : "You are currently managed via 1 authorized institutional endpoint in Athens, GR."}
            </p>
          </div>
          <button className="w-full md:w-auto px-8 py-4 bg-white border border-red-100 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95">
            <LogOut size={14} />
            {isGreek ? "ΤΕΡΜΑΤΙΣΜΟΣ ΟΛΩΝ" : "Kill All Sessions"}
          </button>
        </div>

        {/* Security Log Insight */}
        <div className="p-8 bg-emerald-50/30 rounded-[2.5rem] border border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
                <Clock size={20} />
             </div>
             <div className="text-left space-y-1">
                <p className="font-black text-emerald-800 text-sm uppercase tracking-tight leading-none">
                  {isGreek ? "Αρχείο Ασφαλείας" : "Security Audit Log"}
                </p>
                <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest">
                  {isGreek ? "Τελευταία πρόσβαση: Πριν από 2 λεπτά" : "Last successful access: 2 minutes ago"}
                </p>
             </div>
          </div>
          <button className="text-[10px] font-black text-emerald-800 uppercase tracking-widest hover:underline bg-transparent border-none cursor-pointer">
            {isGreek ? "ΠΡΟΒΟΛΗ ΙΣΤΟΡΙΚΟΥ →" : "View Full Log →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;