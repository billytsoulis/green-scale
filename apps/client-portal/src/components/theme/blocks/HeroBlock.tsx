import React from "react";

/**
 * GreenScale Theme: Hero Block
 * Path: apps/client-portal/src/components/theme/blocks/HeroBlock.tsx
 * Purpose: Atomic component for top-level page banners.
 * Identification: data-component="HeroBlock"
 */

// --- Production Ready Imports (Commented for Manual Handling) ---
import { Badge } from "@repo/ui";

// --- Local UI Mocks for Preview Stability ---
// const Badge = ({ children, className = "" }: any) => (
//   <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-amber-50 text-amber-600 border border-amber-100 ${className}`}>
//     {children}
//   </span>
// );

interface HeroBlockProps {
  data: {
    badge?: string;
    title?: string;
    description?: string;
  };
}

export const HeroBlock = ({ data }: HeroBlockProps) => {
  // Graceful fallbacks for missing data
  const { 
    badge = "Section Badge", 
    title = "Section Title", 
    description = "Section description content goes here." 
  } = data || {};

  return (
    <section 
      className="py-24 bg-[#FEFCF3] border-b border-slate-100" 
      data-component="HeroBlock"
    >
      <div className="max-w-7xl mx-auto px-8 text-center space-y-6">
        {/* @ts-ignore */}
        <Badge className="mb-4">
          {badge}
        </Badge>
        
        <h1 className="text-6xl md:text-7xl font-serif font-black text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        
        <p className="max-w-3xl mx-auto text-xl text-slate-500 font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
};

export default HeroBlock;