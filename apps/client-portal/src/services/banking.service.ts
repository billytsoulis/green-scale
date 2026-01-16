/**
 * GreenScale Phase 2: Mock Banking Service (REST)
 * Path: apps/client-portal/src/services/banking.service.ts
 * Purpose: Simulates a Plaid-style REST API integration for asset synchronization.
 */

export interface Asset {
  id: string;
  name: string;
  type: "STOCK" | "BOND" | "CASH" | "ETF";
  value: number;
  esgScore: number; // 0 - 100
  sector: string;
}

export const bankingService = {
  /**
   * GET /api/banking/mock-sync
   * Logic: Simulates network latency and returns a diversified portfolio 
   * with varying ESG health scores for visualization testing.
   */
  syncAssets: async (): Promise<Asset[]> => {
    // Simulate API Latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    return [
      { id: "a1", name: "Global Energy Fund", type: "ETF", value: 12500, esgScore: 22, sector: "Utilities" },
      { id: "a2", name: "Tech Frontiers Alpha", type: "STOCK", value: 45000, esgScore: 78, sector: "Technology" },
      { id: "a3", name: "Sovereign Green Bond", type: "BOND", value: 30000, esgScore: 95, sector: "Government" },
      { id: "a4", name: "Circular Economy VC", type: "STOCK", value: 15000, esgScore: 88, sector: "Consumer" },
      { id: "a5", name: "Legacy Oil & Gas", type: "STOCK", value: 8000, esgScore: 12, sector: "Energy" },
    ];
  }
};