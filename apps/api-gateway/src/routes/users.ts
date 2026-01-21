import { Router } from "express";
// --- Production Ready Imports (Uncomment in local IDE) ---
import { db, schema } from "@greenscale/database";
import { eq } from "drizzle-orm";
import { auth } from "../auth";

/**
 * GreenScale API Gateway - User Profile Route
 * Path: greenscale/apps/api-gateway/src/routes/users.ts
 * Purpose: Manages investor-specific profiles and onboarding progress.
 * Fix: Normalized header passing for better-auth stateless JWT validation.
 */

const router: Router = Router();

/**
 * GET /api/users/me
 * Retrieves the current user session and their associated investor profile.
 * Fix: Enhanced header mapping to ensure Bearer tokens are recognized.
 */
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    console.log("[Gateway] GET /me - Auth Audit:", {
      hasAuthorization: !!authHeader,
      tokenPreview: authHeader ? `${authHeader.substring(0, 20)}...` : "N/A"
    });

    /**
     * 1. Attempt standard session retrieval.
     * Better-Auth tries to find a session cookie or valid database session.
     */
    // @ts-ignore
    let session = await auth.api.getSession({ headers: req.headers });
    let authenticatedUser = session?.user;

    /**
     * 2. Stateless Fallback: verifyJWT
     * If getSession yields nothing (common in pure stateless Bearer flows), 
     * we manually verify the JWT using the shared secret.
     */
    if (!authenticatedUser && authHeader?.startsWith("Bearer ")) {
      console.log("[Gateway] getSession returned null. Attempting stateless verifyJWT...");
      const token = authHeader.split(" ")[1];
      
      try {
        /**
         * FIX: better-auth verifyJWT programmatic call.
         * The result directly contains the 'payload' property.
         */
        // @ts-ignore
        const result = await auth.api.verifyJWT({
          headers: req.headers,
          body: { token }
        });

        // The result contains the decoded 'payload' directly (no .response wrapper)
        if (result?.payload) {
          const userId = result.payload.sub;
          console.log("[Gateway] Stateless JWT verified for Subject (UID):", userId);

          // Fetch the full user from the DB to populate 'authenticatedUser'
          // @ts-ignore
          const [dbUser] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, userId));

          if (dbUser) {
            authenticatedUser = dbUser;
          }
        }
      } catch (jwtErr: any) {
        console.warn("[Gateway] Stateless verification failed:", jwtErr.message);
      }
    }

    // 3. Final Identity Guard
    if (!authenticatedUser) {
      console.error("[Gateway] All identity checks failed. Rejecting request.");
      return res.status(401).json({ error: "Unauthorized session." });
    }

    // 4. Fetch the extended profile from PostgreSQL
    // @ts-ignore
    const [profile] = await db
      .select()
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, authenticatedUser.id));

    return res.json({
      ...authenticatedUser,
      profile: profile || null,
    });
  } catch (error: any) {
    console.error("[Gateway Diagnostics] Profile Fetch Error:", error.message);
    return res.status(500).json({ error: "Failed to sync user context." });
  }
});

/**
 * PATCH /api/users/profile
 * Upserts the investor profile (Intent, Persona, KYC step).
 */
router.patch("/profile", async (req, res) => {
  const { valueIntent, persona, kycStep, annualNetWorth } = req.body;

  try {
    const authHeader = req.headers.authorization;
    // @ts-ignore
    let session = await auth.api.getSession({ headers: req.headers });
    let userId = session?.user?.id;

    // Stateless verification fallback for PATCH
    if (!userId && authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      // @ts-ignore
      const result = await auth.api.verifyJWT({ 
        headers: req.headers,
        body: { token } 
      });
      
      // Fix: Accessing payload directly from result
      if (result?.payload) {
        userId = result.payload.sub;
      }
    }

    if (!userId) {
      return res.status(401).json({ error: "Authentication required to save profile." });
    }

    console.log(`[Gateway] Saving profile for User: ${userId}`);

    // @ts-ignore
    const [updatedProfile] = await db
      .insert(schema.userProfiles)
      .values({
        userId: userId,
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
    console.error("--- DB INTEGRITY FAILURE ---", error.message);
    return res.status(500).json({ 
      error: "Transaction failed. Database integrity check required.",
      diagnostic: error.message 
    });
  }
});

export default router;