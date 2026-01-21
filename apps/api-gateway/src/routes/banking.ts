import { Router } from "express";
import { db, schema } from "@greenscale/database";
import { eq, inArray } from "drizzle-orm";

import { auth } from "../auth";

/**
 * GreenScale Phase 3: Banking & Asset Normalization
 * Path: greenscale/apps/api-gateway/src/routes/banking.ts
 * Purpose: Backend engine for asset synchronization and ESG math.
 * Logic: 
 * 1. Verifies identity via stateless JWT.
 * 2. If no assets exist, seeds the 'linked_assets' table (simulating Plaid link).
 * 3. Calculates the weighted ESG score on the server.
 */

const router: Router = Router();

/**
 * GET /api/banking/sync
 * Retrieves user assets and calculates the aggregate ESG health.
 */
router.get("/sync", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    // 1. Identity Verification (Stateless-First pattern from Phase 2)
    let userId: string | null = null;
    
    // Attempt standard session
    // @ts-ignore
    const session = await auth.api.getSession({ headers: req.headers });
    if (session?.user) {
      userId = session.user.id;
    } 
    // Fallback to manual JWT verification
    else if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      // @ts-ignore
      const result = await auth.api.verifyJWT({ headers: req.headers, body: { token } });
      if (result?.payload) userId = result.payload.sub;
    }

    if (!userId) return res.status(401).json({ error: "Unauthorized banking access." });

    // 2. Initial Seed Logic
    // Check if user has any linked assets in PostgreSQL
    const existingAssets = await db
      .select()
      .from(schema.linkedAssets)
      .where(eq(schema.linkedAssets.userId, userId));

    if (existingAssets.length === 0) {
      console.log(`🌱 [Banking] First sync for User: ${userId}. Seeding initial holdings...`);
      
      const seedHoldings = [
        { userId, name: "Global Carbon ETF", type: "ETF", value: "125000.00", esgScore: 32, sector: "Energy" },
        { userId, name: "NextGen Solar Equity", type: "STOCK", value: "450000.00", esgScore: 94, sector: "Renewables" },
        { userId, name: "EU Green Sovereignty", type: "BOND", value: "300000.00", esgScore: 88, sector: "Government" },
        { userId, name: "Circular Tech Fund", type: "ETF", value: "150000.00", esgScore: 72, sector: "Technology" },
      ];

      // @ts-ignore
      await db.insert(schema.linkedAssets).values(seedHoldings);
    }

    // 3. Normalized Math (The Engine)
    // We fetch the assets again to ensure we have the full current state
    const assets = await db
      .select()
      .from(schema.linkedAssets)
      .where(eq(schema.linkedAssets.userId, userId));

    // Calculate Weighted Average: SUM(value * esgScore) / SUM(value)
    let totalValue = 0;
    let weightedSum = 0;

    assets.forEach(asset => {
        const val = parseFloat(asset.value.toString());
        totalValue += val;
        weightedSum += (val * (asset.esgScore || 0));
    });

    const aggregateScore = totalValue > 0 ? Math.round(weightedSum / totalValue) : 0;

    console.log(`📊 [Banking] Calculation complete for ${userId}: Score ${aggregateScore}`);

    return res.json({
      assets,
      summary: {
        totalValue,
        aggregateScore,
        lastSync: new Date()
      }
    });

  } catch (error: any) {
    console.error("[Banking Sync Failure]:", error.message);
    return res.status(500).json({ error: "Internal ledger synchronization failure." });
  }
});

/**
 * POST /api/banking/rebalance
 * Executes the "Ethical Pivot" as a single atomic transaction.
 */
router.post("/rebalance", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let userId: string | null = null;

    // 1. Identity Guard
    // @ts-ignore
    const result = await auth.api.verifyJWT({ headers: req.headers, body: { token: authHeader?.split(" ")[1] } });
    if (result?.payload) userId = result.payload.sub;
    if (!userId) return res.status(401).json({ error: "Unauthorized pivot." });

    const { sellAssetIds, newAssets, previousScore, newScore, totalValuePivot } = req.body;

    /**
     * 2. Atomic Transaction Block
     * Ensures either the whole rebalance happens or none of it does.
     */
    await db.transaction(async (tx) => {
      // A. Divest from "dirty" assets
      if (sellAssetIds.length > 0) {
        await tx.update(schema.linkedAssets)
          .set({ status: "DIVESTED" })
          .where(inArray(schema.linkedAssets.id, sellAssetIds));
      }

      // B. Acquire "green" assets
      if (newAssets.length > 0) {
        const holdingsToInsert = newAssets.map((a: any) => ({
          userId,
          name: a.name,
          type: a.type,
          value: a.value.toString(),
          esgScore: a.esgScore,
          sector: a.sector,
          status: "ACTIVE"
        }));
        // @ts-ignore
        await tx.insert(schema.linkedAssets).values(holdingsToInsert);
      }

      // C. Record Transaction in Ledger for Q1 Reports
      // @ts-ignore
      await tx.insert(schema.rebalanceTransactions).values({
        userId,
        previousAggregateScore: previousScore,
        newAggregateScore: newScore,
        totalValuePivot: totalValuePivot.toString(),
        trades: JSON.stringify({ divested: sellAssetIds, acquired: newAssets }),
        executedAt: new Date()
      });
    });

    console.log(`✅ [Ledger] Rebalance executed for user: ${userId}`);
    return res.json({ success: true, message: "Portfolio rebalanced successfully." });

  } catch (error: any) {
    console.error("[Transactional Failure]:", error.message);
    return res.status(500).json({ error: "Failed to commit rebalance to ledger." });
  }
});

export default router;