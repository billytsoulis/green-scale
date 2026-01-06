"use client";

import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            className={`
              block w-full px-5 py-4 rounded-2xl border transition-all outline-none
              bg-slate-50 text-slate-900 placeholder:text-slate-400
              focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500
              disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed
              ${error ? "border-red-500 ring-4 ring-red-500/10" : "border-slate-200"}
              ${className}
            `}
            {...props}
          />
        </div>

        {(error || helperText) && (
          <p className={`text-xs ml-1 font-medium ${error ? "text-red-500" : "text-slate-500"}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";