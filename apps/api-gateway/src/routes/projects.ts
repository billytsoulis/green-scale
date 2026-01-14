import { Router } from "express";
import { db, schema } from "@greenscale/database";
import { eq, desc } from "drizzle-orm";

/**
 * GreenScale Projects API (CRUD)
 * Path: apps/api-gateway/src/routes/projects.ts
 * Logic: Handles fetching and managing projects. 
 * Note: If the table does not exist in the DB, this will return a 500 error.
 */

const router: Router = Router();

/**
 * GET /api/projects
 * Returns 200 [] if no projects are found.
 * Returns 500 if the database table is missing or connection fails.
 */
router.get("/", async (req, res) => {
  try {
    // Attempt to fetch all projects ordered by creation date
    const results = await db
      .select()
      .from(schema.projects)
      .orderBy(desc(schema.projects.createdAt));
    
    // If successful, even if results is [], return 200 OK
    return res.json(results || []);
  } catch (error: any) {
    // Log the specific error to the server console for debugging
    console.error("[Backend] Fetch Projects Error:", error.message);
    
    // If the error is about a missing table, we still return 500 because it's a server configuration issue
    return res.status(500).json({ 
      error: "Failed to fetch projects.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

/**
 * GET /api/projects/:slug
 */
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const [project] = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.slug, slug));
      
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.json(project);
  } catch (error) {
    return res.status(500).json({ error: "Database error during single fetch." });
  }
});

/**
 * POST /api/projects
 */
router.post("/", async (req, res) => {
  const { 
    titleEn, titleEl, slug, category, status, 
    targetIrr, minInvestment, totalGoal, esgScore 
  } = req.body;

  try {
    const [newProject] = await db.insert(schema.projects).values({
      slug,
      status: status || "DRAFT",
      category,
      targetIrr: targetIrr?.toString(),
      minInvestment: minInvestment?.toString(),
      esgScore: esgScore || 0,
      location: { city: "Athens", country: "Greece" },
      contentEn: { title: titleEn, description: "", impactSummary: "" },
      contentEl: { title: titleEl, description: "", impactSummary: "" },
      fundingStatus: { 
        totalGoal: parseFloat(totalGoal), 
        currentRaised: 0, 
        investorCount: 0 
      }
    }).returning();

    return res.status(201).json(newProject);
  } catch (error) {
    console.error("[Backend] Creation Error:", error);
    return res.status(500).json({ error: "Project creation failed." });
  }
});

/**
 * PATCH /api/projects/:id
 */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const [updated] = await db
      .update(schema.projects)
      .set({ 
        ...data, 
        updatedAt: new Date() 
      })
      .where(eq(schema.projects.id, id))
      .returning();

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Update failed." });
  }
});

export default router;