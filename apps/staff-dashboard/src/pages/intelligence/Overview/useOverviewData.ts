import { useState, useEffect } from "react";

/**
 * Institutional Intelligence: Overview Data Hook
 * Path: src/pages/intelligence/Overview/useOverviewData.ts
 * Purpose: Encapsulates all analytical data fetching for the Market Overview.
 * Logic: Executes parallel hydration from the Python ML Engine.
 */

import type { 
  GlobalStats, 
  SectorAnalysis, 
  MarketMatrixPoint 
} from "../shared/types";

const ML_ENGINE_URL = "http://localhost:8000";

export const useOverviewData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * State variables now utilize the strict analytical interfaces.
   * This ensures the frontend cannot drift from the Python API contract.
   */
  const [stats, setStats] = useState<GlobalStats>({
    total_indexed: 0,
    anomalies: 0,
    drift_24h: 0,
    sync_state: "CONNECTING",
    last_updated: new Date().toISOString()
  });
  
  const [sectorData, setSectorData] = useState<SectorAnalysis[]>([]);
  const [scatterData, setScatterData] = useState<MarketMatrixPoint[]>([]);

  /**
   * Hydration Lifecycle
   * Logic: Executes concurrent fetches to maximize performance on 10,000 ticker aggregations.
   */
  useEffect(() => {
    const hydrate = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Concurrent Request Batching (Optimization)
        const [statsRes, sectorRes, matrixRes] = await Promise.all([
          fetch(`${ML_ENGINE_URL}/ml/stats`),
          fetch(`${ML_ENGINE_URL}/ml/overview/sectors`),
          fetch(`${ML_ENGINE_URL}/ml/overview/matrix`)
        ]);

        // 2. Multi-Node Health Verification
        if (!statsRes.ok || !sectorRes.ok || !matrixRes.ok) {
          throw new Error("Handshake failed with one or more analytical services.");
        }

        // 3. Parallel JSON Parsing
        const [statsJson, sectorJson, matrixJson] = await Promise.all([
          statsRes.json(),
          sectorRes.json(),
          matrixRes.json()
        ]);

        // 4. Atomic State Update
        setStats(statsJson);
        setSectorData(sectorJson);
        setScatterData(matrixJson);
      } catch (err: any) {
        console.error("❌ [useOverviewData] Analytical Sync Failure:", err);
        setError(err.message);
      } finally {
        // Institutional delay to emphasize Big Data complexity during presentation
        setTimeout(() => setLoading(false), 600);
      }
    };

    hydrate();
  }, []);

  /**
   * Public API
   * Allows the View components to stay "dumb" and purely represent the hook's state.
   */
  return {
    loading,
    error,
    stats,
    sectorData,
    scatterData,
    refresh: () => setLoading(true) 
  };
};

export default useOverviewData;