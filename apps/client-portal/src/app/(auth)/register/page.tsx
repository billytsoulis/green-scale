"use client";

import React, { useState } from "react";
/**
 * GreenScale Phase 3 Refactor: Register Page
 * Utilizing the Shared AuthLayout and real Better Auth logic.
 */
import { Button, Input, AuthLayout } from "@repo/ui";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      /**
       * Real Registration Call
       * Using the signUp.email method from our authClient.
       */
      // @ts-ignore
      const { data, error: authError } = await signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });

      if (authError) {
        setError(authError.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      /**
       * SUCCESS:
       * Since we are using the JWT plugin, the session is already created.
       * We use window.location.replace to trigger the middleware immediately.
       */
      console.log("✅ Registration successful, redirecting...");
      window.location.replace("/dashboard");
      
    } catch (err) {
      setError("Connection failed. Ensure the API Gateway is running on port 3005.");
      setLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  const footerLink = (
    <>
      Already have an account?{" "}
      <button 
        onClick={() => navigateTo("/login")}
        className="text-[#047857] font-bold hover:underline"
      >
        Log in
      </button>
    </>
  );

  return (
    // @ts-ignore
    <AuthLayout
      title="Join GreenScale"
      description="Create your sustainable wealth profile"
      footer={footerLink}
    >
      <form className="space-y-4" onSubmit={handleRegister}>
        {error && (
          <div className="p-4 text-sm font-bold text-red-700 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in">
            {error}
          </div>
        )}

        {/* @ts-ignore */}
        <Input
          label="Full Name"
          type="text"
          required
          placeholder="John Doe"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />
        
        {/* @ts-ignore */}
        <Input
          label="Email Address"
          type="email"
          required
          placeholder="name@company.com"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />

        {/* @ts-ignore */}
        <Input
          label="Password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />

        <div className="pt-2">
          {/* @ts-ignore */}
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full !text-[#ffffff] !bg-[#065f46] hover:!bg-[#047857] cursor-pointer relative !py-6"
          >
            {loading ? "Creating Account..." : "Register as Investor"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}