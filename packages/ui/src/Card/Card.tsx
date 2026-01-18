"use client";

import React from "react";

/**
 * GreenScale Shared Card Component
 * Path: greenscale/packages/ui/src/Card/Card.tsx
 * * Luxury container for metrics, lists, and interactive sections.
 * * Update: Added 'style' prop support for dynamic CSS values (e.g., animation delays).
 */

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  /** Inline styles for dynamic values like animation delays */
  style?: React.CSSProperties;
  /**
   * 'elevated' for main metrics, 
   * 'flat' for lists/secondary data, 
   * 'outline' for minimalist sections
   */
  variant?: "elevated" | "flat" | "outline";
}

export const Card = ({
  children,
  title,
  description,
  footer,
  className = "",
  style,
  variant = "elevated",
}: CardProps) => {
  const baseStyles = "rounded-[2rem] overflow-hidden transition-all duration-300";
  
  const variants = {
    // High-end luxury shadow with subtle emerald tint
    elevated: "bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(6,95,70,0.08)] hover:shadow-[0_15px_50px_-12px_rgba(6,95,70,0.12)]",
    // Clean, minimalist background
    flat: "bg-slate-50 border border-slate-200",
    // Thin border for dense dashboards
    outline: "bg-transparent border border-slate-200 hover:border-emerald-200",
  };

  const hasHeader = title || description;

  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      style={style} 
      data-component="Card"
    >
      {hasHeader && (
        <div className="p-3 pt-4 pb-0 text-center">
          {title && (
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-slate-500 mt-1 text-xs">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className={`p-3 flex flex-col items-center text-center ${hasHeader ? "pt-1" : "pt-3"}`}>
        {children}
      </div>

      {footer && (
        <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-center">
          {footer}
        </div>
      )}
    </div>
  );
};