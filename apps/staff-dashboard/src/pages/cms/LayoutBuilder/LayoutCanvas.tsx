import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
// import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical, Edit3, Trash2, Plus, Eye, ChevronLeft } from "lucide-react";
import { Button, Card, Badge } from "@repo/ui";

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

export default function LayoutCanvas() {
  const { slug } = useParams();
  const pageId = slug || "about-us"; 
  
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLayout = async () => {
      // Mock Data representing Step 2 Logic
      const mockSections: Section[] = [
        { id: "sec-1", type: "HERO", orderIndex: 1, isActive: true },
        { id: "sec-2", type: "NARRATIVE", orderIndex: 2, isActive: true },
        { id: "sec-3", type: "TEAM_GRID", orderIndex: 3, isActive: true },
      ];
      setSections(mockSections);
      setLoading(false);
    };
    fetchLayout();
  }, [pageId]);

  if (loading) return <div className="p-20 text-center text-slate-400">Loading Layout...</div>;

  return (
    <div className="space-y-8" data-component="LayoutCanvas">
      {/* Header with Back Navigation */}
      <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link to="/cms">
            <Button 
              variant="ghost" 
              className="!p-2 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Layout: {pageId}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Layer 2: Orchestration</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 text-xs">
            <Plus size={14} /> Add Block
          </Button>
          <Button className="!bg-[#064e3b] shadow-lg shadow-emerald-900/20 text-xs text-white">
            Save Layout
          </Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto space-y-4 pb-20">
        {sections.map((section) => (
          <Card key={section.id} className="p-6 flex items-center gap-6 group hover:border-emerald-200 transition-all bg-white border-slate-100">
            {/* Drag Handle */}
            <div className="cursor-grab text-slate-300 group-hover:text-emerald-400 transition-colors">
              <GripVertical size={20} />
            </div>
            
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center font-black text-[10px] text-slate-400">
                  {section.orderIndex}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{section.type}</h4>
                  <Badge className="mt-1 opacity-50">Instance: {section.id}</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                {/* Dynamic routing to Layer 3 Switcher */}
                <Link to={`/cms/${pageId}/edit/${section.id}?type=${section.type}`}>
                  <Button 
                    variant="ghost" 
                    className="!p-2 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <Edit3 size={16} />
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  className="!p-2 text-slate-400 hover:text-red-destructive transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {sections.length === 0 && (
          <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-300">
            <Plus size={40} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">No sections added to this layout yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}