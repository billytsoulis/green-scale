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
import ProjectList from "./pages/projects/ProjectList";
import ProjectEditor from "./pages/projects/ProjectEditor";
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
  // @ts-ignore
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    // @ts-ignore
    <BrowserRouter>
      {/* @ts-ignore */}
      <Routes>
        {/* Public Login Route */}
        {/* @ts-ignore */}
        <Route 
          path="/login" 
          /* @ts-ignore */
          element={session ? <Navigate to="/dashboard" replace /> : <StaffLoginPage />} 
        />

        {/* Protected Staff Routes */}
        {/* @ts-ignore */}
        <Route 
          /* @ts-ignore */
          element={session ? <StaffLayout /> : <Navigate to="/login" replace />}
        >
          <Route path="/dashboard" element={<StaffDashboard />} />
          
          {/* CMS Layers */}
          <Route path="/cms" element={<CMSList />} />
          <Route path="/cms/:slug/settings" element={<PageSettings />} />
          <Route path="/cms/:slug/layout" element={<LayoutCanvas />} />
          <Route path="/cms/:slug/edit/:sectionId" element={<BlockEditorSwitcher />} />

          {/* GS-22: Global Project Registry (Step 2) */}
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/new" element={<ProjectEditor />} />
          <Route path="/projects/edit/:slug" element={<ProjectEditor />} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;