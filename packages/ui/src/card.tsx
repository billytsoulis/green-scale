"use client";

import { ReactNode } from "react";

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

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {(title || description) && (
        <div className="px-8 pt-8 pb-4">
          {title && (
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm font-medium text-slate-500 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="px-8 py-6">
        {children}
      </div>

      {footer && (
        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100">
          {footer}
        </div>
      )}
    </div>
  );
};