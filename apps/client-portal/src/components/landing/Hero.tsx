"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui";
import { useParams, useRouter } from "next/navigation";
import { useDiscoveryStore } from "@/store/useDiscoveryStore";

/**
 * Hero Section & Ethical Audit Widget
 * Path: apps/client-portal/src/components/landing/Hero.tsx
 */

export const Hero = () => {
  const [value, setValue] = useState("");
  
  // Next.js Navigation Hooks
  // @ts-ignore
  const params = useParams();
  // @ts-ignore
  const router = useRouter();
  
  // Zustand Global Store Hook
  // @ts-ignore
  const { setValueIntent } = useDiscoveryStore();

  const lang = (params?.lang as string) || "en";

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;
    
    // 1. Persist the intent in the global Zustand store
    setValueIntent(value);

    // 2. Programmatic Navigation using Next.js Router
    // @ts-ignore
    router.push(`/${lang}/audit`);
  };

  return (
    <section data-component="Hero" className="min-h-[85vh] flex items-center justify-center bg-[#FEFCF3] relative overflow-hidden pt-20">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecfdf5]/50 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#fffbeb]/30 rounded-full blur-[100px] -ml-32 -mb-32" />
      
      <div className="text-center space-y-10 max-w-5xl px-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            {lang === 'el' ? 'ΑΝΑΦΟΡΑ ESG: Q1 2025 ΔΗΜΟΣΙΕΥΘΗΚΕ' : 'ESG Intelligence Report: Q1 2025 Released'}
          </span>
        </div>
        
        <h1 className="text-6xl md:text-[5.5rem] font-serif font-black text-slate-900 leading-[0.95] tracking-tight">
          {lang === 'el' ? <>Επενδύστε στο Μέλλον <br /> <span className="text-emerald-600 italic">που Θέλετε να Δείτε.</span></> : <>Invest in the Future <br /> <span className="text-emerald-600 italic">You Want to See.</span></>}
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
          {lang === 'el' 
            ? 'Η πρώτη πλατφόρμα πλούτου ESG για ιδιώτες υψηλής καθαρής θέσης που απαιτούν θεσμική απόδοση και ριζικό παγκόσμιο αντίκτυπο.' 
            : 'The first ESG-first wealth platform for high-net-worth individuals who demand institutional-grade alpha and radical global impact.'}
        </p>
        
        <div className="pt-10">
          <form 
            onSubmit={handleAudit}
            className="bg-white p-2.5 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(6,95,70,0.15)] border border-slate-100 flex flex-col md:flex-row items-center max-w-2xl mx-auto ring-8 ring-emerald-50/50"
          >
            <input 
              type="text" 
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={lang === 'el' ? 'Τι εκτιμάτε περισσότερο; (π.χ. Ωκεανοί)' : 'What do you value most? (e.g. Ocean Health)'}
              className="flex-1 px-8 py-4 outline-none text-slate-900 font-bold text-lg placeholder:text-slate-400 bg-transparent w-full md:w-auto"
            />
            {/* @ts-ignore */}
            <Button 
              type="submit"
              className="w-full md:w-auto px-10 !py-5 rounded-[2.5rem] !text-lg shadow-xl shadow-emerald-900/20 active:scale-95 whitespace-nowrap bg-emerald-900 text-white border-none cursor-pointer"
            >
              {lang === 'el' ? 'Έλεγχος Πλούτου' : 'Audit My Wealth'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};