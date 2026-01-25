/**
 * Simulation Sandbox: Constraint Builder
 * Path: src/pages/intelligence/Sandbox/components/SimulationControls.tsx
 * Purpose: Parameters for the backtesting engine (Dates, Sectors, ESG Thresholds).
 */

interface ControlsProps {
  params: any;
  onChange: (field: string, value: any) => void;
}

export const SimulationControls = ({ params, onChange }: ControlsProps) => {
  const sectors = ["Technology", "Renewable Energy", "Healthcare", "Financials", "Utilities"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left" data-component="SimulationControls">
      {/* 1. ESG Threshold Constraint */}
      <section className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <header className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Ethical Guardrail</p>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Minimum ESG Score</h3>
        </header>
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-slate-400">Exclude below:</span>
            <span className="text-3xl font-black text-emerald-600">{params.minEsg}</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-950"
            value={params.minEsg}
            onChange={(e) => onChange("minEsg", parseInt(e.target.value))}
          />
        </div>
      </section>

      {/* 2. Sector Exposure Toggles */}
      <section className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <header className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Mandate Scope</p>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Industrial Filters</h3>
        </header>
        <div className="flex flex-wrap gap-2">
          {sectors.map(s => (
            <button
              key={s}
              onClick={() => {
                const newSectors = params.excludedSectors.includes(s)
                  ? params.excludedSectors.filter((x: string) => x !== s)
                  : [...params.excludedSectors, s];
                onChange("excludedSectors", newSectors);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border cursor-pointer ${
                params.excludedSectors.includes(s)
                  ? "bg-red-50 text-red-500 border-red-100"
                  : "bg-emerald-50 text-emerald-700 border-emerald-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Historical Horizon */}
      <section className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <header className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Backtest Horizon</p>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Timeline Selection</h3>
        </header>
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-[9px] font-black text-slate-300 uppercase">Start Date</label>
             <input type="date" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs" value="2021-01-01" readOnly />
           </div>
           <div className="space-y-2">
             <label className="text-[9px] font-black text-slate-300 uppercase">End Date</label>
             <input type="date" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs" value="2025-12-31" readOnly />
           </div>
        </div>
      </section>
    </div>
  );
};

export default SimulationControls;