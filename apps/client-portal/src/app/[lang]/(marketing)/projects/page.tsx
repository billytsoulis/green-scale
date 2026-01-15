"use client";

import React from "react";

import { useParams } from "next/navigation";
import { ProjectHeroBlock } from "@/components/theme/blocks/ProjectHeroBlock";
import { ProjectDirectoryBlock } from "@/components/theme/blocks/ProjectDirectoryBlock";

/**
 * Client Portal - Projects Directory (Modular Version)
 * Path: apps/client-portal/src/app/[lang]/(marketing)/projects/page.tsx
 * Purpose: Acts as a controller that orchestrates modular blocks.
 * Logic: Simulates the "Block Rendering" behavior where data is passed to specialized components.
 */

export default function ProjectsPage() {
  // @ts-ignore
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  /**
   * Mocked CMS Data Structure
   * In the final production environment, this data is fetched from the API Gateway:
   * GET /api/cms/layout/projects
   */
  const pageData = {
    hero: {
      badge: lang === "el" ? "Το Μητρώο Επενδυτών" : "The Investor Registry",
      title: lang === "el" 
        ? "Κεφάλαιο για μια <br/><span className='text-emerald-800'>Πράσινη Κληρονομιά.</span>" 
        : "Capital for a <br/><span className='text-emerald-800'>Greener Legacy.</span>",
      description: lang === "el"
        ? "Ένας κατάλογος υψηλής απόδοσης με επαληθευμένες, βιώσιμες επενδυτικές ευκαιρίες βελτιστοποιημένος για διαχείριση ιδιωτικού πλούτου."
        : "A high-performance catalog of verified, sustainable investment opportunities optimized for private wealth management."
    },
    directory: {
      filterTitle: lang === "el" ? "Φιλτράρισμα Αποθέματος" : "Refine Inventory",
      auditTitle: lang === "el" ? "Έλεγχος Θεσμικού <br/>Επιπέδου" : "Institutional <br/>Grade Auditing",
      auditDescription: lang === "el"
        ? "Κάθε έργο σε αυτόν τον κατάλογο έχει περάσει από τον ιδιόκτητο έλεγχο AI για την επαλήθευση των ισχυρισμών ESG."
        : "Every project in this catalog has passed our proprietary AI audit for ESG claim verification and financial stability.",
      emptyStateText: lang === "el"
        ? "Δεν υπάρχουν διαθέσιμες κατανομές αυτήν τη στιγμή σε αυτόν τον τομέα."
        : "No active allocations currently available in this sector."
    }
  };

  return (
    <div className="min-h-screen bg-white" data-component="ProjectsPage">
      {/* Layer 2: Modular Block Orchestration 
        Instead of a monolithic file, we now call atomic blocks.
      */}
      
      {/* 1. Project Hero Block */}
      {/* @ts-ignore */}
      <ProjectHeroBlock data={pageData.hero} />

      {/* 2. Project Directory Block (Handles both bilingual labels and Data-fetching logic) */}
      {/* @ts-ignore */}
      <ProjectDirectoryBlock 
        lang={lang} 
        data={pageData.directory} 
      />
    </div>
  );
}