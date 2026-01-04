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
  // DashboardIcon, 
  // PortfolioIcon, 
  // ClientIcon, 
  // SignOutIcon,
  // DriftIcon,
  // SustainabilityIcon,
  Column
} from "@repo/ui";
import { authClient } from "@/lib/auth-client";


// --- MOCK COMPONENTS FOR PREVIEW ---
// These allow the page to render without the @repo/ui package.

// const Button = ({ children, variant, className, onClick }: any) => {
//   const base = "px-4 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2";
//   const variants: any = {
//     primary: "bg-[#065f46] text-white hover:bg-[#047857]",
//     ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
//   };
//   return (
//     <button onClick={onClick} className={`${base} ${variants[variant] || variants.primary} ${className}`}>
//       {children}
//     </button>
//   );
// };

// const Card = ({ title, description, children, variant }: any) => (
//   <div className={`p-6 rounded-3xl border ${variant === 'elevated' ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
//     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
//     <p className="text-xs text-slate-500 mb-4">{description}</p>
//     {children}
//   </div>
// );

// const Badge = ({ children, variant, showDot, animate }: any) => {
//   const styles: any = {
//     success: "bg-emerald-100 text-emerald-700",
//     danger: "bg-red-100 text-red-700",
//     warning: "bg-amber-100 text-amber-700",
//     info: "bg-blue-100 text-blue-700",
//     gold: "bg-amber-50 text-amber-600 border border-amber-200",
//   };
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${styles[variant] || 'bg-slate-100'} ${animate ? 'animate-pulse' : ''}`}>
//       {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
//       {children}
//     </span>
//   );
// };

// const DataTable = ({ data, columns }: any) => (
//   <div className="w-full overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm">
//     <table className="w-full text-left border-collapse">
//       <thead className="bg-slate-50/50">
//         <tr>
//           {columns.map((col: any) => (
//             <th key={col.key} className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-bottom border-slate-100">
//               {col.header}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-slate-50">
//         {data.map((row: any) => (
//           <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
//             {columns.map((col: any) => (
//               <td key={col.key} className={`p-5 text-sm ${col.cellClassName || ''}`}>
//                 {col.render ? col.render(row[col.key], row) : row[col.key]}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// // MOCK ICONS (SVG implementations)
// const SustainabilityIcon = ({ size = 24, className = "" }: any) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
//   </svg>
// );

const DashboardIcon = ({ size = 20, className = "" }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ClientIcon = ({ size = 20, className = "" }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const PortfolioIcon = ({ size = 20, className = "" }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const SignOutIcon = ({ size = 20, className = "" }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const DriftIcon = ({ size = 20, className = "", animate }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${className} ${animate ? 'animate-bounce' : ''}`}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

// // MOCK AUTH CLIENT
// const authClient = {
//   signOut: async () => new Promise(res => setTimeout(res, 1000))
// };

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
        // <Badge variant={val === "Critical" ? "danger" : "warning"} showDot animate={val === "Critical"}>
        <Badge variant={val === "Critical" ? "danger" : "warning"} showDot>
          {val}
        </Badge>
      )
    },
    {
      key: "actions",
      header: "",
      render: () => (
        <div className="text-right">
          <Button variant="ghost" className="text-[#047857] font-bold">
            Fix Drift
          </Button>
        </div>
      )
    }
  ];

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      /**
       * Execute Sign Out
       * This clears the signed JWT session from the browser.
       */
      // @ts-ignore
      await authClient.signOut();
      
      /**
       * FIX: Forced Navigation
       * Redirection must be active to leave the 'isLoggingOut' state.
       */
      console.log("✅ Session terminated, redirecting to login...");
      window.location.replace("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      // Even if API fails, we clear the client state by force redirect
      window.location.replace("/login");
    }
  };

  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-500 font-bold tracking-widest uppercase text-xs">Terminating Session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-slate-400 p-8 flex flex-col border-r border-slate-800">
        <div className="text-white font-bold text-2xl mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#059669] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
             {/* <SustainabilityIcon size={24} className="text-white" /> */}
          </div>
          GS Admin
        </div>
        
        <nav className="space-y-3 flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 mb-6">Management</p>
          <a href="#" className="flex items-center gap-4 px-5 py-4 bg-emerald-500/10 text-emerald-400 rounded-2xl font-bold transition-all">
            <DashboardIcon size={20} />
            Command Center
          </a>
          <a href="#" className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 hover:text-white rounded-2xl transition-all font-medium">
            <ClientIcon size={20} />
            Client Directory
          </a>
          <a href="#" className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 hover:text-white rounded-2xl transition-all font-medium">
            <PortfolioIcon size={20} />
            Trade Blotter
          </a>
        </nav>

        <div className="pt-8 border-t border-slate-800">
          <button 
            onClick={handleSignOut}
            className="group w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-red-400 transition-all font-bold"
          >
            <SignOutIcon size={20} className="group-hover:translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-50/30 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h2>
            <p className="text-slate-500 font-medium mt-1">Real-time ESG performance and portfolio health.</p>
          </div>
          <div className="flex items-center gap-5 bg-white p-3 pr-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
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
          <Card title="Total AUM" description="Global Managed Assets" variant="elevated">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900">€4.2B</h3>
              <Badge variant="success" showDot>+2.1%</Badge>
            </div>
          </Card>
          
          <Card title="Active Clients" description="Growth this month" variant="elevated">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900">1,240</h3>
              <Badge variant="info">+12</Badge>
            </div>
          </Card>

          <Card title="Drift Alerts" description="Requires attention" variant="elevated">
            <div className="flex items-baseline gap-4">
              <h3 className="text-3xl font-black text-red-600">18</h3>
              <DriftIcon size={28} animate className="text-red-500" />
            </div>
          </Card>

          <Card title="Avg ESG Score" description="Platform average" variant="elevated">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-[#065f46]">74.2</h3>
              <Badge variant="gold" showDot>Top 5%</Badge>
            </div>
          </Card>
        </div>

        {/* High Priority Alerts Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              Priority Portfolio Drift Alerts
              <Badge variant="danger">Action Required</Badge>
            </h3>
          </div>
          <DataTable 
            data={alerts} 
            columns={columns} 
          />
        </div>
      </main>
    </div>
  );
}