import { useState, useEffect } from "react";

/**
 * Institutional Intelligence: Governance Dashboard
 * Path: src/pages/intelligence/Governance/index.tsx
 * Purpose: Global oversight of all manual ESG score overrides.
 * UX: High-density audit table with qualitative expansion.
 */

import { motion } from "framer-motion";
import { History, User } from "lucide-react";
import { Badge } from "@repo/ui";

const GATEWAY_URL = "http://localhost:3005";

export default function GovernanceDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${GATEWAY_URL}/api/intelligence/logs`, {
           // In production, include the staff session token here
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error("Governance Handshake Failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    /* @ts-ignore */
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 text-left pb-20">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">Institutional Oversight</Badge>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">Governance <span className="text-emerald-600">Ledger</span></h1>
          <p className="text-slate-500 font-medium text-lg italic">Audit historical ESG modifications and compliance justifications.</p>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                <th className="px-10 py-6">Timestamp</th>
                <th className="px-8 py-6">Entity</th>
                <th className="px-8 py-6">Operator</th>
                <th className="px-8 py-6 text-center">Delta</th>
                <th className="px-10 py-6">Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-10 py-10"><div className="h-4 bg-slate-50 rounded-full w-full" /></td>
                  </tr>
                ))
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-emerald-50/10 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <History size={16} />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-slate-900 text-emerald-400 rounded-lg font-black text-xs uppercase shadow-sm">
                        {log.ticker}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <User size={16} /> {log.userName}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-slate-300 font-bold line-through">{log.previousScore}</span>
                        <span className="text-3xl font-light text-slate-200">→</span>
                        <span className="text-lg font-black text-emerald-600">{log.certifiedScore}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-sm text-slate-500 font-medium italic leading-relaxed max-w-md line-clamp-2 hover:line-clamp-none transition-all">
                        "{log.commentary}"
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={5} className="py-40 text-center border-t-0 bg-slate-50/50">
                      <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-[10px]">No Governance Events Recorded</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}