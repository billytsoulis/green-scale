import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/**
 * Staff Dashboard Application Router
 * Path: apps/staff-dashboard/src/App.tsx
 * * UPDATED: Integrated Modular CMS Routes (GS-17).
 * * Architecture: Supports Directory (L1), Layout (L2), and Block Editors (L3).
 */

// --- PREVIEW SAFETY IMPORTS ---
import StaffLoginPage from "./pages/login";
import StaffDashboard from "./pages/dashboard";
import CMSList from "./pages/cms/CMSList";
import LayoutCanvas from "./pages/cms/LayoutBuilder/LayoutCanvas";
import PageSettings from "./pages/cms/PageManager/PageSettings";
import BlockEditorSwitcher from "./pages/cms/BlockEditors/BlockEditorSwitcher";
import { StaffLayout } from "./layout/StaffLayout";
import { authClient } from "./lib/auth-client";

// Mock components for environment safety if imports are not yet resolved
// const StaffLoginPage = () => <div>Login Page</div>;
// const StaffDashboard = () => <div>Dashboard</div>;
// const StaffLayout = () => <div className="p-10">Layout Wrapper (Outlet)</div>;
// const CMSList = () => <div>CMS List</div>;
// const LayoutCanvas = () => <div>Layout Canvas</div>;
// const PageSettings = () => <div>Page Settings</div>;
// const BlockEditorSwitcher = () => <div>Block Editor Switcher</div>;

// authClient mock
// const authClient = { 
//   useSession: () => ({ data: { user: { id: "1" } }, isPending: false }) 
// };

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
          {/* Dashboard Home */}
          <Route path="/dashboard" element={<StaffDashboard />} />
          
          {/* Layer 1: CMS Page Directory */}
          <Route path="/cms" element={<CMSList />} />
          
          {/* Layer 1: Page Settings (SEO/Metadata) */}
          <Route path="/cms/:slug/settings" element={<PageSettings />} />

          {/* Layer 2: Visual Layout Builder (Reordering Blocks) */}
          <Route path="/cms/:slug/layout" element={<LayoutCanvas />} />

          {/* Layer 3: Individual Block Editor (Bilingual Content) */}
          <Route path="/cms/:slug/edit/:sectionId" element={<BlockEditorSwitcher />} />
          
          {/* Redirect empty paths to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Global Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;