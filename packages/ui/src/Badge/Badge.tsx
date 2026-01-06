"use client";

import React from "react";

/**
 * GreenScale Shared Badge Component
 * Path: packages/ui/src/badge.tsx
 * * Luxury status indicator with optional pulse animation.
 */

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "gold";
  size?: "sm" | "md";
  showDot?: boolean;
  /** Enables the pulse animation on the status dot */
  animate?: boolean;
  className?: string;
}

export const Badge = ({
  children,
  variant = "info",
  size = "md",
  showDot = false,
  animate = false,
  className = "",
}: BadgeProps) => {
  const baseStyles = "inline-flex items-center font-bold tracking-tight rounded-full uppercase transition-all whitespace-nowrap";
  
  const variants = {
    // Brand Emerald Palette
    success: "bg-brand-emerald-50 text-brand-emerald-700 border border-brand-emerald-100",
    // Brand Gold Palette
    warning: "bg-brand-gold-50 text-brand-gold-600 border border-brand-gold-100",
    // Red Palette (Requires definition in theme.css)
    danger: "bg-red-50 text-red-700 border border-red-100",
    // Slate Palette (Requires definition in theme.css)
    info: "bg-slate-50 text-slate-600 border border-slate-200",
    // Premium Gold Variant
    gold: "bg-brand-gold-50 text-brand-gold-600 border border-brand-gold-100 shadow-sm",
  };

  // const dotColors = {
  //   success: "bg-brand-emerald-500",
  //   warning: "bg-brand-gold-500",
  //   danger: "bg-red-500",
  //   info: "bg-slate-400",
  //   gold: "bg-brand-gold-400",
  // };
  const dotColors = {
  success: "#10b981", // brand-emerald-500
  warning: "#f59e0b", // brand-gold-500
  danger: "#ef4444",  // red-500
  info: "#94a3b8",    // slate-400
  gold: "#fbbf24",    // brand-gold-400
};

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2 py-1 text-[10.4px]",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {showDot && (
  <span 
    style={{ backgroundColor: dotColors[variant] }}
    className={`
      w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 inline-block
      ${animate ? "animate-pulse" : ""}
    `} 
  />
)}
      {children}
    </span>
  );
};