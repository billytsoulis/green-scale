"use client";

import React, { useEffect, useState } from "react";

/**
 * GreenScale About Us Page
 * Path: apps/client-portal/src/app/(marketing)/about/page.tsx
 * * Refactored: Header and Footer are now provided by the shared layout.
 */

import { Card, Badge } from "@repo/ui";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const team = [
    { name: "Eleni Kosta", role: "Chief ESG Strategist", bio: "Former Lead Analyst at MSCI European Sustainable Funds." },
    { name: "Dr. Nikos Vane", role: "Architect / AI Lead", bio: "Specialist in high-integrity data auditing and satellite analytics." },
    { name: "Sarah Stern", role: "Head of Wealth", bio: "20+ years in HNWI concierge banking and legacy planning." }
  ];

  return (
    <div className="min-h-screen bg-white" data-component="AboutPage">
      {/* Hero Section */}
      <section className="py-24 bg-[#FEFCF3] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 text-center space-y-6">
          {/* @ts-ignore */}
          <Badge variant="gold" className="mb-4">Our Vision</Badge>
          <h1 className="text-6xl md:text-7xl font-serif font-black text-slate-900 tracking-tight">
            A Legacy of <br/> <span className="text-brand-emerald-700 italic">Purpose & Performance.</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-slate-500 font-medium leading-relaxed">
            GreenScale was founded on a single premise: Capital has the power to fix the world, 
            but only if it's guided by data that cannot be greenwashed.
          </p>
        </div>
      </section>

      {/* The Narrative */}
      <section className="py-24 max-w-4xl mx-auto px-8 space-y-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">Radical Accountability</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            For decades, ESG reporting has been a black box. Companies self-reported their 
            sustainability metrics, and banks simply consumed them. At GreenScale, we don't 
            believe in "trusting" reports—we believe in "auditing" reality. 
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Based in the heart of Greece, we leverage the Mediterranean’s unique perspective 
            on climate resilience to build a platform that serves the next generation 
            of European wealth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
           <div className="p-10 bg-brand-emerald-900 rounded-[2.5rem] text-white space-y-4">
              <h3 className="text-2xl font-bold">The AI Audit</h3>
              <p className="text-brand-emerald-100/70 text-sm leading-relaxed">
                Our ml-engine cross-references satellite thermal data with corporate energy claims 
                to ensure your "Green Bond" is actually green.
              </p>
           </div>
           <div className="p-10 bg-slate-100 rounded-[2.5rem] text-slate-900 space-y-4">
              <h3 className="text-2xl font-bold">Human Strategy</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our Wealth Managers translate complex ESG scores into a personalized 
                investment strategy that protects your capital and your values.
              </p>
           </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-16">The Specialists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map(member => (
              /* @ts-ignore */
              <Card key={member.name} variant="elevated" className="p-10 bg-white text-center group">
                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                   <span className="text-2xl font-serif text-slate-300 italic">{member.name[0]}</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900">{member.name}</h4>
                <p className="text-brand-emerald-600 font-bold text-xs uppercase tracking-widest mt-1 mb-4">{member.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}