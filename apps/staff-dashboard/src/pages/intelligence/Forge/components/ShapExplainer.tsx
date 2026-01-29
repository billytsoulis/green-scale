/**
 * Institutional Intelligence: SHAP Explainer Chart (XAI)
 * Path: src/pages/intelligence/Forge/components/ShapExplainer.tsx
 * Purpose: Visualizes the factor attribution driving the AI Score adjustment.
 * UX: High-contrast horizontal bars showing positive (Emerald) and negative (Amber/Red) impact.
 */

import { motion } from "framer-motion";

interface ShapFactor {
  name: string;
  value: number;
  description: string;
}

interface ShapExplainerProps {
  factors: ShapFactor[];
  isLoading?: boolean;
}

export const ShapExplainer = ({ factors, isLoading }: ShapExplainerProps) => {
  if (isLoading) return <div className="h-64 bg-slate-50 rounded-[3rem] animate-pulse" />;

  return (
    <section className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-8 text-left" data-component="ShapExplainer">
      <header className="flex justify-between items-start border-b border-slate-50 pb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] leading-none">Model Explainability</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Factor Attribution</h3>
        </div>
        <div className="px-3 py-1 bg-slate-950 text-white rounded-full text-[8px] font-black uppercase tracking-widest">
          SHAP Method v2
        </div>
      </header>

      <div className="space-y-6">
        {factors.map((factor, i) => {
          const isPositive = factor.value >= 0;
          const absValue = Math.abs(factor.value);
          const maxScale = 25; // Max expected SHAP delta
          const barWidth = (absValue / maxScale) * 100;

          return (
            <div key={factor.name} className="space-y-2 group">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{factor.name}</span>
                <span className={`text-[10px] font-black ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isPositive ? '+' : ''}{factor.value.toFixed(1)}
                </span>
              </div>

              {/* Centered Axis Chart */}
              <div className="relative h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 z-10" />
                {/* @ts-ignore */}
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${barWidth / 2}%` }}
                   transition={{ duration: 1, delay: i * 0.1 }}
                   className={`absolute top-0 bottom-0 h-full ${isPositive ? 'bg-emerald-500 left-1/2' : 'bg-red-400 right-1/2'}`}
                />
              </div>

              <p className="text-[10px] text-slate-400 font-medium italic opacity-0 group-hover:opacity-100 transition-opacity">
                {factor.description}
              </p>
            </div>
          );
        })}
      </div>

      <footer className="pt-6 border-t border-slate-50">
        <p className="text-[9px] font-bold text-slate-300 leading-relaxed max-w-md">
          SHAP (SHapley Additive exPlanations) decomposes the AI Adjusted Score into the marginal contributions of each ESG vector.
        </p>
      </footer>
    </section>
  );
};

export default ShapExplainer;