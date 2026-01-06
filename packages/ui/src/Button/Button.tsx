"use client";

import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  // Base classes using Tailwind v4 compatible logic
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all rounded-2xl active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    // Luxury Emerald - using our brand tokens
    primary: "bg-[#065f46] text-white hover:bg-[#064e3b] shadow-lg",
    // Premium Gold - using our brand tokens
    secondary: "bg-[#f59e0b] text-slate-900 hover:bg-[#d97706] shadow-md",
    // Minimalist
    outline: "border-2 border-slate-200 bg-transparent text-slate-900 hover:border-[#10b981] hover:text-[#047857]",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-4 text-sm",
    lg: "px-8 py-5 text-base",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};