import React, { useState } from "react";

/**
 * GreenScale Staff Login (Vite Edition)
 * Path: apps/staff-dashboard/src/pages/login.tsx
 * * Refined: Restored user's preferred high-contrast two-column layout.
 * * Fixed: Logic now hits the API Gateway on port 3005 with proper error handling.
 */

// Preview Safety: Commenting out local imports to avoid compiler errors in the preview environment
import { authClient } from "../lib/auth-client";

export default function StaffLoginPage() {
  const [email, setEmail] = useState("test2@test.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      /**
       * Real Authentication Call via Better Auth Client
       * @ts-ignore - authClient is provided by lib/auth-client.ts
       */
      const { data, error: authError } = await authClient.signIn.email({ 
        email, 
        password, 
        callbackURL: "/dashboard" 
      });

      if (authError) {
        setError(authError.message || "Invalid Staff Credentials");
        setLoading(false);
        return;
      }

      /**
       * SUCCESS: Hard Redirect
       * Using window.location.replace to ensure the browser clears state 
       * and the session is correctly picked up by the staff dashboard.
       */
      window.location.replace("/dashboard");
      
    } catch (err) {
      setError("Gateway connection refused. Ensure API Gateway is running on port 3005.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Visual Branding Side: Luxury Emerald Sidebar */}
      <div className="hidden lg:flex w-1/2 bg-[#064e3b] items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-5xl font-black mb-6 tracking-tight">GreenScale Admin</h1>
          <p className="text-emerald-200/80 text-lg leading-relaxed font-medium">
            Internal Wealth Management & ESG Analytical Suite. <br/>
            Unauthorized access is strictly monitored and logged via the Audit Engine.
          </p>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white lg:bg-slate-50">
        <div className="max-w-sm w-full space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Staff Sign In</h2>
            <p className="text-slate-500 mt-2 font-medium">Enter your corporate credentials</p>
          </div>

          <form className="space-y-6" onSubmit={handleStaffLogin}>
            {error && (
              <div className="p-4 text-sm font-bold text-red-700 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Corporate Email</label>
                <input
                  type="email"
                  placeholder="admin@greenscale.finance"
                  className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Security Key</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#047857] hover:bg-[#065f46] text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-900/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authorizing Terminal..." : "Access Command Center"}
            </button>
          </form>
          
          <div className="pt-8 text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
               Secure Environment v1.4.2
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}