"use client";

import React from "react";
import { Card } from "@repo/ui";

/**
 * The Three Pillars (E-S-G)
 * Path: apps/client-portal/src/components/landing/ESGPillars.tsx
 */

export const ESGPillars = () => {
  const pillars = [
    {
      type: "Environmental",
      tagline: "Planet-First Alpha",
      desc: "Our engine uses satellite imagery and IoT sensors to audit real-world carbon sequestration, bypass reporting biases, and identify true environmental leaders.",
      features: ["Carbon Neutrality Verification", "Waste Stream Auditing", "Renewable Yield Analysis"],
      iconColor: "bg-brand-emerald-50 text-brand-emerald-600"
    },
    {
      type: "Social",
      tagline: "Human-Centric Value",
      desc: "We analyze supply chain labor conditions, diversity metrics, and community impact to ensure your capital supports ethical growth and reduces systemic risk.",
      features: ["Supply Chain Ethics", "Diversity & Inclusion Index", "Community Impact Scoring"],
      iconColor: "bg-blue-50 text-blue-600"
    },
    {
      type: "Governance",
      tagline: "Radical Transparency",
      desc: "Beyond board seats—we audit executive compensation, anti-corruption history, and tax transparency to ensure long-term corporate resilience.",
      features: ["Tax Transparency Audits", "Exec Comp Alignment", "Anti-Corruption Scans"],
      iconColor: "bg-brand-gold-50 text-brand-gold-600"
    }
  ];

  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-black text-brand-emerald-600 uppercase tracking-[0.4em]">Our Proprietary Engine</h2>
          <h3 className="text-5xl font-serif font-bold text-slate-900 leading-tight">Built on Radical Transparency.</h3>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            We don't just consume ESG scores; we create them. GreenScale audits institutional 
            claims using objective, independent data chains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {pillars.map((pillar) => (
            /* @ts-ignore - Card is imported from @repo/ui but commented for preview safety */
            <Card 
              key={pillar.type}
              variant="elevated"
              className="p-10 transition-all duration-500 group relative overflow-hidden text-left"
            >
              <div className={`w-14 h-14 ${pillar.iconColor} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <div className="w-6 h-6 border-2 border-current rounded-full" />
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pillar.tagline}</p>
                <h4 className="text-3xl font-bold text-slate-900">{pillar.type}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {pillar.desc}
                </p>
                
                <ul className="pt-6 space-y-3">
                  {pillar.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <span className="w-1 h-1 bg-brand-emerald-500 rounded-full" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};