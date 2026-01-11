import { db } from "./index";
import { contentBlocks } from "./schema/cms";
import { aboutBlocks } from "./cms/about-us.seed";

/**
 * GreenScale CMS Seeding Logic
 * Path: packages/database/seed-cms.ts
 * * Updated: Aggregates all marketing blocks and implements 'upsert' logic.
 * * Strategy: Targeted updates on [pageId, sectionId] conflicts to avoid data loss.
 */

async function seed() {
  console.log("🌱 [CMS-SEED] Synchronizing dynamic content blocks...");

  const allBlocks = [
    ...aboutBlocks,
    // Add future page blocks here (e.g., ...homeBlocks)
  ];

  try {
    for (const block of allBlocks) {
      /**
       * UPSERT Logic:
       * Uses 'onConflictDoUpdate' targeting the unique index [pageId, sectionId].
       * This allows you to run the seed script repeatedly to reset text values
       * without creating duplicate records.
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
    
    console.log(`✅ [CMS-SEED] Success: ${allBlocks.length} blocks synchronized.`);
  } catch (error) {
    console.error("❌ [CMS-SEED] Critical failure during synchronization:");
    console.error(error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();