import { Link, useLocation, Outlet } from "react-router-dom";
import { authClient } from "../lib/auth-client";

/**
 * Staff Layout Wrapper
 * Path: apps/staff-dashboard/src/components/layout/StaffLayout.tsx
 * * Shared Sidebar for all authenticated staff routes.
 * * Uses NavLink logic to detect and highlight active routes.
 */
const DashboardIcon = () => <span>📊</span>;
const CMSIcon = () => <span>📝</span>;
const MarketIcon = () => <span>📈</span>;
const SearchIcon = () => <span>🔍</span>;

export const StaffLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const handleSignOut = async () => {
    // @ts-ignore
    await authClient.signOut();
    window.location.replace("/login");
  };

  /**
   * Navigation Groups
   * Logic: Separating management tools from data intelligence tools.
   */
  const navGroups = [
    {
      label: "Management",
      items: [
        { label: "Command Center", path: "/dashboard", icon: <DashboardIcon />, id: "dashboard" },
        { label: "CMS Content", path: "/cms", icon: <CMSIcon />, id: "cms" },
      ]
    },
    {
      label: "Institutional Intelligence",
      items: [
        { label: "Hub", path: "/intelligence", icon: <MarketIcon />, id: "Hub" },
        { label: "Market Overview", path: "/intelligence/overview", icon: <MarketIcon />, id: "overview" },
        { label: "Ticker Discovery", path: "/intelligence/search", icon: <SearchIcon />, id: "search" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white flex font-sans text-left">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-slate-400 p-8 flex flex-col border-r border-slate-800 shrink-0">
        <div className="text-white font-bold text-2xl mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
             <span className="text-white font-black">GS</span>
          </div>
          <span className="tracking-tight">GS Admin</span>
        </div>
        
        <nav className="space-y-10 flex-1">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 pl-2">
                {group.label}
              </p>
              
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.path);
                  return (
                    /* @ts-ignore */
                    <Link 
                      key={item.id}
                      to={item.path} 
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                        isActive 
                          ? "bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]" 
                          : "hover:bg-white/5 hover:text-white text-slate-400"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* System Status / User Footer */}
        <div className="pt-8 border-t border-slate-800 space-y-4">
          <div className="px-5 py-3 bg-white/5 rounded-2xl flex items-center gap-3 border border-white/5">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Gateway Connected</span>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="group w-full flex items-center gap-4 px-5 py-4 text-slate-500 hover:text-red-400 transition-all font-bold cursor-pointer bg-transparent border-none"
          >
             <span className="text-xl group-hover:scale-110 transition-transform">🚪</span>
             <span className="text-sm uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area: Renders the child routes */}
      <main className="flex-1 bg-slate-50/30 p-12 overflow-y-auto">
        {/* Child components like Overview.tsx will render here */}
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;