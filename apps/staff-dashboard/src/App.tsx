import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/**
 * Staff Dashboard Application Router
 * Path: apps/staff-dashboard/src/App.tsx
 * * UPDATED: Integrated Modular CMS Routes (GS-17).
 * * Architecture: Supports Directory (L1), Layout (L2), and Block Editors (L3).
 */

import StaffLoginPage from "./pages/login";
import StaffDashboard from "./pages/dashboard";
import CMSList from "./pages/cms/CMSList";
import LayoutCanvas from "./pages/cms/LayoutBuilder/LayoutCanvas";
import PageSettings from "./pages/cms/PageManager/PageSettings";
import BlockEditorSwitcher from "./pages/cms/BlockEditors/BlockEditorSwitcher";
import ProjectList from "./pages/projects/ProjectList";
import ProjectEditor from "./pages/projects/ProjectEditor";

import IntelligenceHub from "./pages/intelligence/Hub";
import IntelligenceOverview from "./pages/intelligence/Overview";
import IntelligenceDiscovery from "./pages/intelligence/Discovery";
import { StaffLayout } from "./layout/StaffLayout";
import { authClient } from "./lib/auth-client";

function App() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-screen flex items-center justify-center font-bold text-slate-400 uppercase tracking-widest">Hydrating Session Context...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route 
          path="/login" 
          element={session ? <Navigate to="/dashboard" replace /> : <StaffLoginPage />} 
        />

        <Route
          element={session ? <StaffLayout /> : <Navigate to="/login" replace />}
        >
          <Route path="/dashboard" element={<StaffDashboard />} />
          
          {/* CMS & Marketing Layers */}
          <Route path="/cms" element={<CMSList />} />
          <Route path="/cms/:slug/settings" element={<PageSettings />} />
          <Route path="/cms/:slug/layout" element={<LayoutCanvas />} />
          <Route path="/cms/:slug/edit/:sectionId" element={<BlockEditorSwitcher />} />

          {/* Global Project Registry */}
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/new" element={<ProjectEditor />} />
          <Route path="/projects/edit/:slug" element={<ProjectEditor />} />

          {/* --- Institutional Intelligence Hub (Phase 6) --- */}
          <Route path="/intelligence" element={<IntelligenceHub />} />
          <Route path="/intelligence/overview" element={<IntelligenceOverview />} />
          <Route path="/intelligence/search" element={<IntelligenceDiscovery />} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Global Fallback */}
        {/* @ts-ignore */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;