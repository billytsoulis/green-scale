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
  // 1. Resolve parameters
  const { lang } = await params;
  const t = lang === "el" ? dictionaries.el : dictionaries.en;

  /** * 2. Fetch Tier B Content
   * We add '&nocache=true' to the language string. 
   * This tells the API Gateway to skip Redis and hit PostgreSQL directly.
   * @ts-ignore
   */
  const content = await getPageContent("about", lang + "&nocache=true");

  const getC = (key: string) => (content && content[key]) || "";

  /**
   * 3. Construct Team Data Dynamically
   * Logic: Filters out empty slots. Since we use nocache, 
   * 'team_1_name' and 'team_2_name' from the seed should now be visible.
   */
  const teamIds = [1, 2, 3, 4];
  const team = teamIds.map(id => ({
    name: getC(`team_${id}_name`),
    role: getC(`team_${id}_role`),
    bio: getC(`team_${id}_bio`),
    imageUrl: getC(`team_${id}_img`)
  })).filter(m => m.name && m.name.trim() !== ""); 

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
          <h2 className="text-3xl font-bold text-slate-900">{getC("narrative_title")}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">{getC("narrative_p1")}</p>
          <p className="text-lg text-slate-600 leading-relaxed">{getC("narrative_p2")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
           <div className="p-10 bg-brand-emerald-900 rounded-[2.5rem] text-white space-y-4">
              <h3 className="text-2xl font-bold">{getC("audit_title")}</h3>
              <p className="text-brand-emerald-100/70 text-sm leading-relaxed">{getC("audit_desc")}</p>
           </div>
           <div className="p-10 bg-slate-100 rounded-[2.5rem] text-slate-900 space-y-4">
              <h3 className="text-2xl font-bold">{getC("strategy_title")}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{getC("strategy_desc")}</p>
           </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-16">
            {t.about.team_heading}
          </h2>
          
          {team.length === 0 ? (
            <div className="max-w-xl mx-auto text-center p-12 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white">
              <p className="text-slate-400 font-medium">No team members visible yet.</p>
              <p className="text-xs text-slate-300 uppercase tracking-widest mt-2">
                Syncing with PostgreSQL...
              </p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${team.length > 2 ? 'lg:grid-cols-3' : ''} gap-8 max-w-6xl mx-auto`}>
              {team.map((member, idx) => (
                /* @ts-ignore */
                <Card key={idx} variant="elevated" className="p-10 bg-white text-center group">
                  <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden border-2 border-slate-50 group-hover:border-brand-emerald-200 transition-all relative">
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
                       <span className="text-2xl font-serif text-slate-300 italic">{member.name[0]}</span>
                     )}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">{member.name}</h4>
                  <p className="text-brand-emerald-600 font-bold text-xs uppercase tracking-widest mt-1 mb-4">
                    {member.role}
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}