/**
 * GreenScale Phase 3: AI Rebalance Service
 * Path: apps/client-portal/src/services/rebalance.service.ts
 * Purpose: Simulates a Python-powered analytics engine that optimizes portfolios.
 */

export interface RebalanceProposal {
  currentScore: number;
  projectedScore: number;
  totalValue: number;
  trades: {
    action: "SELL" | "BUY";
    assetName: string;
    value: number;
    esgScore: number;
  }[];
}

export const rebalanceService = {
  /**
   * POST /api/analytics/rebalance-proposal
   * Fix: Added default empty array to currentAssets parameter.
   */
  getProposal: async (currentAssets: any[] = []): Promise<RebalanceProposal> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Handle case where currentAssets might be null/undefined despite the default
    const safeAssets = Array.isArray(currentAssets) ? currentAssets : [];

    // Protection: Ensure we don't reduce on undefined and handle missing 'value'
    const totalAUM = safeAssets.reduce((sum, a) => sum + (Number(a?.value) || 0), 0);
    
    // If no assets exist, we return a baseline proposal for the demo
    if (safeAssets.length === 0) {
      return {
        currentScore: 0,
        projectedScore: 90,
        totalValue: 0,
        trades: [
          { action: "BUY", assetName: "Strategic Green Entry", value: 100000, esgScore: 92 }
        ]
      };
    }

    const lowEsgAssets = safeAssets.filter(a => (a?.esgScore || 0) < 60);
    const trades: any[] = [];
    let sellValue = 0;

    lowEsgAssets.forEach(asset => {
      trades.push({
        action: "SELL",
        assetName: asset.name,
        value: asset.value,
        esgScore: asset.esgScore
      });
      sellValue += asset.value;
    });

    trades.push({
      action: "BUY",
      assetName: "Global Green Hydrogen Index",
      value: sellValue,
      esgScore: 96
    });

    return {
      currentScore: 42,
      projectedScore: 92,
      totalValue: totalAUM,
      trades
    };
  }
};