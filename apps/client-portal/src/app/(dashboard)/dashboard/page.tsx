"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";

/**
 * Staff Engineer UI Note:
 * This is the primary protected route. We use a grid layout 
 * to show high-level ESG metrics and portfolio performance.
 */

export default function DashboardPage() {
  // const { data: session } = authClient.useSession();

  return (
    <div className="min-h-screen bg-[#FEFCF3] p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex justify-between items-end">
          <div>
            <p className="text-emerald-700 font-bold tracking-widest text-xs uppercase mb-2">Portfolio Overview</p>
            <h1 className="text-4xl font-extrabold text-slate-900">
              Welcome back, { /* session?.user?.name || */ "Investor" }
            </h1>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              Download Report
            </button>
            <button className="px-6 py-3 bg-emerald-800 text-white rounded-2xl text-sm font-bold hover:bg-emerald-900 transition-all shadow-md">
              Invest Funds
            </button>
          </div>
        </header>

        {/* Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Value */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium mb-1">Total Assets</p>
            <h3 className="text-3xl font-bold text-slate-900">€1,248,500.00</h3>
            <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              +12.4% this year
            </div>
          </div>

          {/* ESG Score */}
          <div className="bg-emerald-900 p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-emerald-300 text-sm font-medium mb-1">Impact Score</p>
              <h3 className="text-3xl font-bold text-white">84 / 100</h3>
              <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-bold">
                Level: "Eco-Guardian"
              </div>
            </div>
            {/* Abstract background leaf icon */}
            <svg className="absolute -right-8 -bottom-8 text-emerald-800/50 w-48 h-48 transform -rotate-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            </svg>
          </div>

          {/* Carbon Offset */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium mb-1">Carbon Sequestered</p>
            <h3 className="text-3xl font-bold text-slate-900">1,420 Tons</h3>
            <div className="mt-4 text-slate-400 text-xs font-medium">
              Equivalent to 23,400 trees planted.
            </div>
          </div>
        </div>

        {/* Recent Activity / Chart Placeholder */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h4 className="font-bold text-slate-900">Investment Performance</h4>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">1M</span>
              <span className="px-3 py-1 bg-emerald-100 rounded-full text-[10px] font-bold text-emerald-700">6M</span>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">1Y</span>
            </div>
          </div>
          <div className="h-64 bg-slate-50/50 flex items-center justify-center">
             <div className="text-slate-300 flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                <p className="text-sm font-medium">Interactive Graph Loading...</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}