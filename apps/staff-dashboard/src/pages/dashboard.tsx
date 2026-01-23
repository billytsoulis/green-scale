"use client";

// import React from "react";

/**
 * Staff Dashboard Content View
 * Path: apps/staff-dashboard/src/pages/dashboard.tsx
 * * Refined: Removed layout logic. This component renders into StaffLayout's <Outlet />.
 */

// Preview Safety: Commenting out local/repo imports
/*
*/
import { 
  Button, 
  Card, 
  Badge,
  DriftIcon 
} from "@repo/ui";
import { authClient } from "../lib/auth-client";

export default function StaffDashboard() {
  /** @ts-ignore - session accessed for UI personalization */
  const { data: session } = authClient.useSession();

  const alerts = [
    { id: "1", name: "Jordan Green", portfolio: "Sustainable Tech", current: 42.5, target: 75.0, status: "Critical" },
    { id: "2", name: "Sarah Smith", portfolio: "Legacy Transition", current: 68.2, target: 80.0, status: "Warning" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
        {/* Header Section */}
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">System Overview</h2>
            <p className="text-slate-500 font-medium">Real-time ESG performance and portfolio health metrics.</p>
          </div>
          
          <div className="flex items-center gap-5 bg-white p-3 pr-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-bold uppercase">
               {session?.user?.name?.[0] || "A"}
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Operator</p>
              <p className="text-sm font-bold text-slate-900 leading-none">{session?.user?.name || "Alex Architect"}</p>
            </div>
          </div>
        </header>

        {/* Global Firm Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* @ts-ignore */}
          <Card title="Total AUM" description="Global Managed Assets">
            <div className="flex items-center gap-2">
              <h3 className="text-3xl font-black text-slate-900">€4.2B</h3>
              {/* @ts-ignore */}
              <Badge variant="success" showDot>+2.1%</Badge>
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
              <h3 className="text-3xl font-black text-emerald-800">74.2</h3>
              {/* @ts-ignore */}
              <Badge variant="gold" showDot>Top 5%</Badge>
            </div>
          </Card>
        </div>

        {/* High Priority Alerts Table */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Priority Portfolio Drift Alerts</h3>
            {/* @ts-ignore */}
            <Badge variant="danger" showDot animate>Action Required</Badge>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">Client Name</th>
                  <th className="px-8 py-5">Portfolio</th>
                  <th className="px-8 py-5">Current ESG</th>
                  <th className="px-8 py-5">Target ESG</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {alerts.map((row, i) => (
                  <tr key={i} className="text-sm group hover:bg-emerald-50/20 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-900">{row.name}</td>
                    <td className="px-8 py-5 text-slate-500 font-medium">{row.portfolio}</td>
                    <td className="px-8 py-5 font-mono font-bold text-red-500">{row.current}</td>
                    <td className="px-8 py-5 font-mono text-slate-400">{row.target}</td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${row.status === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {/* @ts-ignore */}
                      <Button variant="ghost" className="text-emerald-700 font-bold hover:underline p-0!">
                        Fix Drift
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
  );
}