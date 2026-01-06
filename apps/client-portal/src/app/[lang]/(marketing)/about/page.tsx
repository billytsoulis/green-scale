import React from "react";

/**
 * GreenScale About Us Page - Localized Server Edition
 * Path: apps/client-portal/src/app/[lang]/(marketing)/about/page.tsx
 * * Refactored: Moved to [lang] directory for SEO subdirectory routing.
 * * Implementation: Server Component to support generateStaticParams.
 * * Fix: Awaiting params as a Promise (Next.js 15+ requirement).
 */

import { Card, Badge } from "@repo/ui";

/**
 * Pre-renders localized paths at build time.
 * This ensures /en/about and /el/about are served as static HTML.
 */
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "el" }];
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  // In Next.js 15+, params is a Promise that must be awaited
  const { lang } = await params;
  const isGreek = lang === "el";

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
            {isGreek ? "Το Όραμά Μας" : "Our Vision"}
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-serif font-black text-slate-900 tracking-tight">
            {isGreek ? (
              <>Κληρονομιά με <br/> <span className="text-brand-emerald-700 italic">Σκοπό & Απόδοση.</span></>
            ) : (
              <>A Legacy of <br/> <span className="text-brand-emerald-700 italic">Purpose & Performance.</span></>
            )}
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl text-slate-500 font-medium leading-relaxed">
            {isGreek 
              ? "Η GreenScale ιδρύθηκε με μια απλή παραδοχή: Το κεφάλαιο έχει τη δύναμη να διορθώσει τον κόσμο, αλλά μόνο αν καθοδηγείται από δεδομένα που δεν επιδέχονται greenwashing."
              : "GreenScale was founded on a single premise: Capital has the power to fix the world, but only if it's guided by data that cannot be greenwashed."
            }
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 max-w-4xl mx-auto px-8 space-y-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">
            {isGreek ? "Ριζική Λογοδοσία" : "Radical Accountability"}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {isGreek 
              ? "Για δεκαετίες, η αναφορά ESG ήταν ένα μαύρο κουτί. Οι εταιρείες ανέφεραν μόνες τους τα στοιχεία τους. Στην GreenScale, δεν πιστεύουμε στην 'εμπιστοσύνη' των αναφορών—πιστεύουμε στον 'έλεγχο' της πραγματικότητας."
              : "For decades, ESG reporting has been a black box. Companies self-reported their sustainability metrics, and banks simply consumed them. At GreenScale, we don't believe in 'trusting' reports—we believe in 'auditing' reality."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
           <div className="p-10 bg-brand-emerald-900 rounded-[2.5rem] text-white space-y-4">
              <h3 className="text-2xl font-bold">{isGreek ? "Ο Έλεγχος AI" : "The AI Audit"}</h3>
              <p className="text-brand-emerald-100/70 text-sm leading-relaxed">
                {isGreek 
                  ? "Η μηχανή μας διασταυρώνει δορυφορικά δεδομένα με εταιρικούς ισχυρισμούς για να διασφαλίσει ότι το πράσινο ομόλογό σας είναι όντως πράσινο."
                  : "Our ml-engine cross-references satellite thermal data with corporate energy claims to ensure your 'Green Bond' is actually green."
                }
              </p>
           </div>
           <div className="p-10 bg-slate-100 rounded-[2.5rem] text-slate-900 space-y-4">
              <h3 className="text-2xl font-bold">{isGreek ? "Ανθρώπινη Στρατηγική" : "Human Strategy"}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {isGreek 
                  ? "Οι διαχειριστές μας μετατρέπουν τα πολύπλοκα σκορ ESG σε μια εξατομικευμένη στρατηγική που προστατεύει το κεφάλαιό σας."
                  : "Our Wealth Managers translate complex ESG scores into a personalized investment strategy that protects your capital and your values."
                }
              </p>
           </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-16">
            {isGreek ? "Οι Ειδικοί Μας" : "The Specialists"}
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