import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Filter, MoreVertical, LayoutGrid, List as ListIcon, Loader2, ArrowUpRight } from "lucide-react";
import { Button, Card, Badge } from "@repo/ui";

/**
 * Staff Dashboard - Project Directory (Phase 2)
 * Path: apps/staff-dashboard/src/pages/projects/ProjectList.tsx
 * Purpose: High-level overview of ESG investment opportunities for the Marketing role.
 */

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const gatewayUrl = "http://localhost:3005";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
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
    fetchProjects();
  }, [gatewayUrl]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">Investment Catalog</h2>
          <p className="text-slate-500 font-medium text-xl">Manage sustainable project listings and ESG scores.</p>
        </div>
        <Button onClick={() => navigate("/projects/new")} className="px-8! py-6! shadow-xl shadow-emerald-900/20">
          <Plus size={20} className="mr-2" /> Register Project
        </Button>
      </header>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search by slug, category or impact..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium"
          />
        </div>
        <Button variant="outline" className="rounded-2xl! px-6! text-sm">Filters</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Wrapper for Card */}
        <div 
          className="group cursor-pointer transition-transform active:scale-95" 
          onClick={() => navigate("/projects/edit/solar-park-alpha")}
        >
          <Card className="group-hover:border-emerald-200 transition-all">
            <div className="p-8 w-full">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 text-2xl">
                  ☀️
                </div>
                {/* Changed color="amber" to variant="warning" to match @repo/ui BadgeProps */}
                <Badge variant="warning">Draft</Badge>
              </div>
              
              <div className="text-left">
                <h3 className="text-2xl font-black text-slate-900 leading-tight">Solar Park Alpha</h3>
                <p className="text-slate-400 font-mono text-xs mt-1">/solar-park-alpha</p>
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Target IRR</p>
                  <p className="text-lg font-bold text-slate-700">12.5%</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ESG Score</p>
                  <p className="text-lg font-bold text-emerald-600">92/100</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
          </div>
        ) : (
          projects.length === 0 && Array(2).fill(0).map((_, i) => (
            <div key={i} className="border-2 border-dashed border-slate-100 rounded-[2.5rem] h-80 flex items-center justify-center text-slate-200 font-bold uppercase tracking-widest text-[10px]">
              Reserved Slot
            </div>
          ))
        )}
      </div>
    </div>
  );
}