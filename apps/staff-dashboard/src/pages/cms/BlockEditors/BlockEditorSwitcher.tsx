import React from "react";
import { useSearchParams } from "react-router-dom";
import HeroBlockEditor from "./HeroBlockEditor";
import TeamBlockEditor from "./TeamBlockEditor";
import NarrativeBlockEditor from "./NarrativeBlockEditor";

/**
 * Block Editor Switcher
 * Path: apps/staff-dashboard/src/pages/cms/BlockEditors/BlockEditorSwitcher.tsx
 * Purpose: Determines which specialized editor to render based on the 'type' query param.
 * Example URL: /cms/about-us/edit/uuid?type=HERO
 */

export default function BlockEditorSwitcher() {
  /** * By using useSearchParams, 'type' is inferred as 'string | null'.
   * This allows the switch statement to compare against different string literals.
   */
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  switch (type) {
    case "HERO":
      /* @ts-ignore */
      return <HeroBlockEditor />;
    case "TEAM_GRID":
      /* @ts-ignore */
      return <TeamBlockEditor />;
    case "NARRATIVE":
      /* @ts-ignore */
      return <NarrativeBlockEditor />;
    default:
      return (
        <div className="p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
             {/* Icon Placeholder */}
             ⚠️
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Unsupported Block Type</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
              The block type <span className="font-mono text-brand-emerald-600">"{type}"</span> does not have a specialized editor configured yet.
            </p>
          </div>
        </div>
      );
  }
}