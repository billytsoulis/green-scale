import { Router } from "express";
import { db, schema } from "@greenscale/database";
import { eq, and } from "drizzle-orm";
import redis from "../lib/redis";

/**
 * GreenScale CMS API Routes
 * Path: apps/api-gateway/src/routes/cms.ts
 * * Implements Tier B translation with Redis caching.
 * * Fixed: Imported eq and and from drizzle-orm directly.
 */

const router = Router();

/**
 * GET /api/cms/:pageId
 * Fetches all content blocks for a specific page.
 */
router.get("/:pageId", async (req, res) => {
  const { pageId } = req.params;
  const lang = (req.query.lang as string) || "en";
  const redisKey = `cms:${pageId}:${lang}`;

  try {
    // 1. Try to fetch from Redis Cache
    const cachedData = await redis.get(redisKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // 2. Fetch from PostgreSQL if Cache Miss
    const blocks = await db.query.contentBlocks.findMany({
      where: eq(schema.contentBlocks.pageId, pageId),
    });

    // 3. Transform to a flat key-value object based on requested lang
    const contentMap = blocks.reduce((acc, block) => {
      acc[block.sectionId] = lang === "el" ? block.contentEl : block.contentEn;
      return acc;
    }, {} as Record<string, string>);

    // 4. Update Redis (TTL 24 hours)
    await redis.set(redisKey, JSON.stringify(contentMap), "EX", 86400);

    return res.json(contentMap);
  } catch (error) {
    console.error(`❌ [CMS-API] Error fetching page ${pageId}:`, error);
    return res.status(500).json({ error: "Failed to fetch content." });
  }
});

/**
 * PATCH /api/cms/:pageId/:sectionId
 * Updates a specific content block and flushes cache.
 */
router.patch("/:pageId/:sectionId", async (req, res) => {
  const { pageId, sectionId } = req.params;
  const { contentEn, contentEl } = req.body;

  try {
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

    // CRITICAL: Flush Redis cache for both languages to ensure immediate update
    await redis.del(`cms:${pageId}:en`);
    await redis.del(`cms:${pageId}:el`);

    return res.json({ success: true, message: `Block ${sectionId} updated.` });
  } catch (error) {
    console.error("❌ [CMS-API] Update failed:", error);
    return res.status(500).json({ error: "Failed to update content." });
  }
});

export { router as cmsRouter };