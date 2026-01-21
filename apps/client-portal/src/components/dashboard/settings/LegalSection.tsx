"use client";

import React from "react";
// @ts-ignore - Direct Lucide-React usage for settings module consistency
import { FileText, ShieldAlert, Scale, Info } from "lucide-react";

/**
 * Settings Sub-component: LegalSection
 * Path: greenscale/apps/client-portal/src/components/dashboard/settings/LegalSection.tsx
 * Purpose: Encapsulates regulatory disclosures, privacy policies, and investment risk terms.
 */

interface LegalSectionProps {
  isGreek: boolean;
}

export const LegalSection = ({ isGreek }: LegalSectionProps) => {
  const policies = [
    {
      id: "privacy",
      icon: <ShieldAlert size={18} className="text-emerald-600" />,
      titleEn: "1. Wealth Privacy Policy",
      titleEl: "1. Πολιτική Απορρήτου Πλούτου",
      contentEn: "GreenScale uses zero-knowledge proof protocols to verify investment eligibility. Your external bank account data is never stored on persistent storage; it is normalized statelessly in memory.",
      contentEl: "Η GreenScale χρησιμοποιεί πρωτόκολλα zero-knowledge proof για την επαλήθευση της επιλεξιμότητας επενδύσεων. Τα δεδομένα του εξωτερικού τραπεζικού σας λογαριασμού δεν αποθηκεύονται ποτέ σε μόνιμη μνήμη."
    },
    {
      id: "disclosure",
      icon: <Scale size={18} className="text-amber-600" />,
      titleEn: "2. Investment Risk Disclosure",
      titleEl: "2. Γνωστοποίηση Επενδυτικού Κινδύνου",
      contentEn: "All ESG scores provided are estimates based on available reporting. Rebalancing trades are executed under standard market conditions. Past performance is not indicative of future results.",
      contentEl: "Όλα τα σκορ ESG που παρέχονται είναι εκτιμήσεις βασισμένες σε διαθέσιμες αναφορές. Οι συναλλαγές εξισορρόπησης εκτελούνται υπό κανονικές συνθήκες αγοράς."
    },
    {
      id: "compliance",
      icon: <Info size={18} className="text-blue-600" />,
      titleEn: "3. Regulatory Compliance",
      titleEl: "3. Κανονιστική Συμμόρφωση",
      contentEn: "GreenScale operates in strict accordance with EU financial regulations, Anti-Money Laundering (AML) directives, and GDPR data protection standards.",
      contentEl: "Η GreenScale λειτουργεί σε αυστηρή συμμόρφωση με τους οικονομικούς κανονισμούς της ΕΕ, τις οδηγίες κατά του ξεπλύματος χρήματος (AML) και τα πρότυπα προστασίας δεδομένων GDPR."
    }
  ];

  return (
    <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-10 text-left animate-in fade-in slide-in-from-right-4 duration-500" data-component="LegalSection">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
        <FileText size={20} className="text-slate-400" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
          {isGreek ? "ΚΑΝΟΝΙΣΤΙΚΟ ΠΛΑΙΣΙΟ & ΓΝΩΣΤΟΠΟΙΗΣΕΙΣ" : "Regulatory & Disclosure"}
        </h3>
      </div>

      <div className="space-y-8 max-w-2xl">
        {policies.map((policy) => (
          <div key={policy.id} className="space-y-3 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-emerald-100 transition-colors">
                  {policy.icon}
                </div>
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                  {isGreek ? policy.titleEl : policy.titleEn}
                </h4>
             </div>
             <p className="text-slate-500 text-sm leading-relaxed font-medium italic ml-1">
               {isGreek ? policy.contentEl : policy.contentEn}
             </p>
          </div>
        ))}
      </div>

      {/* Institutional Footer */}
      <div className="pt-6 mt-6 border-t border-slate-50 flex justify-between items-center opacity-40">
         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
           GreenScale Compliance Engine v5.0
         </p>
         <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div className="w-2 h-2 rounded-full bg-amber-500" />
         </div>
      </div>
    </div>
  );
};

export default LegalSection;