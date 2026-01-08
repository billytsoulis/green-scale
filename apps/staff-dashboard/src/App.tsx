import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/**
 * Staff Dashboard Application Router
 * Path: apps/staff-dashboard/src/App.tsx
 * * FIXED: Added dynamic route for /cms/:pageId to prevent dashboard redirects.
 */

// Preview Safety: Commenting out local/shared imports
/*
*/
import StaffLoginPage from "./pages/login";
import StaffDashboard from "./pages/dashboard";
import CMSList from "./pages/cms/CMSList";
import CMSEditor from "./pages/cms/CMSEditor";
import { StaffLayout } from "./layout/StaffLayout";
import { authClient } from "./lib/auth-client";

function App() {
  /** @ts-ignore - authClient handled in production */
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center space-y-4 font-black text-brand-emerald-500 uppercase tracking-widest text-xs">
          INITIALIZING_TERMINAL...
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route 
          path="/login" 
          /* @ts-ignore */
          element={session ? <Navigate to="/dashboard" replace /> : <StaffLoginPage />} 
        />

        {/* Protected Staff Routes (Nested in StaffLayout) */}
        <Route 
          /* @ts-ignore */
          element={session ? <StaffLayout /> : <Navigate to="/login" replace />}
        >
          {/* Dashboard View */}
          <Route path="/dashboard" element={<StaffDashboard />} />
          
          {/* CMS Directory View */}
          <Route path="/cms" element={<CMSList />} />
          
          {/* FIXED: Dynamic Page Editor Route */}
          <Route path="/cms/:pageId" element={<CMSEditor />} />
          
          {/* Default Route within Layout */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Global Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;