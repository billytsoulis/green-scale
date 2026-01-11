import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Eye, Plus, Trash2, UserPlus } from "lucide-react";
import { Button, Card, Badge } from "@repo/ui";
import RichTextEditor from "./Shared/RichTextEditor";

/**
 * Staff Dashboard - Team Block Editor (Layer 3)
 * Path: apps/staff-dashboard/src/pages/cms/BlockEditors/TeamBlockEditor.tsx
 * Purpose: Specialized editor for TEAM_GRID sections handling dynamic arrays.
 */

interface TeamMember {
  id: string; // Internal unique ID for React list reconciliation
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

interface TeamContent {
  title: string;
  members: TeamMember[];
}

export default function TeamBlockEditor() {
  // @ts-ignore
  // const { pageId, sectionId } = useParams();
  
  const [contentEn, setContentEn] = useState<TeamContent>({ title: "", members: [] });
  const [contentEl, setContentEl] = useState<TeamContent>({ title: "", members: [] });
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<"en" | "el">("en");

  // Load initial data (Mocking the fetch from PostgreSQL JSONB column)
  useEffect(() => {
    const initialEn: TeamContent = {
      title: "The Specialists",
      members: [
        { id: "1", name: "Eleni Kosta", role: "Chief Strategist", bio: "Former Lead Analyst...", imageUrl: "" },
        { id: "2", name: "Dr. Nikos Vane", role: "AI Lead", bio: "Specialist in high-integrity...", imageUrl: "" }
      ]
    };
    const initialEl: TeamContent = {
      title: "Οι Ειδικοί Μας",
      members: [
        { id: "1", name: "Ελένη Κώστα", role: "Επικεφαλής Στρατηγικής", bio: "Πρώην Κύρια Αναλύτρια...", imageUrl: "" },
        { id: "2", name: "Δρ. Νίκος Βέιν", role: "Επικεφαλής AI", bio: "Ειδικός στον έλεγχο...", imageUrl: "" }
      ]
    };
    setContentEn(initialEn);
    setContentEl(initialEl);
  }, []);

  const currentContent = activeLang === "en" ? contentEn : contentEl;
  const setContent = activeLang === "en" ? setContentEn : setContentEl;

  const handleAddMember = () => {
    const newId = crypto.randomUUID();
    const newMember: TeamMember = { id: newId, name: "", role: "", bio: "", imageUrl: "" };
    setContent({ ...currentContent, members: [...currentContent.members, newMember] });
  };

  const handleRemoveMember = (id: string) => {
    setContent({ ...currentContent, members: currentContent.members.filter(m => m.id !== id) });
  };

  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    setContent({
      ...currentContent,
      members: currentContent.members.map(m => m.id === id ? { ...m, [field]: value } : m)
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // @ts-ignore
    // await fetch(`${GATEWAY_URL}/api/cms/${pageId}/${sectionId}`, { 
    //   method: 'PATCH', 
    //   body: JSON.stringify({ contentEn, contentEl }) 
    // });
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="space-y-8 pb-32" data-component="TeamBlockEditor">
      <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          {/* @ts-ignore */}
          <Button variant="ghost" size="sm" className="!rounded-xl text-slate-400">
            {/* @ts-ignore */}
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Team Grid</h2>
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
            <Eye size={14} /> {showPreview ? "Close Preview" : "Preview Grid"}
          </Button>
          {/* @ts-ignore */}
          <Button onClick={handleSave} disabled={isSaving} className="!rounded-xl !bg-brand-emerald-800 shadow-lg shadow-emerald-900/20 text-xs flex items-center gap-2">
            {/* @ts-ignore */}
            <Save size={14} /> {isSaving ? "Publishing..." : "Update Grid"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Team Composition</h3>
             {/* @ts-ignore */}
             <Button onClick={handleAddMember} variant="outline" size="sm" className="!rounded-xl !border-dashed flex items-center gap-2">
               {/* @ts-ignore */}
               <Plus size={14} /> Add Staff Member
             </Button>
          </div>

          <div className="space-y-4">
            {currentContent.members.map((member, index) => (
              /* @ts-ignore */
              <Card key={member.id} className="p-8 border-slate-100 bg-white space-y-6 relative group">
                <button 
                  onClick={() => handleRemoveMember(member.id)}
                  className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  {/* @ts-ignore */}
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-brand-emerald-500 transition-all text-sm"
                      value={member.name}
                      onChange={(e) => updateMember(member.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Official Role</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-brand-emerald-500 transition-all text-sm"
                      value={member.role}
                      onChange={(e) => updateMember(member.id, "role", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Member Bio</label>
                  {/* @ts-ignore */}
                  <RichTextEditor 
                    value={member.bio}
                    onChange={(val) => updateMember(member.id, "bio", val)}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sandbox Preview Column */}
        <div className="relative">
          <div className={`sticky top-32 transition-all duration-500 ${showPreview ? 'opacity-100 translate-y-0' : 'opacity-40 grayscale translate-y-4 pointer-events-none'}`}>
            <div className="mb-4 flex items-center justify-between px-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sandbox Preview</span>
              {/* @ts-ignore */}
              <Badge variant="gold">Grid View</Badge>
            </div>
            
            <div className="bg-slate-50 rounded-[3rem] border border-slate-100 shadow-2xl p-12 overflow-hidden min-h-[500px]">
               <h2 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12">
                 {currentContent.title || "The Specialists"}
               </h2>
               
               <div className="grid grid-cols-2 gap-6">
                 {currentContent.members.map((member) => (
                   <div key={member.id} className="bg-white p-6 rounded-3xl border border-slate-100 text-center">
                     <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center italic text-slate-300 font-serif text-xl">
                       {member.name ? member.name[0] : "?"}
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm">{member.name || "Untitled"}</h4>
                     <p className="text-[10px] font-black text-brand-emerald-600 uppercase tracking-widest mt-1 mb-3">{member.role || "No Role"}</p>
                     <div className="text-[11px] text-slate-500 leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: member.bio }} />
                   </div>
                 ))}
                 {currentContent.members.length === 0 && (
                   <div className="col-span-2 py-20 text-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2rem]">
                     No members added to preview.
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}