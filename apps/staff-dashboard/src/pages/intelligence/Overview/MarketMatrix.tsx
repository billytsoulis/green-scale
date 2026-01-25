/**
 * Institutional Intelligence: Valuation vs Impact Matrix
 * Path: src/pages/intelligence/Overview/MarketMatrix.tsx
 * Purpose: Scatter plot identifying ESG outliers across the market cap spectrum.
 * Logic: Vectorized mapping of X (Cap), Y (Score), and Z (Carbon Size).
 */

import { motion } from "framer-motion";
import type { MarketMatrixPoint } from "../shared/types";

interface MarketMatrixProps {
  data: MarketMatrixPoint[];
}

export const MarketMatrix = ({ data }: MarketMatrixProps) => {
  // Logic: Max X bound is $500B as per our Big Data generator specs.
  const MAX_X = 500; 

  return (
    <div 
      className="h-95 w-full mt-4 relative bg-slate-900 rounded-[2.5rem] overflow-hidden p-8 shadow-inner border border-slate-800" 
      data-component="MarketMatrix"
    >
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center text-[10rem] font-black text-white italic select-none pointer-events-none">
        AI CORE
      </div>

      {/* The Coordinate Space */}
      <div className="relative w-full h-full border-l border-b border-white/10">
        {data.length > 0 ? (
          data.map((point, i) => {
            // Using MarketMatrixPoint properties to drive the visual vectors
            const leftPos = (point.x / MAX_X) * 100;
            const bottomPos = point.y;
            const bubbleSize = Math.max(6, point.z / 15);

            return (
              /* @ts-ignore - Using 'motion' for orchestrated entrance */
              <motion.div 
                key={`${point.ticker}-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: point.anomaly ? 1 : 0.4, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: (i % 20) * 0.02, // Staggered entrance for institutional "pop"
                  ease: "easeOut" 
                }}
                title={`Ticker: ${point.ticker} | Cap: $${point.x}B | Score: ${point.y}`}
                className={`absolute rounded-full transition-all hover:scale-150 hover:opacity-100 cursor-crosshair ${
                  point.anomaly 
                    ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] z-10' 
                    : 'bg-emerald-400'
                }`}
                style={{ 
                  left: `${leftPos}%`, 
                  bottom: `${bottomPos}%`,
                  width: `${bubbleSize}px`,
                  height: `${bubbleSize}px`,
                  transform: 'translate(-50%, 50%)'
                }}
              />
            );
          })
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] animate-pulse">
              Mapping Vectors...
            </p>
          </div>
        )}
      </div>

      {/* Axis Metadata */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-10">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Stable Asset</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Risk Outlier</span>
         </div>
      </div>
    </div>
  );
};

export default MarketMatrix;