import React, { useState } from "react";
import { authClient } from "../lib/auth-client";

/**
 * Staff Dashboard Login:
 * Designed for internal use. High-contrast and focused on security.
 */

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStaffLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Logic: Sign in and redirect to internal management area
    await authClient.signIn.email({ email, password, callbackURL: "/" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Visual Branding Side (Optional but professional) */}
      <div className="hidden lg:flex w-1/2 bg-emerald-900 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-5xl font-extrabold mb-6">GreenScale Admin</h1>
          <p className="text-emerald-200 text-lg">
            Internal Wealth Management & ESG Analytical Suite.
            Unauthorized access is strictly monitored.
          </p>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-sm w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Staff Sign In</h2>
            <p className="text-slate-500 mt-2">Enter your corporate credentials</p>
          </div>

          <form className="space-y-6" onSubmit={handleStaffLogin}>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Staff Email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Security Key"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-700/20"
            >
              Access Command Center
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}