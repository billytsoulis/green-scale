import { Router } from "express";
import { db, schema } from "@greenscale/database";
import { eq, and, asc } from "drizzle-orm";
import redis from "../lib/redis";

/**
 * GreenScale CMS API Routes (Modular JSONB Architecture)
 * Path: apps/api-gateway/src/routes/cms.ts
 * * Updated: Refactored to handle marketingPages and pageSections with JSONB content.
 * * Logic: Efficient fetching of layouts and granular block updates.
 */

const router: Router = Router();

/**
 * GET /api/cms/pages
 * Returns the list of all marketing pages for Layer 1 directory.
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
 * GET /api/cms/layout/:slug
 * Returns the full layout for a page including all ordered sections and content.
 * Used by both LayoutCanvas (Layer 2) and Client Portal.
 */
router.get("/layout/:slug", async (req, res) => {
  const { slug } = req.params;
  const noCache = req.query.nocache === "true";
  const redisKey = `cms:layout:${slug}`;

  try {
    // 1. Check Redis for public-facing requests
    if (!noCache) {
      const cached = await redis.get(redisKey);
      if (cached) return res.json(JSON.parse(cached));
    }

    // 2. Resolve Page
    const [page] = await db.select()
      .from(schema.marketingPages)
      .where(eq(schema.marketingPages.slug, slug));

    if (!page) return res.status(404).json({ error: "Page not found" });

    // 3. Fetch Ordered Sections
    const sections = await db.select()
      .from(schema.pageSections)
      .where(eq(schema.pageSections.pageId, page.id))
      .orderBy(asc(schema.pageSections.orderIndex));

    const response = {
      page,
      sections
    };

    // 4. Cache the result for 1 hour if not bypass
    if (!noCache) {
      await redis.set(redisKey, JSON.stringify(response), "EX", 3600);
    }

    return res.json(response);
  } catch (error) {
    console.error(`❌ [CMS-API] Error fetching layout for ${slug}:`, error);
    return res.status(500).json({ error: "Failed to fetch page layout." });
  }
});

/**
 * PATCH /api/cms/sections/:sectionId
 * Granular update for a specific block's content (Layer 3).
 * Since we use JSONB, we replace the whole content object for that language.
 */
router.patch("/sections/:sectionId", async (req, res) => {
  const { sectionId } = req.params;
  const { contentEn, contentEl } = req.body;

  try {
    const [updatedSection] = await db.update(schema.pageSections)
      .set({
        contentEn,
        contentEl,
        updatedAt: new Date(),
      })
      .where(eq(schema.pageSections.id, sectionId))
      .returning();

    // Invalidate caches
    const [page] = await db.select()
      .from(schema.marketingPages)
      .where(eq(schema.marketingPages.id, updatedSection.pageId));
    
    if (page) {
      await redis.del(`cms:layout:${page.slug}`);
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("❌ [CMS-API] Section update failed:", error);
    return res.status(500).json({ error: "Failed to update section content." });
  }
});

/**
 * PATCH /api/cms/pages/:pageId/reorder
 * Layer 2: Updates the orderIndex of multiple sections.
 */
router.patch("/pages/:pageId/reorder", async (req, res) => {
  const { pageId } = req.params;
  const { sectionOrders } = req.body; // Array of { id: string, orderIndex: number }

  try {
    await db.transaction(async (tx) => {
      for (const item of sectionOrders) {
        await tx.update(schema.pageSections)
          .set({ orderIndex: item.orderIndex })
          .where(and(
            eq(schema.pageSections.id, item.id),
            eq(schema.pageSections.pageId, pageId)
          ));
      }
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("❌ [CMS-API] Reorder failed:", error);
    return res.status(500).json({ error: "Failed to update layout order." });
  }
});

export { router as cmsRouter };