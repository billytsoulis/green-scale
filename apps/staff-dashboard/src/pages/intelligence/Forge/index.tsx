import { useState, useEffect } from "react";

/**
 * Institutional Intelligence: Ticker Forge
 * Path: src/pages/intelligence/Forge/index.tsx
 * Purpose: Manual override terminal for AI-adjusted ESG scores.
 * Logic: Orchestrates modularized sub-components for Header, Metrics, and Adjustment Terminal.
 * Update: Senior Refactor - Decoupled UI blocks into specialized functional files.
 */

import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ForgeHeader } from "./components/ForgeHeader.tsx";
import { MetricMatrix } from "./components/MetricMatrix.tsx";
import { AdjustmentTerminal } from "./components/AdjustmentTerminal.tsx";
import type { ResearchResult } from "../shared/types.ts";

const ML_ENGINE_URL = "http://localhost:8000";

export default function IntelligenceForge() {
  const { ticker } = useParams();

  const [loading, setLoading] = useState(true);
  
  /** * Strict Typing: Using ResearchResult ensures the data structure 
   * remains synchronized with the Python ML engine contract.
   */
  const [data, setData] = useState<ResearchResult | null>(null);
  const [certifiedScore, setCertifiedScore] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Research Lifecycle
   * Logic: Aggregates real-time AI inference for the selected ticker.
   */
  useEffect(() => {
    const fetchDeepDive = async () => {
      try {
        const res = await fetch(`${ML_ENGINE_URL}/ml/research/${ticker}`);
        if (res.ok) {
          const json: ResearchResult = await res.json();
          setData(json);
          setCertifiedScore(json.ai_adjusted_score);
        }
      } catch (err) {
        console.error("❌ [Forge] Research node offline.");
      } finally {
        // Institutional delay to emphasize analytical depth
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchDeepDive();
  }, [ticker]);

  const handleCommit = async () => {
    setIsSaving(true);
    // Logic: In production, this POSTs to the PostgreSQL Override Ledger
    await new Promise(r => setTimeout(r, 800));
    setIsSaving(false);
  };

  if (loading || !data) return (
    <div className="h-screen flex items-center justify-center bg-white font-sans">
      <div className="text-center space-y-4">
         <div className="w-10 h-10 border-t-2 border-emerald-500 rounded-full animate-spin mx-auto" />
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Opening Ticker Forge...</p>
      </div>
    </div>
  );

  return (
    /* @ts-ignore - Utilizing motion for a coordinated terminal entrance */
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-10 text-left"
    >
      {/* 1. Forge Navigation & Header (Modularized) */}
      <ForgeHeader 
        ticker={data.ticker}
        name={data.name}
        sector={data.sector}
        lastAudit={data.last_audit}
        onCommit={handleCommit}
        isSaving={isSaving}
      />

      {/* 2. Top-tier Metric Matrix (Modularized) */}
      <MetricMatrix 
        marketCap={data.market_cap}
        rawScore={data.raw_score}
        trend={data.esg_trend || "STABLE"}
      />

      {/* 3. The Adjustment Terminal (Modularized) */}
      <AdjustmentTerminal 
        rawScore={data.raw_score}
        aiScore={data.ai_adjusted_score}
        certifiedScore={certifiedScore}
        onScoreChange={setCertifiedScore}
      />
    </motion.div>
  );
}