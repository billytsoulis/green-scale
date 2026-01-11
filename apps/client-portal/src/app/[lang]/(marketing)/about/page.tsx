import React from "react";

/**
 * GreenScale About Us Page - 100% Dynamic Tier B Edition
 * Path: apps/client-portal/src/app/[lang]/(marketing)/about/page.tsx
 * * Updated: Using 'nocache=true' to bypass Redis and ensure fresh data.
 * * Engine: Next.js 16.1.1 + React 19.
 */

// --- PREVIEW SAFETY IMPORTS ---
import { Card, Badge } from "@repo/ui";
import { getPageContent } from "@/lib/cms-client";
import Image from "next/image";

/**
 * Bypass Next.js Data Cache to see DB changes immediately.
 */
export const revalidate = 0;

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "el" }];
}

const dictionaries = {
  en: { about: { team_heading: "The Specialists" } },
  el: { about: { team_heading: "Οι Ειδικοί Μας" } }
};

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  // 1. Resolve parameters for Next.js 16 compliance
  const { lang } = await params;
  const isGreek = lang === "el";

  // 2. Fetch the modular layout from Gateway
  // Using nocache=true to ensure staff updates are reflected instantly
  const gatewayUrl = "http://localhost:3005";
  const res = await fetch(`${gatewayUrl}/api/cms/layout/about-us?nocache=true`);
  
  if (!res.ok) {
    return <div className="p-20 text-center text-slate-400">Failed to load content.</div>;
  }

  const { sections } = await res.json();

  /**
   * Helper to extract localized content from the JSONB columns
   */
  const getContent = (section: any) => isGreek ? section.contentEl : section.contentEn;

  return (
    <div className="min-h-screen bg-white" data-component="AboutPage">
      {sections.map((section: any) => {
        const c = getContent(section);

        switch (section.type) {
          case "HERO":
            return (
              <section key={section.id} className="py-24 bg-[#FEFCF3] border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-8 text-center space-y-6">
                  {/* @ts-ignore */}
                  <Badge className="mb-4">
                    {c.badge}
                  </Badge>
                  
                  <h1 className="text-6xl md:text-7xl font-serif font-black text-slate-900 tracking-tight leading-tight">
                    {c.title}
                  </h1>
                  
                  <p className="max-w-3xl mx-auto text-xl text-slate-500 font-medium leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </section>
            );

          case "NARRATIVE":
            return (
              <section key={section.id} className="py-24 max-w-4xl mx-auto px-8 space-y-12">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-slate-900">{c.title}</h2>
                  <p className="text-lg text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: c.paragraph1 }} />
                  <p className="text-lg text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: c.paragraph2 }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
                  <div className="p-10 bg-[#064e3b] rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-emerald-900/10">
                    <h3 className="text-2xl font-bold">{c.auditTitle}</h3>
                    <p className="text-emerald-100/70 text-sm leading-relaxed">{c.auditDesc}</p>
                  </div>
                  <div className="p-10 bg-slate-100 rounded-[2.5rem] text-slate-900 space-y-4">
                    <h3 className="text-2xl font-bold">{c.strategyTitle}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{c.strategyDesc}</p>
                  </div>
                </div>
              </section>
            );

          case "TEAM_GRID":
            return (
              <section key={section.id} className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-8">
                  <h2 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-16">
                    {c.title || (isGreek ? "ΟΙ ΕΙΔΙΚΟΙ ΜΑΣ" : "THE SPECIALISTS")}
                  </h2>
                  
                  <div className={`grid grid-cols-1 md:grid-cols-2 ${c.members?.length > 2 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-8 max-w-6xl mx-auto`}>
                    {c.members?.map((member: any, idx: number) => (
                      /* @ts-ignore */
                      <Card key={idx} className="p-10 bg-white text-center group hover:shadow-2xl transition-all">
                        <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden border-2 border-slate-50 group-hover:border-emerald-200 transition-all relative">
                          {member.imageUrl ? (
                            /* @ts-ignore */
                            <Image 
                              src={member.imageUrl} 
                              alt={member.name} 
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-serif text-slate-300 italic">
                              {member.name ? member.name[0] : "?"}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">{member.name}</h4>
                        <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mt-1 mb-4">
                          {member.role}
                        </p>
                        <div 
                          className="text-slate-500 text-sm leading-relaxed line-clamp-4" 
                          dangerouslySetInnerHTML={{ __html: member.bio }} 
                        />
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}