import { Router } from "express";
import { db, schema } from "@greenscale/database";
import { eq, sql } from "drizzle-orm";
// @ts-ignore
import { auth } from "../auth";

/**
 * GreenScale Phase 5: Real-Time Project Funding
 * Path: greenscale/apps/api-gateway/src/routes/funding.ts
 * Purpose: Manages project investments and broadcasts live progress via WebSockets.
 * Logic:
 * 1. Validates investor identity via Stateless JWT.
 * 2. Executes a transaction to update the project's raised amount.
 * 3. Emits a 'project:update' event via Socket.io to all connected clients.
 */

const router: Router = Router();

/**
 * POST /api/funding/invest
 * Simulates a capital allocation to a sustainable project.
 */
router.post("/invest", async (req, res) => {
  const { projectId, amount } = req.body;
  const authHeader = req.headers.authorization;

  try {
    // 1. Identity Verification
    let userId: string | null = null;

    // Check for Bearer token existence and correct format
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      if (token) {
        // @ts-ignore
        const result = await auth.api.verifyJWT({ 
          headers: req.headers, 
          body: { token: token } // Fixed: Passing a guaranteed string
        });
        
        if (result?.payload) {
          userId = result.payload.sub;
        }
      }
    }
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized investment attempt." });
    }

    if (!projectId || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid project ID or investment amount." });
    }

    /**
     * 2. Atomic Transaction Block
     * Updates the project funding status in PostgreSQL.
     */
    const updatedProject = await db.transaction(async (tx) => {
      // Fetch current status
      // @ts-ignore
      const [project] = await tx
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.id, projectId));

      if (!project) throw new Error("Project not found.");

      const currentRaised = parseFloat(project.fundingStatus.currentRaised.toString());
      const newTotal = currentRaised + parseFloat(amount);

      // Check for overfunding (Cap at 100% for this demo)
      if (newTotal > project.fundingStatus.totalGoal) {
        throw new Error("Investment exceeds remaining allocation.");
      }

      // Update the project record
      // @ts-ignore
      const [updated] = await tx
        .update(schema.projects)
        .set({
          fundingStatus: {
            ...project.fundingStatus,
            currentRaised: newTotal,
            investorCount: (project.fundingStatus.investorCount || 0) + 1
          },
          updatedAt: new Date()
        })
        .where(eq(schema.projects.id, projectId))
        .returning();

      return updated;
    });

    /**
     * 3. Real-Time Broadcast (Socket.io)
     * We notify all connected portals that the allocation has changed.
     */
    // @ts-ignore
    const io = req.io;
    if (io) {
      console.log(`📡 [Socket] Broadcasting update for project: ${projectId}`);
      io.emit("project:update", {
        projectId: updatedProject.id,
        currentRaised: updatedProject.fundingStatus.currentRaised,
        investorCount: updatedProject.fundingStatus.investorCount,
        progress: (updatedProject.fundingStatus.currentRaised / updatedProject.fundingStatus.totalGoal) * 100
      });
    }

    return res.json({
      success: true,
      project: updatedProject
    });

  } catch (error: any) {
    console.error("[Funding Error]:", error.message);
    return res.status(500).json({ 
      error: error.message || "Failed to process investment." 
    });
  }
});

export default router;