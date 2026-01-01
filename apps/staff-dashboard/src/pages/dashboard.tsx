"use client";

import React, { useState, useEffect } from "react";

/**
 * Staff Command Center:
 * This is the high-density view for Wealth Managers.
 * It features the "Portfolio Drift" detector alerts.
 */

import { authClient } from "../lib/auth-client"; 

export default function StaffDashboard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      /**
       * authClient.signOut handles clearing the session cookies/tokens.
       * We use window.location.replace for a "clean" redirect that 
       * replaces the dashboard in the browser history, preventing 
       * the user from clicking "Back" to return to a dead session.
       */
      // @ts-ignore
      await authClient.signOut();
      
      // We use replace() instead of href to prevent the user from 
      // navigating "Back" into the dashboard after signing out.
      // A hard refresh to the absolute login URL clears any remaining memory state.
      window.location.replace("/login");
    } catch (error) {
      console.error("Sign out failed", error);
      window.location.replace("/login");
    }
  };

  // If the user is currently logging out, show a blank state or loader
  // to prevent them from interacting with the dashboard data.
  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Securing session and redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-400 p-6 flex flex-col">
        <div className="text-white font-bold text-xl mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg"></div>
          GS Admin
        </div>
        
        <nav className="space-y-2 flex-1">
          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-600 mb-4">Management</div>
          <a href="#" className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg font-medium">
            Command Center
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors">
            Client Directory
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors">
            Trade Blotter
          </a>
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button 
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="text-sm hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-50/50 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">System Overview</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400">OPERATOR</p>
              <p className="text-sm font-bold text-slate-900">Alex Architect</p>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
          </div>
        </header>

        {/* Global Firm Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total AUM", value: "€4.2B", change: "+2.1%" },
            { label: "Active Clients", value: "1,240", change: "+12" },
            { label: "Drift Alerts", value: "18", color: "text-red-600" },
            { label: "Avg ESG Score", value: "74.2", change: "+0.5" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tight mb-1">{stat.label}</p>
              <h3 className={`text-2xl font-bold ${stat.color || "text-slate-900"}`}>{stat.value}</h3>
              {stat.change && <p className="text-[10px] font-bold text-emerald-600 mt-2">{stat.change} vs last month</p>}
            </div>
          ))}
        </div>

        {/* High Priority Alerts Table */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h3 className="font-bold text-slate-900">Priority Portfolio Drift Alerts</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold">
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Portfolio</th>
                <th className="px-6 py-4">Current ESG</th>
                <th className="px-6 py-4">Target ESG</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: "Jordan Green", portfolio: "Sustainable Tech", current: "42.5", target: "75.0", status: "Critical" },
                { name: "Sarah Smith", portfolio: "Legacy Transition", current: "68.2", target: "80.0", status: "Warning" },
              ].map((row, i) => (
                <tr key={i} className="text-sm hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{row.name}</td>
                  <td className="px-6 py-4 text-slate-500">{row.portfolio}</td>
                  <td className="px-6 py-4 font-mono font-bold text-red-500">{row.current}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{row.target}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${row.status === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-emerald-600 font-bold hover:underline">Fix Drift</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}