/**
 * Ticker Forge: Adjustment Terminal
 * Path: src/pages/intelligence/Forge/components/AdjustmentTerminal.tsx
 * Purpose: Comparison between AI Inference and Manual Certification.
 */

interface AdjustmentTerminalProps {
  rawScore: number;
  aiScore: number;
  certifiedScore: number;
  onScoreChange: (val: number) => void;
  isGreek?: boolean;
}

export const AdjustmentTerminal = ({
  rawScore,
  aiScore,
  certifiedScore,
  onScoreChange,
  isGreek = false
}: AdjustmentTerminalProps) => {
  const delta = aiScore - rawScore;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
      {/* 1. AI Inference Card */}
      <section className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">AI Inference Layer</p>
            <h3 className="text-4xl font-black tracking-tighter">Adjusted ESG Core</h3>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Confidence</p>
              <p className="text-4xl font-black text-emerald-400 tracking-tighter">94%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Suggested</p>
              <p className="text-6xl font-black text-white tracking-tighter leading-none">{aiScore}</p>
            </div>
          </div>

          <p className="text-slate-400 text-sm italic font-medium leading-relaxed max-w-sm">
            The AI Engine suggests an adjustment of {delta > 0 ? `+${delta}` : delta} points based on sector-wide governance anomalies.
          </p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black italic text-white/2 pointer-events-none">
          ML
        </div>
      </section>

      {/* 2. Manual Override Card */}
      <section className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col justify-between">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Institutional Override</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Certified Score</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <label className="text-[10px] font-black text-slate-300 uppercase">Manual Input</label>
              <span className="text-2xl font-black text-emerald-950">{certifiedScore}</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              className="w-full h-4 bg-slate-50 border border-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-900"
              value={certifiedScore}
              onChange={(e) => onScoreChange(parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mt-8">
          <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Audit Policy</p>
          <p className="text-xs font-medium text-slate-500 italic">
            Overrides require a mandatory commentary in the production audit log.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AdjustmentTerminal;