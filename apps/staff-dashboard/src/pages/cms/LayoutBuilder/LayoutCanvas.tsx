import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
// import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
// import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, ChevronLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@repo/ui";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
import BlockSelector from "./BlockSelector";
import SortableSection from "./SortableSection";

/**
 * Staff Dashboard - Layout Builder (Layer 2)
 * Path: apps/staff-dashboard/src/pages/cms/LayoutBuilder/LayoutCanvas.tsx
 * Purpose: Allows staff to reorder, add, and remove blocks on a marketing page.
 * Logic: Uses @dnd-kit for accessible drag-and-drop reordering.
 */

interface Section {
  id: string;
  type: string;
  orderIndex: number;
  isActive: boolean;
}

// const X = ({ size }: any) => <span>✕</span>;
// const HeroIcon = () => <span>🖼️</span>;
// const TeamIcon = () => <span>👥</span>;
// const NarrativeIcon = () => <span>📝</span>;

export default function LayoutCanvas() {
  // @ts-ignore
  const { slug } = useParams();
  const pageId = slug || "projects";
  
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [dbPageId, setDbPageId] = useState<string | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGatewayUrl = () => {
    try {
      const meta = import.meta as any;
      return meta?.env?.VITE_API_URL || "http://localhost:3005";
    } catch (e) { return "http://localhost:3005"; }
  };
  const gatewayUrl = getGatewayUrl();

  /**
   * 1. Fetch Hydrated Layout
   * Gets the DB internal ID and the current block arrangement.
   */
  const fetchLayout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // We use the root-delegated path /api/cms/layout/:slug
      const response = await fetch(`${gatewayUrl}/api/cms/layout/${pageId}?nocache=true`);
      
      if (!response.ok) {
        throw new Error(`The registry could not find configuration for "/${pageId}". Verify the page exists in the directory.`);
      }
      
      const data = await response.json();
      setSections(data.sections || []);
      setDbPageId(data.page.id);
    } catch (err: any) { 
      console.error("[LayoutCanvas] Sync Error:", err);
      setError(err.message);
    } finally { 
      setLoading(false); 
    }
  }, [pageId, gatewayUrl]);

  useEffect(() => {
    fetchLayout();
  }, [fetchLayout]);

  /**
   * 2. Add Block Logic
   * Creates a new section instance in the database.
   */
  const handleAddBlock = async (type: string) => {
    // If dbPageId is null, it means the layout fetch failed.
    if (!dbPageId) {
      setError("Cannot add block: Layout context not loaded. Please refresh.");
      return;
    }
    
    setIsAdding(true);
    try {
      const nextIndex = sections.length + 1;
      // Fixed Route: POST /api/cms/pages/:id/sections
      const response = await fetch(`${gatewayUrl}/api/cms/pages/${dbPageId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, orderIndex: nextIndex })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Block registration failed.");
      }
      
      const newSection = await response.json();
      setSections(prev => [...prev, newSection]);
      setIsSelectorOpen(false);
    } catch (err: any) { 
      console.error("[LayoutCanvas] Block Creation Error:", err);
      setError(err.message);
    } finally { 
      setIsAdding(false); 
    }
  };

  /**
   * 3. Reordering Logic (Local State Re-indexing)
   */
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        /** @ts-ignore - arrayMove utilized for reordering */
        const newOrder = arrayMove(items, oldIndex, newIndex);
        return newOrder.map((s, idx) => ({ ...s, orderIndex: idx + 1 }));
      });
    }
  };

  /**
   * 4. Persistence Logic (Transaction Sync)
   */
  const handleSaveOrder = async () => {
    if (!dbPageId) return;
    setSaving(true);
    try {
      const response = await fetch(`${gatewayUrl}/api/cms/pages/${dbPageId}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sectionOrders: sections.map(s => ({ id: s.id, orderIndex: s.orderIndex })) 
        })
      });
      
      if (!response.ok) throw new Error("Order synchronization failed.");
    } catch (err: any) {
      setError(err.message);
    } finally { 
      setTimeout(() => setSaving(false), 500); 
    }
  };

  /** @ts-ignore - Sensors setup for production dnd-kit functionality */
  const sensors = useSensors(
    // @ts-ignore
    useSensor(PointerSensor), 
    // @ts-ignore
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
      {/* @ts-ignore */}
      <Loader2 size={32} className="animate-spin text-emerald-500" />
      <p className="font-bold tracking-widest uppercase text-[10px]">Hydrating Layout Context...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700" data-component="LayoutCanvas">
      {/* Header Bar */}
      <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          {/* @ts-ignore */}
          <Link to="/cms">
            {/* @ts-ignore */}
            <button className="!p-3 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
              {/* @ts-ignore */}
              <ChevronLeft size={20} />
            </button>
          </Link>
          <div className="text-left">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Layout Builder</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
              Page Slug: <span className="text-emerald-600 font-black">/{pageId}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* @ts-ignore */}
          <button 
            className="flex items-center gap-2 text-xs px-5 py-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:text-emerald-600 font-bold transition-all cursor-pointer shadow-sm"
            onClick={() => setIsSelectorOpen(true)}
          >
            {/* @ts-ignore */}
            <Plus size={14} /> Add Block
          </button>
          {/* @ts-ignore */}
          <button 
            disabled={saving || !dbPageId}
            onClick={handleSaveOrder}
            className="!bg-[#064e3b] shadow-xl shadow-emerald-900/20 text-xs text-white px-6 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-all border-none font-bold cursor-pointer disabled:opacity-50"
          >
            {/* @ts-ignore */}
            {saving ? <Loader2 size={14} className="animate-spin text-emerald-200" /> : <Save size={14} />}
            {saving ? "Syncing..." : "Commit Arrangement"}
          </button>
        </div>
      </header>

      {/* Real-time Error Alert */}
      {error && (
        <div className="max-w-3xl mx-auto p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-600 animate-in slide-in-from-top-4">
          {/* @ts-ignore */}
          <AlertCircle size={24} className="shrink-0" />
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest">Diagnostic Error</p>
            <p className="font-bold text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-auto text-red-300 hover:text-red-500 bg-transparent border-none cursor-pointer p-2">✕</button>
        </div>
      )}

      {/* Canvas Area */}
      <div className="max-w-3xl mx-auto space-y-4 pb-20">
        {/* @ts-ignore */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {/* @ts-ignore */}
          <SortableContext items={sections} strategy={verticalListSortingStrategy}>
            {sections.map((section) => (
              /** @ts-ignore */
              <SortableSection key={section.id} section={section} pageId={pageId} />
            ))}
          </SortableContext>
        </DndContext>

        {sections.length === 0 && !error && (
          <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-[3.5rem] bg-slate-50/30 text-slate-300">
            {/* @ts-ignore */}
            <Plus size={48} className="mx-auto mb-6 opacity-20" />
            <h4 className="font-black uppercase tracking-widest text-xs">Canvas Empty</h4>
            <p className="font-medium text-sm mt-2">Initialize this route by adding your first modular block component.</p>
          </div>
        )}
      </div>

      {/* Visual Block Selector */}
      {/** @ts-ignore */}
      <BlockSelector 
        isOpen={isSelectorOpen} 
        onClose={() => setIsSelectorOpen(false)}
        onSelect={handleAddBlock}
        isAdding={isAdding}
      />
    </div>
  );
}