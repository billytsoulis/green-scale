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
      <ProjectHeroBlock data={pageData.hero} />
      <ProjectDirectoryBlock 
        lang={lang} 
        data={pageData.directory} 
      />
    </div>
  );
}