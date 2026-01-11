import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Globe, Search, ShieldCheck } from "lucide-react";
import { Button, Card, Badge } from "@repo/ui";

/**
 * Staff Dashboard - Page Settings (Layer 1)
 * Path: apps/staff-dashboard/src/pages/cms/PageManager/PageSettings.tsx
 * Purpose: Manages SEO metadata and high-level page configuration.
 */

interface PageMetadata {
  description: string;
  keywords: string;
  ogImage: string;
}

export default function PageSettings() {
  // @ts-ignore
  // const { pageId } = useParams();
  // const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isNavItem, setIsNavItem] = useState(false);
  const [metadata, setMetadata] = useState<PageMetadata>({
    description: "",
    keywords: "",
    ogImage: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Mock Fetch Logic for SEO Data
    setTitle("About Us");
    setSlug("about-us");
    setIsNavItem(true);
    setMetadata({
      description: "Learn about GreenScale's mission to decarbonize capital markets.",
      keywords: "ESG, Greenwashing, Sustainability Audit",
      ogImage: "https://assets.greenscale.com/og-about.jpg"
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // @ts-ignore
    // await fetch(`/api/cms/pages/${pageId}/settings`, { method: 'PATCH', ... });
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="space-y-8 pb-20" data-component="PageSettings">
      <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          {/* @ts-ignore */}
          <Button variant="ghost" size="sm" onClick={() => {} /* navigate(-1) */} className="!rounded-xl text-slate-400">
            {/* @ts-ignore */}
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Page Settings</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Configuring: {slug}</p>
          </div>
        </div>

        {/* @ts-ignore */}
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="!rounded-xl !bg-brand-emerald-800 shadow-lg shadow-emerald-900/20 text-xs flex items-center gap-2"
        >
          {/* @ts-ignore */}
          <Save size={14} /> {isSaving ? "Syncing..." : "Save Settings"}
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* @ts-ignore */}
          <Card className="p-8 space-y-8 border-slate-100 bg-white">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              {/* @ts-ignore */}
              <Settings size={18} className="text-brand-emerald-600" />
              <h3 className="font-bold text-slate-900">General Configuration</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Administrative Title</label>
                <input 
                  type="text"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-brand-emerald-500 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL Slug</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-medium">/</span>
                  <input 
                    type="text"
                    className="w-full p-4 pl-7 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-brand-emerald-500 transition-all"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-emerald-600 shadow-sm">
                  {/* @ts-ignore */}
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Navigation Visibility</h4>
                  <p className="text-xs text-slate-400 font-medium">Include this page in the main portal header.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsNavItem(!isNavItem)}
                className={`w-14 h-8 rounded-full transition-all relative ${isNavItem ? 'bg-brand-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${isNavItem ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </Card>

          {/* @ts-ignore */}
          <Card className="p-8 space-y-8 border-slate-100 bg-white">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              {/* @ts-ignore */}
              <Search size={18} className="text-brand-emerald-600" />
              <h3 className="font-bold text-slate-900">SEO & Social Meta</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Meta Description</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 outline-none focus:border-brand-emerald-500 transition-all min-h-[100px]"
                  value={metadata.description}
                  onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Keywords (Comma Separated)</label>
                <input 
                  type="text"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 outline-none focus:border-brand-emerald-500 transition-all"
                  value={metadata.keywords}
                  onChange={(e) => setMetadata({...metadata, keywords: e.target.value})}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* @ts-ignore */}
          <Card className="p-6 bg-brand-emerald-900 text-white rounded-[2rem] space-y-4">
            {/* @ts-ignore */}
            <ShieldCheck size={32} className="text-brand-emerald-400" />
            <h4 className="font-bold text-lg leading-tight">Search Integrity Policy</h4>
            <p className="text-brand-emerald-100/60 text-sm leading-relaxed">
              Updating the slug will change the live URL. Ensure that redirects are handled in the API Gateway to prevent 404 errors for existing users.
            </p>
          </Card>
          
          <div className="p-6 border border-slate-100 rounded-[2rem] bg-white text-center space-y-4">
            <div className="w-full aspect-video bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300 italic text-xs">
              Social Card Preview
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OG Image Preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}