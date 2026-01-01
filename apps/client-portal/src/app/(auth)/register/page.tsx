"use client";

import React, { useState } from "react";

/**
 * Staff Engineer Diagnostic (v1.8):
 * As requested, imports are commented out to bypass the preview compilation errors.
 * Logic remains in place; simply uncomment these lines in your local VS Code
 * once your path resolution (src/lib vs lib) is verified.
 */

import { authClient } from "../../../lib/auth-client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      /**
       * The logic below uses the authClient. 
       * We use @ts-ignore to allow the file to exist even while the import is commented out.
       */
      // @ts-ignore
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });

      if (authError) {
        setError(authError.message || "Registration failed.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Connection failed. Check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for navigation since 'next/link' was failing to resolve in the preview
  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFCF3] px-4 font-sans">
        <div className="max-w-md w-full text-center p-10 bg-white rounded-3xl shadow-xl border border-emerald-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Account Created</h2>
          <p className="text-slate-500 mb-8">Your investor profile is ready. You can now access the portal.</p>
          <button 
            onClick={() => navigateTo("/login")}
            className="block w-full py-4 bg-emerald-800 text-white font-bold rounded-2xl hover:bg-emerald-900 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEFCF3] px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-emerald-50">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Join GreenScale</h2>
          <p className="mt-3 text-slate-500 font-medium">Create your sustainable wealth profile</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100">{error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="block w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                className="block w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="block w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl text-md font-bold text-white bg-slate-900 hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register as Investor"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button 
            onClick={() => navigateTo("/login")}
            className="text-emerald-700 font-bold hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}