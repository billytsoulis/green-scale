"use client";

import React, { useEffect, useState } from "react";

/**
 * Live Impact Ticker
 * Path: apps/client-portal/src/components/landing/ImpactTicker.tsx
 * * Refactored to solve Hydration Mismatch by moving animations to global CSS
 * * and implementing a mounted state guard.
 */

export const ImpactTicker = () => {
  // 1. Mount State to prevent hydration mismatches on animation classes
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tickerItems = [
    { label: "MSCI World ESG", value: "+0.2%", trend: "up" },
    { label: "Renewable Index", value: "+1.4%", trend: "up" },
    { label: "Carbon Credit Futures", value: "-0.5%", trend: "down" },
    { label: "Oceanic Health Index", value: "+2.1%", trend: "up" },
    { label: "Solar Yield Bond", value: "+0.8%", trend: "up" },
    { label: "Social Equity ETF", value: "+1.1%", trend: "up" },
    { label: "Governance Compliance Avg", value: "+0.4%", trend: "up" },
  ];

  // We only apply the marquee class once the component has mounted on the client
  const animationClass = mounted ? "animate-marquee" : "";

  return (
    <div data-component="ImpactTicker" className="h-14 bg-slate-900 flex items-center overflow-hidden border-y border-white/5 relative z-20">
      {/* Edge Fades for Luxury Depth */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10" />
      
      {/* The 'animate-marquee' class is now defined in globals.css to avoid 
         the hash-mismatch errors caused by styled-jsx.
      */}
      <div className={`whitespace-nowrap flex gap-16 ${animationClass} text-[10px] font-black uppercase tracking-[0.2em]`}>
        {/* Render twice for seamless infinite loop */}
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-slate-500">{item.label}</span>
            <span className={item.trend === "up" ? "text-brand-emerald-400" : "text-red-400"}>
              {item.value} {item.trend === "up" ? "↑" : "↓"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};