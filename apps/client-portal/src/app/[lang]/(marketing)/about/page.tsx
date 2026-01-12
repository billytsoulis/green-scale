import React from "react";

/**
 * GreenScale About Us Page - 100% Dynamic Tier B Edition
 * Path: apps/client-portal/src/app/[lang]/(marketing)/about/page.tsx
 * * Updated: Using 'nocache=true' to bypass Redis and ensure fresh data.
 * * Engine: Next.js 16.1.1 + React 19.
 */

import { HeroBlock } from "@/components/theme/blocks/HeroBlock";
import { NarrativeBlock } from "@/components/theme/blocks/NarrativeBlock";
import { TeamGridBlock } from "@/components/theme/blocks/TeamGridBlock";

/**
 * Bypass Next.js Data Cache to see DB changes immediately.
 */
export const revalidate = 0;

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "el" }];
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  // 1. Resolve parameters for Next.js 16 compliance
  const { lang } = await params;
  const isGreek = lang === "el";

  // 2. Fetch the modular layout from Gateway
  // Using nocache=true to ensure staff updates are reflected instantly
  const gatewayUrl = "http://localhost:3005";
  const res = await fetch(`${gatewayUrl}/api/cms/layout/about-us?nocache=true`);
  
  if (!res.ok) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4 text-slate-400">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-medium">Hydrating Marketing Layout...</p>
        </div>
      </div>
    );
  }

  const { sections } = await res.json();

  /**
   * Helper to extract localized content from the JSONB columns
   */
  const getContent = (section: any) => isGreek ? section.contentEl : section.contentEn;

  return (
    <div className="min-h-screen bg-white" data-component="AboutPage">
      {sections.map((section: any) => {
        const content = getContent(section);

        switch (section.type) {
          case "HERO":
            /* @ts-ignore - HeroBlock utilized in production */
            return <HeroBlock key={section.id} data={content} />;

          case "NARRATIVE":
            /* @ts-ignore - NarrativeBlock utilized in production */
            return <NarrativeBlock key={section.id} data={content} />;

          case "TEAM_GRID":
            /* @ts-ignore - TeamGridBlock utilized in production */
            return <TeamGridBlock key={section.id} data={content} />;

          default:
            return (
              <div key={section.id} className="p-10 border border-dashed text-slate-300 text-center">
                Unknown Block Type: {section.type}
              </div>
            );
        }
      })}
    </div>
  );
}