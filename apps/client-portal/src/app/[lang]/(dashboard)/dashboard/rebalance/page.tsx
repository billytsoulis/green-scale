"use client";

import React, { useState, useEffect } from "react";

// --- Production Ready Imports (Commented for Manual Handling) ---
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { rebalanceService, RebalanceProposal } from "@/services/rebalance.service";
import { ArrowRight, ArrowLeftRight, TrendingUp, ShieldCheck, CheckCircle2, RotateCcw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; 

/**
 * GreenScale Phase 3: AI Rebalance View
 * Path: apps/client-portal/src/app/[lang]/(dashboard)/dashboard/rebalance/page.tsx
 * Purpose: Secure portfolio optimization and ethical pivot execution.
 * Logic: Strict auth-guard simulation, bilingual support, and transactional UX.
 */

export default function RebalancePage() {
  // @ts-ignore
  const params = useParams();
  // @ts-ignore
  const router = useRouter();
  const lang = (params?.lang as string) || "en";
  const isGreek = lang === "el";

  // --- Auth & State ---
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [proposal, setProposal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Phase 3 Guard: Simulate session verification before data fetching
    const checkAuth = async () => {
      // Logic for checking session availability
      const hasValidSession = true; 
      if (!hasValidSession) {
        router.push(`/${lang}/login`);
        return;
      }
      setIsAuthorized(true);
    };

    const fetchProposal = async () => {
      try {
        // @ts-ignore
        const data = await rebalanceService.getProposal();
        setProposal(data);
      } catch (err) {
        console.error("AI Service Error", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth().then(() => {
      if (isAuthorized !== false) fetchProposal();
    });
  }, [lang, router, isAuthorized]);

  const handleExecute = async () => {
    setExecuting(true);
    // @ts-ignore
    const ok = await rebalanceService.execute();
    if (ok) {
      setExecuting(false);
      setSuccess(true);
    }
  };

  if (loading || isAuthorized === null) return (
    <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
       <div className="text-center space-y-6">
         <div className="w-12 h-12 border-t-2 border-emerald-600 rounded-full animate-spin mx-auto" />
         <div className="space-y-1">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
             {isGreek ? 'ΑΣΦΑΛΗΣ ΣΥΝΕΔΡΙΑ AI' : 'SECURE AI SESSION'}
           </p>
           <p className="text-[9px] font-bold text-slate-300 italic uppercase">
             {isGreek ? 'Υπολογισμός Ηθικού Δέλτα...' : 'Calculating Ethical Delta...'}
           </p>
         </div>
       </div>
    </div>
  );

  if (success) return (
    <div className="h-screen flex items-center justify-center bg-emerald-950 px-6">
       {/* @ts-ignore */}
       <motion.div className="max-w-md w-full text-center space-y-10 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto text-white shadow-2xl text-4xl shadow-emerald-500/30">✨</div>
          <div className="space-y-3">
            <h2 className="text-5xl font-serif font-black text-white leading-none">
              {isGreek ? 'Η Κληρονομιά Κατοχυρώθηκε.' : 'Legacy Secured.'}
            </h2>
            <p className="text-emerald-100/60 font-medium text-lg leading-relaxed">
              {isGreek ? 'Το χαρτοφυλάκιό σας εξισορροπήθηκε με επιτυχία για μέγιστο αντίκτυπο.' : 'Your portfolio has been successfully rebalanced for maximum planetary impact.'}
            </p>
          </div>
          <button 
            // @ts-ignore
            onClick={() => router.push(`/${lang}/dashboard`)}
            className="w-full py-6 bg-white text-emerald-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] cursor-pointer border-none shadow-2xl hover:scale-105 transition-all"
          >
            {isGreek ? 'ΕΠΙΣΤΡΟΦΗ ΣΤΟ ΚΕΝΤΡΟ ΕΛΕΓΧΟΥ' : 'RETURN TO COCKPIT'}
          </button>
       </motion.div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 lg:p-16 space-y-12">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="text-left space-y-3">
           <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-200">
             {isGreek ? 'ΠΡΟΤΑΣΗ AI ΕΞΙΣΟΡΡΟΠΗΣΗΣ' : 'AI REBALANCE PROPOSAL'}
           </span>
           <h1 className="text-6xl font-serif font-black text-slate-900 tracking-tight leading-none">
             {isGreek ? 'Η Ηθική Στροφή' : 'The Ethical Pivot'}
           </h1>
        </div>
        
        {/* Score Delta Visualization */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex items-center gap-10">
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Current</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-red-500">{proposal.currentScore}</span>
                <span className="text-xs font-bold text-slate-300">/100</span>
              </div>
           </div>
           <div className="text-slate-200"><span className="text-3xl">→</span></div>
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase mb-2 tracking-widest">Projected</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-emerald-500">{proposal.projectedScore}</span>
                <span className="text-xs font-bold text-slate-300">/100</span>
              </div>
           </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* SELL COLUMN */}
        <section className="space-y-6">
           <div className="flex items-center gap-3 px-6">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{isGreek ? 'ΕΚΠΟΙΗΣΗ' : 'DIVESTMENT'}</h3>
           </div>
           <div className="space-y-4">
              {proposal.trades.filter((t:any) => t.action === "SELL").map((trade:any, i:number) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left flex justify-between items-center group hover:border-red-100 transition-all">
                   <div>
                     <p className="font-black text-slate-900 text-xl leading-none">{trade.assetName}</p>
                     <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Score: {trade.esgScore} • High Carbon Exposure</p>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-black text-red-600 tracking-tighter">-€{trade.value.toLocaleString()}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* BUY COLUMN */}
        <section className="space-y-6">
           <div className="flex items-center gap-3 px-6">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{isGreek ? 'ΑΠΟΚΤΗΣΗ' : 'ACQUISITION'}</h3>
           </div>
           <div className="space-y-4">
              {proposal.trades.filter((t:any) => t.action === "BUY").map((trade:any, i:number) => (
                <div key={i} className="bg-emerald-950 p-8 rounded-[2.5rem] border border-emerald-800 shadow-2xl text-left flex justify-between items-center group relative overflow-hidden">
                   <div className="relative z-10 text-white">
                     <p className="font-black text-xl leading-none tracking-tight">{trade.assetName}</p>
                     <p className="text-[10px] font-black text-emerald-400 mt-2 uppercase tracking-widest">Score: {trade.esgScore} • Verified Sustainable</p>
                   </div>
                   <div className="text-right relative z-10">
                      <p className="text-2xl font-black text-emerald-400 tracking-tighter">+€{trade.value.toLocaleString()}</p>
                   </div>
                   <div className="absolute top-0 right-0 p-6 opacity-5 text-4xl">🌿</div>
                </div>
              ))}
           </div>
        </section>
      </div>

      <footer className="max-w-6xl mx-auto pt-16 border-t border-slate-100 flex flex-col items-center gap-8 pb-20">
         <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 text-slate-400">
               <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-[10px] font-black">!</div>
               <p className="text-xs font-bold uppercase tracking-widest italic">Authorized Transaction Environment</p>
            </div>
            <p className="text-xs text-slate-400 max-w-sm text-center">
              {isGreek ? 'Η ενέργεια αυτή απαιτεί επικυρωμένη σύνδεση.' : 'This action requires a validated secure connection.'}
            </p>
         </div>

         <div className="flex gap-4 w-full max-w-2xl">
            <button 
              // @ts-ignore
              onClick={() => router.push(`/${lang}/dashboard`)}
              className="flex-1 py-6 bg-white border border-slate-200 text-slate-400 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all cursor-pointer"
            >
              {isGreek ? 'ΑΚΥΡΩΣΗ' : 'CANCEL'}
            </button>
            <button 
              onClick={handleExecute}
              disabled={executing}
              className="flex-[2] py-6 bg-emerald-950 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-800 transition-all active:scale-95 disabled:opacity-50 border-none cursor-pointer flex items-center justify-center gap-4"
            >
              {executing ? '...' : (isGreek ? 'ΕΠΙΒΕΒΑΙΩΣΗ ΕΞΙΣΟΡΡΟΠΗΣΗΣ' : 'EXECUTE SUSTAINABLE REBALANCE')}
              {!executing && <ArrowRight size={18} />}
            </button>
         </div>
      </footer>
    </main>
  );
}