import React from "react";

/**
 * GreenScale Theme: Narrative Block
 * Path: apps/client-portal/src/components/theme/blocks/NarrativeBlock.tsx
 * Purpose: Atomic component for long-form content and strategy cards.
 * Identification: data-component="NarrativeBlock"
 */

interface NarrativeBlockProps {
  data: {
    title?: string;
    paragraph1?: string;
    paragraph2?: string;
    auditTitle?: string;
    auditDesc?: string;
    strategyTitle?: string;
    strategyDesc?: string;
  };
}

export const NarrativeBlock = ({ data }: NarrativeBlockProps) => {
  // Graceful fallbacks for the Narrative structure
  const {
    title = "Narrative Title",
    paragraph1 = "Primary narrative content paragraph.",
    paragraph2 = "Secondary narrative content paragraph.",
    auditTitle = "AI Audit",
    auditDesc = "Audit description.",
    strategyTitle = "Strategy",
    strategyDesc = "Strategy description."
  } = data || {};

  return (
    <section 
      className="py-24 max-w-4xl mx-auto px-8 space-y-12" 
      data-component="NarrativeBlock"
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        <p 
          className="text-lg text-slate-600 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: paragraph1 }} 
        />
        <p 
          className="text-lg text-slate-600 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: paragraph2 }} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
        {/* The Audit Card (Brand Emerald) */}
        <div className="p-10 bg-brand-emerald-900 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-emerald-900/10">
          <h3 className="text-2xl font-bold">{auditTitle}</h3>
          <p 
            className="text-emerald-100/70 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: auditDesc }}
          />
        </div>

        {/* The Strategy Card (Neutral Slate) */}
        <div className="p-10 bg-slate-100 rounded-[2.5rem] text-slate-900 space-y-4">
          <h3 className="text-2xl font-bold">{strategyTitle}</h3>
          <p 
            className="text-slate-500 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: strategyDesc }}
          />
        </div>
      </div>
    </section>
  );
};

export default NarrativeBlock;