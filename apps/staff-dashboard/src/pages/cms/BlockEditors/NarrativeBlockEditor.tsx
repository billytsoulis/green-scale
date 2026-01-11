import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, Save, Eye, FileText } from "lucide-react";
import { Button, Card, Badge } from "@repo/ui";
import RichTextEditor from "./Shared/RichTextEditor";

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
  const [contentEn, setContentEn] = useState<NarrativeContent>({ title: "", paragraph1: "", paragraph2: "" });
  const [contentEl, setContentEl] = useState<NarrativeContent>({ title: "", paragraph1: "", paragraph2: "" });
  const [activeLang, setActiveLang] = useState<"en" | "el">("en");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Mock data for Narrative seed
    setContentEn({
      title: "Our Heritage",
      paragraph1: "GreenScale was founded to bring clarity to the ESG landscape.",
      paragraph2: "We believe that data integrity is the only way to drive real change."
    });
    setContentEl({
      title: "Η Κληρονομιά Μας",
      paragraph1: "Η GreenScale ιδρύθηκε για να φέρει σαφήνεια στο τοπίο του ESG.",
      paragraph2: "Πιστεύουμε ότι η ακεραιότητα των δεδομένων είναι ο μόνος τρόπος για την πραγματική αλλαγή."
    });
  }, []);

  const currentContent = activeLang === "en" ? contentEn : contentEl;
  const setContent = activeLang === "en" ? setContentEn : setContentEl;

  return (
    <div className="space-y-8 pb-32">
      <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          {/* @ts-ignore */}
          <Button variant="ghost" size="sm" className="!rounded-xl text-slate-400">
            {/* @ts-ignore */}
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Narrative</h2>
            <div className="flex gap-4 mt-1">
              <button onClick={() => setActiveLang("en")} className={`text-[10px] font-black uppercase tracking-widest ${activeLang === 'en' ? 'text-brand-emerald-600' : 'text-slate-300'}`}>English</button>
              <button onClick={() => setActiveLang("el")} className={`text-[10px] font-black uppercase tracking-widest ${activeLang === 'el' ? 'text-brand-emerald-600' : 'text-slate-300'}`}>Greek</button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {/* @ts-ignore */}
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="!rounded-xl flex items-center gap-2 text-xs">
            {/* @ts-ignore */}
            <Eye size={14} /> Preview
          </Button>
          {/* @ts-ignore */}
          <Button className="!rounded-xl !bg-brand-emerald-800 shadow-lg text-xs">Update Section</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          {/* @ts-ignore */}
          <Card className="p-10 space-y-8 border-slate-100 bg-white">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Section Heading</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-brand-emerald-500 transition-all"
                value={currentContent.title}
                onChange={(e) => setContent({...currentContent, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Paragraph</label>
              {/* @ts-ignore */}
              <RichTextEditor 
                value={currentContent.paragraph1}
                onChange={(val) => setContent({...currentContent, paragraph1: val})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Secondary Paragraph</label>
              {/* @ts-ignore */}
              <RichTextEditor 
                value={currentContent.paragraph2}
                onChange={(val) => setContent({...currentContent, paragraph2: val})}
              />
            </div>
          </Card>
        </div>

        <div className="relative">
          <div className={`sticky top-32 transition-all duration-500 ${showPreview ? 'opacity-100 translate-y-0' : 'opacity-40 grayscale translate-y-4 pointer-events-none'}`}>
             <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-12 overflow-hidden min-h-[500px] space-y-6">
                <h2 className="text-3xl font-bold text-slate-900">{currentContent.title}</h2>
                <div className="text-lg text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: currentContent.paragraph1 }} />
                <div className="text-lg text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: currentContent.paragraph2 }} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}