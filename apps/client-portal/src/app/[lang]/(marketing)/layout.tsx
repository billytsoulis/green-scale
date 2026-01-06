"use client";

import React from "react";
/**
 * GreenScale Marketing Route Group Layout
 * Path: apps/client-portal/src/app/(marketing)/layout.tsx
 * * This layout wraps all marketing pages (About, Contact, Pricing, Projects).
 * * It ensures the Header and Footer are consistent across the site.
 */

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/shared/Footer";

export default function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <div className="flex flex-col min-h-screen" data-component="MarketingLayout">
      {/* The Header and Footer will now be aware of the 'lang' param 
        via the LanguageContext which is provided in the root [lang] layout.
      */}
      {/* @ts-ignore */}
      <Header />
      
      <main className="flex-1">
        {children}
      </main>

      {/* @ts-ignore */}
      <Footer />
    </div>
  );
}