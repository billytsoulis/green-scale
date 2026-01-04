"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui";

/**
 * Hero Section & Ethical Audit Widget
 * Path: apps/client-portal/src/components/landing/Hero.tsx
 */

export const Hero = () => {
  const [value, setValue] = useState("");

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;
    // Redirect to registration with the value intent
    window.location.href = `/register?intent=${encodeURIComponent(value)}`;
  };

  return (
    <section className="min-h-[85vh] flex items-center justify-center bg-[#FEFCF3] relative overflow-hidden pt-20">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-emerald-50/50 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-gold-50/30 rounded-full blur-[100px] -ml-32 -mb-32" />
      
      <div className="text-center space-y-10 max-w-5xl px-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="w-2 h-2 bg-brand-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            ESG Intelligence Report: Q1 2025 Released
          </span>
        </div>
        
        <h1 className="text-6xl md:text-[5.5rem] font-serif font-black text-slate-900 leading-[0.95] tracking-tight">
          Invest in the Future <br />
          <span className="text-brand-emerald-600 italic">You Want to See.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
          The first ESG-first wealth platform for high-net-worth individuals 
          who demand institutional-grade alpha and radical global impact.
        </p>
        
        <div className="pt-10">
          <form 
            onSubmit={handleAudit}
            className="bg-white p-2.5 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(6,95,70,0.15)] border border-slate-100 flex flex-col md:flex-row items-center max-w-2xl mx-auto ring-8 ring-brand-emerald-50/50"
          >
            <input 
              type="text" 
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="What do you value most? (e.g. Ocean Health)"
              className="flex-1 px-8 py-4 outline-none text-slate-900 font-bold text-lg placeholder:text-slate-400 bg-transparent w-full md:w-auto"
            />
            {/* @ts-ignore - Button is imported from @repo/ui but commented for preview safety */}
            <Button 
              type="submit"
              variant="primary"
              className="w-full md:w-auto px-10 !py-5 rounded-[2.5rem] !text-lg shadow-xl shadow-emerald-900/20 active:scale-95 whitespace-nowrap"
            >
              Audit My Wealth
            </Button>
          </form>
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
              Verified ESG Data
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
              Zero Greenwashing
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
              EU Regulatory Compliant
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};