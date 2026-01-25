import React from "react";

/**
 * Institutional Intelligence: AnalyticsBadge
 * Path: src/pages/intelligence/components/AnalyticsBadge.tsx
 * Purpose: Specialized badge for analytical statuses, risk levels, and security flags.
 * UX: Minimalist high-contrast design with support for live status pulses.
 */

import { cn } from "../../../lib/utils";

interface AnalyticsBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "gold";
  showDot?: boolean;
  animate?: boolean;
  className?: string;
}

export const AnalyticsBadge = ({
  children,
  variant = "info",
  showDot = false,
  animate = false,
  className = ""
}: AnalyticsBadgeProps) => {
  
  const variants = {
    // Brand Emerald Palette
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    // Brand Amber/Warning Palette
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    // Institutional Red/Critical Palette
    danger: "bg-red-50 text-red-700 border-red-100",
    // Neutral Slate Palette
    info: "bg-slate-50 text-slate-500 border-slate-200",
    // Premium Gold Variant
    gold: "bg-amber-50 text-amber-600 border-amber-200 shadow-sm",
  };

  const dotColors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-slate-400",
    gold: "bg-amber-400",
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border transition-all",
        variants[variant],
        className
      )}
      data-component="AnalyticsBadge"
    >
      {showDot && (
        <span className={cn(
          "w-1.5 h-1.5 rounded-full mr-2 shrink-0",
          dotColors[variant],
          animate ? "animate-pulse shadow-[0_0_8px_currentColor]" : ""
        )} />
      )}
      {children}
    </span>
  );
};

export default AnalyticsBadge;