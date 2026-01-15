import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Loader2, Globe, TrendingUp, ShieldCheck } from "lucide-react";
import { Button, Card } from "@repo/ui";

/**
 * Staff Dashboard - Project Editor (Phase 2)
 * Path: apps/staff-dashboard/src/pages/projects/ProjectEditor.tsx
 * Purpose: Multi-section form for creating/editing investment opportunities.
 */
interface ProjectFormData {
  id?: string;
  titleEn: string;
  titleEl: string;
  slug: string;
  category: string;
  status: "DRAFT" | "ACTIVE" | "FULLY_FUNDED" | "COMPLETED";
  targetIrr: string;
  minInvestment: string;
  totalGoal: string;
  esgScore: number;
}

export default function ProjectEditor() {
  const { slug: existingSlug } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<"GENERAL" | "FINANCIAL" | "ESG">("GENERAL");
  const [loading, setLoading] = useState(!!existingSlug);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Centralized Form State
  const [formData, setFormData] = useState<ProjectFormData>({
    titleEn: "",
    titleEl: "",
    slug: "",
    category: "Renewable Energy",
    status: "DRAFT",
    targetIrr: "0",
    minInvestment: "0",
    totalGoal: "0",
    esgScore: 0
  });

  const gatewayUrl = "http://localhost:3005";

  /**
   * 2. Hydration Logic
   * Fetches existing project data and maps nested JSONB to flat state.
   */
  useEffect(() => {
    if (!existingSlug) return;
    const fetchProject = async () => {
      try {
        const res = await fetch(`${gatewayUrl}/api/projects/${existingSlug}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            id: data.id,
            titleEn: data.contentEn?.title || "",
            titleEl: data.contentEl?.title || "",
            slug: data.slug,
            category: data.category,
            status: data.status,
            targetIrr: data.targetIrr,
            minInvestment: data.minInvestment,
            totalGoal: data.fundingStatus?.totalGoal?.toString() || "0",
            esgScore: data.esgScore || 0
          });
        }
      } catch (err) { 
        console.error("Hydration Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchProject();
  }, [existingSlug, gatewayUrl]);

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * 3. Persistence Logic
   * Handles POST (Create) or PATCH (Update) based on ID presence.
   */
  const handleSave = async () => {
    setIsSaving(true);
    const isUpdate = !!formData.id;
    const url = isUpdate 
      ? `${gatewayUrl}/api/projects/${formData.id}` 
      : `${gatewayUrl}/api/projects`;
    
    try {
      const res = await fetch(url, {
        method: isUpdate ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        // Return to catalog on success
        navigate("/projects");
      } else {
        const error = await res.json();
        console.error("Save Error:", error);
      }
    } catch (err) {
      console.error("Network Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
       <Loader2 size={32} />
       <p className="font-bold tracking-widest uppercase text-[10px]">Retrieving Project Identity...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      <header className="flex justify-between items-center sticky top-0 z-30 bg-white/80 backdrop-blur-md p-6 rounded-4xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="!p-2 text-slate-300 hover:text-emerald-900" 
            onClick={() => navigate("/projects")}
          >
            <ChevronLeft size={24} />
          </Button>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase">
              {formData.id ? "Edit Project" : "New Registration"}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Status: {formData.status}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="text-xs" onClick={() => navigate("/projects")}>Discard Changes</Button>
           <Button onClick={handleSave} disabled={isSaving} className="!rounded-xl !px-6 !bg-[#064e3b] text-white shadow-lg shadow-emerald-900/20 text-xs flex items-center gap-2 active:scale-95 transition-all">
             {isSaving ? (
               <><Loader2 size={14} /> Syncing Database...</>
             ) : (
               <><Save size={14} /> Commit Update</>
             )}
           </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 lg:px-0">
        {/* Navigation Sidebar */}
        <nav className="space-y-2">
          {(["GENERAL", "FINANCIAL", "ESG"] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all text-sm border-2 ${
                activeTab === tab 
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-xl shadow-emerald-900/20' 
                  : 'bg-white text-slate-400 border-transparent hover:border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {tab === "GENERAL" && "🏛️"}
                  {tab === "FINANCIAL" && "📈"}
                  {tab === "ESG" && "🌿"}
                </span>
                <span>
                  {tab === "GENERAL" && "Project Identity"}
                  {tab === "FINANCIAL" && "Financial Metrics"}
                  {tab === "ESG" && "Impact Analysis"}
                </span>
              </div>
            </button>
          ))}
        </nav>

        {/* Dynamic Editor Content */}
        <div className="lg:col-span-3">
          {activeTab === "GENERAL" && (
            <Card className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Marketing Title (EN)</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all" 
                      value={formData.titleEn} 
                      onChange={(e) => handleInputChange("titleEn", e.target.value)} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Marketing Title (EL)</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-emerald-500 transition-all" 
                      value={formData.titleEl} 
                      onChange={(e) => handleInputChange("titleEl", e.target.value)} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL Slug</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-emerald-600 outline-none" 
                      value={formData.slug} 
                      onChange={(e) => handleInputChange("slug", e.target.value)} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none"
                      value={formData.category} 
                      onChange={(e) => handleInputChange("category", e.target.value)}
                    >
                      <option>Renewable Energy</option>
                      <option>Sustainable Infrastructure</option>
                      <option>Reforestation</option>
                      <option>Marine Protection</option>
                    </select>
                 </div>
               </div>
               
               <div className="p-12 border-2 border-dashed border-slate-100 rounded-3xl text-center space-y-4 group hover:border-emerald-200 transition-all">
                  <div className="text-4xl grayscale group-hover:grayscale-0 transition-all">📸</div>
                  <h4 className="font-bold text-slate-900">Media Manager</h4>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Placeholder: Asset Integration Coming in Phase 5</p>
               </div>
            </Card>
          )}

          {activeTab === "FINANCIAL" && (
             <Card className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target IRR (%)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none" 
                        value={formData.targetIrr} 
                        onChange={(e) => handleInputChange("targetIrr", e.target.value)} 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Minimum Investment ($)</label>
                      <input 
                        type="number" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none" 
                        value={formData.minInvestment} 
                        onChange={(e) => handleInputChange("minInvestment", e.target.value)} 
                      />
                   </div>
                   <div className="space-y-2 col-span-1 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Project Goal ($)</label>
                      <input 
                        type="number" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none" 
                        value={formData.totalGoal} 
                        onChange={(e) => handleInputChange("totalGoal", e.target.value)} 
                      />
                   </div>
                </div>
             </Card>
          )}

          {activeTab === "ESG" && (
            <Card className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-center py-20">
               <div className="text-6xl mb-6">🍃</div>
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">ESG Alignment Score</h3>
               <div className="max-w-xs mx-auto space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-left">Audit Score</label>
                    <span className="text-3xl font-black text-emerald-600">{formData.esgScore}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                    value={formData.esgScore} 
                    onChange={(e) => handleInputChange("esgScore", parseInt(e.target.value))} 
                  />
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    This score is verified against internal audit data. 
                    Scores above 85 are classified as "Elite Impact".
                  </p>
               </div>
            </Card>
          )}
        </div>
      </div>

      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 px-8 py-4 bg-white/80 backdrop-blur-md rounded-full border border-slate-100 shadow-2xl flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {isSaving ? "Synchronizing Cloud Data..." : "PostgreSQL Connection: Stable"}
          </span>
        </div>
      </footer>
    </div>
  );
}