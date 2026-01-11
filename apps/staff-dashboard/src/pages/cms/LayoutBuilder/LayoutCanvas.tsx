import React, { useState, useEffect } from "react";
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
  const { slug } = useParams();
  const pageId = slug || "about-us";
  
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [dbPageId, setDbPageId] = useState<string | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const getGatewayUrl = () => {
    try {
      const meta = import.meta as any;
      return meta?.env?.VITE_API_URL || "http://localhost:3005";
    } catch (e) { return "http://localhost:3005"; }
  };
  const gatewayUrl = getGatewayUrl();

  // 1. Fetch Hydrated Layout
  useEffect(() => {
    const fetchLayout = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${gatewayUrl}/api/cms/layout/${pageId}?nocache=true`);
        if (!response.ok) throw new Error("Layout not found");
        const data = await response.json();
        setSections(data.sections);
        setDbPageId(data.page.id);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchLayout();
  }, [pageId, gatewayUrl]);

  // 2. Add Block Logic (Resolved POST 404)
  const handleAddBlock = async (type: string) => {
    if (!dbPageId) return;
    setIsAdding(true);
    try {
      const nextIndex = sections.length + 1;
      const response = await fetch(`${gatewayUrl}/api/cms/pages/${dbPageId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, orderIndex: nextIndex })
      });
      
      if (!response.ok) throw new Error("Creation failed");
      const newSection = await response.json();
      setSections([...sections, newSection]);
      setIsSelectorOpen(false);
    } catch (err) { console.error(err); } finally { setIsAdding(false); }
  };

  // 3. Reordering Logic
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        /* @ts-ignore - arrayMove utilized for reordering */
        const newOrder = arrayMove(items, oldIndex, newIndex);
        return newOrder.map((s, idx) => ({ ...s, orderIndex: idx + 1 }));
      });
    }
  };

  // 4. Persistence Logic
  const handleSaveOrder = async () => {
    if (!dbPageId) return;
    setSaving(true);
    try {
      await fetch(`${gatewayUrl}/api/cms/pages/${dbPageId}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionOrders: sections.map(s => ({ id: s.id, orderIndex: s.orderIndex })) })
      });
    } finally { setTimeout(() => setSaving(false), 500); }
  };

  /** @ts-ignore - Sensors setup for production dnd-kit functionality */
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
      {/* @ts-ignore */}
      <Loader2 size={32} className="animate-spin" />
      <p className="font-bold tracking-widest uppercase text-[10px]">Hydrating Layout...</p>
    </div>
  );

  return (
    <div className="space-y-8" data-component="LayoutCanvas">
      <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link to="/cms">
            {/* @ts-ignore */}
            <Button variant="ghost" className="!p-2 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">
              {/* @ts-ignore */}
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Layout: {pageId}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Layer 2: Orchestration</p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* @ts-ignore */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-xs !px-3 hover:border-emerald-500 hover:text-emerald-600"
            onClick={() => setIsSelectorOpen(true)}
          >
            {/* @ts-ignore */}
            <Plus size={14} /> Add Block
          </Button>
          {/* @ts-ignore */}
          <Button 
            disabled={saving}
            onClick={handleSaveOrder}
            className="!bg-[#064e3b] shadow-lg shadow-emerald-900/20 text-xs text-white !px-3 flex items-center gap-2 active:scale-95 transition-all"
          >
            {/* @ts-ignore */}
            {saving ? <Loader2 size={14} className="animate-spin text-emerald-200" /> : <Save size={14} />}
            {saving ? "Syncing..." : "Save Layout"}
          </Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto space-y-4 pb-20">
        {/* @ts-ignore */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {/* @ts-ignore */}
          <SortableContext items={sections} strategy={verticalListSortingStrategy}>
            {sections.map((section) => (
              /* @ts-ignore */
              <SortableSection key={section.id} section={section} pageId={pageId} />
            ))}
          </SortableContext>
        </DndContext>

        {sections.length === 0 && (
          <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-300">
            {/* @ts-ignore */}
            <Plus size={40} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">No sections added to this layout yet.</p>
          </div>
        )}
      </div>

      {/* Layer 2 Selector Logic */}
      {/* @ts-ignore */}
      <BlockSelector 
        isOpen={isSelectorOpen} 
        onClose={() => setIsSelectorOpen(false)}
        onSelect={handleAddBlock}
        isAdding={isAdding}
      />
    </div>
  );
}