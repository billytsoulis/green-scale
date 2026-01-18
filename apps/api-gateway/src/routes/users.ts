import { Router } from "express";
import { db, schema } from "@greenscale/database";
import { eq } from "drizzle-orm";
import { auth } from "../auth";

/**
 * GreenScale API Gateway - User Profile Route
 * Path: greenscale/apps/api-gateway/src/routes/users.ts
 * Purpose: Manages investor-specific profiles, intent, and onboarding progress.
 * Logic: Links Phase 1/4 data to the core authentication session.
 */

const router: Router = Router();

/**
 * GET /api/users/me
 * Retrieves the current user session and their associated investor profile.
 */
router.get("/me", async (req, res) => {
  try {
    // @ts-ignore
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session) {
      console.warn("[Gateway] GET /me - No session/JWT found in headers.");
      return res.status(401).json({ error: "Unauthorized session." });
    }

    // @ts-ignore
    const [profile] = await db
      .select()
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, session.user.id));

    return res.json({
      ...session.user,
      profile: profile || null,
    });
  } catch (error: any) {
    console.error("[Gateway Diagnostics] Profile Fetch Error:", error);
    return res.status(500).json({ error: "Failed to sync user context." });
  }
});

/**
 * PATCH /api/users/profile
 * Upserts the investor profile (Intent, Persona, KYC step).
 * Fix: Enhanced diagnostic check for both Cookies and Authorization headers.
 */
router.patch("/profile", async (req, res) => {
  const { valueIntent, persona, kycStep, annualNetWorth } = req.body;

  try {
    // --- DIAGNOSTIC CHECK: JWT FLOW ---
    console.log("[Gateway] PATCH /profile - Authentication Audit:", {
      origin: req.headers.origin,
      hasCookie: !!req.headers.cookie,
      hasAuthorization: !!req.headers.authorization,
      // Log the first few chars of the JWT for verification without exposing the full secret
      authPrefix: req.headers.authorization ? req.headers.authorization.substring(0, 15) + "..." : "NONE",
    });

    // @ts-ignore
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session) {
      console.warn("[Gateway] PATCH /profile - Stateless validation failed. No valid JWT/Session found.");
      return res.status(401).json({ error: "Authentication required to save profile." });
    }

    console.log(`[Gateway] Authorized: Upserting profile for User: ${session.user.id}`);

    // @ts-ignore
    const [updatedProfile] = await db
      .insert(schema.userProfiles)
      .values({
        userId: session.user.id,
        valueIntent,
        persona,
        kycStep: kycStep || 1,
        annualNetWorth,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.userProfiles.userId,
        set: {
          valueIntent: valueIntent ?? undefined,
          persona: persona ?? undefined,
          kycStep: kycStep ?? undefined,
          annualNetWorth: annualNetWorth ?? undefined,
          updatedAt: new Date(),
        },
      })
      .returning();

    return res.json(updatedProfile);
  } catch (error: any) {
    console.error("--- DB INTEGRITY FAILURE ---");
    console.error("Message:", error.message);
    console.error("---------------------------");

    return res.status(500).json({ 
      error: "Transaction failed. Database integrity check required.",
      diagnostic: error.message 
    });
  }
});

export default router;