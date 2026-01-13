import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Eye, ExternalLink } from "lucide-react";
import { Button, Card } from "@repo/ui";
import RichTextEditor, { cleanRichText } from "./Shared/RichTextEditor";

/**
 * Narrative Block Editor (Layer 3)
 * Path: apps/staff-dashboard/src/pages/cms/BlockEditors/NarrativeBlockEditor.tsx
 * Purpose: Specialized editor for NARRATIVE sections with emphasis on long-form rich text.
 */

interface NarrativeContent {
  title: string;
  paragraph1: string;
  paragraph2: string;
}

export default function NarrativeBlockEditor() {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  
  const [contentEn, setContentEn] = useState<NarrativeContent>({ title: "", paragraph1: "", paragraph2: "" });
  const [contentEl, setContentEl] = useState<NarrativeContent>({ title: "", paragraph1: "", paragraph2: "" });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<"en" | "el">("en");
  
  const [previewId] = useState(() => crypto.randomUUID());
  const hasFetched = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const gatewayUrl = "http://localhost:3005";
  const portalUrl = "http://localhost:3000";

  /**
   * 1. Hydrate Data from Database (PostgreSQL)
   */
  useEffect(() => {
    if (!sectionId || hasFetched.current) return;
    hasFetched.current = true;

    const fetchSectionData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${gatewayUrl}/api/cms/sections/${sectionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.contentEn) setContentEn(data.contentEn);
          if (data.contentEl) setContentEl(data.contentEl);
        }
      } catch (err) { 
        console.error("Fetch error:", err); 
        hasFetched.current = false;
      } finally { 
        setLoading(false); 
      }
    };
    fetchSectionData();
  }, [sectionId, gatewayUrl]);

  /**
   * 2. Phase 4: Transient Sync Logic (Redis + Sockets)
   */
  const syncPreview = useCallback(async (en: NarrativeContent, el: NarrativeContent) => {
    try {
      await fetch(`${gatewayUrl}/api/cms/preview/${previewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contentEn: { ...en, paragraph1: cleanRichText(en.paragraph1), paragraph2: cleanRichText(en.paragraph2) }, 
          contentEl: { ...el, paragraph1: cleanRichText(el.paragraph1), paragraph2: cleanRichText(el.paragraph2) }, 
          type: "NARRATIVE" 
        })
      });
    } catch (err) { console.warn("Sync error"); }
  }, [previewId, gatewayUrl]);

  useEffect(() => {
    if (loading) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => syncPreview(contentEn, contentEl), 300);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [contentEn, contentEl, syncPreview, loading]);

  /**
   * 3. Persistence (PostgreSQL)
   */
  const handleSave = async () => {
    setIsSaving(true);

    const payload = {
      contentEn: { ...contentEn, paragraph1: cleanRichText(contentEn.paragraph1), paragraph2: cleanRichText(contentEn.paragraph2) },
      contentEl: { ...contentEl, paragraph1: cleanRichText(contentEl.paragraph1), paragraph2: cleanRichText(contentEl.paragraph2) }
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

  const currentContent = activeLang === "en" ? contentEn : contentEl;

  const setContent = (newData: NarrativeContent) => {
    const prevData = activeLang === "en" ? contentEn : contentEl;
    
    if (
      newData.title === prevData.title && 
      newData.paragraph1 === prevData.paragraph1 && 
      newData.paragraph2 === prevData.paragraph2
    ) {
      return;
    }

    if (activeLang === "en") setContentEn(newData);
    else setContentEl(newData);
  };

  const handleOpenPreview = () => {
    window.open(`${portalUrl}/${activeLang}/preview/block?type=NARRATIVE&id=${previewId}`, "_blank");
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
       <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
       <p className="font-bold tracking-widest uppercase text-[10px]">Establishing Mirror Session...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20" data-component="NarrativeBlockEditor">
      <header className="flex justify-between items-center bg-white p-6 rounded-4xl border border-slate-100 shadow-sm sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-xl!">
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Narrative</h2>
            <div className="flex gap-4 mt-1">
              <button onClick={() => setActiveLang("en")} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeLang === 'en' ? 'text-emerald-600 underline underline-offset-4' : 'text-slate-300'}`}>English</button>
              <button onClick={() => setActiveLang("el")} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeLang === 'el' ? 'text-emerald-600 underline underline-offset-4' : 'text-slate-300'}`}>Greek</button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleOpenPreview} className="rounded-xl! px-6! flex items-center gap-2 text-xs hover:border-emerald-500 group">
            <Eye size={14} className="group-hover:text-emerald-600" /> Live Preview 
            <ExternalLink size={12} />
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="rounded-xl! px-6! bg-emerald-900! text-white shadow-lg shadow-emerald-900/20 text-xs flex items-center gap-2 active:scale-95 transition-all">
            {isSaving ? "Syncing..." : <><Save size={14} /> Update Section</>}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-10 space-y-8 border-slate-100 bg-white shadow-xl shadow-slate-200/50">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Narrative Heading</label>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all" 
              value={currentContent.title} 
              onChange={(e) => setContent({...currentContent, title: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Paragraph</label>
            <RichTextEditor 
              key={`p1-${activeLang}`}
              value={currentContent.paragraph1} 
              onChange={(val: string) => {
                if (val !== currentContent.paragraph1) {
                  setContent({...currentContent, paragraph1: val});
                }
              }} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Secondary Paragraph</label>
            <RichTextEditor 
              key={`p2-${activeLang}`}
              value={currentContent.paragraph2} 
              onChange={(val: string) => {
                if (val !== currentContent.paragraph2) {
                  setContent({...currentContent, paragraph2: val});
                }
              }} 
            />
          </div>
        </Card>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border border-slate-100 shadow-xl flex items-center gap-4">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mirror Session ID: {previewId.slice(0, 8)}</span>
      </div>
    </div>
  );
}