import React from "react";

/**
 * Institutional Intelligence: HubCard Component
 * Path: src/pages/intelligence/Hub/HubCard.tsx
 * Purpose: Interactive Bento-grid item for Hub navigation.
 * UX: Framer-motion driven hover states and layout-aware decorative glow.
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils";

interface HubCardProps {
  id: string;
  title: string;
  desc: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  locked?: boolean;
  variants?: any;
}

export const HubCard = ({
  title,
  desc,
  path,
  icon,
  color,
  bg,
  locked = false,
  variants
}: HubCardProps) => {
  return (
    /* @ts-ignore */
    <Link to={path} className="group no-underline">
      {/* @ts-ignore */}
      <motion.div 
        variants={variants}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="h-full bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group-hover:shadow-2xl group-hover:border-emerald-100 transition-all flex flex-col items-center text-center space-y-6 relative overflow-hidden"
      >
        {/* Decorative Background Glow */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-50 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Status / Lock Indicator */}
        {locked && (
          <div className="absolute top-6 right-6">
            <span className="px-3 py-1 bg-slate-50 text-slate-300 border border-slate-100 rounded-full text-[9px] font-black uppercase">
              Alpha Build
            </span>
          </div>
        )}

        {/* Icon Box */}
        <div className={cn(
          "w-24 h-24 rounded-4xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-sm",
          bg,
          color
        )}>
          {icon}
        </div>
        
        {/* Content */}
        <div className="space-y-2 relative z-10">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed px-4">
            {desc}
          </p>
        </div>

        {/* CTA Hint */}
        <div className="pt-4 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-emerald-600 transition-colors">
            Access Terminal →
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default HubCard;