"use client";

import React from "react";
import { Header } from "../../components/landing/Header";
import { Footer } from "../../components/shared/Footer";

/**
 * GreenScale Marketing Home Page
 * Path: apps/client-portal/src/app/(marketing)/page.tsx
 * * Assembly point for the Phase 4 conversion engine.
 */

// Basic Hero Section (Will be moved to its own file in the next step)
const HeroPlaceholder = () => (
  <section className="min-h-[85vh] flex items-center justify-center bg-[#FEFCF3] relative overflow-hidden">
    {/* Background Glow */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-emerald-50/50 rounded-full blur-[120px] -mr-64 -mt-64" />
    
    <div className="text-center space-y-8 max-w-4xl px-4 relative z-10">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <span className="w-2 h-2 bg-brand-emerald-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live ESG Ticker: MSCI World +0.2%</span>
      </div>
      
      <h1 className="text-6xl md:text-8xl font-serif font-black text-slate-900 leading-[1.05] tracking-tight">
        Invest in the Future <br />
        <span className="text-brand-emerald-600 italic">You Want to See.</span>
      </h1>
      
      <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
        The first ESG-first wealth platform designed for high-net-worth individuals 
        who demand both institutional-grade alpha and radical global impact.
      </p>
      
      <div className="pt-10">
        <div className="bg-white p-2 rounded-[2.5rem] shadow-premium border border-slate-100 flex items-center max-w-xl mx-auto ring-8 ring-brand-emerald-50/50">
          <input 
            type="text" 
            placeholder="What do you value most? (e.g. Ocean Health)"
            className="flex-1 px-8 py-3 outline-none text-slate-900 font-medium placeholder:text-slate-400 bg-transparent"
          />
          <button className="bg-brand-emerald-900 text-white px-10 py-5 rounded-[2rem] font-bold hover:bg-slate-800 transition-all shadow-xl shadow-emerald-900/20 active:scale-95">
            Audit My Wealth
          </button>
        </div>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Trusted by 1,200+ Private Investors in the EU
        </p>
      </div>
    </div>
  </section>
);

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-brand-emerald-100 selection:text-brand-emerald-900">
      <Header />
      
      <main className="flex-1">
        {/* Block 2: Hero */}
        <HeroPlaceholder />

        {/* Block 3: Live Impact Ticker */}
        <div className="h-14 bg-brand-emerald-950 flex items-center overflow-hidden border-y border-white/5">
          <div className="whitespace-nowrap flex gap-16 animate-marquee text-brand-emerald-100/40 font-bold uppercase tracking-widest text-[10px]">
            <span>MSCI World ESG +0.2%</span>
            <span>Renewable Index +1.4%</span>
            <span>Carbon Credit Futures -0.5%</span>
            <span>Oceanic Health Index +2.1%</span>
            <span>Solar Yield Bond +0.8%</span>
            <span>Social Equity ETF +1.1%</span>
            {/* Duplicate for seamless loop */}
            <span>MSCI World ESG +0.2%</span>
            <span>Renewable Index +1.4%</span>
            <span>Carbon Credit Futures -0.5%</span>
            <span>Oceanic Health Index +2.1%</span>
            <span>Solar Yield Bond +0.8%</span>
            <span>Social Equity ETF +1.1%</span>
          </div>
        </div>

        {/* Block 4 Preview: The Three Pillars */}
        <section className="py-32 bg-[#FEFCF3]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-xs font-black text-brand-emerald-600 uppercase tracking-[0.4em] mb-6">Our Methodology</h2>
              <h3 className="text-5xl font-serif font-bold text-slate-900 leading-tight">Built on Radical Transparency.</h3>
              <p className="mt-6 text-slate-500 font-medium text-lg">
                We don't just use ESG scores; we audit them. Our proprietary engine 
                cross-references institutional data with real-time satellite and labor reporting.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['Environmental', 'Social', 'Governance'].map((pillar) => (
                <div key={pillar} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-premium transition-all duration-500 group cursor-pointer">
                  <div className="w-14 h-14 bg-brand-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-emerald-900 transition-colors">
                    <div className="w-6 h-6 border-2 border-brand-emerald-600 group-hover:border-white rounded-full" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-4">{pillar}</h4>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    Detailed analysis of {pillar.toLowerCase()} metrics using satellite monitoring and verified data chains.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}