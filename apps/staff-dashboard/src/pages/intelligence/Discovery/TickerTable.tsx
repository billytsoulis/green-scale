/**
 * Institutional Intelligence: Discovery Data Table
 * Path: src/pages/intelligence/Discovery/TickerTable.tsx
 * Purpose: High-density visualization of search results with integrated pagination.
 * UX: Performance-optimized row rendering with motion-driven entry sequences.
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AnomalyIcon, ChevronLeft, ChevronRight } from "../shared/icons.tsx";
import { AnalyticsBadge } from "../components/AnalyticsBadge.tsx";
import type { ResearchResult } from "../shared/types.ts";

interface TickerTableProps {
  results: ResearchResult[];
  loading: boolean;
  total: number;
  currentPage: number;
  setPage: (page: number) => void;
  limit: number;
}

export const TickerTable = ({
  results,
  loading,
  total,
  currentPage,
  setPage,
  limit
}: TickerTableProps) => {

  const totalPages = Math.ceil(total / limit);

  return (
    <div 
      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden min-h-150 flex flex-col"
      data-component="TickerDiscoveryTable"
    >
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <th className="px-10 py-6 font-black">Company Entity</th>
              <th className="px-8 py-6 font-black">Sector</th>
              <th className="px-8 py-6 font-black">Mkt Cap ($B)</th>
              <th className="px-8 py-6 text-center font-black">Raw ESG</th>
              <th className="px-8 py-6 text-center font-black">AI Adjusted</th>
              <th className="px-8 py-6 font-black">Status</th>
              <th className="px-10 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              // Skeleton Rows for perceived performance
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  <td colSpan={7} className="px-10 py-10">
                    <div className="h-4 bg-slate-50 rounded-full w-full" />
                  </td>
                </tr>
              ))
            ) : (
              results.map((row, idx) => (
                /* @ts-ignore - Performance row entry */
                <motion.tr 
                  key={row.id || `${row.ticker}-${idx}`} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group hover:bg-emerald-50/20 transition-all cursor-default"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center font-black shadow-lg uppercase shrink-0">
                        {row.ticker}
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="font-black text-slate-900 leading-none mb-1 truncate">{row.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Last Audit: {row.last_audit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <AnalyticsBadge variant="info" className="bg-slate-50 text-slate-500">{row.sector}</AnalyticsBadge>
                  </td>
                  <td className="px-8 py-6 font-mono font-bold text-slate-600">
                    ${row.market_cap.toFixed(1)}B
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="font-black text-slate-300">{row.raw_score}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`font-black text-xl tracking-tighter ${row.ai_adjusted_score > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {row.ai_adjusted_score}
                      </span>
                      {row.esg_trend && (
                        <span className={`text-[8px] font-black ${row.esg_trend === 'UPWARD' ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {row.esg_trend}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {row.anomaly_detected ? (
                      <div className="flex items-center gap-2 text-red-500">
                        <AnomalyIcon />
                        <span className="text-[10px] font-black uppercase tracking-widest">Flagged Anomaly</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Stable</span>
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    {/* @ts-ignore */}
                    <Link 
                      to={`/intelligence/forge/${row.ticker}`}
                      className="inline-block no-underline"
                    >
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

      {/* Pagination Footer */}
      <footer className="px-10 py-8 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Showing <span className="text-slate-900">{(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, total)}</span> of {total.toLocaleString()} entities
        </p>
        
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-900 transition-all cursor-pointer shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft />
          </button>
          
          <button className="w-12 h-12 rounded-xl text-xs font-black bg-emerald-950 text-white shadow-sm cursor-default">
            {currentPage}
          </button>

          <button 
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-900 transition-all cursor-pointer shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default TickerTable;