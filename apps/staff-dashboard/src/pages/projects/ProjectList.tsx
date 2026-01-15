import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Filter, Trash2, Edit3, Loader2, Zap, Leaf } from "lucide-react";
import { Button, Card, Badge } from "@repo/ui";

/**
 * Staff Dashboard - Project Directory (Phase 2)
 * Path: apps/staff-dashboard/src/pages/projects/ProjectList.tsx
 * Purpose: High-level overview of ESG investment opportunities for the Marketing role.
 */

export default function ProjectList() {
  // @ts-ignore
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const gatewayUrl = "http://localhost:3005";

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${gatewayUrl}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [gatewayUrl]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently remove this project from the registry?")) return;
    
    try {
      const res = await fetch(`${gatewayUrl}/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Deletion failed:", err);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && projects.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
        {/* @ts-ignore */}
        <Loader2 size={40} className="animate-spin text-emerald-500" />
        <p className="font-bold tracking-widest uppercase text-[10px]">Accessing Global Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700" data-component="ProjectList">
      <header className="flex justify-between items-end">
        <div className="space-y-2 text-left">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Investment Catalog</h2>
          <p className="text-slate-500 font-medium text-xl">Manage sustainable project listings and real-time ESG scores.</p>
        </div>
        {/* @ts-ignore */}
        <button 
          onClick={() => navigate("/projects/new")} 
          className="px-8 py-4 bg-emerald-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:scale-105 transition-all border-none cursor-pointer flex items-center gap-2"
        >
          {/* @ts-ignore */}
          <Plus size={16} /> Register Project
        </button>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
            {/* @ts-ignore */}
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search by slug, category or impact..." 
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[1.5rem] outline-none focus:border-emerald-500 transition-all font-bold shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div 
            key={project.id} 
            className="group p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 text-left relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${
                project.category === 'Renewable Energy' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
              }`}>
                {/* @ts-ignore */}
                {project.category === 'Renewable Energy' ? <Zap size={28} /> : <Leaf size={28} />}
              </div>
              <div className="flex flex-col items-end gap-2">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                   project.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                 }`}>
                   {project.status}
                 </span>
                 <div className="text-[10px] font-black text-emerald-700 bg-emerald-50/50 px-2 py-0.5 rounded uppercase tracking-tighter">
                   Score: {project.esgScore}/100
                 </div>
              </div>
            </div>

            <div className="space-y-2 mb-8 relative z-10">
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-900 transition-colors">
                {project.contentEn?.title || project.slug}
              </h3>
              <p className="text-slate-400 font-mono text-xs italic">/{project.slug}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8 relative z-10">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Target IRR</p>
                <p className="text-lg font-black text-slate-900">{project.targetIrr}%</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Min Entry</p>
                <p className="text-lg font-black text-slate-900">${parseInt(project.minInvestment || "0").toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-2 relative z-10">
               {/* @ts-ignore */}
               <button 
                 onClick={() => navigate(`/projects/edit/${project.slug}`)}
                 className="flex-1 py-4 bg-emerald-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-800 transition-colors border-none cursor-pointer"
               >
                 {/* @ts-ignore */}
                 <Edit3 size={14} /> Edit Entry
               </button>
               {/* @ts-ignore */}
               <button 
                 onClick={(e) => handleDelete(project.id, e)}
                 className="p-4 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border-none cursor-pointer"
               >
                 {/* @ts-ignore */}
                 <Trash2 size={16} />
               </button>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && !loading && (
          <div className="col-span-full py-32 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 gap-4 bg-slate-50/30">
            {/* @ts-ignore */}
            <Search size={48} className="opacity-20" />
            <p className="font-black uppercase tracking-widest text-xs">No matching projects found in registry</p>
          </div>
        )}
      </div>
    </div>
  );
}