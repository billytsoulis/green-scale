import React, { useState, useEffect } from "react";

/**
 * Staff Dashboard - CMS Page Editor
 * Path: apps/staff-dashboard/src/pages/cms/CMSEditor.tsx
 * * Purpose: Side-by-side editing for high-alpha content.
 */

// Preview Safety: Mock data for the editor
const mockBlocks = [
  { sectionId: "hero_title", contentEn: "Invest in the Future", contentEl: "Επενδύστε στο Μέλλον" },
  { sectionId: "hero_desc", contentEn: "ESG platform for HNWI.", contentEl: "Πλατφόρμα ESG για HNWI." },
];

export default function CMSEditor() {
  const [blocks, setBlocks] = useState(mockBlocks);
  const [activeTab, setActiveTab] = useState<"en" | "el" | "split">("split");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => window.location.href = "/cms"}
            className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
          >
            ←
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Editing: Landing Page</h2>
            <div className="flex gap-4 mt-1">
               <button onClick={() => setActiveTab("en")} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === "en" ? "text-emerald-600" : "text-slate-300"}`}>English</button>
               <button onClick={() => setActiveTab("el")} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === "el" ? "text-emerald-600" : "text-slate-300"}`}>Greek</button>
               <button onClick={() => setActiveTab("split")} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === "split" ? "text-emerald-600 underline" : "text-slate-300"}`}>Side-by-Side</button>
            </div>
          </div>
        </div>

        <button className="px-8 py-4 bg-emerald-800 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all">
          Publish Changes
        </button>
      </header>

      <div className="space-y-6">
        {blocks.map((block) => (
          <div key={block.sectionId} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                BLOCK_ID: {block.sectionId}
              </span>
            </div>

            <div className={`grid gap-8 ${activeTab === "split" ? "grid-cols-2" : "grid-cols-1"}`}>
              {(activeTab === "en" || activeTab === "split") && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">English (EN)</label>
                  <textarea 
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all min-h-[120px]"
                    defaultValue={block.contentEn}
                  />
                </div>
              )}
              {(activeTab === "el" || activeTab === "split") && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest ml-1">Greek (EL)</label>
                  <textarea 
                    className="w-full p-6 bg-emerald-50/30 border border-emerald-100 rounded-2xl font-medium text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all min-h-[120px]"
                    defaultValue={block.contentEl}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}