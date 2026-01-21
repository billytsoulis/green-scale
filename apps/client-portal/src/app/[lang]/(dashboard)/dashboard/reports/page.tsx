"use client";

import { useState } from "react";

import { Card, Badge, Button } from "@repo/ui";
import { useParams } from "next/navigation";

/**
 * GreenScale Phase 5: Impact Tracking & Reports
 * Path: greenscale/apps/client-portal/src/app/[lang]/(dashboard)/dashboard/reports/page.tsx
 * Purpose: Visualizes global impact metrics and generates PDF statements.
 * Logic: Simulates real-time funding progress and document export.
 */

export default function ReportsPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const isGreek = lang === "el";

  const [downloading, setDownloading] = useState(false);
  const GATEWAY_URL = "http://localhost:3005";

  const metrics = [
    { label: isGreek ? "CO2 που Αποφεύχθηκε" : "CO2 Avoided", value: "1,240", unit: "tons", color: "text-emerald-500" },
    { label: isGreek ? "Καθαρή Ενέργεια" : "Clean Energy", value: "842", unit: "MWh", color: "text-amber-500" },
    { label: isGreek ? "Κοινωνικός Αντίκτυπος" : "Social Reach", value: "12,000", unit: "lives", color: "text-blue-500" },
  ];

  /**
   * Helper: retrieveToken
   * Standard bridge to retrieve the session JWT for the backend.
   */
  const retrieveToken = async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/auth/get-jwt`, { credentials: "include" });
      if (res.ok) {
        const { token } = await res.json();
        return token;
      }
      return localStorage.getItem("gs-auth.token");
    } catch (e) { 
      return localStorage.getItem("gs-auth.token"); 
    }
  };

  /**
   * handleDownload
   * 1. Fetches the PDF stream from the API Gateway.
   * 2. Converts response to a Blob.
   * 3. Triggers browser download.
   */
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const token = await retrieveToken();
      if (!token) throw new Error("Authentication required.");

      const response = await fetch(`${GATEWAY_URL}/api/reports/impact-statement`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Report generation failed.");

      // Process the stream as a binary blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Temporary link creation to trigger native download behavior
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `GreenScale_Impact_Report_${new Date().getFullYear()}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[Reports] Download Error:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 lg:p-16 space-y-12" data-component="ReportsPage">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none">
            {isGreek ? "Αναφορές Αντικτύπου" : "Impact Statements"}
          </h1>
          <p className="text-slate-500 font-medium italic text-lg">
            {isGreek ? "Η κληρονομιά σας σε αριθμούς." : "Quantifying your planetary legacy."}
          </p>
        </div>
        <Button 
          onClick={handleDownload} 
          disabled={downloading}
          className="rounded-2xl bg-emerald-950 text-white hover:bg-emerald-800 shadow-xl active:scale-95 border-none flex items-center gap-3"
        >
          {downloading ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isGreek ? "Δημιουργία..." : "Generating..."}
            </>
          ) : (
            isGreek ? "Λήψη Αναφοράς Q1" : "Download Q1 Statement"
          )}
        </Button>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {metrics.map((m, i) => (
          <Card 
            key={i} 
            className="animate-in fade-in slide-in-from-bottom-4 duration-700" 
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-none">{m.label}</p>
            <div className="flex items-baseline gap-2">
               <span className={`text-5xl font-black ${m.color} tracking-tighter leading-none`}>{m.value}</span>
               <span className="text-xs font-bold text-slate-300 uppercase">{m.unit}</span>
            </div>
          </Card>
        ))}
      </div>

      <section className="max-w-6xl mx-auto">
        <div className="bg-emerald-950 p-12 rounded-[4rem] text-left relative overflow-hidden shadow-2xl border border-emerald-800">
           <div className="relative z-10 space-y-8 max-w-lg">
              <Badge 
                showDot 
                animate 
                className="bg-emerald-800/50 border border-emerald-700 text-emerald-400"
              >
                {isGreek ? "Ζωντανή Χρηματοδότηση" : "Live Project Funding"}
              </Badge>
              
              <div className="space-y-2">
                <h2 className="text-4xl font-serif font-black text-white leading-tight">
                  {isGreek ? "Ηλιακή Κιβωτός: Τελική Φάση" : "Solar Ark Messinia: Final Allocation"}
                </h2>
                <p className="text-emerald-100/60 text-sm leading-relaxed font-medium">
                  {isGreek 
                    ? "Απομένουν μόνο €150,000 για την ολοκλήρωση της χρηματοδότησης. Δείτε την πρόοδο σε πραγματικό χρόνο." 
                    : "Only €150,000 remains to complete the funding. Watch live as the community closes the gap."}
                </p>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <span>94% Funded</span>
                    <span className="opacity-50">Target: €2.5M</span>
                 </div>
                 <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-emerald-500 w-[94%] animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                 </div>
              </div>
           </div>
           
           <div className="absolute -top-10 -right-10 p-20 opacity-10 text-[15rem] leading-none select-none pointer-events-none">
              <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
           </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto py-10 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          {isGreek ? "GreenScale Πλατφόρμα Αναφορών v5.0" : "GreenScale Reporting Engine v5.0"}
        </p>
      </footer>
    </main>
  );
}