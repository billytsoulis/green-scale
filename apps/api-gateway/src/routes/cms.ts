import { Router } from "express";
import { db, schema } from "@greenscale/database";
import { eq, and } from "drizzle-orm";
import redis from "../lib/redis";

/**
 * GreenScale CMS API Routes
 * Path: apps/api-gateway/src/routes/cms.ts
 * * Implements Tier B translation with Redis caching.
 */

const router: Router = Router();

/**
 * GET /api/cms/:pageId
 * Fetches all content blocks for a page, with a Redis cache-aside layer.
 */
router.get("/:pageId", async (req, res) => {
  const { pageId } = req.params;
  const lang = (req.query.lang as string) || "en";
  const redisKey = `cms:${pageId}:${lang}`;

  try {
    // 1. Check Redis Cache
    const cachedData = await redis.get(redisKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // 2. Cache Miss: Fetch from PostgreSQL using Drizzle Relational API
    const blocks = await db.query.contentBlocks.findMany({
      where: (contentBlocks: any, { eq }: any) => eq(contentBlocks.pageId, pageId),
    });

    // 3. Map language-specific content
    const contentMap = blocks.reduce((acc: any, block: any) => {
      acc[block.sectionId] = lang === "el" ? block.contentEl : block.contentEn;
      return acc;
    }, {} as Record<string, string>);

    // 4. Hydrate Cache (TTL: 24 hours)
    await redis.set(redisKey, JSON.stringify(contentMap), "EX", 86400);

    return res.json(contentMap);
  } catch (error) {
    console.error(`❌ [CMS-API] Error fetching page ${pageId}:`, error);
    return res.status(500).json({ error: "Failed to fetch content." });
  }
});

/**
 * PATCH /api/cms/:pageId/:sectionId
 * Updates a specific block and invalidates the Redis cache for that page.
 */
router.patch("/:pageId/:sectionId", async (req, res) => {
  const { pageId, sectionId } = req.params;
  const { contentEn, contentEl } = req.body;

  try {
    // 1. Update Database
    await db.update(schema.contentBlocks)
      .set({
        contentEn,
        contentEl,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.contentBlocks.pageId, pageId),
          eq(schema.contentBlocks.sectionId, sectionId)
        )
      );

    // 2. Invalidate Cache for both languages to ensure consistency
    await redis.del(`cms:${pageId}:en`);
    await redis.del(`cms:${pageId}:el`);

    return res.json({ success: true, message: `Block ${sectionId} updated and cache cleared.` });
  } catch (error) {
    console.error("❌ [CMS-API] Update failed:", error);
    return res.status(500).json({ error: "Failed to update content." });
  }
});

export { router as cmsRouter };