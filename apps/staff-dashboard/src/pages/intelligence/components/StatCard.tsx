import React from "react";

/**
 * Institutional Intelligence: Metric StatCard
 * Path: src/pages/intelligence/components/StatCard.tsx
 * Purpose: Reusable high-density card for platform-wide analytical metrics.
 * UX: Optimized for dark-mode institutional monitoring with trend indicators.
 */

import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string | number;
  trendLabel?: string;
  icon?: React.ReactNode;
  variant?: "default" | "dark";
  statusColor?: "emerald" | "red" | "blue" | "amber";
  className?: string;
}

export const StatCard = ({
  label,
  value,
  trend,
  trendLabel,
  icon,
  variant = "default",
  statusColor = "emerald",
  className
}: StatCardProps) => {
  
  const colorMap = {
    emerald: "text-emerald-400",
    red: "text-red-400",
    blue: "text-blue-400",
    amber: "text-amber-400"
  };

  const bgClasses = variant === "dark" 
    ? "bg-slate-900 text-white shadow-2xl" 
    : "bg-white text-slate-900 border border-slate-100 shadow-sm";

  return (
    /* @ts-ignore */
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-4xl flex items-center gap-6 transition-all hover:scale-[1.02]",
        bgClasses,
        className || ""
      )}
      data-component="StatCard"
    >
      {/* Icon Wrapper */}
      {icon && (
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
          variant === "dark" ? "bg-white/10" : "bg-slate-50"
        )}>
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="text-left flex-1">
        <p className={cn(
          "text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-2",
          variant === "dark" ? "text-slate-500" : "text-slate-400"
        )}>
          {label}
        </p>
        
        <div className="flex items-baseline gap-3">
          <h3 className="text-3xl font-black tracking-tighter leading-none">
            {value}
          </h3>
          
          {trend && (
            <div className="flex flex-col">
              <span className={cn("text-xs font-black leading-none", colorMap[statusColor])}>
                {trend}
              </span>
              {trendLabel && (
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Decorative Status Pulse (Dark Variant Only) */}
      {variant === "dark" && (
        <div className="pr-2">
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]", colorMap[statusColor])} />
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;