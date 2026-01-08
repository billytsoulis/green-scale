import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { authClient } from "../lib/auth-client";

/**
 * Staff Layout Wrapper
 * Path: apps/staff-dashboard/src/components/layout/StaffLayout.tsx
 * * Shared Sidebar for all authenticated staff routes.
 * * Uses NavLink logic to detect and highlight active routes.
 */

export const StaffLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const handleSignOut = async () => {
    // @ts-ignore
    await authClient.signOut();
    window.location.replace("/login");
  };

  const navItems = [
    { label: "Command Center", path: "/dashboard", id: "dashboard" },
    { label: "CMS Content", path: "/cms", id: "cms" },
    { label: "Client Directory", path: "/clients", id: "clients" },
    { label: "Trade Blotter", path: "/trades", id: "trades" },
  ];

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-slate-400 p-8 flex flex-col border-r border-slate-800">
        <div className="text-white font-bold text-2xl mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
             <span className="text-white font-black">GS</span>
          </div>
          GS Admin
        </div>
        
        <nav className="space-y-3 flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 mb-6">Management</p>
          
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link 
                key={item.id}
                to={item.path} 
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-slate-800">
          <button 
            onClick={handleSignOut}
            className="group w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-red-400 transition-all font-bold cursor-pointer"
          >
             Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area: Renders the child routes */}
      <main className="flex-1 bg-slate-50/30 p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};