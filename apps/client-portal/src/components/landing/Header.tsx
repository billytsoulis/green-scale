"use client";

import React from "react";
import { SustainabilityIcon } from "@repo/ui";
import { useSession } from "../../lib/auth-client";

/**
 * Glassmorphism Header
 * Path: apps/client-portal/src/components/landing/Header.tsx
 */

export const Header = () => {
  const { data: session, isPending } = useSession();

  const navLinks = [
    { label: "About Us", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Pricing", href: "/pricing" },
    { label: "Methodology", href: "/methodology" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <header data-component="Header" className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-emerald-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <SustainabilityIcon className="text-brand-emerald-100" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">
            GreenScale
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              className="text-sm font-bold text-slate-500 hover:text-brand-emerald-700 transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-emerald-500 transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 mr-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <span className="text-brand-emerald-600 underline cursor-pointer">EN</span>
            <span className="opacity-30">|</span>
            <span className="hover:text-slate-600 cursor-pointer">GR</span>
          </div>

          {!isPending && (
            <>
              {session ? (
                <a 
                  href="/dashboard"
                  className="bg-brand-emerald-50 text-brand-emerald-700 px-6 py-2.5 rounded-full font-bold text-sm border border-brand-emerald-100 hover:bg-brand-emerald-100 transition-colors shadow-sm"
                >
                  Go to Dashboard
                </a>
              ) : (
                <div className="flex items-center gap-3">
                  <a 
                    href="/login"
                    className="text-sm font-bold text-slate-600 hover:text-brand-emerald-700 px-4 py-2 transition-colors"
                  >
                    Login
                  </a>
                  <a 
                    href="/register"
                    className="bg-brand-emerald-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-emerald-900/10"
                  >
                    Get Started
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};