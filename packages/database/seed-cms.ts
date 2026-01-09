import { db } from "./index";
import { contentBlocks } from "./schema/cms";
import { aboutBlocks } from "./cms/about-us.seed";

/**
 * GreenScale CMS Seeding Logic
 * Path: packages/database/seed-cms.ts
 * * Updated: Modularized to import page-specific content blocks.
 */

async function seed() {
  console.log("🌱 [CMS-SEED] Initializing Tier B content blocks...");

  // Aggregate all modular seeds here as we build them
  const allBlocks = [
    ...aboutBlocks,
    // ...homeBlocks,
    // ...pricingBlocks,
  ];

  try {
    for (const block of allBlocks) {
      /**
       * Upsert Logic:
       * Ensures that re-running the seed script updates existing values
       * instead of throwing unique constraint errors.
       */
      await db.insert(contentBlocks).values(block).onConflictDoUpdate({
        target: [contentBlocks.pageId, contentBlocks.sectionId],
        set: {
          contentEn: block.contentEn,
          contentEl: block.contentEl,
          updatedAt: new Date()
        }
      });
    }
    console.log(`✅ [CMS-SEED] Synchronized ${allBlocks.length} content blocks.`);
  } catch (error) {
    console.error("❌ [CMS-SEED] Synchronization failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();