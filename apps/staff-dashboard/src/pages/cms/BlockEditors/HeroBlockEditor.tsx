import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Eye, ExternalLink } from "lucide-react";
import { Button, Card } from "@repo/ui";
import RichTextEditor, { cleanRichText } from "./Shared/RichTextEditor";

/**
 * Staff Dashboard - Hero Block Editor (Layer 3)
 * Path: apps/staff-dashboard/src/pages/cms/BlockEditors/HeroBlockEditor.tsx
 * * Phase 4: Integrated Real-Time Preview Sync (Zero-DB).
 * * Logic: Debounced Redis/Socket emission to the Client Portal "Puppet".
 */

interface HeroContent {
  badge: string;
  title: string;
  description: string;
}

export default function HeroBlockEditor() {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  
  const [contentEn, setContentEn] = useState<HeroContent>({ badge: "", title: "", description: "" });
  const [contentEl, setContentEl] = useState<HeroContent>({ badge: "", title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<"en" | "el">("en");
  
  // Phase 4: Preview Session Management
  const [previewId] = useState(() => crypto.randomUUID());
  const hasFetched = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const gatewayUrl = "http://localhost:3005";
  const portalUrl = "http://localhost:3000";

  /**
   * 1. Hydrate Data from Database (PostgreSQL)
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
      } catch (err) { console.error("Hydration failed", err); } finally { setLoading(false); }
    };
    fetchSectionData();
  }, [sectionId, gatewayUrl]);

  /**
   * 2. Phase 4: Transient Sync Logic (Redis + Sockets)
   * This function pushes the current "dirty" state to the gateway without saving to Postgres.
   */
  const syncPreview = useCallback(async (en: HeroContent, el: HeroContent) => {
    try {
      await fetch(`${gatewayUrl}/api/cms/preview/${previewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contentEn: { ...en, description: cleanRichText(en.description) }, 
          contentEl: { ...el, description: cleanRichText(el.description) },
          type: "HERO" 
        })
      });
    } catch (err) {
      console.warn("⚠️ Preview sync failed - Is the Gateway running?");
    }
  }, [previewId, gatewayUrl]);

  /**
   * 3. Debounced Emitter
   * Every time the content changes, we wait 300ms then sync to the Preview puppet.
   */
  useEffect(() => {
    if (!hasFetched.current) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      syncPreview(contentEn, contentEl);
    }, 300);

    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [contentEn, contentEl, syncPreview]);

  /**
   * 4. Persistence (PostgreSQL)
   */
  const handleSave = async () => {
    setIsSaving(true);
 
    const payload = {
      contentEn: { ...contentEn, description: cleanRichText(contentEn.description) },
      contentEl: { ...contentEl, description: cleanRichText(contentEl.description) }
    };
    try {
      await fetch(`${gatewayUrl}/api/cms/sections/${sectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setTimeout(() => setIsSaving(false), 500);
    } catch (err) { setIsSaving(false); }
  };

  /**
   * 5. Open External Preview Tab
   */
  const handleOpenPreview = () => {
    const url = `${portalUrl}/${activeLang}/preview/block?type=HERO&id=${previewId}`;
    window.open(url, "_blank");
  };

  const currentContent = activeLang === "en" ? contentEn : contentEl;
  const setContent = (newData: HeroContent) => {
    if (activeLang === "en") setContentEn(newData);
    else setContentEl(newData);
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
       <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
       <p className="font-bold tracking-widest uppercase text-[10px]">Establishing Mirror Session...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20" data-component="HeroBlockEditor">
      <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="!rounded-xl text-slate-400">
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Hero Section</h2>
            <div className="flex gap-4 mt-1">
              <button onClick={() => setActiveLang("en")} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeLang === 'en' ? 'text-emerald-600 underline underline-offset-4' : 'text-slate-300'}`}>English</button>
              <button onClick={() => setActiveLang("el")} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeLang === 'el' ? 'text-emerald-600 underline underline-offset-4' : 'text-slate-300'}`}>Greek</button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleOpenPreview} className="!rounded-xl !px-6 flex items-center gap-2 text-xs hover:border-emerald-500 group">
            <Eye size={14} className="group-hover:text-emerald-600" /> Live Preview 
            <ExternalLink size={12} />
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="!rounded-xl !px-6 !bg-[#064e3b] text-white shadow-lg shadow-emerald-900/20 text-xs flex items-center gap-2 active:scale-95 transition-all">
            {isSaving ? "Syncing..." : <><Save size={14} /> Update Section</>}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <Card className="p-10 space-y-8 border-slate-100 bg-white shadow-xl shadow-slate-200/50">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Section Badge</label>
            <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all" value={currentContent.badge} onChange={(e) => setContent({...currentContent, badge: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Main Title</label>
            <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-serif font-bold text-3xl text-slate-900 outline-none focus:border-emerald-500 transition-all min-h-[120px]" value={currentContent.title} onChange={(e) => setContent({...currentContent, title: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description (Rich Text)</label>
            <RichTextEditor value={currentContent.description} onChange={(val: string) => setContent({...currentContent, description: val})} />
          </div>
        </Card>
      </div>
      
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border border-slate-100 shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mirror Session ID: {previewId.slice(0, 8)}</span>
        <div className="w-[1px] h-4 bg-slate-100" />
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Changes stream to portal automatically</span>
      </div>
    </div>
  );
}