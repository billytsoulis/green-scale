"use client";

import React from "react";
import { SustainabilityIcon } from "@repo/ui";

/**
 * GreenScale Regulatory Footer
 * Path: apps/client-portal/src/components/shared/Footer.tsx
 */

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Product",
      links: [
        { label: "Investment Catalog", href: "/projects" },
        { label: "ESG Methodology", href: "/methodology" },
        { label: "Pricing Tiers", href: "/pricing" },
        { label: "Risk Assessments", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About GreenScale", href: "/about" },
        { label: "Our Story", href: "/story" },
        { label: "Careers", href: "#" },
        { label: "Press Kit", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Impact Reports", href: "#" },
        { label: "ESG News", href: "#" },
        { label: "API Docs", href: "/docs" },
        { label: "Help Center", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Disclosures", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 pt-24 pb-12 font-sans selection:bg-brand-emerald-900 selection:text-brand-emerald-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 text-white">
              <SustainabilityIcon size={32} className="text-brand-emerald-400" />
              <span className="text-2xl font-black tracking-tighter">GreenScale</span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm font-medium">
              Empowering global wealth to transition capital 
              into sustainable, high-alpha ESG investments through AI-driven auditing.
            </p>
            <div className="flex gap-4">
              {['T', 'L', 'I'].map(icon => (
                <div key={icon} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-brand-emerald-900 hover:text-white transition-all cursor-pointer border border-slate-700/50">
                  <span className="text-[10px] font-black uppercase tracking-widest">{icon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nav Sections */}
          {sections.map(section => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.25em]">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-brand-emerald-400 transition-colors text-sm font-medium">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Regulatory Disclaimer */}
        <div className="pt-12 border-t border-slate-800 space-y-8">
          <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-slate-700/30">
            <p className="text-[10.5px] leading-relaxed text-slate-500 uppercase tracking-wide">
              <strong className="text-slate-400">Regulatory Disclaimer:</strong> Sustainable bonds and ESG-targeted funds involve 
              significant risk of capital loss. Past performance is not indicative of future results. GreenScale Wealth Management 
              is a registered financial services provider. This website is for informational purposes only 
              and does not constitute financial advice. Certified B-Corp (Pending). Thessaloniki, Greece.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <p>© {currentYear} GreenScale S.A. All Rights Reserved.</p>
            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>Nodes: Operational</span>
              </div>
              <span className="text-brand-emerald-800">Region: EU (Thessaloniki)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};