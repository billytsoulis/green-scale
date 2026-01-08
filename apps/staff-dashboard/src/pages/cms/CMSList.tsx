import React from "react";
import { Link } from "react-router-dom";

/**
 * Staff Dashboard - CMS Page Directory
 * Path: apps/staff-dashboard/src/pages/cms/CMSList.tsx
 * * Lists all high-level marketing pages for localized content editing.
 */

// Preview Safety: No shared UI imports currently used in this specific file,
// but adding the template for future use.
import { Badge, Card } from "@repo/ui";

const pages = [
  { id: "home", name: "Marketing Home", sections: 8, lastUpdate: "Active" },
  { id: "about", name: "About GreenScale", sections: 4, lastUpdate: "Active" },
  { id: "pricing", name: "Pricing Strategy", sections: 6, lastUpdate: "Draft" },
  { id: "contact", name: "Lead Generation", sections: 2, lastUpdate: "Active" },
];

export default function CMSList() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Content Management</h2>
          <p className="text-slate-500 font-medium text-lg">Select a page to modify its bilingual marketing blocks.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map((page) => (
          <Link 
            key={page.id}
            to={`/cms/${page.id}`}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-all">
                {page.id[0].toUpperCase()}
              </div>
              <div className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                {page.sections} Sections
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2">{page.name}</h3>
            <div className="flex items-center gap-2">
               <span className={`w-1.5 h-1.5 rounded-full ${page.lastUpdate === 'Active' ? 'bg-emerald-500' : 'bg-orange-400'}`} />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Status: {page.lastUpdate}</p>
            </div>

            <div className="mt-10 flex justify-between items-center text-emerald-600 font-black text-xs uppercase tracking-widest">
              <span>Open Terminal Editor</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}