"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Zap, ArrowRight, Wallet } from "lucide-react";
import { Card, Badge } from "@repo/ui";
import { io } from "socket.io-client";
import { ProjectInvestmentModal } from "../modals/ProjectInvestmentModal";

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

  // 1. Transactional & UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 2. Real-Time Funding State (Phase 5 Integrated)
  const [funding, setFunding] = useState({
    currentRaised: parseFloat(project.fundingStatus?.currentRaised || 0),
    investorCount: project.fundingStatus?.investorCount || 0,
    totalGoal: parseFloat(project.fundingStatus?.totalGoal || 1)
  });

  const GATEWAY_URL = "http://localhost:3005";

  // 3. WebSocket Orchestration
  useEffect(() => {
    const socket = io(GATEWAY_URL);

    // @ts-ignore
    socket.on("project:update", (data: any) => {
      if (data.projectId === project.id) {
        console.log(`📡 [Live] Project ${project.id} updated via Socket.io`);
        setFunding(prev => ({
          ...prev,
          currentRaised: parseFloat(data.currentRaised),
          investorCount: data.investorCount
        }));
      }
    });

    return () => {
      // @ts-ignore
      socket.disconnect();
    };
  }, [project.id]);

  /**
   * handleSuccess: Local celebration and mock progress update
   */
  const handleInvestmentSuccess = () => {
    setShowSuccess(true);
    // Simulate immediate local UI update for the demo
    setFunding(prev => ({ ...prev, currentRaised: prev.currentRaised + 5000 }));
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const progress = (funding.currentRaised / funding.totalGoal) * 100;

  return (
    <>
      {/* @ts-ignore */}
      <motion.div 
        variants={itemVariants}
        layout
        className={`group relative h-full transition-all duration-700 ${showSuccess ? 'ring-2 ring-emerald-500 ring-offset-4 rounded-[2.5rem]' : ''}`}
        data-project={project.id} 
        data-component="ProjectCard"
      >
        {/* @ts-ignore */}
        <Card className="p-8 h-full flex flex-col bg-white hover:shadow-[0_60px_100px_-30px_rgba(6,95,70,0.15)] border-slate-100 group-hover:border-emerald-200/50 group-hover:bg-emerald-50/10 transition-all duration-700 rounded-[2.5rem] border border-solid overflow-hidden relative">
          
          {/* Centered Header Section */}
          <div className="flex flex-col items-center text-center mb-10 gap-5">
             {/* @ts-ignore */}
             <motion.div 
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="w-16 h-16 bg-gradient-to-br from-slate-50 to-white rounded-2xl flex items-center justify-center group-hover:from-emerald-50 group-hover:to-white transition-all duration-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.03)] border border-slate-50 group-hover:border-emerald-100 text-2xl"
              >
                {project.category === "Renewable Energy" ? <Zap /> : <Leaf />}
              </motion.div>

              <div className="flex flex-col items-center gap-2">
                 <span className="text-[10px] font-black text-emerald-600/60 uppercase tracking-[0.2em]">
                   {project.category}
                 </span>
                 {/* @ts-ignore */}
                 <Badge 
                   variant={project.esgScore > 90 ? "gold" : "success"} 
                   className={`shadow-sm ${project.esgScore > 90 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}
                 >
                    {project.esgScore > 90 && "Elite "}Impact: {project.esgScore}/100
                 </Badge>
                 <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Live Allocation Active</span>
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
                : "Investment in sustainable infrastructure with verified high yield."}
            </p>
          </div>

          {/* Financial Metrics (Phase 5 Dynamic Data) */}
          <div className="mt-10 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 group-hover:bg-white group-hover:border-emerald-100/50 transition-all duration-500 text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target IRR</p>
                  <p className="text-xl font-black text-slate-800 tracking-tight">{project.targetIrr}%</p>
                </div>
                <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 group-hover:bg-white group-hover:border-emerald-100/50 transition-all duration-500 text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{isGreek ? "Επενδυτές" : "Investors"}</p>
                  <p className="text-xl font-black text-slate-800 tracking-tight">{funding.investorCount}</p>
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
                <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                  <span>Raised: €{funding.currentRaised.toLocaleString()}</span>
                  <span>Goal: €{funding.totalGoal.toLocaleString()}</span>
                </div>
             </div>
          </div>

          {/* Success Overlay (Magic Moment) */}
          {showSuccess && (
            <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-center p-8 z-20 animate-in fade-in zoom-in duration-500 rounded-[2.5rem]">
               <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl shadow-2xl mb-4">✨</div>
               <h4 className="text-white font-black text-xl mb-2">{isGreek ? "Επιτυχής Κατανομή!" : "Allocation Confirmed!"}</h4>
               <p className="text-emerald-100/60 text-[10px] font-bold uppercase tracking-widest">
                 Synchronizing Ledger...
               </p>
            </div>
          )}

          {/* Card Footer: The Trigger Actions */}
          <div className="mt-8 pt-8 border-t border-slate-50 flex gap-3">
             <button 
               onClick={() => setIsModalOpen(true)}
               className="flex-1 py-4 bg-emerald-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-800 transition-all border-none cursor-pointer flex items-center justify-center gap-2"
             >
                <Wallet size={14} /> {isGreek ? "ΕΠΕΝΔΥΣΗ" : "ALLOCATE CAPITAL"}
             </button>
             <button className="p-4 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-emerald-600 transition-all cursor-pointer group">
                <ArrowRight />
             </button>
          </div>

          {/* Detailed Footer (whileHover reveal) */}
          {/* @ts-ignore */}
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            whileHover={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div className="pt-6 border-t border-emerald-100/30 flex justify-between items-center mt-6">
              <div className="flex items-center gap-2 text-left">
                <div className="p-1.5 bg-emerald-50 rounded-full">
                  <ShieldCheck />
                </div>
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-none">GS-Verified Audit</span>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-emerald-900 flex items-center gap-1.5 hover:gap-2.5 transition-all bg-transparent border-none cursor-pointer">
                Prospectus <ArrowRight />
              </button>
            </div>
          </motion.div>
        </Card>
      </motion.div>

      {/* Transactional Modal Instance */}
      <ProjectInvestmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
        lang={lang}
        onSuccess={handleInvestmentSuccess}
      />
    </>
  );
};

export default ProjectCard;