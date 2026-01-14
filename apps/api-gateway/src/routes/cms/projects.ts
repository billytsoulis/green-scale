import { Router } from "express";

/**
 * Modular CMS: Projects Orchestrator
 * Path: apps/api-gateway/src/routes/cms/projects.ts
 * Logic: Specialized route for the /projects landing page layout.
 */

const router: Router = Router();

/**
 * GET /api/cms/projects/layout
 * Purpose: Returns the layout blocks specifically for the Projects directory.
 */
router.get("/layout", async (req, res) => {
  try {
    // Logic: Fetch the 'projects' page from marketingPages
    // and its sections from pageSections (e.g., Intro, Filter, Grid).
    return res.json({
      page: { title: "Sustainable Projects", slug: "projects" },
      sections: [
        { type: "PROJECT_HERO", orderIndex: 1, contentEn: { title: "Sustainable Opportunities" } },
        { type: "PROJECT_GRID", orderIndex: 2, contentEn: {} }
      ]
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch project layout." });
  }
});

export default router;