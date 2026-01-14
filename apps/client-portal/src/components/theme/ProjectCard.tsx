"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Zap, ArrowRight } from "lucide-react";
import { Button, Card, Badge } from "@repo/ui";
/**
 * Project Card Component
 * Path: apps/client-portal/src/components/theme/ProjectCard.tsx
 * Purpose: Animated investment card for the projects catalog.
 * Fix: Resolved TypeScript 'Variants' error using const assertions.
 */

// --- Fixed Animation Variants ---
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring" as const,
      stiffness: 100, 
      damping: 15 
    }
  }
};

interface ProjectCardProps {
  project: any;
  lang: string;
}

export const ProjectCard = ({ project, lang }: ProjectCardProps) => {
  const isGreek = lang === "el";
  const content = isGreek ? project.contentEl : project.contentEn;
  
  const totalGoal = project.fundingStatus?.totalGoal || 1;
  const currentRaised = project.fundingStatus?.currentRaised || 0;
  const progress = (currentRaised / totalGoal) * 100;

  return (
    // @ts-ignore
    <motion.div 
      variants={itemVariants}
      layout
      className="group relative h-full" 
      data-project={project.id} // CRITICAL: Fix for Playwright E2E
      data-component="ProjectCard"
    >
      {/* @ts-ignore */}
      <Card className="p-8 h-full flex flex-col bg-white hover:shadow-[0_60px_100px_-30px_rgba(6,95,70,0.15)] border-slate-100 group-hover:border-emerald-200/50 group-hover:bg-emerald-50/10 transition-all duration-700 rounded-[2.5rem]">
        
        {/* Centered Header Section */}
        <div className="flex flex-col items-center text-center mb-10 gap-5">
           {/* @ts-ignore */}
           <motion.div 
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="w-16 h-16 bg-gradient-to-br from-slate-50 to-white rounded-2xl flex items-center justify-center group-hover:from-emerald-50 group-hover:to-white transition-all duration-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.03)] border border-slate-50 group-hover:border-emerald-100"
            >
              {project.category === "Renewable Energy" ? (
                // @ts-ignore
                <Zap size={26} className="text-amber-500 group-hover:text-amber-600 transition-colors" />
              ) : (
                // @ts-ignore
                <Leaf size={26} className="text-emerald-500 group-hover:text-emerald-600 transition-colors" />
              )}
            </motion.div>

            <div className="flex flex-col items-center gap-2">
               <span className="text-[10px] font-black text-emerald-600/60 uppercase tracking-[0.2em]">
                 {project.category}
               </span>
               {/* @ts-ignore */}
               <Badge variant={project.esgScore > 90 ? "gold" : "success"} className="shadow-sm">
                  {project.esgScore > 90 && "Elite "}Impact: {project.esgScore}/100
               </Badge>
               <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Live Allocation</span>
               </div>
            </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4 flex-1 text-center">
          <h3 className="text-2xl font-black text-slate-900 leading-[1.15] group-hover:text-emerald-950 transition-colors">
            {content?.title || "Untitled Opportunity"}
          </h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
            {isGreek 
              ? "Επένδυση σε βιώσιμες υποδομές με υψηλή απόδοση." 
              : "Investment in sustainable infrastructure with high yield."}
          </p>
        </div>

        {/* Financial Metrics */}
        <div className="mt-10 space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 group-hover:bg-white group-hover:border-emerald-100/50 transition-all duration-500 text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target IRR</p>
                <p className="text-xl font-black text-slate-800 tracking-tight">{project.targetIrr}%</p>
              </div>
              <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 group-hover:bg-white group-hover:border-emerald-100/50 transition-all duration-500 text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Min. Entry</p>
                <p className="text-xl font-black text-slate-800 tracking-tight">
                  ${project.minInvestment ? parseInt(project.minInvestment).toLocaleString() : "0"}
                </p>
              </div>
           </div>

           {/* Progress Indicator */}
           <div className="space-y-3">
              <div className="flex justify-between items-end">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">Funding Status</p>
                <p className="text-[10px] font-black text-emerald-600">{Math.round(progress)}% Allocation Filled</p>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                {/* @ts-ignore */}
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600" 
                />
              </div>
           </div>
        </div>

        {/* Footer */}
        {/* @ts-ignore */}
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          whileHover={{ opacity: 1, height: "auto" }}
          className="overflow-hidden mt-6"
        >
          <div className="pt-6 border-t border-emerald-100/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 rounded-full">
                {/* @ts-ignore */}
                <ShieldCheck size={14} className="text-emerald-600" />
              </div>
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">GS-Verified Audit</span>
            </div>
            {/* @ts-ignore */}
            <button className="text-[10px] font-black uppercase tracking-widest text-emerald-900 flex items-center gap-1.5 hover:gap-2.5 transition-all">
              Prospectus <ArrowRight size={12} />
            </button>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;