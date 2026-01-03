"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "gold";
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}

export const Badge = ({
  children,
  variant = "info",
  size = "md",
  showDot = false,
  className = "",
}: BadgeProps) => {
  const baseStyles = "inline-flex items-center font-bold tracking-tight rounded-full uppercase";
  
  const variants = {
    // GreenScale Emerald
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    // Warning Gold
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    // Danger Red
    danger: "bg-red-50 text-red-700 border border-red-100",
    // Neutral Slate
    info: "bg-slate-50 text-slate-600 border border-slate-200",
    // Premium Brand Gold
    gold: "bg-[#fffbeb] text-[#d97706] border border-[#fef3c7] shadow-sm",
  };

  const dotColors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-slate-400",
    gold: "bg-[#fbbf24]",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[10px] gap-1.5",
    md: "px-3 py-1 text-[11px] gap-2",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />
      )}
      {children}
    </span>
  );
};