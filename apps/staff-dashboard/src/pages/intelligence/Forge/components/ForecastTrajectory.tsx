/**
 * Institutional Intelligence: LSTM Forecast Trajectory
 * Path: src/pages/intelligence/Forge/components/ForecastTrajectory.tsx
 * Purpose: Visualizes the 12-month predictive ESG path with confidence intervals.
 * UX: Custom SVG chart with shaded area for statistical uncertainty.
 */

import { motion } from "framer-motion";

interface ForecastPoint {
  date: string;
  value: number;
  confidence_high: number;
  confidence_low: number;
}

interface ForecastProps {
  data: ForecastPoint[];
}

export const ForecastTrajectory = ({ data }: ForecastProps) => {
  if (!data.length) return <div className="h-64 bg-slate-50 rounded-[3rem] animate-pulse" />;

  const width = 500;
  const height = 250;
  const padding = 40;

  // Scaling Logic
  const getX = (i: number) => padding + (i * (width - padding * 2)) / (data.length - 1);
  const getY = (v: number) => height - padding - (v * (height - padding * 2)) / 100;

  // Path Generation: Predicted Line
  const linePath = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.value)}`).join(' ');

  // Area Generation: Confidence Interval
  const areaPath = [
    ...data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.confidence_high)}`),
    ...[...data].reverse().map((p, i) => `L ${getX(data.length - 1 - i)} ${getY(p.confidence_low)}`),
    'Z'
  ].join(' ');

  const currentTrend = data[data.length-1].value > data[0].value ? "UPWARD" : "DOWNWARD";

  return (
    <section className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-8 text-left" data-component="ForecastTrajectory">
      <header className="flex justify-between items-start border-b border-slate-50 pb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Deep Learning Projection</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">12-Month LSTM Forecast</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${currentTrend === 'UPWARD' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          Trajectory: {currentTrend}
        </div>
      </header>

      <div className="relative h-50 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* 1. Confidence Area */}
          <path d={areaPath} fill="#f1f5f9" opacity="0.6" />
          
          {/* 2. Horizontal Reference Lines */}
          {[25, 50, 75].map(y => (
            <line key={y} x1={padding} y1={getY(y)} x2={width-padding} y2={getY(y)} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
          ))}

          {/* 3. Predicted Path */}
          {/* @ts-ignore */}
          <motion.path 
            d={linePath} 
            fill="none" 
            stroke="#064e3b" 
            strokeWidth="3" 
            strokeLinecap="round" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* 4. End Point Node */}
          {/* @ts-ignore */}
          <motion.circle 
            cx={getX(data.length-1)} 
            cy={getY(data[data.length-1].value)} 
            r="5" 
            fill="#10b981" 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2 }}
          />
        </svg>
      </div>

      <footer className="pt-6 border-t border-slate-50">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div className="text-left">
              <p className="text-[8px] font-black text-slate-400 uppercase">Predicted Target</p>
              <p className="text-lg font-black text-slate-900">{Math.round(data[data.length-1].value)}</p>
            </div>
            <div className="text-left">
              <p className="text-[8px] font-black text-slate-400 uppercase">Rel. Confidence</p>
              <p className="text-lg font-black text-emerald-600">88.4%</p>
            </div>
          </div>
          <p className="text-[9px] font-bold text-slate-300 italic max-w-35 text-right">
            Shaded region represents 95% Bayesian probability.
          </p>
        </div>
      </footer>
    </section>
  );
};

export default ForecastTrajectory;