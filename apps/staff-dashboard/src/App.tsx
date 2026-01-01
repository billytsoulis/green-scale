import React from "react";
import { useState, useEffect } from "react";
import StaffLoginPage from "./pages/login";
import StaffDashboard from "./pages/dashboard";
import { authClient } from "./lib/auth-client";

function App() {
  const { data: session, isPending } = authClient.useSession();
  const [view, setView] = useState<"login" | "dashboard">("login");

  useEffect(() => {
    if (!isPending) {
      setView(session ? "dashboard" : "login");
    }
  }, [session, isPending]);

  if (isPending) return <div className="h-screen flex items-center justify-center font-bold text-slate-400">GS_SYSTEM_INITIALIZING...</div>;

  return (
    <>
      {view === "login" ? <StaffLoginPage /> : <StaffDashboard />}
      
      {/* PREVIEW MODE: Remove this line and uncomment above for real routing */}
      <div className="p-10 text-center">
        <h1 className="text-xl font-bold">Staff Dashboard Router Ready</h1>
        <p className="text-slate-500">Uncomment the logic in App.tsx to enable Login/Dashboard switching.</p>
      </div>
    </>
  );
}

export default App
