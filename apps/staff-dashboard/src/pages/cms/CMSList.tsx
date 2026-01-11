import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Globe, Settings, ExternalLink, Plus, Layout, ArrowRight, Loader2 } from "lucide-react";
import { Button, Card, Badge } from "@repo/ui";

/**
 * Page Manager (Layer 1)
 * Path: apps/staff-dashboard/src/pages/cms/CMSList.tsx
 * * Fix: Resolved 'import.meta' error for compatibility with older target environments.
 * * Function: Dynamic list fetched from the marketing_pages table.
 */

interface MarketingPage {
  id: string;
  slug: string;
  title: string;
  isNavItem: boolean;
  updatedAt: string;
}

export default function CMSList() {
  const [pages, setPages] = useState<MarketingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Safe retrieval of the Gateway URL.
   * Uses cast to 'any' to avoid compilation errors in environments 
   * that do not support import.meta directly.
   */
  const getGatewayUrl = () => {
    try {
      const meta = import.meta as any;
      if (meta?.env?.VITE_API_URL) {
        return meta.env.VITE_API_URL;
      }
    } catch (e) {
      // Fallback to default port
    }
    return "http://localhost:3005";
  };

  const gatewayUrl = getGatewayUrl();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${gatewayUrl}/api/cms/pages`);
        if (!response.ok) throw new Error("Connection failed to the CMS database.");
        const data = await response.json();
        setPages(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [gatewayUrl]);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
        {/* @ts-ignore */}
        <Loader2 size={40} className="animate-spin" />
        <p className="font-bold tracking-widest uppercase text-[10px]">Synchronizing Page Directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <h2 className="text-5xl font-black text-slate-900 tracking-tight">Content</h2>
             {/* @ts-ignore */}
             <Badge variant="gold" size="sm" className="mt-2 text-amber-600 border-amber-200 bg-amber-50">v2.0 Modular</Badge>
          </div>
          <p className="text-slate-500 font-medium text-xl">Manage your bilingual marketing ecosystem.</p>
        </div>
        
        {/* @ts-ignore */}
        <Button className="!rounded-[1.5rem] !bg-emerald-900 !px-8 !py-6 shadow-xl shadow-emerald-900/20 flex items-center gap-3 hover:scale-105 transition-transform text-white">
          {/* @ts-ignore */}
          <Plus size={20} />
          <span className="font-bold">Create Page</span>
        </Button>
      </header>

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] text-red-600 flex items-center gap-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-black uppercase text-xs tracking-widest">Connection Error</p>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map((page) => (
          /* @ts-ignore */
          <Card key={page.id} className="group p-0 rounded-[2.5rem] border-slate-100 bg-white overflow-hidden hover:shadow-2xl hover:border-emerald-100 transition-all duration-500">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-500">
                  {/* @ts-ignore */}
                  <FileText size={32} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  {page.isNavItem && (
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                      {/* @ts-ignore */}
                      <Globe size={12} /> In Menu
                    </span>
                  )}
                  {/* @ts-ignore */}
                  <Badge variant="outline" className="opacity-50 text-[10px]">ID: {page.id.slice(0, 8)}</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">{page.title}</h3>
                <p className="text-slate-400 font-mono text-sm mt-1">/{page.slug}</p>
              </div>

              <div className="flex gap-2 pt-2">
                 {/* @ts-ignore */}
                 <Link to={`/cms/${page.slug}/layout`} className="flex-1 cursor-pointer">
                   {/* @ts-ignore */}
                   <Button variant="outline" className="w-full !rounded-xl !py-5 !border-slate-100 hover:cursor-pointer hover:bg-emerald-500/10 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:!text-emerald-900 transition-colors">
                     {/* @ts-ignore */}
                     <Layout size={14} /> Layout
                   </Button>
                 </Link>
                 
                 {/* @ts-ignore */}
                 <Link to={`/cms/${page.slug}/settings`} className="group/settings cursor-pointer">
                   {/* @ts-ignore */}
                   <Button variant="ghost" className="!p-4 !rounded-xl text-slate-300 group-hover/settings:text-emerald-700 transition-all hover:cursor-pointer">
                     {/* @ts-ignore */}
                     <Settings size={20} className="inline-block transition-transform duration-500 ease-in-out group-hover/settings:rotate-360" />
                   </Button>
                 </Link>
              </div>
            </div>

            <a 
              href={`http://localhost:3000/en/${page.slug}?nocache=true`} 
              target="_blank" 
              rel="noreferrer"
              className="block w-full py-4 bg-slate-50 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:!bg-emerald-600 hover:!text-white transition-all border-t border-slate-50 cursor-pointer"
            >
              View Live Portal <span className="ml-1 inline-block group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </Card>
        ))}

        {/* Create Placeholder Card */}
        {/* @ts-ignore */}
        <button className="border-2 border-dashed border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-emerald-200 hover:text-emerald-400 transition-all group cursor-pointer">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
             {/* @ts-ignore */}
             <Plus size={32} />
          </div>
          <span className="font-black uppercase tracking-widest text-xs">Register New Page</span>
        </button>
      </div>

      <style>{`
        .rotate-360 {
          transform: rotate(360deg);
        }
      `}</style>
    </div>
  );
}