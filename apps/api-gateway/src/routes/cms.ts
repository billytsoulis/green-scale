import { Router } from "express";
import { db, schema } from "@greenscale/database";
import { eq, and } from "drizzle-orm";
import redis from "../lib/redis";

/**
 * GreenScale CMS API Routes
 * Path: apps/api-gateway/src/routes/cms.ts
 * * Updated: Added 'nocache' support for development and fixed the cache-first logic.
 */

const router: Router = Router();

/**
 * GET /api/cms/:pageId
 * Public endpoint: Returns a localized key-value map for the Client Portal.
 */
router.get("/:pageId", async (req, res) => {
  const { pageId } = req.params;
  const lang = (req.query.lang as string) || "en";
  
  // Logic: 'admin' returns raw blocks, 'nocache' skips Redis
  const isAdmin = req.query.admin === "true";
  const noCache = req.query.nocache === "true"; 
  const redisKey = `cms:${pageId}:${lang}`;

  try {
    // 1. Check Redis Cache (Skip if isAdmin or noCache is requested)
    if (!isAdmin && !noCache) {
      const cachedData = await redis.get(redisKey);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        // Debug log to terminal
        console.log(`[CMS-API] Serving ${pageId}:${lang} from Redis (${Object.keys(parsed).length} keys)`);
        return res.json(parsed);
      }
    }

    // 2. Fetch from PostgreSQL
    console.log(`[CMS-API] Cache miss or bypass. Fetching ${pageId} from PostgreSQL...`);
    const blocks = await db.query.contentBlocks.findMany({
      where: (contentBlocks: any, { eq }: any) => eq(contentBlocks.pageId, pageId),
    });

    // 3. Admin Response: Return the full block objects
    if (isAdmin) {
      return res.json(blocks);
    }

    // 4. Public Response: Map language-specific content
    const contentMap = blocks.reduce((acc: any, block: any) => {
      acc[block.sectionId] = lang === "el" ? block.contentEl : block.contentEn;
      return acc;
    }, {} as Record<string, string>);

    // 5. Hydrate Cache (TTL: 24 hours)
    if (blocks.length > 0) {
      await redis.set(redisKey, JSON.stringify(contentMap), "EX", 86400);
      console.log(`[CMS-API] Cache hydrated for ${pageId}:${lang} with ${blocks.length} blocks.`);
    }

    return res.json(contentMap);
  } catch (error) {
    console.error(`❌ [CMS-API] Error fetching page ${pageId}:`, error);
    return res.status(500).json({ error: "Failed to fetch content." });
  }
});

/**
 * PATCH /api/cms/:pageId/:sectionId
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

    await redis.del(`cms:${pageId}:en`);
    await redis.del(`cms:${pageId}:el`);

    return res.json({ success: true });
  } catch (error) {
    console.error("❌ [CMS-API] Update failed:", error);
    return res.status(500).json({ error: "Failed to update content." });
  }
});

export { router as cmsRouter };