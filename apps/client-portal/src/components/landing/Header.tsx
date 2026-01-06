"use client";

import React from "react";
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

export const Header = () => {
  /**
   * @ts-ignore - Accessing the translation hook
   */
  const { lang, setLang, t } = useTranslation();
  
  /**
   * @ts-ignore - Accessing the auth session
   */
  const { data: session, isPending } = useSession();

  /**
   * @ts-ignore - Accessing Next.js Navigation hooks
   */
  const router = useRouter();
  /**
   * @ts-ignore
   */
  const pathname = usePathname();

  const navLinks = [
    { label: t.nav.about, href: `/${lang}/about` },
    { label: t.nav.projects, href: `/${lang}/projects` },
    { label: t.nav.pricing, href: `/${lang}/pricing` },
    { label: t.nav.methodology, href: `/${lang}/methodology` },
    { label: t.nav.contact, href: `/${lang}/contact` },
  ];

  /**
   * SPA Language Switcher
   * Uses router.push to change the URL segment without a full page reload.
   */
  const handleLanguageChange = (newLang: "en" | "el") => {
    if (newLang === lang) return;
    
    // 1. Update the context state
    setLang(newLang);
    
    // 2. Resolve the new path by swapping the locale segment
    // Example: /en/about -> /el/about
    const pathSegments = pathname.split("/");
    pathSegments[1] = newLang;
    const newPath = pathSegments.join("/");

    /**
     * @ts-ignore - Client-side navigation
     */
    router.push(newPath);
  };

  return (
    <header data-component="Header" className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Identity */}
        {/* @ts-ignore */}
        <Link href={`/${lang}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-emerald-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {/* @ts-ignore */}
            <SustainabilityIcon className="text-brand-emerald-100" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">
            Green<span className="text-brand-emerald-600">Scale</span>
          </span>
        </Link>

        {/* Desktop Navigation (SPA Link-based) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            /* @ts-ignore */
            <Link 
              key={link.label}
              href={link.href}
              className={`text-sm font-bold transition-colors relative group ${
                pathname === link.href ? "text-brand-emerald-700" : "text-slate-500 hover:text-brand-emerald-700"
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-emerald-500 transition-all group-hover:w-full ${pathname === link.href ? "w-full" : "w-0"}`} />
            </Link>
          ))}
        </nav>

        {/* Action Suite */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <div className="hidden sm:flex items-center gap-2 mr-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <button 
              onClick={() => handleLanguageChange("en")}
              className={`${lang === "en" ? "text-brand-emerald-600 underline" : "hover:text-slate-600"} transition-all cursor-pointer`}
            >
              EN
            </button>
            <span className="opacity-30">|</span>
            <button 
              onClick={() => handleLanguageChange("el")}
              className={`${lang === "el" ? "text-brand-emerald-600 underline" : "hover:text-slate-600"} transition-all cursor-pointer`}
            >
              GR
            </button>
          </div>

          {!isPending && (
            <>
              {session ? (
                /* @ts-ignore */
                <Link 
                  href={`/${lang}/dashboard`}
                  className="bg-brand-emerald-50 text-brand-emerald-700 px-6 py-2.5 rounded-full font-bold text-sm border border-brand-emerald-100 hover:bg-brand-emerald-100 transition-colors shadow-sm"
                >
                  {t.nav.dashboard}
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  {/* @ts-ignore */}
                  <Link 
                    href={`/${lang}/login`}
                    className="text-sm font-bold text-slate-600 hover:text-brand-emerald-700 px-4 py-2 transition-colors"
                  >
                    {t.nav.login}
                  </Link>
                  {/* @ts-ignore */}
                  <Link 
                    href={`/${lang}/register`}
                    className="bg-brand-emerald-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-emerald-900/10"
                  >
                    {t.nav.getStarted}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};