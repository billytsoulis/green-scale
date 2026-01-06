"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footer?: React.ReactNode;
}

export const AuthLayout = ({ children, title, description, footer }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ecfdf5]/30 px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-50">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-slate-500 font-medium">
            {description}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {children}
        </div>

        {footer && (
          <div className="text-center text-sm text-slate-500 font-medium pt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};