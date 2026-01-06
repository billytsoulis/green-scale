import React from "react";

/**
 * GreenScale Localized Home Page (Server Component)
 * Path: apps/client-portal/src/app/[lang]/(marketing)/page.tsx
 * * Refactored: Removed "use client" to support generateStaticParams.
 * * This is the Next.js best practice for SEO-optimized i18n.
 */

// import { Header } from "../../../components/landing/Header";
// import { Footer } from "../../../components/shared/Footer";
import { Hero } from "../../../components/landing/Hero";
import { ImpactTicker } from "../../../components/landing/ImpactTicker";
import { ESGPillars } from "../../../components/landing/ESGPillars";
import { FeaturedProjects } from "../../../components/landing/FeaturedProjects";

/**
 * Pre-renders both language versions at build time for instant loading.
 * This must remain in a Server Component.
 */
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "el" }];
}

// Mock Dictionaries for the Server Component (as paths aren't resolvable in preview)
const en = {
  nav: { getStarted: "Get Started Now", methodology: "View Methodology" }
};

const el = {
  nav: { getStarted: "Ξεκινήστε Τώρα", methodology: "Δείτε τη Μεθοδολογία" }
};

export default function MarketingHomePage({ params }: { params: { lang: string } }) {
  // Select dictionary based on the URL param directly (Server-side)
  const t = params.lang === "el" ? el : en;

  return (
    <div className="flex flex-col min-h-screen bg-white" data-component="MarketingHomePage">
      <main className="flex-1">
        {/* Block 2: Hero & Audit Widget (Internally translated) */}
        {/* @ts-ignore */}
        <Hero />

        {/* Block 3: Live Impact Ticker */}
        {/* @ts-ignore */}
        <ImpactTicker />

        {/* Block 4: The Three Pillars (E-S-G) (Internally translated) */}
        {/* @ts-ignore */}
        <ESGPillars />

        {/* Block 5: The Staff Advantage (Hybrid Human+AI Model) */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-xs font-black text-brand-emerald-400 uppercase tracking-[0.4em]">
                {params.lang === "el" ? "ΤΟ ΥΒΡΙΔΙΚΟ ΜΟΝΤΕΛΟ" : "The Hybrid Model"}
              </h2>
              <h3 className="text-5xl font-serif font-bold leading-tight">
                {params.lang === "el" ? (
                  <>AI Έλεγχος. <br/>Expert Στρατηγική.</>
                ) : (
                  <>AI Audited. <br/>Expert Strategized.</>
                )}
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                {params.lang === "el" 
                  ? "Ενώ οι αλγόριθμοί μας σαρώνουν εκατομμύρια σημεία δεδομένων για την επαλήθευση των ισχυρισμών ESG, οι εξειδικευμένοι διαχειριστές μας επιμελούνται τη στρατηγική που ταιριάζει στους μακροπρόθεσμους στόχους σας."
                  : "While our algorithms scan millions of data points to verify ESG claims, our human wealth managers curate the strategy to match your family's long-term legacy goals."
                }
              </p>
              <div className="pt-4">
                <button className="px-8 py-4 bg-brand-emerald-600 text-white rounded-2xl font-bold hover:bg-brand-emerald-500 transition-all shadow-lg shadow-emerald-900/20">
                  {params.lang === "el" ? "Γνωρίστε την Ομάδα" : "Meet the Strategy Team"}
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-2xl">
                <div className="text-center space-y-4">
                   <div className="w-16 h-16 bg-brand-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                      <div className="w-8 h-8 border-2 border-brand-emerald-400 rounded-lg animate-pulse" />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest text-brand-emerald-400">
                     {params.lang === "el" ? "Διεπαφή Analytics" : "Staff Analytics Interface"}
                   </p>
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-emerald-500/10 blur-[120px] rounded-full" />
            </div>
          </div>
        </section>

        {/* Block 6: Featured Projects Preview */}
        {/* @ts-ignore */}
        <FeaturedProjects />

        {/* Block 8: Final Conversion Section */}
        <section className="py-32 bg-[#FEFCF3] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          </div>

          <div className="max-w-4xl mx-auto px-8 text-center space-y-10 relative z-10">
            <h2 className="text-6xl md:text-7xl font-serif font-black text-slate-900 tracking-tight leading-[1.1]">
              {params.lang === "el" 
                ? <>Είστε έτοιμοι να Ευθυγραμμίσετε τον <br/>Πλούτο με τις Αξίες σας;</>
                : <>Ready to Align Your <br/>Wealth with Your Values?</>
              }
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              {params.lang === "el"
                ? "Γίνετε μέλος μιας επιλεγμένης ομάδας Ευρωπαίων επενδυτών που μετασχηματίζουν το παγκόσμιο κεφάλαιο προς ένα βιώσιμο και κερδοφόρο μέλλον."
                : "Join a select group of European investors transitioning the world's capital toward a sustainable and profitable future."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="px-10 py-5 bg-brand-emerald-900 text-white rounded-[2rem] font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-emerald-900/20 active:scale-95">
                {t.nav.getStarted}
              </button>
              <button className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-bold text-lg hover:bg-slate-50 transition-all shadow-sm">
                {t.nav.methodology}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}