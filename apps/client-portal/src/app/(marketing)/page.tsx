"use client";

import React from "react";
import { Header } from "../../components/landing/Header";
import { Footer } from "../../components/shared/Footer";
import { Hero } from "../../components/landing/Hero";
import { ImpactTicker } from "../../components/landing/ImpactTicker";
import { ESGPillars } from "../../components/landing/ESGPillars";
import { FeaturedProjects } from "../../components/landing/FeaturedProjects";

/**
 * GreenScale Marketing Home Page
 * Path: apps/client-portal/src/app/(marketing)/page.tsx
 * * Refined assembly of the Phase 4 conversion engine.
 */

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-brand-emerald-100 selection:text-brand-emerald-900">
      {/* @ts-ignore */}
      <Header />
      
      <main className="flex-1">
        {/* Block 2: Hero & Audit Widget */}
        {/* @ts-ignore */}
        <Hero />

        {/* Block 3: Live Impact Ticker */}
        {/* @ts-ignore */}
        <ImpactTicker />

        {/* Block 4: The Three Pillars (E-S-G) */}
        {/* @ts-ignore */}
        <ESGPillars />

        {/* Block 5: Staff Advantage Teaser (Inline for now) */}
        <section className="py-24 bg-brand-emerald-950 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-xs font-black text-brand-emerald-400 uppercase tracking-[0.4em]">The Hybrid Model</h2>
              <h3 className="text-5xl font-serif font-bold leading-tight">AI Audited. <br/>Expert Strategized.</h3>
              <p className="text-brand-emerald-100/70 text-lg leading-relaxed max-w-lg">
                While our algorithms scan millions of data points to verify ESG claims, 
                our human wealth managers curate the strategy to match your family's 
                long-term legacy goals.
              </p>
              <div className="pt-4">
                <button className="px-8 py-4 bg-brand-emerald-500 text-white rounded-2xl font-bold hover:bg-brand-emerald-400 transition-all">
                  Meet the Strategy Team
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-2xl">
                <div className="text-center space-y-4">
                   <div className="w-16 h-16 bg-brand-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                      <div className="w-8 h-8 border-2 border-brand-emerald-400 rounded-lg animate-pulse" />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest text-brand-emerald-400">Staff Dashboard Preview</p>
                </div>
              </div>
              {/* Decorative Glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-emerald-500/20 blur-[100px] rounded-full" />
            </div>
          </div>
        </section>

        {/* Block 6: Featured Projects */}
        {/* @ts-ignore */}
        <FeaturedProjects />

        {/* Block 8: Final CTA */}
        <section className="py-32 bg-[#FEFCF3]">
          <div className="max-w-4xl mx-auto px-8 text-center space-y-10">
            <h2 className="text-6xl font-serif font-black text-slate-900 tracking-tight">Ready to Align Your <br/>Wealth with Your Values?</h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Join a select group of European investors transitioning the world's capital 
              toward a sustainable and profitable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-5 bg-brand-emerald-900 text-white rounded-[2rem] font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-emerald-900/20">
                Get Started Now
              </button>
              <button className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-bold text-lg hover:bg-slate-50 transition-all">
                View Pricing
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* @ts-ignore */}
      <Footer />
    </div>
  );
}