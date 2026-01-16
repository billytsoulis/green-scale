"use client";

import React from "react";
// --- Production Ready Imports (Commented for Manual Handling) ---
import { useParams } from "next/navigation";
import ValuesAuditBlock from "@/components/theme/blocks/audit/ValuesAuditBlock";

/**
 * GreenScale Phase 1: Audit Discovery Page
 * Path: apps/client-portal/src/app/[lang]/(marketing)/audit/page.tsx
 * Purpose: A dedicated route to host the Values Audit interactive experience.
 */

export default function AuditPage() {
  // @ts-ignore
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  return (
    <div className="min-h-screen bg-white" data-component="AuditPage">
      {/* This page orchestrates the Phase 1 Discovery journey */}
      
      {/* 1. Main Audit Block (Receives locale for bilingual content) */}
      {/* @ts-ignore */}
      <ValuesAuditBlock lang={lang} />

      {/* 2. Trust Footer */}
      <footer className="max-w-4xl mx-auto py-20 px-8 text-center border-t border-slate-50">
        <div className="flex flex-col items-center gap-4">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
             {lang === 'el' 
               ? 'Ενεργή ασφαλής περίοδος ανακάλυψης. Η GreenScale χρησιμοποιεί τοπική κρυπτογράφηση.' 
               : 'Secure discovery session active. GreenScale uses local session encryption.'}
           </p>
        </div>
      </footer>
    </div>
  );
}