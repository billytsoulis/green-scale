import type { Metadata } from "next";
// Correcting the relative import path to ensure the build tool resolves the stylesheet correctly
import "./globals.css";

/**
 * GreenScale Root Layout
 * Path: apps/client-portal/src/app/layout.tsx
 * * This is the entry point for the entire Client Portal.
 */

export const metadata: Metadata = {
  title: "GreenScale | ESG-First Wealth Management",
  description: "The premier wealth platform for high-net-worth individuals focused on sustainable impact and alpha.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Playfair Display for Serifs & Inter for Sans */}
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased font-sans bg-white text-slate-900 selection:bg-brand-emerald-100 selection:text-brand-emerald-900">
        {children}
      </body>
    </html>
  );
}