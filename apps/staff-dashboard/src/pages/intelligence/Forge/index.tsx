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
import { ShapExplainer } from "./components/ShapExplainer.tsx";
import { SentimentFeed } from "./components/SentimentFeed.tsx";
import { ForecastTrajectory } from "./components/ForecastTrajectory.tsx";
import type { ResearchResult } from "../shared/types.ts";

const ML_ENGINE_URL = "http://localhost:8000";

export default function IntelligenceForge() {
  const { ticker } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResearchResult | null>(null);
  const [certifiedScore, setCertifiedScore] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Fail-safe Mock Data
   * Used if the Python API is unreachable or has outdated schemas.
   */
  const MOCK_FALLBACK: ResearchResult = {
    id: "preview-id",
    ticker: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    market_cap: 2800.5,
    raw_score: 72,
    ai_adjusted_score: 85,
    anomaly_detected: false,
    last_audit: "2026-01-20",
    esg_trend: "UPWARD",
    shap_attribution: [
      { name: "Carbon Intensity", value: -4.2, description: "Emissions slightly above target." },
      { name: "Supply Chain", value: 12.8, description: "Top-tier logistics audit." }
    ],
    sentiment_feed: [
      { headline: "Institutional investors bullish on roadmap.", source: "Reuters", sentiment_score: 0.85, impact_weight: 0.9, date: "2026-01-25" }
    ],
    forecast_trajectory: Array.from({ length: 12 }, (_, i) => ({
      date: `2026-${i+1}`,
      value: 85 + (i * 0.5) + Math.random(),
      confidence_high: 88 + (i * 0.8),
      confidence_low: 82 - (i * 0.8)
    }))
  };

  useEffect(() => {
    const fetchDeepDive = async () => {
      try {
        const res = await fetch(`${ML_ENGINE_URL}/ml/research/${ticker}`);
        console.log(res)
        if (res.ok) {
          const json: ResearchResult = await res.json();
          console.log(json)
          // Logic: Merge with fallback if trajectory is missing (outdated backend)
          setData({
            ...json,
            forecast_trajectory: json.forecast_trajectory?.length ? json.forecast_trajectory : MOCK_FALLBACK.forecast_trajectory
          });
          setCertifiedScore(json.ai_adjusted_score);
        } else {
          // If 404 or backend offline, use full fallback for visual verification
          setData(MOCK_FALLBACK);
          setCertifiedScore(MOCK_FALLBACK.ai_adjusted_score);
        }
      } catch (err) {
        console.warn("⚠️ [Forge] Backend node offline. Using institutional mock fallback.");
        setData(MOCK_FALLBACK);
        setCertifiedScore(MOCK_FALLBACK.ai_adjusted_score);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchDeepDive();
  }, [ticker]);

  const handleCommit = async () => {
    setIsSaving(true);
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
    /* @ts-ignore */
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-10 text-left pb-20"
    >
      <ForgeHeader 
        ticker={data.ticker}
        name={data.name}
        sector={data.sector}
        lastAudit={data.last_audit}
        onCommit={handleCommit}
        isSaving={isSaving}
      />

      <MetricMatrix 
        marketCap={data.market_cap}
        rawScore={data.raw_score}
        trend={data.esg_trend || "STABLE"}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8">
           <AdjustmentTerminal 
             rawScore={data.raw_score}
             aiScore={data.ai_adjusted_score}
             certifiedScore={certifiedScore}
             onScoreChange={setCertifiedScore}
           />
        </div>
        <div className="xl:col-span-4">
           <ShapExplainer factors={data.shap_attribution || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <SentimentFeed 
          signals={data.sentiment_feed || []} 
          hasDivergence={data.divergence_detected || false}
        />

        <ForecastTrajectory data={data.forecast_trajectory || []} />
      </div>
    </motion.div>
  );
}