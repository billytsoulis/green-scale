"use client";

import React, { useState } from "react";

/**
 * GreenScale Phase 3 Refactor: Staff Dashboard
 * * NOTE FOR LOCAL ENVIRONMENT: 
 * The imports below are commented out to allow rendering in this preview.
 * Uncomment them and remove the "MOCK" definitions below when moving to your local code.
 */

import { 
  Button, 
  Card, 
  Badge, 
  DataTable, 
  DashboardIcon, 
  PortfolioIcon, 
  ClientIcon, 
  SignOutIcon,
  DriftIcon,
  SustainabilityIcon,
  // Column
} from "@repo/ui";
import { authClient } from "@/lib/auth-client";

export default function StaffDashboard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const alerts = [
    { id: "1", name: "Jordan Green", portfolio: "Sustainable Tech", current: 42.5, target: 75.0, status: "Critical" },
    { id: "2", name: "Sarah Smith", portfolio: "Legacy Transition", current: 68.2, target: 80.0, status: "Warning" },
    { id: "3", name: "Marcus Vane", portfolio: "Ocean CleanTech", current: 55.0, target: 85.0, status: "Critical" },
  ];

  const columns = [
    { 
      key: "name", 
      header: "Client Name", 
      cellClassName: "font-bold text-slate-900" 
    },
    { key: "portfolio", header: "Portfolio" },
    { 
      key: "current", 
      header: "Current ESG", 
      render: (val: number) => <span className="font-mono font-bold text-red-500">{val}</span>
    },
    { 
      key: "target", 
      header: "Target ESG", 
      render: (val: number) => <span className="font-mono text-slate-400">{val}</span>
    },
    { 
      key: "status", 
      header: "Status",
      render: (val: string) => (
        // @ts-ignore
        <Badge variant={val === "Critical" ? "danger" : "warning"} showDot animate={val === "Critical"}>
          {val}
        </Badge>
      )
    },
    {
      key: "actions",
      header: "",
      render: () => (
        <div className="text-right">
          {/* @ts-ignore */}
          <Button variant="ghost" className="text-brand-emerald-700 font-bold">
            Fix Drift
          </Button>
        </div>
      )
    }
  ];

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      // @ts-ignore
      await authClient.signOut();
      window.location.replace("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      window.location.replace("/login");
    }
  };

  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-emerald-500 font-bold tracking-widest uppercase text-xs">Terminating Session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-slate-400 p-8 flex flex-col border-r border-slate-800">
        <div className="text-white font-bold text-2xl mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
            {/* @ts-ignore */}
            <SustainabilityIcon size={24} className="text-white" />
          </div>
          GS Admin
        </div>
        
        <nav className="space-y-3 flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 mb-6">Management</p>
          <a href="#" className="flex items-center gap-4 px-5 py-4 bg-brand-emerald-500/10 text-brand-emerald-400 rounded-2xl font-bold transition-all">
            {/* @ts-ignore */}
            <DashboardIcon size={20} />
            Command Center
          </a>
          <a href="#" className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 hover:text-white rounded-2xl transition-all font-medium">
            {/* @ts-ignore */}
            <ClientIcon size={20} />
            Client Directory
          </a>
          <a href="#" className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 hover:text-white rounded-2xl transition-all font-medium">
            {/* @ts-ignore */}
            <PortfolioIcon size={20} />
            Trade Blotter
          </a>
        </nav>

        <div className="pt-8 border-t border-slate-800">
          <button 
            onClick={handleSignOut}
            className="group w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-red-400 transition-all font-bold cursor-pointer"
          >
            {/* @ts-ignore */}
            <SignOutIcon size={20} className="group-hover:translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-50/30 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight text-balance">System Overview</h2>
            <p className="text-slate-500 font-medium mt-1">Real-time ESG performance and portfolio health.</p>
          </div>
          <div className="flex items-center gap-5 bg-white p-3 pr-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-brand-gold-100 rounded-2xl flex items-center justify-center text-brand-gold-600">
              {/* @ts-ignore */}
              <ClientIcon size={24} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</p>
              <p className="text-sm font-bold text-slate-900">Alex Architect</p>
            </div>
          </div>
        </header>

        {/* Global Firm Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* @ts-ignore */}
          <Card title="Total AUM" description="Global Managed Assets">
            <div className="flex items-center gap-4">
              <h3 className="text-3xl font-black text-slate-900">€4.2B</h3>
              {/* @ts-ignore */}
              <Badge 
                variant="success" 
                showDot 
                className="h-[1.7rem] mt-1 py-0 flex items-center"
              >
                +2.1%
              </Badge>
            </div>
          </Card>
          
          {/* @ts-ignore */}
          <Card title="Active Clients" description="Growth this month">
            <div className="flex items-center gap-2">
              <h3 className="text-3xl font-black text-slate-900">1,240</h3>
              {/* @ts-ignore */}
              <Badge variant="info">+12</Badge>
            </div>
          </Card>

          {/* @ts-ignore */}
          <Card title="Drift Alerts" description="Requires attention">
            <div className="flex items-center gap-4">
              <h3 className="text-3xl font-black text-red-600">18</h3>
              {/* @ts-ignore */}
              <DriftIcon size={28} animate className="text-red-500" />
            </div>
          </Card>

          {/* @ts-ignore */}
          <Card title="Avg ESG Score" description="Platform average">
            <div className="flex items-center gap-2">
              <h3 className="text-3xl font-black text-brand-emerald-800">74.2</h3>
              {/* @ts-ignore */}
              <Badge variant="gold" showDot>Top 5%</Badge>
            </div>
          </Card>
        </div>

        {/* High Priority Alerts Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              Priority Portfolio Drift Alerts
              {/* @ts-ignore */}
              <Badge variant="danger">Action Required</Badge>
            </h3>
          </div>
          {/* @ts-ignore */}
          <DataTable 
            data={alerts} 
            columns={columns} 
          />
        </div>
      </main>
    </div>
  );
}