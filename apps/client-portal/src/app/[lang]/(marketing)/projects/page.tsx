"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck, Info, Filter } from "lucide-react";
import { Badge } from "@repo/ui";
import { ProjectCard } from "@/components/theme/ProjectCard";

const GATEWAY_URL = "http://localhost:3005";
/**
 * Client Portal - Projects Directory (Phase 4: Extraordinary Animations)
 * Path: apps/client-portal/src/app/[lang]/(marketing)/projects/page.tsx
 * Purpose: High-performance, animated investment catalog for investors.
 * UX: Layout morphing, staggered grid entry, and sophisticated hover reveals.
 */

const LocalBadge = ({ children, variant = "info", className = "" }: any) => {
  const variants: any = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    info: "bg-slate-50 text-slate-500 border-slate-100",
    gold: "bg-amber-50 text-amber-600 border-amber-200 shadow-sm"
  };
  return <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${variants[variant]} ${className}`}>{children}</span>;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  
  // @ts-ignore
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProjects = async () => {
      try {
        const res = await fetch(`${GATEWAY_URL}/api/projects`, { signal });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Only show projects that are ACTIVE
            setProjects(data.filter((p: any) => p.status === "ACTIVE"));
          }
        }
      } catch (err: any) { 
        if (err.name !== 'AbortError') console.error("[Frontend] Fetch Error:", err); 
      } finally { 
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchProjects();
    return () => controller.abort();
  }, []);

  // Strict Filtering logic to resolve "always 2 results" issue
  const filteredProjects = useMemo(() => {
    // If 'ALL' is selected, return the full list
    if (!activeCategory || activeCategory === "ALL") {
      return projects;
    }

    // Return only strictly matched categories
    return projects.filter(p => {
      const pCat = (p.category || "").trim().toUpperCase();
      const aCat = activeCategory.trim().toUpperCase();
      return pCat === aCat;
    });
  }, [projects, activeCategory]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Establishing Audit Session...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white" data-component="ProjectsPage">
      {/* Hero Section */}
      <section className="py-32 bg-[#FEFCF3] border-b border-slate-100 relative overflow-hidden">
        {/* @ts-ignore */}
        <motion.div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-10">
           <LocalBadge variant="success" className="px-6 py-2">The Investor Registry</LocalBadge>
           <h1 className="text-7xl md:text-[9rem] font-serif font-black text-slate-900 tracking-tighter leading-[0.85]">
             Capital for a <br/><span className="text-emerald-800">Greener Legacy.</span>
           </h1>
           <p className="max-w-2xl mx-auto text-xl text-slate-500 font-medium leading-relaxed">
             A high-performance catalog of verified, sustainable investment opportunities.
           </p>
        </motion.div>
      </section>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto px-8 py-24 flex flex-col lg:flex-row gap-20">
        
        {/* Sidebar */}
        <aside className="lg:w-80 space-y-12">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                {/* @ts-ignore */}
                <Filter size={16} className="text-slate-300" />
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Refine Inventory</h4>
              </div>
              <nav className="flex flex-col gap-2">
                {["ALL", "Renewable Energy", "Sustainable Infrastructure", "Reforestation"].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left px-5 py-4 rounded-2xl font-bold transition-all text-sm relative overflow-hidden group ${
                      activeCategory === cat 
                        ? 'bg-emerald-950 text-white shadow-2xl' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="relative z-10">{cat === "ALL" ? "All Specialist Sectors" : cat}</span>
                  </button>
                ))}
              </nav>
           </div>

           {/* @ts-ignore */}
           <motion.div 
             whileHover={{ scale: 1.02 }}
             className="p-10 bg-emerald-950 text-white rounded-[2.5rem] space-y-6 shadow-2xl border border-emerald-800"
           >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
              <h5 className="text-xl font-bold leading-tight">Institutional <br/>Grade Auditing</h5>
              <p className="text-xs text-emerald-200/50 leading-relaxed">
                Passed our proprietary AI audit for ESG claim verification and financial stability.
              </p>
           </motion.div>
        </aside>

        {/* Project List */}
        <main className="flex-1 space-y-12 min-h-[600px]">
           <header className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Registry Index: {filteredProjects.length} Opportunities Found
              </p>
           </header>

           {/* @ts-ignore */}
           <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* @ts-ignore */}
              <AnimatePresence mode="popLayout">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    // @ts-ignore
                    <ProjectCard key={project.id} project={project} lang={lang} />
                  ))
                ) : (
                  // @ts-ignore
                  <motion.div 
                    key="empty"
                    className="col-span-full py-40 text-center border-2 border-dashed border-slate-100 rounded-[3.5rem] bg-slate-50/50"
                  >
                     <p className="text-slate-300 font-black uppercase tracking-widest text-[11px]">No active allocations currently available in this sector.</p>
                  </motion.div>
                )}
              </AnimatePresence>
           </motion.div>
        </main>
      </div>
    </div>
  );
}