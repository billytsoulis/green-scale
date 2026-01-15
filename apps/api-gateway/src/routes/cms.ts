import { Router } from "express";
// @ts-ignore
import pagesRouter from "./cms/pages";
// @ts-ignore
import sectionsRouter from "./cms/sections";
// @ts-ignore
import previewRouter from "./cms/preview";

/**
 * GreenScale CMS API Gateway (Modular Orchestrator)
 * Path: apps/api-gateway/src/routes/cms.ts
 * Fix: Re-established root-level delegation to resolve path mismatches.
 */

const router: Router = Router();

// --- Production Ready Route Integration ---

// 1. Pages Routing (e.g., /api/cms/pages)
// @ts-ignore
router.use("/pages", pagesRouter);

// 2. Sections Routing (Explicit Prefix)
/**
 * GS-25 Fix: Mount sectionsRouter at /sections so that calls like 
 * GET /api/cms/sections/:sectionId from the block editors work correctly.
 */
// @ts-ignore
router.use("/sections", sectionsRouter);

// 3. Sections/Pages Integration (Root Level)
/**
 * Note: We also keep sectionsRouter at root ("/") because it contains 
 * specific routes starting with "/pages" (e.g., POST /pages/:pageId/sections) 
 * to match the API structure expected by LayoutCanvas.tsx.
 */
// @ts-ignore
router.use("/", sectionsRouter);

// 4. Preview Routing (e.g., /api/cms/preview)
// @ts-ignore
router.use("/preview", previewRouter);

// 5. Fallback Root Delegation
// @ts-ignore
router.use("/", pagesRouter);

export { router as cmsRouter };