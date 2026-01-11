import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

/**
 * Staff Dashboard - CMS Side-by-Side Editor (Live Edition)
 * Path: apps/staff-dashboard/src/pages/cms/CMSEditor.tsx
 * * FIX: Resolved 'import.meta' expression and type errors.
 * * Implementation: Real-time data binding to the API Gateway REST endpoints.
 */

// --- PREVIEW SAFETY IMPORTS ---
import { Button, Badge } from "@repo/ui";

interface ContentBlock {
  sectionId: string;
  contentEn: string;
  contentEl: string;
}

export default function CMSEditor() {
  const { pageId } = useParams();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"en" | "el" | "split">("split");

  /**
   * FIX: Environment Variable Access
   * Using a safe casting pattern to bypass parser issues with the 'import' keyword
   * in restricted TypeScript/Vite environments.
   */
  const getGatewayUrl = () => {
    try {
      // Cast to any to access Vite's meta object without triggering 'typeof' reserved word errors
      const meta = import.meta as any;
      if (meta?.env?.VITE_API_URL) {
        return meta.env.VITE_API_URL;
      }
    } catch (e) {
      // Fallback to default port
    }
    return "http://localhost:3005";
  };

  const GATEWAY_URL = getGatewayUrl();

  // 1. Fetch live data from the Gateway
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${GATEWAY_URL}/api/cms/${pageId}?admin=true`);
        if (!response.ok) throw new Error("Failed to fetch page blocks.");
        
        const data = await response.json();
        setBlocks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (pageId) fetchBlocks();
  }, [pageId, GATEWAY_URL]);

  // 2. Handle Individual Block State Change
  const handleContentChange = (sectionId: string, lang: 'en' | 'el', value: string) => {
    setBlocks(prev => prev.map(b => 
      b.sectionId === sectionId 
        ? { ...b, [lang === 'en' ? 'contentEn' : 'contentEl']: value } 
        : b
    ));
  };

  // 3. Save a Specific Block (The "Update" button per section)
  const handleSaveBlock = async (block: ContentBlock) => {
    setSavingId(block.sectionId);
    setError(null);

    try {
      const response = await fetch(`${GATEWAY_URL}/api/cms/${pageId}/${block.sectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentEn: block.contentEn,
          contentEl: block.contentEl
        })
      });

      if (!response.ok) throw new Error(`Failed to save ${block.sectionId}`);
      
      console.log(`✅ [CMS-EDITOR] Section ${block.sectionId} updated.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  // 4. Global Publish (Bulk Save)
  const handlePublishAll = async () => {
    setSavingGlobal(true);
    setError(null);

    try {
      const promises = blocks.map(block => 
        fetch(`${GATEWAY_URL}/api/cms/${pageId}/${block.sectionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentEn: block.contentEn,
            contentEl: block.contentEl
          })
        })
      );

      await Promise.all(promises);
      console.log("✅ [CMS-EDITOR] All content synchronized.");
    } catch (err) {
      setError("Failed to publish some changes. Check gateway logs.");
    } finally {
      setSavingGlobal(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-6">
          <Link 
            to="/cms"
            className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Editor: {pageId}</h2>
              {/* @ts-ignore */}
              <Badge variant="gold" size="sm">Bilingual Mode</Badge>
            </div>
            <div className="flex gap-6 mt-1">
               {["en", "el", "split"].map((mode) => (
                 <button 
                  key={mode}
                  onClick={() => setViewMode(mode as any)} 
                  className={`text-[10px] font-black uppercase tracking-widest transition-colors ${viewMode === mode ? "text-brand-emerald-600 underline underline-offset-4" : "text-slate-300 hover:text-slate-500"}`}
                 >
                   {mode === 'split' ? 'Side-by-Side' : mode}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* @ts-ignore */}
        <Button 
          onClick={handlePublishAll}
          disabled={savingGlobal}
          className="!px-10 !bg-brand-emerald-800 shadow-xl shadow-emerald-900/20 active:scale-95 disabled:opacity-50"
        >
          {savingGlobal ? "Publishing All..." : "Publish Changes"}
        </Button>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-bold text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-6 pb-20">
        {blocks.map((block) => (
          <div key={block.sectionId} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 group relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                BLOCK_ID: <span className="text-slate-900">{block.sectionId}</span>
              </span>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleSaveBlock(block)}
                  disabled={savingId === block.sectionId}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-brand-emerald-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all disabled:opacity-50"
                >
                  {savingId === block.sectionId ? "Saving..." : "Update Section"}
                </button>
                <div className={`w-2 h-2 rounded-full ${savingId === block.sectionId ? 'bg-amber-400 animate-pulse' : 'bg-slate-100 group-focus-within:bg-brand-emerald-500'} transition-colors`} />
              </div>
            </div>

            <div className={`grid gap-10 ${viewMode === "split" ? "grid-cols-2" : "grid-cols-1"}`}>
              {(viewMode === "en" || viewMode === "split") && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">English Source</label>
                  <textarea 
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 outline-none focus:ring-4 focus:ring-brand-emerald-500/10 focus:border-brand-emerald-500 transition-all min-h-[120px] leading-relaxed"
                    value={block.contentEn}
                    onChange={(e) => handleContentChange(block.sectionId, 'en', e.target.value)}
                  />
                </div>
              )}
              {(viewMode === "el" || viewMode === "split") && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-brand-emerald-600 tracking-widest ml-1">Greek Translation</label>
                  <textarea 
                    className="w-full p-6 bg-brand-emerald-50/20 border border-brand-emerald-100 rounded-2xl font-medium text-slate-900 outline-none focus:ring-4 focus:ring-brand-emerald-500/10 focus:border-brand-emerald-500 transition-all min-h-[120px] leading-relaxed"
                    value={block.contentEl}
                    onChange={(e) => handleContentChange(block.sectionId, 'el', e.target.value)}
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