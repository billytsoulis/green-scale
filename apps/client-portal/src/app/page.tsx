"use client";

import React from "react";
// Using explicit relative paths to ensure resolution in the monorepo structure
import { Header } from "../components/landing/Header";
import { Footer } from "../components/shared/Footer";

/**
 * GreenScale Home Page (Marketing)
 * Path: apps/client-portal/src/app/page.tsx
 * * This is the primary landing page for the investor portal.
 * It features the Ethical Audit Widget and the Live ESG Ticker.
 */

const HeroSection = () => (
  <section className="min-h-[85vh] flex items-center justify-center bg-[#FEFCF3] relative overflow-hidden">
    {/* Animated Background Element */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-emerald-50/40 rounded-full blur-[120px] -mr-64 -mt-64" />
    
    <div className="text-center space-y-8 max-w-4xl px-4 relative z-10">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm mb-4">
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
        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          Trusted by 1,200+ Private Investors across the EU
        </p>
      </div>
    </div>
  </section>
);

const TickerSection = () => (
  <div className="h-14 bg-slate-900 flex items-center overflow-hidden border-y border-white/5">
    <div className="whitespace-nowrap flex gap-16 animate-marquee text-brand-emerald-400/60 font-bold uppercase tracking-widest text-[10px]">
      <span>MSCI World ESG +0.2%</span>
      <span>Renewable Index +1.4%</span>
      <span>Carbon Credit Futures -0.5%</span>
      <span>Oceanic Health Index +2.1%</span>
      <span>Solar Yield Bond +0.8%</span>
      <span>Social Equity ETF +1.1%</span>
      {/* Loop duplicates for seamless scrolling */}
      <span>MSCI World ESG +0.2%</span>
      <span>Renewable Index +1.4%</span>
      <span>Carbon Credit Futures -0.5%</span>
      <span>Oceanic Health Index +2.1%</span>
    </div>
  </div>
);

const PillarsTeaser = () => (
  <section className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { title: 'Environmental', desc: 'Real-time carbon auditing via satellite imagery and verified chain data.' },
          { title: 'Social', desc: 'Verified labor standards and diversity index tracking across global portfolios.' },
          { title: 'Governance', desc: 'Radical transparency in board ethics, anti-corruption, and tax compliance.' }
        ].map((pillar) => (
          <div key={pillar.title} className="p-10 rounded-3xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-premium transition-all group cursor-default">
            <div className="w-12 h-12 bg-brand-emerald-50 rounded-2xl mb-6 group-hover:bg-brand-emerald-900 group-hover:text-white transition-colors flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-current rounded-full" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h4>
            <p className="text-slate-500 font-medium leading-relaxed">{pillar.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <TickerSection />
        <PillarsTeaser />
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .shadow-premium {
          box-shadow: 0 10px 40px -15px rgba(6,95,70,0.08);
        }
      `}</style>
    </div>
  );
}