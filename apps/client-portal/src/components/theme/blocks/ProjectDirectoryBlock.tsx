"use client";

import React, { useState, useEffect, useMemo } from "react";

/**
 * GreenScale Theme: Project Directory Block
 * Path: apps/client-portal/src/components/theme/blocks/ProjectDirectoryBlock.tsx
 * Purpose: Encapsulates the project grid, filtering logic, and auditing sidebar.
 */

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Filter } from "lucide-react";
import ProjectCard from "@/components/theme/ProjectCard";
import ProjectsSkeleton from "./ProjectsSkeleton";

const GATEWAY_URL = "http://localhost:3005";

interface ProjectDirectoryBlockProps {
  lang: string;
  data: {
    filterTitle?: string;
    auditTitle?: string;
    auditDescription?: string;
    emptyStateText?: string;
  };
}

export const ProjectDirectoryBlock = ({ lang, data }: ProjectDirectoryBlockProps) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const {
    filterTitle = "Refine Inventory",
    auditTitle = "Institutional Grade Auditing",
    auditDescription = "Every project in this catalog has passed our proprietary AI audit for ESG claim verification.",
    emptyStateText = "No active allocations currently available in this sector."
  } = data || {};

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProjects = async () => {
      try {
        const res = await fetch(`${GATEWAY_URL}/api/projects`, { signal });
        if (res.ok) {
          const results = await res.json();
          if (Array.isArray(results)) {
            setProjects(results.filter((p: any) => p.status === "ACTIVE"));
          }
        }
      } catch (err: any) { 
        if (err.name !== 'AbortError') console.error("[ProjectDirectoryBlock] Fetch Error:", err); 
      } finally {
        // intentional delay for skeleton testing
        setTimeout(() => {
          if (!signal.aborted) setLoading(false);
        }, 3000);
      }
    };

    fetchProjects();
    return () => controller.abort();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!activeCategory || activeCategory === "ALL") return projects;
    return projects.filter(p => {
      const pCat = (p.category || "").trim().toLowerCase();
      const aCat = activeCategory.trim().toLowerCase();
      return pCat === aCat;
    });
  }, [projects, activeCategory]);

  /**
   * GS-31 Implementation:
   * Replaced simple text with the high-fidelity skeleton grid.
   */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 flex flex-col lg:flex-row gap-20">
        <aside className="lg:w-80 space-y-12 opacity-50 pointer-events-none">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Filter size={16} className="text-slate-300" />
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic leading-none">{filterTitle}</h4>
              </div>
              <div className="h-40 w-full bg-slate-50 rounded-2xl animate-pulse" />
           </div>
        </aside>
        <main className="flex-1">
          <ProjectsSkeleton lang={lang} />
        </main>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-24 flex flex-col lg:flex-row gap-20" data-component="ProjectDirectoryBlock">
      {/* 1. Filter Sidebar */}
      <aside className="lg:w-80 space-y-12 text-left">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            {/* @ts-ignore */}
            <Filter size={16} className="text-slate-300" />
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic leading-none">{filterTitle}</h4>
          </div>
          <nav className="flex flex-col gap-2">
            {["ALL", "Renewable Energy", "Sustainable Infrastructure", "Reforestation"].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-left px-5 py-4 rounded-2xl font-bold transition-all text-sm relative overflow-hidden group border-none cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-emerald-950 text-white shadow-2xl shadow-emerald-950/20' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900 bg-transparent'
                }`}
              >
                <span className="relative z-10">{cat === "ALL" ? (lang === 'el' ? "Όλοι οι Τομείς" : "All Sectors") : cat}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Audit Block */}
        {/* @ts-ignore */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-10 bg-emerald-950 text-white rounded-[2.5rem] space-y-6 shadow-2xl border border-emerald-800"
        >
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            {/* @ts-ignore */}
            <ShieldCheck size={24} className="text-emerald-400" />
          </div>
          <h5 className="text-xl font-bold leading-tight" dangerouslySetInnerHTML={{ __html: auditTitle }} />
          <p className="text-xs text-emerald-200/50 leading-relaxed">{auditDescription}</p>
        </motion.div>
      </aside>

      {/* 2. Main Grid View */}
      <main className="flex-1 space-y-12 min-h-[600px]">
        <header className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-left leading-none">
            {lang === 'el' ? `Μητρώο: ${filteredProjects.length} Ευκαιρίες` : `Registry Index: ${filteredProjects.length} Opportunities Found`}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* @ts-ignore */}
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} lang={lang} />
              ))
            ) : (
              // @ts-ignore
              <motion.div 
                key="empty"
                className="col-span-full py-40 text-center border-2 border-dashed border-slate-100 rounded-[3.5rem] bg-slate-50/50"
              >
                <p className="text-slate-300 font-black uppercase tracking-widest text-[11px]">{emptyStateText}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default ProjectDirectoryBlock;