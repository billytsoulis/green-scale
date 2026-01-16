"use client";

import { useMemo } from "react";

// --- Production Ready Imports ---
import { motion } from "framer-motion";

/**
 * GreenScale Phase 2: ESG Impact Dial
 * Path: apps/client-portal/src/components/dashboard/ESGDial.tsx
 * Purpose: A custom SVG gauge that visualizes the aggregate ESG score.
 */

interface Props {
  score: number;
  isGreek: boolean;
}

export const ESGDial = ({ score = 0, isGreek }: Props) => {
  // SVG Math for a semi-circle gauge
  const radius = 90;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const arcLength = circumference / 2; // Semi-circle
  
  // Calculate offset based on score (0-100)
  const arcOffset = arcLength - (score / 100) * arcLength;

  const color = useMemo(() => {
    if (score < 40) return "#ef4444"; // Red
    if (score < 75) return "#f59e0b"; // Amber
    return "#10b981"; // Emerald
  }, [score]);

  return (
    <div className="relative flex flex-col items-center justify-center py-10" data-component="ESGDial">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-180"
      >
        {/* Background Track */}
        <circle
          stroke="#f1f5f9"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${arcLength} ${circumference}`}
          style={{ strokeDashoffset: 0 }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Active Progress Path */}
        {/* @ts-ignore */}
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${arcLength} ${circumference}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: arcOffset }}
          transition={{ duration: 2, ease: "easeOut" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </svg>

      {/* Score Text overlay */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-4">
        <span className="text-6xl font-black text-slate-900 tracking-tighter">
          {score}
        </span>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {isGreek ? 'Σκορ ESG' : 'ESG Score'}
          </span>
          <div 
            className="mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase text-white shadow-sm transition-colors"
            style={{ backgroundColor: color }}
          >
            {score < 40 ? (isGreek ? 'ΚΡΙΣΙΜΟ' : 'CRITICAL') : score < 75 ? (isGreek ? 'ΟΥΔΕΤΕΡΟ' : 'NEUTRAL') : (isGreek ? 'ΒΕΛΤΙΣΤΟ' : 'OPTIMAL')}
          </div>
        </div>
      </div>
    </div>
  );
};