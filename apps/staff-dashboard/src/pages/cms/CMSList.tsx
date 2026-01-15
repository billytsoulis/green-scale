import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Globe, Settings, ExternalLink, Plus, Layout, ArrowRight, Loader2 } from "lucide-react";
import { Button, Card, Badge, Modal, Input } from "@repo/ui";

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

  // Creation State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isNavItem, setIsNavItem] = useState(false);

  const getGatewayUrl = () => {
    try {
      const meta = import.meta as any;
      return meta?.env?.VITE_API_URL || "http://localhost:3005";
    } catch (e) { return "http://localhost:3005"; }
  };
  const gatewayUrl = getGatewayUrl();

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

  useEffect(() => {
    fetchPages();
  }, [gatewayUrl]);

  // Auto-generate slug from title
  useEffect(() => {
    if (newTitle && !newSlug.includes('-')) {
      setNewSlug(newTitle.toLowerCase().trim().replace(/\s+/g, '-'));
    }
  }, [newTitle]);

  const handleCreatePage = async () => {
    if (!newTitle || !newSlug) return;
    setIsCreating(true);
    try {
      const response = await fetch(`${gatewayUrl}/api/cms/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: newTitle, 
          slug: newSlug, 
          isNavItem 
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setNewTitle("");
        setNewSlug("");
        fetchPages(); // Refresh the list
      } else {
        const err = await response.json();
        alert(err.error || "Creation failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading && pages.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
        {/* @ts-ignore */}
        <Loader2 size={40} className="animate-spin text-emerald-500" />
        <p className="font-bold tracking-widest uppercase text-[10px]">Synchronizing Page Directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-3">
             <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Content</h2>
             {/* @ts-ignore */}
             <Badge variant="gold" className="text-amber-600 border border-amber-200 bg-amber-50">v2.0 Modular</Badge>
          </div>
          <p className="text-slate-500 font-medium text-xl">Manage your bilingual marketing ecosystem.</p>
        </div>
        
        {/* Trigger Modal */}
        {/* @ts-ignore */}
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="!bg-emerald-900 shadow-xl shadow-emerald-900/20 flex items-center gap-3 hover:scale-105 transition-transform text-white border-none"
        >
          {/* @ts-ignore */}
          <Plus size={20} />
          <span>Create Page</span>
        </Button>
      </header>

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] text-red-600 flex items-center gap-4 text-left">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-black uppercase text-xs tracking-widest">Connection Error</p>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map((page) => (
          <div key={page.id} className="group p-0 rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden hover:shadow-2xl hover:border-emerald-100 transition-all duration-500">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-500 border border-transparent">
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
                  <div className="opacity-50 text-[10px] border border-slate-200 px-2 py-0.5 rounded uppercase font-bold">ID: {page.id.slice(0, 8)}</div>
                </div>
              </div>

              <div className="text-left">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors leading-none">{page.title}</h3>
                <p className="text-slate-400 font-mono text-sm mt-2">/{page.slug}</p>
              </div>

              <div className="flex gap-2 pt-2">
                 {/* @ts-ignore */}
                 <Link to={`/cms/${page.slug}/layout`} className="flex-1">
                   <button className="w-full rounded-xl py-4 border border-slate-100 hover:bg-emerald-50 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-900 transition-colors bg-white cursor-pointer">
                     {/* @ts-ignore */}
                     <Layout size={14} /> Layout builder
                   </button>
                 </Link>
                 
                 {/* @ts-ignore */}
                 <Link to={`/cms/${page.slug}/settings`}>
                   <button className="p-4 rounded-xl text-slate-300 hover:text-emerald-700 transition-all bg-transparent border-none cursor-pointer">
                     {/* @ts-ignore */}
                     <Settings size={20} />
                   </button>
                 </Link>
              </div>
            </div>

            <a 
              href={`http://localhost:3000/en/${page.slug}?nocache=true`} 
              target="_blank" 
              className="block w-full py-4 bg-slate-50 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-emerald-600 hover:text-white transition-all border-t border-slate-100 no-underline"
            >
              View Live Portal →
            </a>
          </div>
        ))}

        {/* Empty State Placeholder */}
        {/* @ts-ignore */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-emerald-200 hover:text-emerald-400 transition-all group cursor-pointer bg-white"
        >
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
             {/* @ts-ignore */}
             <Plus size={32} />
          </div>
          <span className="font-black uppercase tracking-widest text-xs">Register New Page</span>
        </button>
      </div>

      {/* CREATE MODAL */}
      {/** @ts-ignore */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Register New Page"
        size="lg"
        footer={
          <>
            {/* @ts-ignore */}
            <Button className="!bg-white !text-slate-400 !border-none" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            {/* @ts-ignore */}
            <Button 
              className="!bg-emerald-900 !text-white !border-none" 
              onClick={handleCreatePage} 
              disabled={isCreating || !newTitle || !newSlug}
            >
              {isCreating ? "Initializing..." : "Create Page"}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* @ts-ignore */}
          <Input 
            label="Page Title" 
            placeholder="e.g. Sustainable Infrastructure" 
            value={newTitle}
            onChange={(e: any) => setNewTitle(e.target.value)}
          />
          {/* @ts-ignore */}
          <Input 
            label="URL Slug" 
            placeholder="e.g. sustainable-infrastructure" 
            value={newSlug}
            onChange={(e: any) => setNewSlug(e.target.value)}
            helperText="The path users will see in the browser."
          />
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-left">
              <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Portal Navigation</h4>
              <p className="text-[10px] text-slate-400 font-bold">Include this page in the main menu?</p>
            </div>
            <button 
              onClick={() => setIsNavItem(!isNavItem)}
              className={`w-12 h-6 rounded-full transition-all relative cursor-pointer border-none ${isNavItem ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${isNavItem ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}