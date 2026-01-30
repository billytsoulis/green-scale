import { Router } from "express";
import { db, schema } from "@greenscale/database";
import { desc, eq } from "drizzle-orm";
import { auth } from "../auth";

/**
 * Institutional Intelligence: Governance API
 * Path: apps/api-gateway/src/routes/intelligence.ts
 * Purpose: Handles the persistence and retrieval of manual ESG score overrides.
 * logic: Enforces institutional compliance via mandatory commentary and identity checks.
 */

const router: Router = Router();

/**
 * GET /api/intelligence/logs
 * Retrieves the full historical ledger of manual overrides.
 * Logic: Includes user names via innerJoin for institutional transparency.
 */
router.get("/logs", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized access to governance logs." });
    }

    /**
     * Institutional Audit Query:
     * We select specific fields and join with the users table so the dashboard 
     * can display the name of the operator (e.g., 'Alex Architect') who performed the override.
     */
    // @ts-ignore
    const logs = await db
      .select({
        id: schema.intelligenceAuditLogs.id,
        ticker: schema.intelligenceAuditLogs.ticker,
        userName: schema.users.name,
        previousScore: schema.intelligenceAuditLogs.previousScore,
        certifiedScore: schema.intelligenceAuditLogs.certifiedScore,
        commentary: schema.intelligenceAuditLogs.commentary,
        createdAt: schema.intelligenceAuditLogs.createdAt,
      })
      .from(schema.intelligenceAuditLogs)
      // @ts-ignore
      .innerJoin(schema.users, eq(schema.intelligenceAuditLogs.userId, schema.users.id))
      .orderBy(desc(schema.intelligenceAuditLogs.createdAt));

    return res.json(logs);
  } catch (error: any) {
    console.error("[Audit Ledger Fetch Error]:", error.message);
    return res.status(500).json({ error: "Failed to retrieve the governance ledger." });
  }
});

/**
 * POST /api/intelligence/audit
 * Records a new manual ESG score override transaction.
 * Logic: Enforces the 20-character justification constraint.
 */
router.post("/audit", async (req, res) => {
  const { ticker, previousScore, certifiedScore, commentary } = req.body;
  const authHeader = req.headers.authorization;

  try {
    // 1. Identity Verification via JWT Bridge
    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      // @ts-ignore
      const result = await auth.api.verifyJWT({ headers: req.headers, body: { token } });
      if (result?.payload) userId = result.payload.sub;
    }

    if (!userId) {
      return res.status(401).json({ error: "Institutional identity required for certification." });
    }

    // 2. Compliance Validation: Justification must be qualitative
    if (!commentary || commentary.trim().length < 20) {
      return res.status(400).json({ 
        error: "Institutional policy requires a minimum of 20 characters of justification for score overrides." 
      });
    }

    // 3. Database Persistence: Commit the audit event to PostgreSQL
    // @ts-ignore
    const [logEntry] = await db.insert(schema.intelligenceAuditLogs).values({
      ticker,
      userId,
      previousScore,
      certifiedScore,
      commentary,
      createdAt: new Date()
    }).returning();

    console.log(`🛡️ [Governance] Override committed for ${ticker} by UID: ${userId}`);
    
    return res.status(201).json({ 
      success: true, 
      auditId: logEntry.id 
    });
  } catch (error: any) {
    console.error("[Audit Transaction Failure]:", error.message);
    return res.status(500).json({ error: "Failed to commit override to the institutional ledger." });
  }
});

export default router;