"use client";

import React, { useState } from "react";
/**
 * Glassmorphism Header (Bilingual + SPA Optimized)
 * Path: apps/client-portal/src/components/landing/Header.tsx
 * * Refactored: Replaced window.location with Next.js Link and useRouter 
 * to prevent full page reloads and enable smooth client-side transitions.
 */

// Preview Safety: Commenting out local and repo imports to avoid compiler errors
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { SustainabilityIcon } from "@repo/ui";
import { useSession } from "@/lib/auth-client";
import { useTranslation } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ArrowRight } from "lucide-react";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // @ts-ignore
  const { lang, setLang, t } = useTranslation();
  // @ts-ignore
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { label: t.nav.about, href: `/${lang}/about` },
    { label: t.nav.projects, href: `/${lang}/projects` },
    { label: t.nav.pricing, href: `/${lang}/pricing` },
    { label: t.nav.methodology, href: `/${lang}/methodology` },
    { label: t.nav.contact, href: `/${lang}/contact` },
  ];

  const handleLanguageChange = (newLang: "en" | "el") => {
    if (newLang === lang) return;
    setLang(newLang);
    const pathSegments = pathname.split("/");
    pathSegments[1] = newLang;
    const newPath = pathSegments.join("/");
    // @ts-ignore
    router.push(newPath);
    setIsMobileMenuOpen(false);
  };

  return (
    <header data-component="Header" className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* 1. Brand Identity */}
        {/* @ts-ignore */}
        <Link href={`/${lang}`} className="flex items-center gap-3 group no-underline">
          <div className="w-10 h-10 bg-[#064e3b] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {/* @ts-ignore */}
            <SustainabilityIcon className="text-emerald-100" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">
            Green<span className="text-emerald-600">Scale</span>
          </span>
        </Link>

        {/* 2. Desktop Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            /* @ts-ignore */
            <Link 
              key={link.label}
              href={link.href}
              className={`text-sm font-bold transition-colors relative group no-underline ${
                pathname === link.href ? "text-emerald-700" : "text-slate-500 hover:text-emerald-700"
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full ${pathname === link.href ? "w-full" : "w-0"}`} />
            </Link>
          ))}
        </nav>

        {/* 3. Action Suite */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Desktop Language Toggle */}
          <div className="hidden sm:flex items-center gap-2 mr-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <button 
              onClick={() => handleLanguageChange("en")}
              className={`${lang === "en" ? "text-emerald-600 underline" : "hover:text-slate-600"} transition-all cursor-pointer bg-transparent border-none`}
            >
              EN
            </button>
            <span className="opacity-30">|</span>
            <button 
              onClick={() => handleLanguageChange("el")}
              className={`${lang === "el" ? "text-emerald-600 underline" : "hover:text-slate-600"} transition-all cursor-pointer bg-transparent border-none`}
            >
              GR
            </button>
          </div>

          {!isPending && (
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                /* @ts-ignore */
                <Link 
                  href={`/${lang}/dashboard`}
                  className="bg-emerald-50 text-emerald-700 px-6 py-2.5 rounded-full font-bold text-sm border border-emerald-100 hover:bg-emerald-100 transition-colors shadow-sm no-underline"
                >
                  {t.nav.dashboard}
                </Link>
              ) : (
                <>
                  {/* @ts-ignore */}
                  <Link 
                    href={`/${lang}/login`}
                    className="text-sm font-bold text-slate-600 hover:text-emerald-700 px-4 py-2 transition-colors no-underline"
                  >
                    {t.nav.login}
                  </Link>
                  {/* @ts-ignore */}
                  <Link 
                    href={`/${lang}/register`}
                    className="bg-[#064e3b] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-emerald-900/10 no-underline"
                  >
                    {t.nav.getStarted}
                  </Link>
                </>
              )}
            </div>
          )}

          {/* 4. Mobile Menu Toggle (GS-32 Trigger) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all border-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 5. Mobile Menu Overlay (GS-32 Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          // @ts-ignore
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-10 space-y-10">
              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  /* @ts-ignore */
                  <Link 
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-black text-slate-900 no-underline flex items-center justify-between group"
                  >
                    {link.label}
                    <ArrowRight size={20} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
                  </Link>
                ))}
              </nav>

              <div className="pt-10 border-t border-slate-50 space-y-8">
                {/* Mobile Identity Actions */}
                {!isPending && (
                  <div className="flex flex-col gap-4">
                    {session ? (
                      /* @ts-ignore */
                      <Link 
                        href={`/${lang}/dashboard`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full py-5 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-center uppercase tracking-widest no-underline border border-emerald-100"
                      >
                        {t.nav.dashboard}
                      </Link>
                    ) : (
                      <>
                        {/* @ts-ignore */}
                        <Link 
                          href={`/${lang}/register`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full py-5 bg-[#064e3b] text-white rounded-2xl font-black text-center uppercase tracking-widest shadow-xl no-underline"
                        >
                          {t.nav.getStarted}
                        </Link>
                        {/* @ts-ignore */}
                        <Link 
                          href={`/${lang}/login`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full py-5 bg-white border border-slate-100 text-slate-400 rounded-2xl font-black text-center uppercase tracking-widest no-underline"
                        >
                          {t.nav.login}
                        </Link>
                      </>
                    )}
                  </div>
                )}

                {/* Mobile Language Switcher */}
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                   <div className="flex items-center gap-3 text-slate-400">
                      <Globe size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">Select Language</span>
                   </div>
                   <div className="flex gap-4">
                     <button 
                       onClick={() => handleLanguageChange("en")}
                       className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${lang === 'en' ? 'bg-emerald-950 text-white shadow-lg' : 'bg-white text-slate-400'}`}
                     >
                       ENGLISH
                     </button>
                     <button 
                       onClick={() => handleLanguageChange("el")}
                       className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${lang === 'el' ? 'bg-emerald-950 text-white shadow-lg' : 'bg-white text-slate-400'}`}
                     >
                       ΕΛΛΗΝΙΚΑ
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};