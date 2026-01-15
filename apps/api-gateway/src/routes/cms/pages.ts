import { Router } from "express";
import { db, schema } from "@greenscale/database";
import { eq, asc } from "drizzle-orm";
import redis from "../../lib/redis";

/**
 * CMS Pages Module (Layer 1)
 * Path: apps/api-gateway/src/routes/cms/pages.ts
 * Logic: Page directory and full layout hydration.
 */

const router: Router = Router();

// @ts-ignore
// const db = {}; const schema = {}; const eq = (a, b) => {}; const asc = (a) => {}; const redis = {};

/**
 * GET /api/cms/pages
 * Returns the list of all marketing pages for the dashboard directory.
 */
router.get("/", async (req, res) => {
  try {
    // @ts-ignore
    const pages = await db.select().from(schema.marketingPages);
    return res.json(pages);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch pages." });
  }
});

/**
 * POST /api/cms/pages
 * Logic: Creates a new marketing page shell.
 * This resolves the backend limitation for creating new pages from the dashboard.
 */
router.post("/", async (req, res) => {
  const { title, slug, isNavItem } = req.body;

  // 1. Validation: Ensure required fields are present
  if (!title || !slug) {
    return res.status(400).json({ error: "Title and slug are required for new pages." });
  }

  try {
    // 2. Slug Normalization (e.g., "Our Services" -> "our-services")
    const cleanSlug = slug.toLowerCase().trim().replace(/\s+/g, '-');

    // 3. Database Insertion: Insert the new page record
    // @ts-ignore
    const [newPage] = await db.insert(schema.marketingPages).values({
      title,
      slug: cleanSlug,
      isNavItem: !!isNavItem,
    }).returning();

    return res.status(201).json(newPage);
  } catch (error: any) {
    // 4. Handle Postgres Unique Constraint (error code 23505 for unique violation)
    if (error.code === '23505') {
      return res.status(409).json({ error: "A page with this slug already exists." });
    }
    return res.status(500).json({ error: "Database failure during page creation." });
  }
});

/**
 * GET /api/cms/layout/:slug
 * Fetches the page metadata and all ordered sections for a specific slug.
 */
router.get("/layout/:slug", async (req, res) => {
  const { slug } = req.params;
  const noCache = req.query.nocache === "true";
  const redisKey = `cms:layout:${slug}`;

  try {
    // Check Redis cache first unless noCache is specified
    // @ts-ignore
    if (!noCache) {
      const cached = await redis.get(redisKey);
      if (cached) return res.json(JSON.parse(cached));
    }

    // Fetch page metadata from database
    // @ts-ignore
    const [page] = await db.select().from(schema.marketingPages).where(eq(schema.marketingPages.slug, slug));
    if (!page) return res.status(404).json({ error: "Page not found" });

    // Fetch associated sections in order
    // @ts-ignore
    const sections = await db.select()
      .from(schema.pageSections)
      .where(eq(schema.pageSections.pageId, page.id))
      .orderBy(asc(schema.pageSections.orderIndex));

    const response = { page, sections };

    // Update cache if applicable
    // @ts-ignore
    if (!noCache) await redis.set(redisKey, JSON.stringify(response), "EX", 3600);

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch page layout." });
  }
});

export default router;