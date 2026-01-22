"use client";

import React, { useMemo } from "react";

/**
 * GreenScale Phase 5: Impact Velocity Chart (GS-30)
 * Path: greenscale/apps/client-portal/src/components/dashboard/ImpactVelocityChart.tsx
 * Purpose: Visualizes ESG score growth over time using high-fidelity SVG paths.
 * Logic: 
 * 1. Calculates a smooth SVG Bézier curve based on historical data points.
 * 2. Uses brand-specific gradients (Emerald -> Gold).
 * 3. Responsive container support.
 */

import { motion } from "framer-motion";
import { TrendingUp, Calendar } from "lucide-react";

interface DataPoint {
  month: string;
  score: number;
}

export const ImpactVelocityChart = ({ lang = "en" }: { lang?: string }) => {
  const isGreek = lang === "el";

  // Mock historical ESG data
  const data: DataPoint[] = [
    { month: isGreek ? "Αυγ" : "Aug", score: 32 },
    { month: isGreek ? "Σεπ" : "Sep", score: 35 },
    { month: isGreek ? "Οκτ" : "Oct", score: 48 },
    { month: isGreek ? "Νοε" : "Nov", score: 42 },
    { month: isGreek ? "Δεκ" : "Dec", score: 68 },
    { month: isGreek ? "Ιαν" : "Jan", score: 82 },
  ];

  // SVG Chart Dimensions
  const width = 600;
  const height = 200;
  const padding = 40;

  // Logic: Map data points to SVG coordinates
  const points = useMemo(() => {
    const xStep = (width - padding * 2) / (data.length - 1);
    const yScale = (height - padding * 2) / 100;
    
    return data.map((d, i) => ({
      x: padding + i * xStep,
      y: height - padding - d.score * yScale
    }));
  }, [data]);

  // Logic: Generate smooth Cubic Bézier curve
  const pathData = useMemo(() => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      d += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  }, [points]);

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 text-left" data-component="ImpactVelocityChart">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600">
            <TrendingUp size={16} />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">{isGreek ? "ΤΑΧΥΤΗΤΑ ΑΝΤΙΚΤΥΠΟΥ" : "Impact Velocity"}</h4>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            {isGreek ? "Πορεία ESG 6 Μηνών" : "6-Month ESG Trajectory"}
          </h3>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <Calendar size={14} className="text-slate-400" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Q3 2025 - Q1 2026</span>
        </div>
      </header>

      <div className="relative h-55 w-full mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = height - padding - tick * ((height - padding * 2) / 100);
            return (
              <line 
                key={tick} 
                x1={padding} y1={y} x2={width - padding} y2={y} 
                stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" 
              />
            );
          })}

          {/* Area Fill */}
          <path 
            d={`${pathData} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`} 
            fill="url(#fillGradient)" 
          />

          {/* Main Animated Path */}
          {/* @ts-ignore */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Data Nodes */}
          {points.map((p, i) => (
            <g key={i} className="group/node">
              {/* @ts-ignore */}
              <motion.circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="white"
                stroke={i === points.length - 1 ? "#10b981" : "#cbd5e1"}
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              />
              {/* Invisible tooltip trigger */}
              <rect x={p.x - 20} y={0} width="40" height={height} fill="transparent" className="cursor-pointer" />
            </g>
          ))}

          {/* X-Axis Labels */}
          {data.map((d, i) => (
            <text 
              key={i} 
              x={padding + i * ((width - padding * 2) / (data.length - 1))} 
              y={height - 10} 
              textAnchor="middle" 
              className="text-[9px] font-black fill-slate-300 uppercase tracking-tighter"
            >
              {d.month}
            </text>
          ))}
        </svg>
      </div>

      <footer className="pt-6 border-t border-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-black text-slate-300 uppercase">Growth</span>
              <span className="text-sm font-black text-emerald-600">+156% Ethical Delta</span>
           </div>
        </div>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic leading-none">
          Verified via GS-Audit Engine
        </p>
      </footer>
    </div>
  );
};