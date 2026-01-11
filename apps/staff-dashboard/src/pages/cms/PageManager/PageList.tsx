import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Globe, Settings, ExternalLink } from "lucide-react";
import { Button, Card, Badge } from "@repo/ui";

/**
 * Staff Dashboard - Page Manager (Layer 1)
 * Path: apps/staff-dashboard/src/pages/cms/PageManager/PageList.tsx
 * Purpose: Lists all marketing routes and provides high-level page management.
 */

interface MarketingPage {
  id: string;
  slug: string;
  title: string;
  isNavItem: boolean;
  status: "DRAFT" | "PUBLISHED";
}

export default function PageList() {
  const [pages, setPages] = useState<MarketingPage[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock API Call for Layer 1
  useEffect(() => {
    const fetchPages = async () => {
      // @ts-ignore
      // const response = await fetch('/api/cms/pages');
      // const data = await response.json();
      
      // Temporary Mock Data
      const mockData: MarketingPage[] = [
        { id: "1", slug: "about", title: "About GreenScale", isNavItem: true, status: "PUBLISHED" },
        { id: "2", slug: "home", title: "Marketing Home", isNavItem: true, status: "PUBLISHED" },
        { id: "3", slug: "methodology", title: "Methodology", isNavItem: false, status: "DRAFT" },
      ];
      
      setPages(mockData);
      setLoading(false);
    };

    fetchPages();
  }, []);

  if (loading) {
    return <div className="p-20 text-center animate-pulse text-slate-400">Loading Page Directory...</div>;
  }

  return (
    <div className="space-y-10" data-component="PageList">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Marketing Pages</h2>
          <p className="text-slate-500 font-medium text-lg">Define your site structure and SEO routes.</p>
        </div>
        {/* @ts-ignore */}
        <Button className="!rounded-2xl !bg-brand-emerald-800 flex items-center gap-2">
          {/* @ts-ignore */}
          <Plus size={20} />
          Create New Page
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          /* @ts-ignore */
          <Card key={page.id} className="p-8 hover:shadow-2xl transition-all group relative overflow-hidden border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-emerald-600 group-hover:text-white transition-all">
                {/* @ts-ignore */}
                <FileText size={24} />
              </div>
              <div className="flex flex-col items-end gap-2">
                {/* @ts-ignore */}
                <Badge variant={page.status === 'PUBLISHED' ? 'success' : 'warning'}>
                  {page.status}
                </Badge>
                {page.isNavItem && (
                   <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                     {/* @ts-ignore */}
                     <Globe size={10} /> In Nav
                   </span>
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">{page.title}</h3>
            <p className="text-sm text-slate-400 font-mono mb-8">/{page.slug}</p>

            <div className="flex items-center gap-3 border-t border-slate-50 pt-6">
              {/* @ts-ignore */}
              <Link to={`/cms/pages/${page.id}/layout`} className="flex-1">
                {/* @ts-ignore */}
                <Button variant="outline" size="sm" className="w-full !rounded-xl text-xs flex items-center justify-center gap-2">
                  {/* @ts-ignore */}
                  <Settings size={14} /> Edit Layout
                </Button>
              </Link>
              {/* @ts-ignore */}
              <a href={`http://localhost:3000/en/${page.slug}?nocache=true`} target="_blank" rel="noreferrer">
                {/* @ts-ignore */}
                <Button variant="ghost" size="sm" className="!p-2 !rounded-xl text-slate-400 hover:text-brand-emerald-600">
                  {/* @ts-ignore */}
                  <ExternalLink size={16} />
                </Button>
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}