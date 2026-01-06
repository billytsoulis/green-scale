"use client";

import React from "react";
import { Badge } from "@repo/ui";

/**
 * Featured Projects Preview Grid
 * Path: apps/client-portal/src/components/landing/FeaturedProjects.tsx
 */

export const FeaturedProjects = () => {
  const projects = [
    {
      title: "Aegean Offshore Wind V",
      location: "Cyclades, Greece",
      impact: "Saves 420K Tons CO2",
      funding: 85,
      type: "Renewables",
      yield: "6.2% Est.",
      color: "from-brand-emerald-600 to-brand-emerald-800"
    },
    {
      title: "Social Housing Trust II",
      location: "Thessaloniki, Greece",
      impact: "Homes for 1,200 Families",
      funding: 62,
      type: "Social Equity",
      yield: "4.8% Est.",
      color: "from-blue-600 to-blue-800"
    },
    {
      title: "Mediterranean Reef Recovery",
      location: "Ionian Coast",
      impact: "2,000sqm Restored",
      funding: 40,
      type: "Oceanic Health",
      yield: "5.5% Est.",
      color: "from-cyan-600 to-cyan-800"
    }
  ];

  return (
    <section data-component="FeaturedProjects" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-xs font-black text-brand-emerald-600 uppercase tracking-[0.4em]">Investment Catalog</h2>
            <h3 className="text-5xl font-serif font-bold text-slate-900 leading-tight">Current High-Impact Projects.</h3>
          </div>
          <button className="text-slate-900 font-bold border-b-2 border-brand-emerald-500 pb-1 hover:text-brand-emerald-600 transition-colors">
            View All Projects →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {projects.map((p) => (
            <div 
              key={p.title} 
              className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden group hover:shadow-premium transition-all duration-500"
            >
              {/* Image Placeholder */}
              <div className={`h-64 bg-gradient-to-br ${p.color} p-8 flex flex-col justify-end relative overflow-hidden`}>
                <div className="absolute top-6 left-6 flex gap-2">
                  {/* @ts-ignore - Badge is imported from @repo/ui but commented for preview safety */}
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20">
                    {p.type}
                  </Badge>
                  {/* @ts-ignore */}
                  <Badge variant="warning" className="bg-brand-gold-400 text-slate-900">
                    {p.yield}
                  </Badge>
                </div>
                
                <div className="relative z-10 space-y-1">
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{p.location}</p>
                  <h4 className="text-2xl font-bold text-white tracking-tight">{p.title}</h4>
                </div>
                
                {/* Abstract Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 0 L100 100 M0 100 L100 0" stroke="white" strokeWidth="0.5" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Impact Outcome</span>
                  <span className="text-brand-emerald-600">{p.impact}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                    <span>Funding Progress</span>
                    <span>{p.funding}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${p.color} transition-all duration-1000 ease-out group-hover:scale-x-105 origin-left`} 
                      style={{ width: `${p.funding}%` }}
                    />
                  </div>
                </div>

                <button className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm group-hover:bg-brand-emerald-900 group-hover:text-white transition-all">
                  Analyze Project Data
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};