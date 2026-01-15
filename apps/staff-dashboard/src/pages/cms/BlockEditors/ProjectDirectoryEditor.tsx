"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Eye, ExternalLink, ShieldCheck, Filter, Database, ArrowRight } from "lucide-react";
// import { Button, Card, Input } from "@repo/ui";

/**
 * Staff Dashboard - Project Directory Editor (Layer 3)
 * Path: apps/staff-dashboard/src/pages/cms/BlockEditors/ProjectDirectoryEditor.tsx
 * Purpose: Specialized editor for the labels and settings of the Project Grid block.
 * Logic: Synchronizes labels for filtering, auditing, and empty states.
 */

interface ProjectDirectoryContent {
  filterTitle: string;
  auditTitle: string;
  auditDescription: string;
}

export default function ProjectDirectoryEditor() {
  // @ts-ignore
  const navigate = useNavigate();
  // @ts-ignore
  const { sectionId } = useParams();
  
  const [contentEn, setContentEn] = useState<ProjectDirectoryContent>({ 
    filterTitle: "Refine Inventory", 
    auditTitle: "Institutional Grade Auditing", 
    auditDescription: "Every project in this catalog has passed our proprietary AI audit for ESG claim verification.",
  });
  const [contentEl, setContentEl] = useState<ProjectDirectoryContent>({ 
    filterTitle: "Φιλτράρισμα Αποθέματος", 
    auditTitle: "Έλεγχος Θεσμικού Επιπέδου", 
    auditDescription: "Κάθε έργο σε αυτόν τον κατάλογο έχει περάσει από τον ιδιόκτητο έλεγχο AI για την επαλήθευση των ισχυρισμών ESG.",
  });
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<"en" | "el">("en");
  const [projectCount, setProjectCount] = useState(0);
  
  const [previewId] = useState(() => crypto.randomUUID());
  const hasFetched = useRef(false);
  const debounceTimer = useRef<any>(null);

  const gatewayUrl = "http://localhost:3005";
  const portalUrl = "http://localhost:3000";

  /**
   * 1. Data Hydration
   */
  useEffect(() => {
    if (!sectionId || hasFetched.current) return;
    const fetchSectionData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${gatewayUrl}/api/cms/sections/${sectionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.contentEn) setContentEn(data.contentEn);
          if (data.contentEl) setContentEl(data.contentEl);
          hasFetched.current = true;
        }

        // Fetch project count for the Registry Integration info card
        const projRes = await fetch(`${gatewayUrl}/api/projects`);
        if (projRes.ok) {
          const projs = await projRes.json();
          setProjectCount(projs.length);
        }
      } catch (err) { 
        console.error("[ProjectDirectoryEditor] Hydration failed:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchSectionData();
  }, [sectionId, gatewayUrl]);

  /**
   * 2. Preview Synchronization
   */
  const syncPreview = useCallback(async (en: ProjectDirectoryContent, el: ProjectDirectoryContent) => {
    try {
      await fetch(`${gatewayUrl}/api/cms/preview/${previewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentEn: en, contentEl: el, type: "PROJECT_DIRECTORY" })
      });
    } catch (err) { console.warn("Sync interrupted."); }
  }, [previewId, gatewayUrl]);

  /**
   * 3. Debounce Effect
   */
  useEffect(() => {
    if (!hasFetched.current) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      syncPreview(contentEn, contentEl);
    }, 400);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [contentEn, contentEl, syncPreview]);

  /**
   * 4. Save to DB
   */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${gatewayUrl}/api/cms/sections/${sectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentEn, contentEl })
      });
      if (res.ok) setTimeout(() => setIsSaving(false), 600);
    } catch (err) { setIsSaving(false); }
  };

  const handleOpenPreview = () => {
    const url = `${portalUrl}/${activeLang}/preview/block?type=PROJECT_DIRECTORY&id=${previewId}`;
    window.open(url, "_blank");
  };

  const currentContent = activeLang === "en" ? contentEn : contentEl;
  
  const updateField = (field: keyof ProjectDirectoryContent, value: string) => {
    if (activeLang === "en") {
      setContentEn(prev => ({ ...prev, [field]: value }));
    } else {
      setContentEl(prev => ({ ...prev, [field]: value }));
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-bold tracking-widest uppercase text-[10px]">Syncing Directory Configuration...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700" data-component="ProjectDirectoryEditor">
      {/* Navigation Header */}
      <header className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-5">
          {/* @ts-ignore */}
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 border border-slate-100 bg-white cursor-pointer"
          >
            {/* @ts-ignore */}
            <ChevronLeft size={20} />
          </button>
          <div className="text-left">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Directory Builder</h2>
            <div className="flex gap-4 mt-2">
              <button onClick={() => setActiveLang("en")} className={`text-[10px] font-black uppercase tracking-widest border-none bg-transparent cursor-pointer ${activeLang === 'en' ? 'text-emerald-600 underline underline-offset-4' : 'text-slate-300'}`}>English</button>
              <button onClick={() => setActiveLang("el")} className={`text-[10px] font-black uppercase tracking-widest border-none bg-transparent cursor-pointer ${activeLang === 'el' ? 'text-emerald-600 underline underline-offset-4' : 'text-slate-300'}`}>Greek</button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {/* @ts-ignore */}
          <button onClick={handleOpenPreview} className="rounded-2xl px-5 py-3 flex items-center gap-2 text-xs border border-slate-200 bg-white font-bold cursor-pointer hover:border-emerald-500 transition-all">
            {/* @ts-ignore */}
            <Eye size={14} /> Preview 
            {/* @ts-ignore */}
            <ExternalLink size={12} className="opacity-30" />
          </button>
          {/* @ts-ignore */}
          <button onClick={handleSave} disabled={isSaving} className="rounded-2xl px-8 py-3 !bg-emerald-900 text-white border-none font-bold cursor-pointer shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">
            {/* @ts-ignore */}
            {isSaving ? "Syncing..." : <><Save size={14} /> Commit Settings</>}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-8 px-4 lg:px-0 text-left">
        
        {/* --- Registry Integration (New CRUD Shortcut) --- */}
        <div className="p-10 border border-emerald-100 bg-emerald-50/30 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 shadow-sm">
           <div className="w-20 h-20 bg-emerald-900 rounded-[2rem] flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-900/10">
              {/* @ts-ignore */}
              <Database size={32} />
           </div>
           <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Data Registry Integration</h3>
              <p className="text-sm text-slate-500 font-medium">
                This block is currently pulling <span className="text-emerald-700 font-bold">{projectCount} projects</span> from the global investment catalog.
              </p>
           </div>
           {/* @ts-ignore */}
           <button 
             onClick={() => navigate("/projects")}
             className="px-8 py-4 bg-white border border-emerald-200 text-emerald-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-900 hover:text-white transition-all shadow-sm flex items-center gap-2 cursor-pointer border-none"
           >
             Manage Global Registry {/* @ts-ignore */} <ArrowRight size={14} />
           </button>
        </div>

        {/* Sidebar Filtering Configuration */}
        {/* @ts-ignore */}
        <div className="p-10 space-y-8 border border-slate-100 bg-white shadow-xl rounded-[3rem]">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            {/* @ts-ignore */}
            <Filter size={18} className="text-emerald-600" />
            <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">Sidebar Configuration</h3>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Filter Heading</label>
            <input 
              type="text" 
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all" 
              value={currentContent.filterTitle} 
              onChange={(e) => updateField("filterTitle", e.target.value)} 
            />
          </div>
        </div>

        {/* Audit Card Messaging */}
        {/* @ts-ignore */}
        <div className="p-10 space-y-8 border border-slate-100 bg-white shadow-xl rounded-[3rem]">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            {/* @ts-ignore */}
            <ShieldCheck size={18} className="text-emerald-600" />
            <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">Audit Card Messaging</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Audit Headline</label>
              <textarea 
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xl text-slate-900 outline-none focus:border-emerald-500 transition-all min-h-[80px]" 
                value={currentContent.auditTitle} 
                onChange={(e) => updateField("auditTitle", e.target.value)} 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Verification Details</label>
              <textarea 
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-600 outline-none focus:border-emerald-500 transition-all min-h-[120px]" 
                value={currentContent.auditDescription} 
                onChange={(e) => updateField("auditDescription", e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}