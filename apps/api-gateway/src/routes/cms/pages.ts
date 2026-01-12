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
 * GET /api/cms/layout/:slug
 */
router.get("/layout/:slug", async (req, res) => {
  const { slug } = req.params;
  const noCache = req.query.nocache === "true";
  const redisKey = `cms:layout:${slug}`;

  try {
    // @ts-ignore
    if (!noCache) {
      const cached = await redis.get(redisKey);
      if (cached) return res.json(JSON.parse(cached));
    }

    // @ts-ignore
    const [page] = await db.select().from(schema.marketingPages).where(eq(schema.marketingPages.slug, slug));
    if (!page) return res.status(404).json({ error: "Page not found" });

    // @ts-ignore
    const sections = await db.select()
      .from(schema.pageSections)
      .where(eq(schema.pageSections.pageId, page.id))
      .orderBy(asc(schema.pageSections.orderIndex));

    const response = { page, sections };

    // @ts-ignore
    if (!noCache) await redis.set(redisKey, JSON.stringify(response), "EX", 3600);

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch page layout." });
  }
});

export default router;