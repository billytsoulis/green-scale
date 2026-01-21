import { Router } from "express";
import React from "react";
// @ts-ignore
import { renderToStream } from "@react-pdf/renderer";
import { ImpactReport } from "../services/reports/ImpactReport";
import { db, schema } from "@greenscale/database";
import { eq } from "drizzle-orm";
// @ts-ignore
import { auth } from "../auth";

/**
 * GreenScale Phase 5: PDF Report Generator API
 * Path: greenscale/apps/api-gateway/src/routes/reports.ts
 * Purpose: Populates the ImpactReport template with real-time data and streams it.
 * Logic:
 * 1. Authenticates user via stateless JWT (Auth Bridge).
 * 2. Fetches personalized investment intent from PostgreSQL.
 * 3. Renders the React-based PDF template to a stream for download.
 */

const router: Router = Router();

router.get("/impact-statement", async (req, res) => {
  try {
    // 1. Authenticate Request via JWT
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization token." });
    }
    
    const token = authHeader.split(" ")[1];
    // @ts-ignore
    const authResult = await auth.api.verifyJWT({ headers: req.headers, body: { token } });
    
    if (!authResult?.payload?.sub) {
      return res.status(401).json({ error: "Invalid or expired session." });
    }

    const userId = authResult.payload.sub;

    // 2. Fetch Investor Metadata from Database
    // @ts-ignore
    const [userRecord] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId));

    // @ts-ignore
    const [profile] = await db
      .select()
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, userId));

    // Mock calculations (In production, query the ledger for these deltas)
    const metrics = {
      aggregateScore: 88,
      co2Saved: "14.2",
      totalValue: "1,240,500.00"
    };

    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 3. Set PDF Response Headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition", 
      `attachment; filename=GreenScale_Impact_${userId.slice(0, 8)}.pdf`
    );

    // 4. Render React PDF to Stream
    const stream = await renderToStream(
      React.createElement(ImpactReport, {
        user: {
          name: userRecord?.name || "GreenScale Investor",
          persona: profile?.persona || "Ethical Strategist",
          intent: profile?.valueIntent || "Sustainable Growth"
        },
        metrics,
        date: reportDate
      }) as any
    );

    // Pipe the stream directly to Express
    stream.pipe(res);

  } catch (error: any) {
    console.error("[Report Engine Error]:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate impact statement." });
    }
  }
});

export default router;