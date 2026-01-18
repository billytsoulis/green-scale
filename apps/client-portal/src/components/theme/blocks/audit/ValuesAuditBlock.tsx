"use client";

import { useState } from "react";

// --- Production Ready Imports (Commented for Manual Handling) ---
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, RotateCcw } from "lucide-react";
import { SustainabilityIcon, ClientIcon, SettingsIcon } from "@repo/ui/icons";
import { useDiscoveryStore } from "@/store/useDiscoveryStore";
import { authClient } from "@/lib/auth-client";

import { IntentError } from "./components/IntentError";
import { AuditProgressHeader } from "./components/AuditHeader";
import { ResultsSummary } from "./components/ResultsSummary";

/**
 * GreenScale Phase 1: Values Audit Block (Main Orchestrator)
 * Path: apps/client-portal/src/components/theme/blocks/audit/ValuesAuditBlock.tsx
 */

interface Props { lang: "en" | "el"; }

export default function ValuesAuditBlock({ lang = "en" }: Props) {
  // @ts-ignore
  const router = useRouter();
  // @ts-ignore
  const { valueIntent, currentStep, scores, setScores, setStep } = useDiscoveryStore();
  
  const [result, setResult] = useState<any | null>(null);
  const [isPersisting, setIsPersisting] = useState(false);
  const isGreek = lang === "el";

  const GATEWAY_URL = "http://localhost:3005";

  const dictionary = {
    steps: [
      { id: "climate", pageTitle: isGreek ? "Προτεραιότητες Κλίματος" : "Climate Priorities", title: isGreek ? "Κλιματική Επείγουσα Ανάγκη" : "Climate Urgency", subtitle: isGreek ? "Πόσο επιθετικά πρέπει το κεφάλαιό σας;" : "How aggressively should your capital combat carbon emissions?", icon: <SustainabilityIcon />, field: "climate" as const },
      { id: "social", pageTitle: isGreek ? "Κοινωνικός Αντίκτυπος" : "Social Alignment", title: isGreek ? "Κοινωνική Δικαιοσύνη" : "Social Impact", subtitle: isGreek ? "Πόσο σημαντική είναι η εργασιακή ισότητα;" : "How important is labor equity and community health in your portfolio?", icon: <ClientIcon />, field: "social" as const },
      { id: "governance", pageTitle: isGreek ? "Εταιρική Διαφάνεια" : "Governance Ethics", title: isGreek ? "Ακεραιότητα Διακυβέρνησης" : "Governance Integrity", subtitle: isGreek ? "Απαιτείτε αυστηρούς ελέγχους;" : "Do you require strict corporate transparency and anti-corruption audits?", icon: <SettingsIcon />, field: "governance" as const }
    ],
    personas: {
      ECO_GUARDIAN: { name: isGreek ? "Ο Οικολογικός Φύλακας" : "The Eco-Guardian", description: isGreek ? "Προτεραιότητά σας είναι ο πλανήτης." : "You prioritize planetary health above all.", color: "bg-[#064e3b]", focus: isGreek ? "Ανανεώσιμες Πηγές" : "Renewable Energy" },
      SOCIAL_ARCHITECT: { name: isGreek ? "Ο Κοινωνικός Αρχιτέκτονας" : "The Social Architect", description: isGreek ? "Ο πλούτος πρέπει να χτίζει γέφυρες." : "You believe wealth should build bridges.", color: "bg-[#92400e]", focus: isGreek ? "Δίκαιο Εμπόριο" : "Fair Trade" },
      HOLISTIC_STRATEGIST: { name: isGreek ? "Ο Ολιστικός Στρατηγικός" : "The Holistic Strategist", description: isGreek ? "Αναζητάτε τέλεια ισορροπία." : "You seek perfect balance across all ESG pillars.", color: "bg-[#1e293b]", focus: isGreek ? "Διαφοροποιημένο ESG" : "Diversified ESG Portfolio" }
    }
  };

  /**
   * Technical Logic: Persistence Layer (JWT Secured)
   * Sends the persona and intent to the API Gateway for PostgreSQL storage.
   * Fix: Explicitly retrieving JWT and attaching to Authorization header.
   */
  const persistProfile = async (personaName: string) => {
    setIsPersisting(true);
    try {
      // 1. Retrieve the stateless JWT from the Better-Auth client
      // @ts-ignore
      const token = await authClient.getJWT();

      // 2. Perform the patch with both Bearer token and credentials for cross-origin resilience
      await fetch(`${GATEWAY_URL}/api/users/profile`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Phase 1 Persistence: Authorization added
        },
        credentials: "include", // Supports both Cookie and Header based validation
        body: JSON.stringify({
          valueIntent: valueIntent,
          persona: personaName,
          kycStep: 1 // Resets or starts KYC at step 1
        })
      });
    } catch (err) {
      console.error("[Audit Persistence Error] Sync failed:", err);
    } finally {
      setIsPersisting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < 2) {
      setStep(currentStep + 1);
    } else {
      const { climate, social } = scores;
      let selectedPersona;
      
      if (climate > 70 && social < 65) selectedPersona = dictionary.personas.ECO_GUARDIAN;
      else if (social > 70 && climate < 65) selectedPersona = dictionary.personas.SOCIAL_ARCHITECT;
      else selectedPersona = dictionary.personas.HOLISTIC_STRATEGIST;

      setResult(selectedPersona);
      
      // Phase 1 Persistence: Trigger authorized save to DB
      await persistProfile(selectedPersona.name);
    }
  };

  if (!valueIntent) return <IntentError isGreek={isGreek} onReturn={() => router.push(`/${lang}`)} />;

  if (result) {
    return (
      <section className="py-24 bg-white flex justify-center px-6">
        {/* @ts-ignore */}
        <motion.div className={`max-w-2xl w-full p-16 rounded-[4rem] text-white text-center space-y-12 shadow-2xl ${result.color} animate-in zoom-in duration-700`}>
          <div className="space-y-4">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40">{isGreek ? 'Αρχέτυπο Επενδυτή' : 'Investor Archetype Found'}</p>
            <h2 className="text-7xl font-black tracking-tighter leading-none">{result.name}</h2>
          </div>
          <p className="text-2xl text-white/90 font-medium italic leading-relaxed">"{result.description}"</p>
          
          <ResultsSummary scores={scores} isGreek={isGreek} />
          
          <div className="pt-4 space-y-10">
             <button 
                // @ts-ignore
                onClick={() => router.push(`/${lang}/onboarding/kyc`)}
                disabled={isPersisting}
                className="w-full px-10 py-6 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all border-none cursor-pointer shadow-2xl disabled:opacity-50"
             >
               {isPersisting ? (isGreek ? 'ΣΥΓΧΡΟΝΙΣΜΟΣ...' : 'SYNCHRONIZING...') : (isGreek ? 'Εκκίνηση Onboarding' : 'Begin Onboarding')}
             </button>
             <button onClick={() => setResult(null)} className="flex items-center gap-2 mx-auto text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors border-none bg-transparent cursor-pointer">
               <RotateCcw size={14} /> {isGreek ? 'Επαναφορα' : 'Reset'}
             </button>
          </div>
        </motion.div>
      </section>
    );
  }

  const currentData = dictionary.steps[currentStep];

  return (
    <section className="py-32 bg-[#FEFCF3] border-y border-slate-100 overflow-hidden px-6" data-component="ValuesAuditBlock">
      <div className="max-w-4xl mx-auto space-y-20">
        <AuditProgressHeader step={currentStep} total={3} isGreek={isGreek} intent={valueIntent} title={currentData.pageTitle} />
        <div className="relative bg-white p-16 rounded-[4.5rem] shadow-2xl border border-slate-100">
          <AnimatePresence mode="wait">
            {/* @ts-ignore */}
            <motion.div key={currentStep} className="space-y-16 animate-in slide-in-from-right-10 duration-500">
               <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left border-b border-slate-50 pb-12">
                  <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner">
                    {currentData.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">{currentData.title}</h3>
                    <p className="text-xl text-slate-400 font-medium leading-tight">{currentData.subtitle}</p>
                  </div>
               </div>
               <div className="space-y-12">
                  <input 
                    type="range" 
                    min="0" max="100" 
                    className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-800" 
                    value={scores[currentData.field]} 
                    onChange={(e) => setScores({ ...scores, [currentData.field]: parseInt(e.target.value) })} 
                  />
                  <div className="flex justify-center text-[10rem] font-black text-slate-900 opacity-[0.03] select-none absolute bottom-0 leading-none">
                     {scores[currentData.field]}
                  </div>
               </div>
               <div className="flex flex-col sm:flex-row justify-between items-center pt-12 border-t border-slate-50 gap-8">
                  <div className="flex items-center gap-6">
                    {currentStep > 0 && (
                      <button onClick={() => setStep(currentStep - 1)} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-800 transition-colors border-none bg-transparent cursor-pointer">
                        <ChevronLeft size={16} /> {isGreek ? 'Πισω' : 'Back'}
                      </button>
                    )}
                    <div className="flex gap-4">
                      {[0, 1, 2].map(i => <button key={i} onClick={() => setStep(i)} className={`h-2 rounded-full transition-all duration-700 border-none cursor-pointer ${i === currentStep ? 'bg-emerald-800 w-16' : 'bg-slate-100 w-2 hover:bg-slate-200'}`} />)}
                    </div>
                  </div>
                  <button 
                    onClick={handleNext} 
                    className="w-full sm:w-auto px-12 py-6 bg-emerald-950 text-white rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-emerald-800 transition-all border-none cursor-pointer shadow-xl active:scale-95 group"
                  >
                    {currentStep === 2 ? (isGreek ? "Ολοκληρωση" : "Finalize Audit") : (isGreek ? "Επομενο" : "Continue")} 
                    <ArrowRight size={18} />
                  </button>
               </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}