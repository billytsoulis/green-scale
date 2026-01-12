import { Router } from "express";
import redis from "../../lib/redis";

/**
 * CMS Preview Module (Live Sync)
 * Path: apps/api-gateway/src/routes/cms/preview.ts
 * Logic: Handles transient state (Redis) and Socket broadcasting.
 */

const router: Router = Router();

// @ts-ignore
// const redis = {};

/**
 * GET /api/cms/preview/:previewId (Handshake)
 */
router.get("/:previewId", async (req, res) => {
  const { previewId } = req.params;
  try {
    // @ts-ignore
    const cached = await redis.get(`cms:preview:${previewId}`);
    if (!cached) return res.status(404).json({ error: "Session expired." });
    return res.json(JSON.parse(cached));
  } catch (error) {
    return res.status(500).json({ error: "Handshake failed." });
  }
});

/**
 * PATCH /api/cms/preview/:previewId (Sync Emitter)
 */
router.patch("/:previewId", async (req, res) => {
  const { previewId } = req.params;
  const { contentEn, contentEl, type } = req.body;

  try {
    const payload = { contentEn, contentEl, type, updatedAt: new Date() };
    // @ts-ignore
    await redis.set(`cms:preview:${previewId}`, JSON.stringify(payload), "EX", 600);

    // @ts-ignore
    const io = req.io;
    if (io) io.to(`preview-${previewId}`).emit("portal:preview-sync", payload);

    return res.json({ success: true, transient: true });
  } catch (error) {
    return res.status(500).json({ error: "Sync failed." });
  }
});

export default router;