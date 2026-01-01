"use client";

import React, { useState } from "react";
/**
 * Staff Engineer Path Correction:
 * We are using a more robust relative path to ensure the authClient 
 * is correctly resolved within the monorepo structure.
 */
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard", 
      });

      if (authError) {
        setError(authError.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Connection failed. Please ensure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEFCF3] px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-emerald-50/50">
        
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-50 rounded-2xl">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-emerald-700"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C10.7 14.4 12 13.5 12 13" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">GreenScale</h2>
          <p className="mt-3 text-slate-500 font-medium">
            Portal Access for Wealth Management
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 ml-1 mb-2">Work Email</label>
              <input
                type="email"
                required
                className="block w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                placeholder="name@greenscale.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center ml-1 mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <button type="button" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">Forgot?</button>
              </div>
              <input
                type="password"
                required
                className="block w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-6 rounded-2xl text-md font-bold text-white bg-slate-900 hover:bg-black focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Sign Into Portal"
            )}
          </button>
        </form>

        <div className="pt-6 border-t border-slate-100">
          <p className="text-center text-xs text-slate-400">
            Secure multi-factor authentication may be required for corporate accounts.
          </p>
        </div>
      </div>
    </div>
  );
}