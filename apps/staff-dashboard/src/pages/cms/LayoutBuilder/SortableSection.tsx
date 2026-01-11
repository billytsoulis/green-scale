import React from "react";
import { Link } from "react-router-dom";

/**
 * Sortable Section Item
 * Path: apps/staff-dashboard/src/pages/cms/LayoutBuilder/SortableSection.tsx
 * Purpose: A draggable card component representing a single block in the layout.
 * Logic: Integrates with @dnd-kit/sortable for reordering functionality.
 */

// --- Production Ready Imports (Commented for Manual Handling) ---
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit3, Trash2 } from "lucide-react";
import { Card, Badge, Button } from "@repo/ui";

// --- Local UI Mocks for Environment Safety ---
// const Button = ({ children, className = "", variant = "primary", ...props }: any) => {
//   const base = "px-4 py-2 rounded-xl font-bold transition-all duration-200 flex items-center justify-center cursor-pointer";
//   const variants: any = {
//     ghost: "bg-transparent hover:bg-slate-50 text-slate-400",
//   };
//   return <button className={`${base} ${variants[variant] || variants.ghost} ${className}`} {...props}>{children}</button>;
// };

// const Card = ({ children, className = "", ...props }: any) => (
//   <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm ${className}`} {...props}>
//     {children}
//   </div>
// );

// const Badge = ({ children, className = "" }: any) => (
//   <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 text-slate-400 ${className}`}>
//     {children}
//   </span>
// );

// const GripVertical = ({ size }: any) => <span>⋮⋮</span>;
// const Edit3 = ({ size }: any) => <span>✎</span>;
// const Trash2 = ({ size }: any) => <span>🗑</span>;

interface Section {
  id: string;
  type: string;
  orderIndex: number;
}

interface SortableSectionProps {
  section: Section;
  pageId: string;
}

export default function SortableSection({ section, pageId }: SortableSectionProps) {
  /**
   * @ts-ignore - useSortable hook for production reordering
   */
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: section.id 
  });

  const style = {
    /**
     * @ts-ignore - CSS utility for dnd-kit transform
     */
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* @ts-ignore */}
      <Card className={`p-6 flex items-center gap-6 group hover:border-emerald-200 transition-all bg-white border-slate-100 ${isDragging ? 'shadow-2xl ring-2 ring-emerald-500/20' : ''}`}>
        {/* Drag Handle - Wired to dnd-kit listeners */}
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab text-slate-300 group-hover:text-emerald-400 transition-colors p-2 -m-2"
        >
          {/* @ts-ignore */}
          <GripVertical size={20} />
        </div>
        
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center font-black text-[10px] text-slate-400">
              {section.orderIndex}
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{section.type}</h4>
              {/* @ts-ignore */}
              <Badge className="mt-1 opacity-50">Instance: {section.id.slice(0, 8)}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
            {/* Link points to Layer 3 Block Editor Switcher */}
            <Link to={`/cms/${pageId}/edit/${section.id}?type=${section.type}`}>
              {/* @ts-ignore */}
              <Button variant="ghost" className="!p-2 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">
                {/* @ts-ignore */}
                <Edit3 size={16} />
              </Button>
            </Link>
            
            {/* @ts-ignore */}
            <Button variant="ghost" className="!p-2 text-slate-400 hover:text-red-destructive transition-colors cursor-pointer">
              {/* @ts-ignore */}
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}