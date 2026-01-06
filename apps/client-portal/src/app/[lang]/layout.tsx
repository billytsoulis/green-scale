import type { Metadata } from "next";
// Correcting the relative import path to ensure the build tool resolves the stylesheet correctly
import "../globals.css";
import { LanguageProvider } from "../../context/LanguageContext";

/**
 * GreenScale Root Layout
 * Path: apps/client-portal/src/app/layout.tsx
 * * This is the entry point for the entire Client Portal.
 */

export const metadata: Metadata = {
  title: "GreenScale | ESG-First Wealth Management",
  description: "The premier wealth platform for high-net-worth individuals focused on sustainable impact and alpha.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang === "el" ? "el" : "en"} className="scroll-smooth">
      <head>
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
        {/* @ts-ignore - Providing the localized context to all client and server children */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}