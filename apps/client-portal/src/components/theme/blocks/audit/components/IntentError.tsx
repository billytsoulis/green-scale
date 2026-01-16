"use client";

import { ArrowRight } from "lucide-react";

/**
 * Audit Sub-component: IntentError
 * Path: src/components/theme/blocks/audit/components/IntentError.tsx
 */

interface Props {
  isGreek: boolean;
  onReturn: () => void;
}

export const IntentError = ({ isGreek, onReturn }: Props) => (
  <section className="py-40 bg-white flex justify-center px-6">
    <div className="max-w-xl w-full p-12 rounded-[3.5rem] bg-slate-50 border border-slate-100 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-sm">⚠️</div>
      <div className="space-y-3">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
          {isGreek ? 'Απαιτείται Αρχική Πρόθεση' : 'Intent Required'}
        </h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          {isGreek 
            ? 'Για να ξεκινήσετε τον έλεγχο, πρέπει πρώτα να ορίσετε τι εκτιμάτε περισσότερο στην αρχική σελίδα.' 
            : 'To begin the discovery audit, you must first define your primary values on the landing page.'}
        </p>
      </div>
      <button 
        onClick={onReturn}
        className="w-full py-6 bg-emerald-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all border-none cursor-pointer flex items-center justify-center gap-3 shadow-xl"
      >
        {isGreek ? 'Επιστροφη στην Αρχικη' : 'Return to Home'} <ArrowRight size={14} />
      </button>
    </div>
  </section>
);