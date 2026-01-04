"use client";

import { ReactNode } from "react";

/**
 * GreenScale Shared Card Component
 * Path: packages/ui/src/card.tsx
 * * Luxury container for metrics, lists, and interactive sections.
 */

interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
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
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {hasHeader && (
        <div className="p-3 pt-4 pb-0 text-center">
          {title && (
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-slate-500 mt-1">
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