"use client";

import { useState, useEffect } from "react";

/**
 * Institutional Ticker Discovery (Phase 6)
 * Path: apps/staff-dashboard/src/pages/intelligence/Discovery.tsx
 * Purpose: High-speed analytical search interface for the 10,000-ticker universe.
 * Logic: Interfaces with Elasticsearch via the Python ML Engine.
 */

import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import { Badge } from "@repo/ui";

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const AnomalyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default function IntelligenceDiscovery() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSector, setActiveSector] = useState("ALL");
  
  // Big Data Mock (Representing a subset of the 10,000 records)
  const [results, setResults] = useState<any[]>([]);

  const sectors = ["ALL", "Technology", "Renewable Energy", "Financials", "Healthcare", "Industrial", "Utilities"];

  useEffect(() => {
    // Logic: In prod, this calls POST http://localhost:8000/ml/search 
    // using the Elasticsearch fuzzy match query.
    const simulateFetch = () => {
      setLoading(true);
      setTimeout(() => {
        const mockData = Array.from({ length: 10 }).map((_, i) => ({
          id: `t-${i}`,
          ticker: ["AAPL", "TSLA", "MSFT", "XOM", "ORCL", "NEST", "VWS", "ENEL", "SAP", "FSLR"][i] || "UNKN",
          name: ["Apple Inc.", "Tesla", "Microsoft", "Exxon", "Oracle", "Nestle", "Vestas", "Enel", "SAP SE", "First Solar"][i],
          sector: i % 2 === 0 ? "Technology" : "Renewable Energy",
          market_cap: (Math.random() * 500).toFixed(2),
          esg_score: 20 + Math.random() * 70,
          ai_adjusted: 20 + Math.random() * 70,
          anomaly: Math.random() > 0.8
        }));
        setResults(mockData);
        setLoading(false);
      }, 600);
    };

    simulateFetch();
  }, [searchTerm, activeSector, currentPage]);

  return (
    <div className="animate-in fade-in duration-700 space-y-10 text-left">
      {/* 1. Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Elasticsearch Node: Active</p>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">Ticker Discovery</h1>
          <p className="text-slate-500 font-medium text-lg italic">Fuzzy-search and multi-dimensional filtering across the company universe.</p>
        </div>
        
        <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Index Count</p>
              <p className="text-lg font-black text-slate-900 leading-none">10,000 <span className="text-xs text-slate-400 font-bold tracking-tight">Records</span></p>
           </div>
        </div>
      </header>

      {/* 2. Unified Search & Filter Control Bar */}
      <section className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
           <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
              <SearchIcon />
           </div>
           <input 
             type="text" 
             placeholder="Search by Ticker, Name, or ISIN..."
             className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[1.8rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-bold text-slate-900 shadow-inner"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
           {sectors.map(sector => (
             <button 
               key={sector}
               onClick={() => setActiveSector(sector)}
               className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer border-none ${
                 activeSector === sector 
                   ? 'bg-emerald-950 text-white shadow-lg' 
                   : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
               }`}
             >
               {sector}
             </button>
           ))}
        </div>
      </section>

      {/* 3. The Big Data Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden min-h-150 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                <th className="px-10 py-6">Company Entity</th>
                <th className="px-8 py-6">Sector</th>
                <th className="px-8 py-6">Mkt Cap ($B)</th>
                <th className="px-8 py-6 text-center">Raw ESG</th>
                <th className="px-8 py-6 text-center">AI Adjusted</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-10 py-10">
                      <div className="h-4 bg-slate-50 rounded-full w-full" />
                    </td>
                  </tr>
                ))
              ) : (
                results.map((row) => (
                  /* @ts-ignore */
                  <motion.tr 
                    key={row.id} 
                    className="group hover:bg-emerald-50/20 transition-all cursor-default"
                  >
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center font-black shadow-lg">
                             {row.ticker}
                          </div>
                          <div className="text-left">
                             <p className="font-black text-slate-900 leading-none mb-1">{row.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Entity UUID: {row.id}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <Badge variant="info">{row.sector}</Badge>
                    </td>
                    <td className="px-8 py-6 font-mono font-bold text-slate-600">
                       ${row.market_cap}
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="font-black text-slate-300">{Math.round(row.esg_score)}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`font-black text-xl tracking-tighter ${row.ai_adjusted > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                         {Math.round(row.ai_adjusted)}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       {row.anomaly ? (
                         <div className="flex items-center gap-2 text-red-500">
                            <AnomalyIcon />
                            <span className="text-[10px] font-black uppercase tracking-widest">Anomaly</span>
                         </div>
                       ) : (
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Stable</span>
                       )}
                    </td>
                    <td className="px-10 py-6 text-right">
                       {/* Link to Ticker Forge (CRUD) */}
                       {/* @ts-ignore */}
                       <Link to={`/intelligence/forge/${row.ticker}`}>
                          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-900 hover:border-emerald-900 hover:bg-emerald-50/30 transition-all cursor-pointer shadow-sm active:scale-95">
                             Open Forge
                          </button>
                       </Link>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Table Pagination Footer */}
        <footer className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             Showing <span className="text-slate-900">1-10</span> of 10,000 Institutional Tickers
           </p>
           
           <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-900 transition-all cursor-pointer shadow-sm"
              >
                ←
              </button>
              {[1, 2, 3].map(p => (
                <button 
                  key={p} 
                  onClick={() => setCurrentPage(p)}
                  className={`w-12 h-12 rounded-xl text-xs font-black transition-all cursor-pointer border-none shadow-sm ${
                    currentPage === p ? 'bg-emerald-950 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <span className="flex items-center px-4 text-slate-300 font-black">...</span>
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-900 transition-all cursor-pointer shadow-sm"
              >
                →
              </button>
           </div>
        </footer>
      </div>

      {/* Global Cluster Status Overlay (Conceptual) */}
      <div className="fixed bottom-10 right-10 flex flex-col items-end gap-3 z-30">
         <div className="px-5 py-3 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-4 duration-1000">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Big-Data Sync: 100%</span>
         </div>
      </div>
    </div>
  );
}