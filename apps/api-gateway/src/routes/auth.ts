import { Router } from "express";
import { auth } from "../auth";

/**
 * GreenScale API Gateway - Custom Auth Bridge
 * Path: greenscale/apps/api-gateway/src/routes/auth.ts
 * Purpose: Provides explicit endpoints for JWT retrieval to bypass client-library path bugs.
 * Logic: Validates the session cookie and returns a stateless JWT.
 */

const router: Router = Router();

// --- Internal Mocks for standalone logic verification ---
// @ts-ignore
router.get("/get-jwt", async (req, res) => {
  try {
    console.log("[Auth Bridge] Requesting JWT for current session headers...");

    /**
     * Logic: Programmatic call to the Better-Auth JWT plugin action.
     * Fix: Diagnostic logs confirmed that the method is named 'getToken', not 'getJwt'.
     */
    // @ts-ignore
    const result = await auth.api.getToken({
      headers: req.headers
    });

    if (!result || !result.token) {
      console.warn("[Auth Bridge] JWT generation failed - No active session found.");
      return res.status(401).json({ error: "No active session to upgrade to JWT." });
    }

    console.log("[Auth Bridge] Real JWT generated successfully.");

    // Return the actual signed token to the frontend
    return res.json({
      token: result.token
    });
  } catch (error: any) {
    // Diagnostic: Maintain logs to verify the fix
    console.error("[Auth Bridge] Critical failure during JWT retrieval:", error.message);
    
    if (error instanceof TypeError && auth.api) {
        console.log("[Auth Bridge] Available Auth API Methods:", Object.keys(auth.api));
    }

    return res.status(500).json({ error: "Internal authentication server error." });
  }
});

export default router;