"use client";

import React, { useState } from "react";
/**
 * GreenScale Phase 3 Refactor:
 * Now using shared components from our @repo/ui library.
 * Note: Using relative paths for preview compilation stability.
 */
// import { Button } from "../../../../../packages/ui/src/button";
// import { Input } from "../../../../../packages/ui/src/input";


// In your local environment, you should use:
import { Button, Input } from "@repo/ui";

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
      // Logic for Better Auth signUp
      // const { data, error: authError } = await authClient.signUp.email({
      //   email,
      //   password,
      //   name,
      //   callbackURL: "/dashboard",
      // });
      
      // Simulating successful registration for UI verification
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError("Connection failed. Check if the server is running.");
      setLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ecfdf5]/30 px-4 font-sans">
        <div className="max-w-md w-full text-center p-10 bg-white rounded-[2.5rem] shadow-xl border border-[#d1fae5]">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#d1fae5] rounded-full mb-6">
            <svg className="w-10 h-10 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Account Created</h2>
          <p className="text-slate-500 mb-8 font-medium">Your investor profile is ready. You can now access the portal.</p>
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full"
            onClick={() => navigateTo("/login")}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ecfdf5]/30 px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-50">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Join GreenScale</h2>
          <p className="mt-3 text-slate-500 font-medium">Create your sustainable wealth profile</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="p-4 text-sm font-bold text-red-700 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {loading ? "Creating Account..." : "Register as Investor"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 font-medium">
          Already have an account?{" "}
          <button 
            onClick={() => navigateTo("/login")}
            className="text-[#047857] font-bold hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}