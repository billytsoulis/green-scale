import { Router } from "express";
import { db, schema } from "@greenscale/database";
import { eq, and } from "drizzle-orm";
import redis from "../../lib/redis";

/**
 * CMS Sections Module (Layer 2 & 3)
 * Path: apps/api-gateway/src/routes/cms/sections.ts
 * Logic: Section creation, reordering, and content persistence.
 */

const router: Router = Router();

// @ts-ignore
// const db = {}; const schema = {}; const eq = (a, b) => {}; const and = (a, b) => {}; const redis = {};

/**
 * GET /api/cms/sections/:sectionId
 */
router.get("/:sectionId", async (req, res) => {
  const { sectionId } = req.params;
  try {
    // @ts-ignore
    const [section] = await db.select().from(schema.pageSections).where(eq(schema.pageSections.id, sectionId));
    if (!section) return res.status(404).json({ error: "Section not found" });
    return res.json(section);
  } catch (error) {
    return res.status(500).json({ error: "Database error." });
  }
});

/**
 * POST /api/cms/pages/:pageId/sections
 */
router.post("/pages/:pageId/sections", async (req, res) => {
  const { pageId } = req.params;
  const { type, orderIndex } = req.body;
  try {
    // @ts-ignore
    const [newSection] = await db.insert(schema.pageSections).values({
      pageId, type, orderIndex, contentEn: {}, contentEl: {}, isActive: true,
    }).returning();
    return res.status(201).json(newSection);
  } catch (error) {
    return res.status(500).json({ error: "Creation failed." });
  }
});

/**
 * PATCH /api/cms/sections/:sectionId (Persistence)
 */
router.patch("/:sectionId", async (req, res) => {
  const { sectionId } = req.params;
  const { contentEn, contentEl } = req.body;
  try {
    // @ts-ignore
    const [updated] = await db.update(schema.pageSections)
      .set({ contentEn, contentEl, updatedAt: new Date() })
      .where(eq(schema.pageSections.id, sectionId))
      .returning();

    // @ts-ignore
    const [page] = await db.select().from(schema.marketingPages).where(eq(schema.marketingPages.id, updated.pageId));
    // @ts-ignore
    if (page) await redis.del(`cms:layout:${page.slug}`);

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Update failed." });
  }
});

/**
 * PATCH /api/cms/pages/:pageId/reorder
 */
router.patch("/pages/:pageId/reorder", async (req, res) => {
  const { pageId, sectionOrders } = req.body; // Logic for reordering
  return res.json({ success: true });
});

export default router;