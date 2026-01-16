"use client";

import React, { useState, useEffect, useMemo } from "react";

// --- Production Ready Imports (Commented for Canvas Environment) ---
import { useParams, useRouter } from "next/navigation";
import { ESGDial } from "@/components/dashboard/ESGDial";
import { bankingService } from "@/services/banking.service";
import { PortfolioIcon, AlertIcon } from "@repo/ui/icons";
import { useAuth } from "@/hooks/useAuth";
import { useDiscoveryStore } from "@/store/useDiscoveryStore";

/**
 * GreenScale Phase 2: Investor Cockpit (Client-Side Wealth View)
 * Path: apps/client-portal/src/app/[lang]/dashboard/page.tsx
 * Purpose: Personal wealth tracking for the individual investor.
 * Logic: Normalizes individual asset data to drive the SVG impact dial.
 */

export default function DashboardPage() {
  // --- Hooks & Context ---
  // @ts-ignore
  const { user, isLoading: authLoading } = useAuth();
  // @ts-ignore
  const { valueIntent } = useDiscoveryStore();

  // @ts-ignore
  const params = useParams();
  // @ts-ignore
  const router = useRouter();
  const lang = (params?.lang as string) || "en";
  const isGreek = lang === "el";

  // --- State ---
  const [assets, setAssets] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (user) {
        try {
          const results = await bankingService.syncAssets();
          if (isMounted) {
            setAssets(results);
            setSyncing(false);
          }
        } catch (err) {
          console.error("Asset Sync Failed", err);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Professional Normalization: Weighted Average Calculation
  const aggregateScore = useMemo(() => {
    if (assets.length === 0) return 0;
    const totalAUM = assets.reduce((sum, a) => sum + (a.value || 0), 0);
    const weightedSum = assets.reduce((sum, a) => sum + (a.esgScore * a.value || 0), 0);
    return Math.round(weightedSum / totalAUM);
  }, [assets]);

  if (authLoading || syncing)
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center space-y-6">
          <div className="w-10 h-10 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto shadow-sm" />
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
              {isGreek ? "ΣΥΓΧΡΟΝΙΣΜΟΣ ΣΥΝΕΔΡΙΑΣ..." : "Synchronizing Secure Session..."}
            </p>
            <p className="text-[9px] font-bold text-slate-300 italic uppercase tracking-tighter">
              {isGreek ? "ΣΥΝΔΕΣΗ ΜΕΣΩ ΠΥΛΗΣ REST..." : "Synchronizing via Secure REST Gateway..."}
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 lg:p-16 space-y-12" data-component="InvestorDashboard">
      {/* Header: Identity & Notifications */}
      <header className="flex justify-between items-center max-w-7xl mx-auto text-left">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none">
            {isGreek ? `Γεια σου, ${user?.name?.split(" ")[0]}` : `Welcome, ${user?.name?.split(" ")[0]}`}
          </h1>
          <p className="text-slate-500 font-medium text-lg italic">
            {isGreek ? "Διαχείριση για:" : "Managing for:"}{" "}
            <span className="text-emerald-700 font-bold not-italic">
              {valueIntent || (isGreek ? "Ηθική Ανάπτυξη" : "Ethical Growth")}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hidden md:block">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">
              Portfolio Tier
            </p>
            <p className="text-xs font-black text-emerald-700 uppercase">Professional Elite</p>
          </div>
          <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-all text-slate-400">
            <AlertIcon size={24} />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Impact Score Section */}
        <section className="lg:col-span-4 bg-white p-12 rounded-[4rem] border border-slate-100 shadow-[0_40px_80px_-20px_rgba(6,78,59,0.06)] flex flex-col items-center justify-between text-center min-h-[500px]">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
            {isGreek ? "ΚΑΤΑΣΤΑΣΗ ESG ΧΑΡΤΟΦΥΛΑΚΙΟΥ" : "ESG PORTFOLIO HEALTH"}
          </h3>
          <ESGDial score={aggregateScore} isGreek={isGreek} />

          <div className="mt-8 space-y-6 w-full">
            <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {isGreek ? "ΠΡΟΤΑΣΗ AI" : "AI RECOMMENDATION"}
              </p>
              <p className="text-md font-bold text-slate-900 leading-tight">
                {aggregateScore < 75
                  ? isGreek
                    ? "Εντοπίστηκε Απόκλιση: Απαιτείται Εξισορρόπηση"
                    : "Drift Detected: Rebalance Suggested"
                  : isGreek
                    ? "Το χαρτοφυλάκιο είναι πλήρως ευθυγραμμισμένο"
                    : "Portfolio Fully Aligned"}
              </p>
            </div>
            {aggregateScore < 75 && (
              <button
                // @ts-ignore
                onClick={() => router.push(`/${lang}/dashboard/rebalance`)}
                className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl active:scale-95 border-none cursor-pointer"
              >
                {isGreek ? "Εκκίνηση Εξισορρόπησης" : "Initiate Rebalance"}
              </button>
            )}
          </div>
        </section>

        {/* Right Column: Asset Breakdown Section */}
        <section className="lg:col-span-8 space-y-8">
          {/* AUM Summary Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-emerald-950 px-10 py-10 rounded-[3rem] shadow-2xl text-left gap-6 border border-emerald-800">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/10 rounded-[1.25rem] flex items-center justify-center text-emerald-400 shadow-inner">
                <PortfolioIcon size={28} />
              </div>
              <div>
                <h4 className="font-black text-white uppercase text-xs tracking-widest opacity-40">
                  {isGreek ? "ΣΥΝΟΛΙΚΑ ΥΠΟ ΔΙΑΧΕΙΡΙΣΗ" : "TOTAL ASSETS UNDER MANAGEMENT"}
                </h4>
                <p className="text-5xl font-black text-white tracking-tighter leading-none mt-2">
                  €{assets.reduce((s, a) => s + a.value, 0).toLocaleString()}
                </p>
              </div>
            </div>
            <button className="px-8 py-4 bg-emerald-500 text-emerald-950 rounded-2xl font-black text-[10px] uppercase tracking-widest border-none cursor-pointer hover:bg-white transition-all shadow-lg active:scale-95">
              {isGreek ? "+ ΣΥΝΔΕΣΗ ΝΕΑΣ ΤΡΑΠΕΖΑΣ" : "+ LINK INSTITUTION"}
            </button>
          </div>

          {/* Individual Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 text-left space-y-8 hover:shadow-xl hover:border-emerald-100 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h5 className="font-black text-slate-900 text-xl tracking-tight leading-none group-hover:text-emerald-900 transition-colors">
                      {asset.name}
                    </h5>
                    <p className="text-[10px] font-black text-slate-300 mt-2 uppercase tracking-widest">
                      {asset.sector} • {asset.type}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black border shadow-sm ${asset.esgScore > 70 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
                  >
                    {asset.esgScore}/100
                  </div>
                </div>

                <div className="flex items-end justify-between border-t border-slate-50 pt-6 relative z-10">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                    €{asset.value.toLocaleString()}
                  </p>
                  <button className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-emerald-600 transition-colors bg-transparent border-none cursor-pointer">
                    {isGreek ? "Λεπτομέρειες →" : "Details →"}
                  </button>
                </div>
                {/* Visual Glassmorphism Glow on Hover */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}