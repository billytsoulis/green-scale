/**
 * Ticker Forge: Top-tier Metric Matrix
 * Path: src/pages/intelligence/Forge/components/MetricMatrix.tsx
 * Purpose: High-level context for the entity being certified.
 */

import { Zap, ShieldCheck } from "lucide-react";
import { StatCard } from "../../components/StatCard.tsx";

interface MetricMatrixProps {
  marketCap: number;
  rawScore: number;
  trend: string;
}

export const MetricMatrix = ({ marketCap, rawScore, trend }: MetricMatrixProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="Market Cap" value={`$${marketCap.toFixed(1)}B`} icon={<Zap />} />
      <StatCard label="Raw ESG Score" value={rawScore} icon={<ShieldCheck />} />
      <StatCard label="Trend Velocity" value={trend} icon={<ShieldCheck />} />
    </div>
  );
};

export default MetricMatrix;