"use client";

import React from "react";

/**
 * GreenScale Theme: Project Hero Block
 * Path: apps/client-portal/src/components/theme/blocks/ProjectHeroBlock.tsx
 * Purpose: Specialized hero banner for the Projects Directory.
 */

// --- Production Ready Imports (Commented for Manual Handling) ---
import { Badge } from "@repo/ui";
import { motion } from "framer-motion";

// --- Local UI Mocks for Canvas Stability ---
// // @ts-ignore
// const Badge = ({ children, variant, className }: any) => (
//   <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-700 border-emerald-100 ${className}`}>
//     {children}
//   </span>
// );

// // @ts-ignore
// const motion = {
//   div: ({ children, ...props }: any) => <div {...props}>{children}</div>
// };

interface ProjectHeroBlockProps {
  data: {
    badge?: string;
    title?: string;
    description?: string;
  };
}

export const ProjectHeroBlock = ({ data }: ProjectHeroBlockProps) => {
  // Graceful fallbacks for missing data
  const { 
    badge = "The Investor Registry", 
    title = "Capital for a Greener Legacy.", 
    description = "A high-performance catalog of verified, sustainable investment opportunities optimized for private wealth management." 
  } = data || {};

  return (
    <section 
      className="py-32 bg-[#FEFCF3] border-b border-slate-100 relative overflow-hidden" 
      data-component="ProjectHeroBlock"
    >
      {/* @ts-ignore */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-10"
      >
        {/* @ts-ignore */}
        <Badge variant="success">
          {badge}
        </Badge>
        
        {/* We use dangerouslySetInnerHTML for the title to support the <br/> and spans from the CMS */}
        <h1 
          className="text-7xl md:text-[9rem] font-serif font-black text-slate-900 tracking-tighter leading-[0.85]"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        
        <p className="max-w-2xl mx-auto text-xl text-slate-500 font-medium leading-relaxed">
          {description}
        </p>
      </motion.div>
    </section>
  );
};

export default ProjectHeroBlock;