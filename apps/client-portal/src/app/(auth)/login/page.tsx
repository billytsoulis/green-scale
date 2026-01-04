"use client";

import React, { useState } from "react";

/**
 * GreenScale Phase 3 Refactor: Login Page
 * * NOTE FOR PREVIEW: The imports below are commented out to allow rendering.
 * Uncomment them in your local code.
 */


import { Button, Input, AuthLayout } from "@repo/ui";
import { signIn } from "@/lib/auth-client";


export default function LoginPage() {
  // Defaulting to test credentials for development speed
  const [email, setEmail] = useState("test1@test.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      /**
       * Real Authentication Call
       * Using the signIn.email method from our authClient.
       */
      // @ts-ignore - signIn is assumed to be available from the commented import above
      const { data, error: authError } = await signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }
      
      /**
       * FIX: Forced Navigation
       * Using window.location.replace("/dashboard") is the most reliable way 
       * to ensure the browser clears its internal state and lets the middleware 
       * evaluate the fresh session cookies on the next request.
       */
      console.log("✅ Login successful, triggering redirect...");
      window.location.replace("/dashboard");
      
    } catch (err) {
      console.error("Login Error:", err);
      setError("Connection failed. Ensure the API Gateway is running on port 3005.");
      setLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  const footerLink = (
    <>
      New to GreenScale?{" "}
      <button 
        onClick={() => navigateTo("/register")}
        className="text-[#047857] font-bold hover:underline"
      >
        Create an account
      </button>
    </>
  );

  return (
    // @ts-ignore - UI components are assumed to be available via commented imports
    <AuthLayout
      title="Welcome Back"
      description="Access your GreenScale dashboard"
      footer={footerLink}
    >
      <form className="space-y-6" onSubmit={handleLogin}>
        {error && (
          <div className="p-4 text-sm font-bold text-red-700 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in">
            {error}
          </div>
        )}

        <div className="space-y-4">
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
        </div>

        <div className="pt-2">
          {/* @ts-ignore */}
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full !py-6"
          >
            {loading ? "Signing in..." : "Login to Portal"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

// export default function LoginPage() {
//   const [email, setEmail] = useState("billy@tsoulis.gr");
//   const [password, setPassword] = useState("password123");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       /** * Step 1: Real Authentication Call
//        */
//       // @ts-ignore
//       const { data, error: authError } = await signIn.email({
//         email,
//         password,
//         // callbackURL is often ignored in cross-port setups; we use manual redirect
//       });

//       if (authError) {
//         // setError(authError.message || "Invalid credentials. Please try again.");
//         setError(authError?.message || "Invalid credentials. Please try again.");
//         setLoading(false);
//         return;
//       }
      
//       /**
//        * FIX: Explicit Manual Redirect
//        * Better Auth client handles the cookie. Once the promise resolves 
//        * successfully, we manually push the user to the dashboard.
//        */
//       window.location.href = "/dashboard";
      
//     } catch (err) {
//       setError("Connection failed. Ensure the API Gateway is running on port 3005.");
//       setLoading(false);
//     }
//   };

//   const navigateTo = (path: string) => {
//     window.location.href = path;
//   };

//   const footerLink = (
//     <>
//       New to GreenScale?{" "}
//       <button 
//         onClick={() => navigateTo("/register")}
//         className="text-[#047857] font-bold hover:underline"
//       >
//         Create an account
//       </button>
//     </>
//   );

//   return (
//     <AuthLayout
//       title="Welcome Back"
//       description="Access your GreenScale dashboard"
//       footer={footerLink}
//     >
//       <form className="space-y-6" onSubmit={handleLogin}>
//         {error && (
//           <div className="p-4 text-sm font-bold text-red-700 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in">
//             {error}
//           </div>
//         )}

//         <div className="space-y-4">
//           <Input
//             label="Email Address"
//             type="email"
//             required
//             placeholder="name@company.com"
//             value={email}
//             onChange={(e: any) => setEmail(e.target.value)}
//           />

//           <Input
//             label="Password"
//             type="password"
//             required
//             placeholder="••••••••"
//             value={password}
//             onChange={(e: any) => setPassword(e.target.value)}
//           />
//         </div>

//         <Button
//           type="submit"
//           disabled={loading}
//           className="w-full text-white bg-[#065f46] hover:bg-[#047857] py-4"
//         >
//           {loading ? "Signing in..." : "Login to Portal"}
//         </Button>
//       </form>
//     </AuthLayout>
//   );
// }