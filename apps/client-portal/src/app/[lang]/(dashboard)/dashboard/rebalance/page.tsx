"use client";

import React, { useState, useEffect, useMemo } from "react";

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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as string) || "en";
  const isGreek = lang === "el";

  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [success, setSuccess] = useState(false);

  const GATEWAY_URL = "http://localhost:3005";

  /**
   * Helper: retrieveToken
   * Standard Phase 2 Bridge implementation for secure cross-origin requests.
   */
  const retrieveToken = async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/auth/get-jwt`, { credentials: "include" });
      if (res.ok) {
        const { token } = await res.json();
        return token;
      }
      return localStorage.getItem("gs-auth.token");
    } catch (e) { return localStorage.getItem("gs-auth.token"); }
  };

  /**
   * 1. Hydrate Current Portfolio
   * Fetches real assets from PostgreSQL to determine the starting point of the pivot.
   */
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchCurrentState = async () => {
      try {
        const token = await retrieveToken();
        if (!token) return;

        const res = await fetch(`${GATEWAY_URL}/api/banking/sync`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setAssets(data.assets || []);
        }
      } catch (err) {
        console.error("[Rebalance] Hydration failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentState();
  }, [isAuthenticated, authLoading]);

  /**
   * 2. The Ethical Proposal (Frontend Simulation)
   * In a production environment, this delta would be calculated by the Python AI service.
   * Here, we identify assets with ESG scores < 50 for divestment.
   */
  const proposal = useMemo(() => {
    if (assets.length === 0) return null;

    const toSell = assets.filter(a => (a.esgScore || 0) < 50);
    const totalDivestmentValue = toSell.reduce((sum, a) => sum + parseFloat(a.value), 0);
    
    // Calculate Current Weighted Score
    const totalValue = assets.reduce((sum, a) => sum + parseFloat(a.value), 0);
    const currentWeightedSum = assets.reduce((sum, a) => sum + (parseFloat(a.value) * (a.esgScore || 0)), 0);
    const currentScore = Math.round(currentWeightedSum / totalValue);

    // Mock "Green" Replacements
    const greenAssets = [
      { name: "Solar Ark Messinia", type: "ETF", value: totalDivestmentValue * 0.6, esgScore: 94, sector: "Renewables" },
      { name: "Aegean Wind IV", type: "BOND", value: totalDivestmentValue * 0.4, esgScore: 88, sector: "Renewables" }
    ];

    // Calculate Projected Score
    const remainingAssets = assets.filter(a => (a.esgScore || 0) >= 50);
    const remainingSum = remainingAssets.reduce((sum, a) => sum + (parseFloat(a.value) * (a.esgScore || 0)), 0);
    const greenSum = greenAssets.reduce((sum, a) => sum + (a.value * a.esgScore), 0);
    const projectedScore = Math.round((remainingSum + greenSum) / totalValue);

    return {
      currentScore,
      projectedScore,
      divest: toSell,
      acquire: greenAssets,
      totalValuePivot: totalDivestmentValue
    };
  }, [assets]);

  /**
   * 3. Execution (The Transaction)
   * Commits the changes to the PostgreSQL ledger atomically.
   */
  const handleExecute = async () => {
    if (!proposal) return;
    setExecuting(true);

    try {
      const token = await retrieveToken();
      if (!token) throw new Error("Security token missing.");

      const res = await fetch(`${GATEWAY_URL}/api/banking/rebalance`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          sellAssetIds: proposal.divest.map(a => a.id),
          newAssets: proposal.acquire,
          previousScore: proposal.currentScore,
          newScore: proposal.projectedScore,
          totalValuePivot: proposal.totalValuePivot
        })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        console.error("[Rebalance] Transaction rejected by Gateway.");
      }
    } catch (err) {
      console.error("[Rebalance] Network failure:", err);
    } finally {
      setExecuting(false);
    }
  };

  if (authLoading || loading) return (
    <div className="h-screen flex items-center justify-center bg-white font-sans">
       <div className="text-center space-y-6">
         <div className="w-12 h-12 border-t-2 border-emerald-600 rounded-full animate-spin mx-auto" />
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">AI Optimization Engine Active...</p>
       </div>
    </div>
  );

  if (success) return (
    <div className="h-screen flex items-center justify-center bg-emerald-950 px-6 text-center font-sans">
       <div className="max-w-md w-full space-y-10 animate-in zoom-in duration-700">
          <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto text-white text-4xl shadow-2xl">✨</div>
          <div className="space-y-3">
            <h2 className="text-5xl font-serif font-black text-white">{isGreek ? 'Η Κληρονομιά Κατοχυρώθηκε.' : 'Legacy Secured.'}</h2>
            <p className="text-emerald-100/60 font-medium">Your portfolio has been synchronized with the new ethical targets.</p>
          </div>
          <button 
            onClick={() => router.push(`/${lang}/dashboard`)} 
            className="w-full py-6 bg-white text-emerald-900 rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer border-none shadow-2xl active:scale-95 transition-all"
          >
            {isGreek ? 'ΕΠΙΣΤΡΟΦΗ ΣΤΟ ΚΕΝΤΡΟ ΕΛΕΓΧΟΥ' : 'RETURN TO COCKPIT'}
          </button>
       </div>
    </div>
  );

  if (!proposal || proposal.divest.length === 0) return (
    <div className="h-screen flex items-center justify-center bg-[#f8fafc] px-6 text-center">
       <div className="max-w-md space-y-6">
          <div className="text-4xl opacity-20">🛡️</div>
          <h2 className="text-2xl font-black text-slate-900 uppercase">Portfolio Fully Aligned</h2>
          <p className="text-slate-500 font-medium">No carbon-heavy assets detected for divestment. Your current holdings match your ethical profile.</p>
          <button onClick={() => router.push(`/${lang}/dashboard`)} className="px-8 py-4 bg-emerald-900 text-white rounded-xl font-bold border-none cursor-pointer">Back to Dashboard</button>
       </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 lg:p-16 space-y-12 font-sans" data-component="RebalanceView">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8 text-left">
        <div className="space-y-3">
           <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-200">
             {isGreek ? 'ΠΡΟΤΑΣΗ AI ΕΞΙΣΟΡΡΟΠΗΣΗΣ' : 'AI REBALANCE PROPOSAL'}
           </span>
           <h1 className="text-6xl font-serif font-black text-slate-900 tracking-tight leading-none">
             {isGreek ? 'Η Ηθική Στροφή' : 'The Ethical Pivot'}
           </h1>
        </div>
        
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex items-center gap-10">
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Current</p>
              <p className="text-4xl font-black text-red-500 tracking-tighter">{proposal.currentScore}</p>
           </div>
           <div className="text-slate-200 text-3xl">→</div>
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Projected</p>
              <p className="text-4xl font-black text-emerald-500 tracking-tighter">{proposal.projectedScore}</p>
           </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
        {/* SELL COLUMN */}
        <section className="space-y-6">
           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] px-4">{isGreek ? 'ΕΚΠΟΙΗΣΗ' : 'DIVESTMENT'}</h3>
           <div className="space-y-4">
              {proposal.divest.map((trade: any, i: number) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:border-red-100 transition-all">
                   <div>
                     <p className="font-black text-slate-900 text-xl leading-none">{trade.name}</p>
                     <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Score: {trade.esgScore} • Divest Order</p>
                   </div>
                   <p className="text-2xl font-black text-red-600">-€{parseFloat(trade.value).toLocaleString()}</p>
                </div>
              ))}
           </div>
        </section>

        {/* BUY COLUMN */}
        <section className="space-y-6">
           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] px-4">{isGreek ? 'ΑΠΟΚΤΗΣΗ' : 'ACQUISITION'}</h3>
           <div className="space-y-4">
              {proposal.acquire.map((trade: any, i: number) => (
                <div key={i} className="bg-emerald-950 p-8 rounded-[2.5rem] border border-emerald-800 shadow-2xl flex justify-between items-center group relative overflow-hidden">
                   <div className="relative z-10">
                     <p className="font-black text-white text-xl leading-none">{trade.name}</p>
                     <p className="text-[10px] font-black text-emerald-400 mt-2 uppercase">Score: {trade.esgScore} • Buy Order</p>
                   </div>
                   <p className="text-2xl font-black text-emerald-400 relative z-10">+€{trade.value.toLocaleString()}</p>
                   <div className="absolute top-0 right-0 p-6 opacity-10 text-4xl">🌿</div>
                </div>
              ))}
           </div>
        </section>
      </div>

      <footer className="max-w-2xl mx-auto pt-16 flex flex-col items-center gap-8 pb-32">
         <div className="flex gap-4 w-full">
            <button 
              onClick={() => router.push(`/${lang}/dashboard`)} 
              className="flex-1 py-6 bg-white border border-slate-200 text-slate-400 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] cursor-pointer hover:bg-slate-50 transition-all"
            >
              {isGreek ? 'ΑΚΥΡΩΣΗ' : 'CANCEL'}
            </button>
            <button 
              onClick={handleExecute} 
              disabled={executing} 
              className="flex-[2] py-6 bg-emerald-950 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-800 transition-all border-none cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {executing ? (isGreek ? 'ΕΚΤΕΛΕΣΗ...' : 'EXECUTING...') : (isGreek ? 'ΕΠΙΒΕΒΑΙΩΣΗ' : 'CONFIRM PIVOT')}
            </button>
         </div>
      </footer>
    </main>
  );
}