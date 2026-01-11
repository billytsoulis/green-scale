import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Eye, Globe } from "lucide-react";
import { Button, Card, Badge } from "@repo/ui";
import RichTextEditor from "./Shared/RichTextEditor";

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
  // @ts-ignore
  // const { pageId, sectionId } = useParams();
  // const navigate = useNavigate();
  
  const [contentEn, setContentEn] = useState<HeroContent>({ badge: "", title: "", description: "" });
  const [contentEl, setContentEl] = useState<HeroContent>({ badge: "", title: "", description: "" });
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<"en" | "el">("en");

  // Mock Fetch Logic
  useEffect(() => {
    // In production, fetch via GATEWAY_URL/api/cms/:pageId/:sectionId
    setContentEn({
      badge: "Our Vision",
      title: "A Legacy of Purpose & Performance.",
      description: "GreenScale was founded on a single premise..."
    });
    setContentEl({
      badge: "Το Όραμά Μας",
      title: "Κληρονομιά με Σκοπό & Απόδοση.",
      description: "Η GreenScale ιδρύθηκε με μια απλή παραδοχή..."
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // @ts-ignore
    // await fetch(...);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const currentContent = activeLang === "en" ? contentEn : contentEl;
  const setContent = activeLang === "en" ? setContentEn : setContentEl;

  return (
    <div className="space-y-8 pb-20" data-component="HeroBlockEditor">
      <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          {/* @ts-ignore */}
          <Button variant="ghost" size="sm" onClick={() => {} /* navigate(-1) */} className="!rounded-xl text-slate-400">
            {/* @ts-ignore */}
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Hero Section</h2>
            <div className="flex gap-4 mt-1">
              <button 
                onClick={() => setActiveLang("en")}
                className={`text-[10px] font-black uppercase tracking-widest ${activeLang === 'en' ? 'text-brand-emerald-600' : 'text-slate-300'}`}
              >
                English
              </button>
              <button 
                onClick={() => setActiveLang("el")}
                className={`text-[10px] font-black uppercase tracking-widest ${activeLang === 'el' ? 'text-brand-emerald-600' : 'text-slate-300'}`}
              >
                Greek
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {/* @ts-ignore */}
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(!showPreview)}
            className={`!rounded-xl flex items-center gap-2 text-xs ${showPreview ? 'bg-slate-100' : ''}`}
          >
            {/* @ts-ignore */}
            <Eye size={14} /> {showPreview ? "Close Preview" : "Preview Block"}
          </Button>
          {/* @ts-ignore */}
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="!rounded-xl !bg-brand-emerald-800 shadow-lg shadow-emerald-900/20 text-xs flex items-center gap-2"
          >
            {/* @ts-ignore */}
            <Save size={14} /> {isSaving ? "Saving..." : "Update Section"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form Column */}
        <div className="space-y-6">
          {/* @ts-ignore */}
          <Card className="p-10 space-y-8 border-slate-100 bg-white">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Section Badge</label>
              <input 
                type="text"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-brand-emerald-500 transition-all"
                value={currentContent.badge}
                onChange={(e) => setContent({...currentContent, badge: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Main Title</label>
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-serif font-bold text-2xl text-slate-900 outline-none focus:border-brand-emerald-500 transition-all min-h-[100px]"
                value={currentContent.title}
                onChange={(e) => setContent({...currentContent, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description (Rich Text)</label>
              {/* @ts-ignore */}
              <RichTextEditor 
                value={currentContent.description}
                onChange={(val) => setContent({...currentContent, description: val})}
              />
            </div>
          </Card>
        </div>

        {/* Sandbox Preview Column */}
        <div className="relative">
          <div className={`sticky top-32 transition-all duration-500 ${showPreview ? 'opacity-100 translate-y-0' : 'opacity-40 grayscale translate-y-4 pointer-events-none'}`}>
            <div className="mb-4 flex items-center justify-between px-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sandbox Preview</span>
              {/* @ts-ignore */}
              <Badge variant="gold">Live Draft</Badge>
            </div>
            
            {/* The Actual UI Component from @repo/ui rendered with local state */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[400px]">
               <section className="py-20 px-10 text-center bg-[#FEFCF3]">
                  {/* @ts-ignore */}
                  <Badge variant="gold" className="mb-4">{currentContent.badge}</Badge>
                  <h1 className="text-4xl font-serif font-black text-slate-900 mb-6 leading-tight">
                    {currentContent.title}
                  </h1>
                  <div 
                    className="text-slate-500 text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentContent.description }}
                  />
               </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}