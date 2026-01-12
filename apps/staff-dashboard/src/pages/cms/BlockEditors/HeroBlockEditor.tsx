import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Eye } from "lucide-react";
import { Button, Card, Badge } from "@repo/ui";
// import RichTextEditor from "./Shared/RichTextEditor";
import RichTextEditor, { cleanRichText } from "./Shared/RichTextEditor";

/**
 * Staff Dashboard - Hero Block Editor (Layer 3)
 * Path: apps/staff-dashboard/src/pages/cms/BlockEditors/HeroBlockEditor.tsx
 * Purpose: Specialized editor for HERO type sections with Sandbox Preview.
 */

interface HeroContent {
  badge: string;
  title: string;
  description: string;
}

export default function HeroBlockEditor() {
  /** @ts-ignore */
  const navigate = useNavigate();
  /** @ts-ignore */
  const { sectionId } = useParams();
  
  const [contentEn, setContentEn] = useState<HeroContent>({ badge: "", title: "", description: "" });
  const [contentEl, setContentEl] = useState<HeroContent>({ badge: "", title: "", description: "" });

  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<"en" | "el">("en");
  
  const hasFetched = useRef(false);

  const getGatewayUrl = () => {
    try {
      const meta = import.meta as any;
      return meta?.env?.VITE_API_URL || "http://localhost:3005";
    } catch (e) { return "http://localhost:3005"; }
  };
  const gatewayUrl = getGatewayUrl();

  useEffect(() => {
    if (!sectionId || hasFetched.current) return;

    const fetchSectionData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${gatewayUrl}/api/cms/sections/${sectionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.contentEn && Object.keys(data.contentEn).length > 0) setContentEn(data.contentEn);
          if (data.contentEl && Object.keys(data.contentEl).length > 0) setContentEl(data.contentEl);
          hasFetched.current = true;
        }
      } catch (err) {
        console.error("Hydration failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [sectionId, gatewayUrl]);

  const handleSave = async () => {
    setIsSaving(true);
    
    /** @ts-ignore - Import cleanup utility from Shared folder */
    const cleanFn = typeof cleanRichText !== 'undefined' ? cleanRichText : cleanRichTextMock;

    const sanitizedEn = {
      ...contentEn,
      description: cleanFn(contentEn.description)
    };
    const sanitizedEl = {
      ...contentEl,
      description: cleanFn(contentEl.description)
    };

    try {
      const response = await fetch(`${gatewayUrl}/api/cms/sections/${sectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentEn: sanitizedEn, contentEl: sanitizedEl })
      });

      if (response.ok) {
        setContentEn(sanitizedEn);
        setContentEl(sanitizedEl);
      }
      setTimeout(() => setIsSaving(false), 500);
    } catch (err) {
      setIsSaving(false);
    }
  };

  const currentContent = activeLang === "en" ? contentEn : contentEl;
  const setContent = (newData: HeroContent) => {
    if (activeLang === "en") setContentEn(newData);
    else setContentEl(newData);
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
       <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
       <p className="font-bold tracking-widest uppercase text-[10px]">Hydrating Layout...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20" data-component="HeroBlockEditor">
      <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          {/* @ts-ignore */}
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="!rounded-xl text-slate-400 hover:text-emerald-500">
            {/* @ts-ignore */}
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Hero Section</h2>
            <div className="flex gap-4 mt-1">
              <button 
                onClick={() => setActiveLang("en")} 
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeLang === 'en' ? 'text-emerald-600 underline underline-offset-4' : 'text-slate-300'}`}
              >
                English
              </button>
              <button 
                onClick={() => setActiveLang("el")} 
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeLang === 'el' ? 'text-emerald-600 underline underline-offset-4' : 'text-slate-300'}`}
              >
                Greek
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {/* @ts-ignore */}
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className={`!rounded-xl !px-6 flex items-center gap-2 text-xs transition-all ${showPreview ? 'bg-slate-100 border-slate-300' : ''}`}>
            {/* @ts-ignore */}
            <Eye size={14} /> {showPreview ? "Close Preview" : "Preview Block"}
          </Button>
          {/* @ts-ignore */}
          <Button onClick={handleSave} disabled={isSaving} className="!rounded-xl !px-6 !bg-[#064e3b] text-white shadow-lg shadow-emerald-900/20 text-xs flex items-center gap-2 active:scale-95 transition-all">
            {/* @ts-ignore */}
            {isSaving ? "Syncing..." : <><Save size={14} /> Update Section</>}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          {/* @ts-ignore */}
          <Card className="p-10 space-y-8 border-slate-100 bg-white">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Section Badge</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all" 
                value={currentContent.badge} 
                onChange={(e) => setContent({...currentContent, badge: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Main Title</label>
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-serif font-bold text-2xl text-slate-900 outline-none focus:border-emerald-500 transition-all min-h-[100px]" 
                value={currentContent.title} 
                onChange={(e) => setContent({...currentContent, title: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description (Rich Text)</label>
              {/* @ts-ignore */}
              <RichTextEditor 
                value={currentContent.description} 
                onChange={(val: string) => setContent({...currentContent, description: val})} 
              />
            </div>
          </Card>
        </div>

        {/* Sandbox Preview Column */}
        <div className="relative">
          <div className={`sticky top-32 transition-all duration-500 ${showPreview ? 'opacity-100 translate-y-0 scale-100' : 'opacity-40 grayscale translate-y-4 scale-[0.98] pointer-events-none'}`}>
            <div className="mb-4 flex items-center justify-between px-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sandbox Preview</span>
              {/* @ts-ignore */}
              <Badge className="bg-amber-50 text-amber-600 border border-amber-100">Live Draft</Badge>
            </div>
            
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-auto max-h-[75vh]">
               {/* IDENTICAL PORTAL RENDERING:
                 Replicating apps/client-portal/src/app/[lang]/(marketing)/about/page.tsx
               */}
               <section className="py-32 px-12 text-center bg-[#FEFCF3] min-h-[500px] flex flex-col items-center justify-center space-y-8 border-b border-slate-100">
                  {/* @ts-ignore - The Badge logic matches exactly */}
                  <Badge>{currentContent.badge || "Hero Badge"}</Badge>
                  
                  <h1 className="text-6xl md:text-8xl font-serif font-black text-slate-900 tracking-tighter leading-[0.9] max-w-4xl mx-auto">
                    {currentContent.title || "Section Main Title"}
                  </h1>
                  
                  <div 
                    className="max-w-3xl mx-auto text-xl text-slate-500 font-medium leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentContent.description || "Enter description content to preview layout." }}
                  />
               </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}