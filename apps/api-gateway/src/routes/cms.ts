import { Router } from "express";
import pagesRouter from "./cms/pages";
import sectionsRouter from "./cms/sections";
import previewRouter from "./cms/preview";

/**
 * GreenScale CMS API Gateway (Modular Orchestrator)
 * Path: apps/api-gateway/src/routes/cms.ts
 * * Refactored: Routes are split into Pages, Sections, and Preview for GS-20.
 * * Updated: Explicitly typed 'router' to resolve portability issues.
 */

const router: Router = Router();

// --- Production Ready Route Integration ---
// @ts-ignore
router.use("/pages", pagesRouter);
// @ts-ignore
router.use("/sections", sectionsRouter);
// @ts-ignore
router.use("/preview", previewRouter);

// Delegate base routes to pages router
// @ts-ignore
router.use("/", pagesRouter);

export { router as cmsRouter };