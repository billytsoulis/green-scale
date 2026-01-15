"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Eye, ExternalLink, Sparkles } from "lucide-react";
import { Button, Card, Input } from "@repo/ui";
import RichTextEditor, { cleanRichText } from "./Shared/RichTextEditor";

/**
 * Staff Dashboard - Project Hero Editor (Layer 3)
 * Path: apps/staff-dashboard/src/pages/cms/BlockEditors/ProjectHeroEditor.tsx
 * Purpose: Specialized editor for the Projects Directory Hero block.
 * Logic: Synchronizes bilingual content with the live preview and persists to the database.
 */

interface ProjectHeroContent {
  badge: string;
  title: string;
  description: string;
}

export default function ProjectHeroEditor() {
  // @ts-ignore
  const navigate = useNavigate();
  // @ts-ignore
  const { sectionId } = useParams();
  
  const [contentEn, setContentEn] = useState<ProjectHeroContent>({ 
    badge: "", 
    title: "", 
    description: "" 
  });
  const [contentEl, setContentEl] = useState<ProjectHeroContent>({ 
    badge: "", 
    title: "", 
    description: "" 
  });
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<"en" | "el">("en");
  
  const [previewId] = useState(() => crypto.randomUUID());
  const hasFetched = useRef(false);
  const debounceTimer = useRef<any>(null);

  const gatewayUrl = "http://localhost:3005";
  const portalUrl = "http://localhost:3000";

  /**
   * 1. Hydrate Data from Database
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
      } catch (err) { 
        console.error("[ProjectHeroEditor] Hydration failed:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchSectionData();
  }, [sectionId, gatewayUrl]);

  /**
   * 2. Preview Sync Logic (Integrated cleanRichText)
   * Cleaning occurs here during emission to avoid editor cursor jumps.
   */
  const syncPreview = useCallback(async (en: ProjectHeroContent, el: ProjectHeroContent) => {
    try {
      await fetch(`${gatewayUrl}/api/cms/preview/${previewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contentEn: { ...en, description: cleanRichText(en.description) }, 
          contentEl: { ...el, description: cleanRichText(el.description) },
          type: "PROJECT_HERO" 
        })
      });
    } catch (err) { console.warn("Sync interrupted."); }
  }, [previewId, gatewayUrl]);

  /**
   * 3. Debounced Emitter
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
   * 4. Save Persistence (Integrated cleanRichText)
   * Cleaning occurs here before committing to PostgreSQL.
   */
  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      contentEn: { ...contentEn, description: cleanRichText(contentEn.description) },
      contentEl: { ...contentEl, description: cleanRichText(contentEl.description) }
    };
    try {
      const res = await fetch(`${gatewayUrl}/api/cms/sections/${sectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) setTimeout(() => setIsSaving(false), 600);
    } catch (err) { setIsSaving(false); }
  };

  const handleOpenPreview = () => {
    const url = `${portalUrl}/${activeLang}/preview/block?type=PROJECT_HERO&id=${previewId}`;
    window.open(url, "_blank");
  };

  const currentContent = activeLang === "en" ? contentEn : contentEl;
  
  const updateField = (field: keyof ProjectHeroContent, value: string) => {
    if (activeLang === "en") {
      setContentEn(prev => ({ ...prev, [field]: value }));
    } else {
      setContentEl(prev => ({ ...prev, [field]: value }));
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-bold tracking-widest uppercase text-[10px]">Loading Block Content...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      <header className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-5">
          {/* @ts-ignore */}
          <button onClick={() => navigate(-1)} className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 border border-slate-100 bg-white cursor-pointer hover:text-emerald-600 transition-colors">
            {/* @ts-ignore */}
            <ChevronLeft size={20} />
          </button>
          <div className="text-left">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Project Hero</h2>
            <div className="flex gap-4 mt-2">
              <button onClick={() => setActiveLang("en")} className={`text-[10px] font-black uppercase tracking-widest border-none bg-transparent cursor-pointer transition-colors ${activeLang === 'en' ? 'text-emerald-600 underline underline-offset-4' : 'text-slate-300'}`}>English</button>
              <button onClick={() => setActiveLang("el")} className={`text-[10px] font-black uppercase tracking-widest border-none bg-transparent cursor-pointer transition-colors ${activeLang === 'el' ? 'text-emerald-600 underline underline-offset-4' : 'text-slate-300'}`}>Greek</button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {/* @ts-ignore */}
          <Button variant="outline" onClick={handleOpenPreview} className="!rounded-xl !px-6 flex items-center gap-2 text-xs hover:border-emerald-500 group border-slate-200 bg-white shadow-sm">
            {/* @ts-ignore */}
            <Eye size={14} className="group-hover:text-emerald-600" /> Live Preview 
            {/* @ts-ignore */}
            <ExternalLink size={12} className="opacity-30" />
          </Button>
          {/* @ts-ignore */}
          <Button onClick={handleSave} disabled={isSaving} className="!rounded-xl !px-6 !bg-[#064e3b] text-white shadow-lg shadow-emerald-900/20 text-xs flex items-center gap-2 active:scale-95 transition-all">
            {/* @ts-ignore */}
            {isSaving ? "Syncing..." : <><Save size={14} /> Update Section</>}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-12 space-y-10 border border-slate-100 bg-white shadow-2xl rounded-[3rem]">
        <div className="space-y-3 text-left">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Section Badge</label>
          <input 
            type="text" 
            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all" 
            value={currentContent.badge} 
            onChange={(e) => updateField("badge", e.target.value)} 
            placeholder="e.g. The Investor Registry"
          />
        </div>

        <div className="space-y-3 text-left">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Main Headline</label>
          <textarea 
            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] font-serif font-black text-4xl text-slate-900 outline-none focus:border-emerald-500 transition-all min-h-[160px]" 
            value={currentContent.title} 
            onChange={(e) => updateField("title", e.target.value)} 
            placeholder="Capital for a Greener Legacy."
          />
        </div>

        <div className="space-y-3 text-left">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Supporting Description</label>
          {/* CRITICAL FIX: key={activeLang} forces the component to remount when language changes.
            This ensures that the RichTextEditor (Quill) internal state is cleared and 
            replaced with the correct localized content.
          */}
          {/* @ts-ignore */}
          <RichTextEditor 
            key={activeLang}
            value={currentContent.description} 
            onChange={(val: string) => updateField("description", val)} 
            placeholder="A high-performance catalog of verified opportunities..."
          />
        </div>
      </div>
    </div>
  );
}