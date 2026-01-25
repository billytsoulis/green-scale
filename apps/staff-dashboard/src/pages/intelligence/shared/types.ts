/**
 * Institutional Intelligence: Type Definitions
 * Path: src/pages/intelligence/shared/types.ts
 * Purpose: Strictly typed interfaces mirrored from the Python Pydantic schemas.
 */

export interface GlobalStats {
  total_indexed: number;
  anomalies: number;
  drift_24h: number;
  sync_state: string;
  last_updated: string;
}

export interface SectorAnalysis {
  name: string;
  count: number;
  risk: number; // Percentage 0-100
}

export interface MarketMatrixPoint {
  ticker: string;
  x: number; // Market Cap ($B)
  y: number; // AI Predicted Score (0-100)
  z: number; // Carbon Intensity (Bubble Size)
  anomaly: boolean;
}

export interface ResearchResult {
  id: string | null;
  ticker: string;
  name: string;
  sector: string;
  market_cap: number;
  raw_score: number;
  ai_adjusted_score: number;
  anomaly_detected: boolean;
  last_audit: string;
  esg_trend?: "UPWARD" | "STABLE" | "DOWNWARD";
}

export interface SearchRequest {
  query: string;
  sector?: string | null;
  page: number;
  limit: number;
}

export interface SearchResponse {
  total: number;
  hits: ResearchResult[];
}