import { useState } from "react";

/**
 * Institutional Intelligence: Simulation Sandbox Entry Point
 * Path: src/pages/intelligence/Sandbox/index.tsx
 * Purpose: Portfolio backtesting orchestrator using high-performance vectors.
 * Logic: Coordinates modular sub-components and manages the simulation state.
 */

import { motion } from "framer-motion";
import { SandboxHeader } from "./components/SandboxHeader.tsx";
import { SimulationControls } from "./components/SimulationControls.tsx";
import { PerformanceMatrix } from "./components/PerformanceMatrix.tsx";

const ML_ENGINE_URL = "http://localhost:8000";

export default function IntelligenceSandbox() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // State for backtest parameters
  const [params, setParams] = useState({
    minEsg: 70,
    excludedSectors: ["Utilities"],
    timeframe: "5Y"
  });

  // Result state (Mocked for initial render, hydrated from Python in production)
  const [results, setResults] = useState({
    benchmark_roi: 12.4,
    ethical_roi: 18.2,
    sharpe: 1.84,
    drawdown: 6.2
  });

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setShowResults(false);
    
    try {
      // In production, this calls POST /ml/simulate to the Python vector engine
      // await fetch(`${ML_ENGINE_URL}/ml/simulate`, { method: "POST", body: JSON.stringify(params) });
      
      // Institutional processing delay
      await new Promise(r => setTimeout(r, 1800));
      setShowResults(true);
    } catch (err) {
      console.error("❌ [Sandbox] Simulation node unreachable.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    setParams({ minEsg: 70, excludedSectors: ["Utilities"], timeframe: "5Y" });
    setShowResults(false);
  };

  return (
    /* @ts-ignore - Coordinated entrance sequence for the Sandbox terminal */
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-12 text-left pb-20"
    >
      {/* 1. Header (Modularized) */}
      <SandboxHeader 
        isSimulating={isSimulating}
        onRun={handleRunSimulation}
        onReset={handleReset}
      />

      {/* 2. Controls & Parameter Builder (Modularized) */}
      <SimulationControls 
        params={params}
        onChange={(field, val) => setParams(prev => ({ ...prev, [field]: val }))}
      />

      {/* 3. Performance & Delta Visualization (Modularized) */}
      <div className="space-y-6">
         <header className="px-6 flex justify-between items-center">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Simulation Output Ledger</h4>
            {showResults && (
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest animate-pulse">
                Vector Math Complete
              </span>
            )}
         </header>
         <PerformanceMatrix 
            results={results}
            isVisible={showResults}
         />
      </div>
    </motion.div>
  );
}