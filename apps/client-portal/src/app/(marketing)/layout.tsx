"use client";

import React from "react";
/**
 * GreenScale Marketing Route Group Layout
 * Path: apps/client-portal/src/app/(marketing)/layout.tsx
 * * This layout wraps all marketing pages (About, Contact, Pricing, Projects).
 * * It ensures the Header and Footer are consistent across the site.
 */

import { Header } from "../../components/landing/Header";
import { Footer } from "../../components/shared/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* @ts-ignore - Header is shared across all marketing pages */}
      <Header />
      
      <main className="flex-1">
        {children}
      </main>

      {/* @ts-ignore - Footer is shared across all marketing pages */}
      <Footer />
    </div>
  );
}