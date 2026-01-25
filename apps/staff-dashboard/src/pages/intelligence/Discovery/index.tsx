/**
 * Institutional Intelligence: Discovery Entry Point
 * Path: src/pages/intelligence/Discovery/index.tsx
 * Purpose: Orchestrates the high-speed ticker search and filtering ecosystem.
 * Logic: Leverages 'useDiscovery' for Elasticsearch state and delegates 
 * complex rendering to atomic sub-components.
 */

import { motion } from "framer-motion";
import { useDiscovery } from "./useDiscovery.ts";
import { SearchBar } from "./SearchBar.tsx";
import { TickerTable } from "./TickerTable.tsx";
import { DiscoveryIcon } from "../shared/icons.tsx";

export default function IntelligenceDiscovery() {
  const {
    searchTerm,
    setSearchTerm,
    activeSector,
    setActiveSector,
    currentPage,
    setPage,
    results,
    total,
    loading,
    error,
    limit
  } = useDiscovery();

  const sectors = ["ALL", "Technology", "Renewable Energy", "Financials", "Healthcare", "Industrial", "Utilities"];

  return (
    /* @ts-ignore - Orchestrating the institutional entrance sequence */
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-10 text-left"
    >
      {/* 1. Module Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
               Elasticsearch Cluster: Operational
             </p>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
            Ticker Discovery
          </h1>
          <p className="text-slate-500 font-medium text-lg italic">
            Fuzzy-search and vector-filtering across the 10,000 ticker universe.
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Total Indexed</p>
              <p className="text-lg font-black text-slate-900 leading-none">
                {total.toLocaleString()} <span className="text-xs text-slate-400 font-bold tracking-tight uppercase ml-1">Records</span>
              </p>
           </div>
        </div>
      </header>

      {/* 2. Error Handling (Logic Awareness) */}
      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 flex items-center gap-4 animate-in slide-in-from-top-4">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest">Inference Engine Error</p>
            <p className="font-bold text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* 3. Search & Sector Controls (Delegated Component) */}
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeSector={activeSector}
        setActiveSector={setActiveSector}
        sectors={sectors}
      />

      {/* 4. The Big Data Table (Delegated Component) */}
      <TickerTable 
        results={results}
        loading={loading}
        total={total}
        currentPage={currentPage}
        setPage={setPage}
        limit={limit}
      />

      {/* Global Status Overlay */}
      <div className="fixed bottom-10 right-10 flex flex-col items-end gap-3 z-30 pointer-events-none">
         <div className="px-5 py-3 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <div className="flex items-center gap-2">
              <DiscoveryIcon />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                Live Index Synchronized
              </span>
            </div>
         </div>
      </div>
    </motion.div>
  );
}