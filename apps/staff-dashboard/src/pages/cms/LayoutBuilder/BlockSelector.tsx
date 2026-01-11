import React from "react";

/**
 * Visual Block Selector Modal
 * Path: apps/staff-dashboard/src/pages/cms/LayoutBuilder/BlockSelector.tsx
 * Purpose: Provides a visual library for staff to add new blocks to a layout.
 * UX: Supports clicking on the backdrop to close the modal.
 */

import { X } from "lucide-react";
import { Button, Card } from "@repo/ui";

const HeroIcon = () => <span>🖼️</span>;
const TeamIcon = () => <span>👥</span>;
const NarrativeIcon = () => <span>📝</span>;

interface BlockSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
  isAdding: boolean;
}

export default function BlockSelector({ isOpen, onClose, onSelect, isAdding }: BlockSelectorProps) {
  if (!isOpen) return null;

  const blockTypes = [
    { type: "HERO", name: "Hero Section", desc: "Top-level banner with badge and CTA.", icon: <HeroIcon /> },
    { type: "NARRATIVE", name: "Narrative", desc: "Long-form bilingual rich text content.", icon: <NarrativeIcon /> },
    { type: "TEAM_GRID", name: "Team Grid", desc: "Dynamic list of specialists or staff.", icon: <TeamIcon /> },
  ];

  /**
   * UX Improvement: Close modal when clicking the grey backdrop.
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the background itself was clicked, not the card content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      {/* @ts-ignore */}
      <Card className="w-full max-w-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Add New Block</h3>
            <p className="text-sm text-slate-400 font-medium">Select the component you want to insert into the layout.</p>
          </div>
          {/* @ts-ignore */}
          <Button variant="ghost" onClick={onClose} className="!p-2 hover:bg-slate-100 rounded-full transition-colors">
            {/* @ts-ignore */}
            <X size={20} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blockTypes.map((block) => (
            <button
              key={block.type}
              disabled={isAdding}
              onClick={() => onSelect(block.type)}
              className="flex items-start gap-4 p-5 rounded-[1.5rem] border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all text-left group disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-emerald-100 flex items-center justify-center text-xl transition-colors">
                {block.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900">{block.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{block.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}