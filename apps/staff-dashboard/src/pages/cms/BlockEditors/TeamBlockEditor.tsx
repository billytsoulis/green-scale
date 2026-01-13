import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Eye, ExternalLink, Plus, Trash2 } from "lucide-react";
import { Button, Card } from "@repo/ui";
import RichTextEditor, { cleanRichText } from "./Shared/RichTextEditor";

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
  const navigate = useNavigate();  
  const { sectionId } = useParams();
  
  const [contentEn, setContentEn] = useState<TeamContent>({ title: "", members: [] });
  const [contentEl, setContentEl] = useState<TeamContent>({ title: "", members: [] });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<"en" | "el">("en");
  
  const [previewId] = useState(() => crypto.randomUUID());
  const hasFetched = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const gatewayUrl = "http://localhost:3005";
  const portalUrl = "http://localhost:3000";

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
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchSectionData();
  }, [sectionId, gatewayUrl]);

  const syncPreview = useCallback(async (en: TeamContent, el: TeamContent) => {
    try {
      // const clean = (t: string) => t;
      const cleanMembers = (mbs: TeamMember[]) => mbs.map(m => ({ ...m, bio: cleanRichText(m.bio) }));

      await fetch(`${gatewayUrl}/api/cms/preview/${previewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contentEn: { ...en, members: cleanMembers(en.members) }, 
          contentEl: { ...el, members: cleanMembers(el.members) }, 
          type: "TEAM_GRID" 
        })
      });
    } catch (err) { console.warn("Sync error"); }
  }, [previewId, gatewayUrl]);

  useEffect(() => {
    if (!hasFetched.current) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => syncPreview(contentEn, contentEl), 300);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [contentEn, contentEl, syncPreview]);

  const handleSave = async () => {
    setIsSaving(true);

    const cleanMembers = (mbs: TeamMember[]) => mbs.map(m => ({ ...m, bio: cleanRichText(m.bio) }));

    const payload = {
      contentEn: { ...contentEn, members: cleanMembers(contentEn.members) },
      contentEl: { ...contentEl, members: cleanMembers(contentEl.members) }
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
  const setContent = (newData: TeamContent) => {
    if (activeLang === "en") setContentEn(newData);
    else setContentEl(newData);
  };

  const handleAddMember = () => {
    const newMember = { id: crypto.randomUUID(), name: "", role: "", bio: "", imageUrl: "" };
    setContent({ ...currentContent, members: [...currentContent.members, newMember] });
  };

  const updateMember = (id: string, field: keyof TeamMember, val: string) => {
    setContent({
      ...currentContent,
      members: currentContent.members.map(m => m.id === id ? { ...m, [field]: val } : m)
    });
  };

  const handleOpenPreview = () => {
    window.open(`${portalUrl}/${activeLang}/preview/block?type=TEAM_GRID&id=${previewId}`, "_blank");
  };

  if (loading) return <div className="p-20 text-center text-slate-400">Loading Team Data...</div>;

  return (
    <div className="space-y-8 pb-20" data-component="TeamBlockEditor">
      <header className="flex justify-between items-center bg-white p-6 rounded-4xl border border-slate-100 shadow-sm sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase">Edit Team Grid</h2>
            <div className="flex gap-4 mt-1">
              <button onClick={() => setActiveLang("en")} className={`text-[10px] font-black uppercase tracking-widest ${activeLang === 'en' ? 'text-emerald-600 underline' : 'text-slate-300'}`}>English</button>
              <button onClick={() => setActiveLang("el")} className={`text-[10px] font-black uppercase tracking-widest ${activeLang === 'el' ? 'text-emerald-600 underline' : 'text-slate-300'}`}>Greek</button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleOpenPreview} className="text-xs">
            <Eye size={14} /> Live Preview <ExternalLink size={12} />
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="text-xs">
            {isSaving ? "Syncing..." : <><Save size={14} /> Update Grid</>}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center px-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Specialist Composition</h3>
           <Button variant="outline" size="sm" onClick={handleAddMember} className="rounded-xl! border-dashed">
             <Plus size={14} /> Add Member
           </Button>
        </div>

        {currentContent.members.map((member) => (
          <Card key={member.id} className="p-8 space-y-6 relative group">
            <button 
              onClick={() => setContent({...currentContent, members: currentContent.members.filter(m => m.id !== member.id)})}
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Name</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={member.name} onChange={(e) => updateMember(member.id, "name", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Role</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={member.role} onChange={(e) => updateMember(member.id, "role", e.target.value)} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Specialist Bio</label>

              <RichTextEditor value={member.bio} onChange={(val: string) => updateMember(member.id, "bio", val)} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}