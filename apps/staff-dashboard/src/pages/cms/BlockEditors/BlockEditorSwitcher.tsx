"use client";

import React from "react";
// @ts-ignore
import { useSearchParams } from "react-router-dom";

/**
 * Staff Dashboard - Block Editor Switcher
 * Path: apps/staff-dashboard/src/pages/cms/BlockEditors/BlockEditorSwitcher.tsx
 * Purpose: Determines which specialized editor to render based on the 'type' query param.
 * Update: Added support for Project Hero and Project Directory editors.
 */

// --- Production Ready Imports (Commented for Manual Handling) ---
/*
*/
import HeroBlockEditor from "./HeroBlockEditor";
import TeamBlockEditor from "./TeamBlockEditor";
import NarrativeBlockEditor from "./NarrativeBlockEditor";
import ProjectHeroEditor from "./ProjectHeroEditor";
import ProjectDirectoryEditor from "./ProjectDirectoryEditor";

// --- Environment Mocks for Canvas Stability ---
// @ts-ignore
// const useSearchParams = () => [new URLSearchParams(window.location.search)];
// // @ts-ignore
// const HeroBlockEditor = () => <div>Hero Block Editor</div>;
// // @ts-ignore
// const TeamBlockEditor = () => <div>Team Block Editor</div>;
// // @ts-ignore
// const NarrativeBlockEditor = () => <div>Narrative Block Editor</div>;
// // @ts-ignore
// const ProjectHeroEditor = () => <div>Project Hero Editor</div>;
// // @ts-ignore
// const ProjectDirectoryEditor = () => <div>Project Directory Editor</div>;

export default function BlockEditorSwitcher() {
  /** * By using useSearchParams, 'type' is inferred as 'string | null'.
   * This allows the switch statement to compare against different string literals.
   */
  // @ts-ignore
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

    // GS-17: New Project Module Support
    case "PROJECT_HERO":
      /* @ts-ignore */
      return <ProjectHeroEditor />;

    case "PROJECT_DIRECTORY":
      /* @ts-ignore */
      return <ProjectDirectoryEditor />;

    default:
      return (
        <div className="p-20 text-center space-y-4" data-component="EditorError">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
             ⚠️
          </div>
          <div className="text-center">
            <h2 className="text-xl font-black text-slate-900 uppercase">Unsupported Block</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2 font-medium">
              The block type <span className="font-mono text-emerald-600 font-bold">"{type}"</span> does not have a specialized editor configured in the registry.
            </p>
          </div>
        </div>
      );
  }
}