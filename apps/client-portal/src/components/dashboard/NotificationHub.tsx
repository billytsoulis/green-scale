"use client";

import React, { useState, useEffect } from "react";

/**
 * GreenScale Phase 5: Notification Signal Hub
 * Path: greenscale/apps/client-portal/src/components/dashboard/NotificationHub.tsx
 * Purpose: Provides real-time feedback on ledger events and system updates.
 * Logic: 
 * 1. Manages a list of "Signals" (Notifications).
 * 2. Visual "Unread" pulse indicator.
 * 3. Animated dropdown list with localized content.
 */

// --- Production Ready Imports (Uncomment in local IDE) ---
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, FileText, TrendingUp, X } from "lucide-react";
import { useRouter } from "next/navigation";

// --- Internal Mocks for Canvas Preview Stability ---
// @ts-ignore
// const motion = {
//   div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
// };
// // @ts-ignore
// const AnimatePresence = ({ children }: any) => <>{children}</>;
// // @ts-ignore
// const Bell = ({ size }: any) => <span>🔔</span>;
// // @ts-ignore
// const CheckCircle2 = ({ size, className }: any) => <span className={className}>✓</span>;
// // @ts-ignore
// const FileText = ({ size, className }: any) => <span className={className}>📄</span>;
// // @ts-ignore
// const TrendingUp = ({ size, className }: any) => <span className={className}>📈</span>;
// // @ts-ignore
// const X = ({ size }: any) => <span>✕</span>;

interface Signal {
  id: string;
  type: "TRANSACTION" | "REPORT" | "MILESTONE";
  titleEn: string;
  titleEl: string;
  timestamp: string;
  isRead: boolean;
}

export const NotificationHub = ({ lang }: { lang: string }) => {
  const isGreek = lang === "el";
  const [isOpen, setIsOpen] = useState(false);
  const [signals, setSignals] = useState<Signal[]>([
    {
      id: "1",
      type: "REPORT",
      titleEn: "Q1 Impact Statement Ready",
      titleEl: "Η Αναφορά Αντικτύπου Q1 είναι έτοιμη",
      timestamp: "2m ago",
      isRead: false
    },
    {
      id: "2",
      type: "MILESTONE",
      titleEn: "Solar Ark reached 95% Funding",
      titleEl: "Η Ηλιακή Κιβωτός έφτασε το 95%",
      timestamp: "1h ago",
      isRead: false
    },
    {
      id: "3",
      type: "TRANSACTION",
      titleEn: "Portfolio Rebalance Successful",
      titleEl: "Επιτυχής Εξισορρόπηση Χαρτοφυλακίου",
      timestamp: "Yesterday",
      isRead: true
    }
  ]);

  const hasUnread = signals.some(s => !s.isRead);

  const markAllAsRead = () => {
    setSignals(signals.map(s => ({ ...s, isRead: true })));
  };

  const toggleDropdown = () => {
    if (!isOpen && hasUnread) {
      // Logic: Mark as read when opened in a real app
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" data-component="NotificationHub">
      {/* Trigger Button */}
      <button 
        onClick={toggleDropdown}
        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-all text-slate-400 relative"
      >
        <Bell size={24} />
        {hasUnread && (
          <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            {/* @ts-ignore */}
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-95 bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 z-50 overflow-hidden text-left"
            >
              <header className="p-6 pb-4 border-b border-slate-50 flex justify-between items-center">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                  {isGreek ? "Ειδοποιήσεις" : "System Signals"}
                </h4>
                <button 
                  onClick={markAllAsRead}
                  className="text-[9px] font-black uppercase text-emerald-600 hover:text-emerald-800 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {isGreek ? "ΑΝΑΓΝΩΣΗ ΟΛΩΝ" : "MARK ALL READ"}
                </button>
              </header>

              <div className="max-h-100 overflow-y-auto">
                {signals.map((signal) => (
                  <div 
                    key={signal.id}
                    className={`p-6 border-b border-slate-50 flex gap-4 transition-colors hover:bg-slate-50/50 cursor-pointer ${!signal.isRead ? 'bg-emerald-50/20' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      signal.type === 'TRANSACTION' ? 'bg-emerald-100 text-emerald-600' : 
                      signal.type === 'REPORT' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {signal.type === 'TRANSACTION' && <CheckCircle2 size={18} />}
                      {signal.type === 'REPORT' && <FileText size={18} />}
                      {signal.type === 'MILESTONE' && <TrendingUp size={18} />}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm leading-tight ${!signal.isRead ? 'font-black text-slate-900' : 'font-medium text-slate-500'}`}>
                        {isGreek ? signal.titleEl : signal.titleEn}
                      </p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                        {signal.timestamp}
                      </p>
                    </div>

                    {!signal.isRead && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                    )}
                  </div>
                ))}
              </div>

              <footer className="p-4 bg-slate-50/50 text-center">
                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-900 transition-colors bg-transparent border-none cursor-pointer">
                  {isGreek ? "ΠΡΟΒΟΛΗ ΟΛΩΝ" : "View Archive"}
                </button>
              </footer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};