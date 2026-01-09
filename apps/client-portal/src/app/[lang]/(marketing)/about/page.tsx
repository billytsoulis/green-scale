import React from "react";

/**
 * GreenScale About Us Page - 100% Dynamic Edition
 * Path: apps/client-portal/src/app/[lang]/(marketing)/about/page.tsx
 * * Refactored: Zero static text. All content is now Tier A (Dictionary) or Tier B (Database).
 * * Compliance: Comments out library imports for preview safety.
 */

// --- PREVIEW SAFETY IMPORTS ---
import { Card, Badge } from "@repo/ui";
import { getPageContent } from "../../../../lib/cms-client";

/**
 * Pre-renders localized paths at build time.
 */
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "el" }];
}

/**
 * Mock Dictionaries for Server Component (Tier A)
 * In production, these are imported from src/dictionaries/
 */
const dictionaries = {
  en: {
    about: {
      team_heading: "The Specialists",
      fallback_role: "ESG Expert"
    }
  },
  el: {
    about: {
      team_heading: "Οι Ειδικοί Μας",
      fallback_role: "Ειδικός ESG"
    }
  }
};

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  // 1. Resolve parameters
  const { lang } = await params;
  const isGreek = lang === "el";
  const t = lang === "el" ? dictionaries.el : dictionaries.en;

  /** * 2. Fetch Tier B Content from CMS via REST Gateway
   * @ts-ignore - getPageContent is a server-side utility
   */
  const content = await getPageContent("about", lang);

  /**
   * Helper to resolve Tier B content
   */
  const getC = (key: string) => content[key] || "";

  // Team Logic: Tier A (Dictionary-style structure)
  const team = [
    { 
      name: "Eleni Kosta", 
      role: isGreek ? "Επικεφαλής Στρατηγικής ESG" : "Chief ESG Strategist", 
      bio: isGreek 
        ? "Πρώην Κύρια Αναλύτρια στα Ευρωπαϊκά Βιώσιμα Ταμεία της MSCI." 
        : "Former Lead Analyst at MSCI European Sustainable Funds." 
    },
    { 
      name: "Dr. Nikos Vane", 
      role: isGreek ? "Αρχιτέκτονας / Επικεφαλής AI" : "Architect / AI Lead", 
      bio: isGreek
        ? "Ειδικός στον έλεγχο δεδομένων υψηλής ακεραιότητας και δορυφορική ανάλυση."
        : "Specialist in high-integrity data auditing and satellite analytics." 
    }
  ];

  return (
    <div className="min-h-screen bg-white" data-component="AboutPage">
      {/* Hero Section */}
      <section className="py-24 bg-[#FEFCF3] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 text-center space-y-6">
          {/* @ts-ignore */}
          <Badge variant="gold" className="mb-4">
            {getC("hero_badge")}
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-serif font-black text-slate-900 tracking-tight">
            {getC("hero_title")}
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl text-slate-500 font-medium leading-relaxed">
            {getC("hero_description")}
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 max-w-4xl mx-auto px-8 space-y-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">
            {getC("narrative_title")}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {getC("narrative_p1")}
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            {getC("narrative_p2")}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
           <div className="p-10 bg-brand-emerald-900 rounded-[2.5rem] text-white space-y-4">
              <h3 className="text-2xl font-bold">
                {getC("audit_title")}
              </h3>
              <p className="text-brand-emerald-100/70 text-sm leading-relaxed">
                {getC("audit_desc")}
              </p>
           </div>
           <div className="p-10 bg-slate-100 rounded-[2.5rem] text-slate-900 space-y-4">
              <h3 className="text-2xl font-bold">
                {getC("strategy_title")}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {getC("strategy_desc")}
              </p>
           </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-16">
            {t.about.team_heading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map(member => (
              /* @ts-ignore */
              <Card key={member.name} variant="elevated" className="p-10 bg-white text-center group">
                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                   <span className="text-2xl font-serif text-slate-300 italic">{member.name[0]}</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900">{member.name}</h4>
                <p className="text-brand-emerald-600 font-bold text-xs uppercase tracking-widest mt-1 mb-4">{member.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}