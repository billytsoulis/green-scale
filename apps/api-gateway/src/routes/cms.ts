import { Router } from "express";
import { db, schema } from "@greenscale/database";
import { eq, and, asc } from "drizzle-orm";
import redis from "../lib/redis";

/**
 * GreenScale CMS API Routes (Modular JSONB Architecture)
 * Path: apps/api-gateway/src/routes/cms.ts
 * * Updated: Added GET /sections/:sectionId to support Layer 3 editors.
 */

const router: Router = Router();

/**
 * GET /api/cms/pages
 * Returns the list of all marketing pages.
 */
router.get("/pages", async (req, res) => {
  try {
    const pages = await db.select().from(schema.marketingPages);
    return res.json(pages);
  } catch (error) {
    console.error("❌ [CMS-API] Failed to fetch pages:", error);
    return res.status(500).json({ error: "Failed to fetch page list." });
  }
});

/**
 * GET /api/cms/sections/:sectionId
 * Layer 3: Fetches the specific content for a block editor.
 */
router.get("/sections/:sectionId", async (req, res) => {
  const { sectionId } = req.params;
  try {
    const [section] = await db.select()
      .from(schema.pageSections)
      .where(eq(schema.pageSections.id, sectionId));

    if (!section) return res.status(404).json({ error: "Section not found" });
    return res.json(section);
  } catch (error) {
    console.error("❌ [CMS-API] Failed to fetch section:", error);
    return res.status(500).json({ error: "Database error." });
  }
});

/**
 * GET /api/cms/layout/:slug
 * Returns the full layout for a page.
 */
router.get("/layout/:slug", async (req, res) => {
  const { slug } = req.params;
  const noCache = req.query.nocache === "true";
  const redisKey = `cms:layout:${slug}`;

  try {
    if (!noCache) {
      const cached = await redis.get(redisKey);
      if (cached) return res.json(JSON.parse(cached));
    }

    const [page] = await db.select()
      .from(schema.marketingPages)
      .where(eq(schema.marketingPages.slug, slug));

    if (!page) return res.status(404).json({ error: "Page not found" });

    const sections = await db.select()
      .from(schema.pageSections)
      .where(eq(schema.pageSections.pageId, page.id))
      .orderBy(asc(schema.pageSections.orderIndex));

    const response = { page, sections };

    if (!noCache) {
      await redis.set(redisKey, JSON.stringify(response), "EX", 3600);
    }

    return res.json(response);
  } catch (error) {
    console.error(`❌ [CMS-API] Error fetching layout:`, error);
    return res.status(500).json({ error: "Failed to fetch page layout." });
  }
});

/**
 * POST /api/cms/pages/:pageId/sections
 * Layer 2: Creates a new section instance.
 */
router.post("/pages/:pageId/sections", async (req, res) => {
  const { pageId } = req.params;
  const { type, orderIndex } = req.body;

  try {
    const [newSection] = await db.insert(schema.pageSections).values({
      pageId,
      type,
      orderIndex,
      contentEn: {},
      contentEl: {},
      isActive: true,
    }).returning();

    return res.status(201).json(newSection);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create block section." });
  }
});

/**
 * PATCH /api/cms/sections/:sectionId
 * Layer 3: Granular update for a specific block's content.
 */
router.patch("/sections/:sectionId", async (req, res) => {
  const { sectionId } = req.params;
  const { contentEn, contentEl } = req.body;

  try {
    const [updatedSection] = await db.update(schema.pageSections)
      .set({ contentEn, contentEl, updatedAt: new Date() })
      .where(eq(schema.pageSections.id, sectionId))
      .returning();

    const [page] = await db.select()
      .from(schema.marketingPages)
      .where(eq(schema.marketingPages.id, updatedSection.pageId));
    
    if (page) await redis.del(`cms:layout:${page.slug}`);

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update content." });
  }
});

/**
 * PATCH /api/cms/pages/:pageId/reorder
 * Layer 2: Reorders sections.
 */
router.patch("/pages/:pageId/reorder", async (req, res) => {
  const { pageId } = req.params;
  const { sectionOrders } = req.body;

  try {
    await db.transaction(async (tx) => {
      for (const item of sectionOrders) {
        await tx.update(schema.pageSections)
          .set({ orderIndex: item.orderIndex })
          .where(and(eq(schema.pageSections.id, item.id), eq(schema.pageSections.pageId, pageId)));
      }
    });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to reorder layout." });
  }
});

export { router as cmsRouter };