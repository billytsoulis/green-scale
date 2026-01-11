import { db } from "./index";
import { marketingPages, pageSections } from "./schema/cms";
import { eq, and } from "drizzle-orm";
import { aboutPageData } from "./cms/about-us.seed";

/**
 * GreenScale Modular CMS Seeding Logic - GS-17/18
 * Path: packages/database/seed-cms.ts
 * Purpose: Controller that synchronizes modular page data into the database.
 * Logic: Clears existing CMS records first to guarantee the order and integrity of new data.
 */

async function seed() {
  console.log("🌱 [CMS-SEED] Starting Modular Content Sync...");

  try {
    // --- 0. DATA CLEANUP (DROP RECORDS) ---
    // We explicitly clear the tables to ensure a fresh state.
    // Note: Deleting from marketingPages will cascade delete sections in a 
    // properly configured schema, but explicit deletion is safer for seeds.
    console.log("  > Clearing existing CMS records to ensure fresh sync...");
    await db.delete(pageSections);
    await db.delete(marketingPages);

    // --- 1. SYNC ABOUT US PAGE (Layer 1) ---
    console.log(`  > Creating Page: '${aboutPageData.slug}'`);
    
    const [pageRecord] = await db.insert(marketingPages).values({
      slug: aboutPageData.slug,
      title: aboutPageData.title,
      isNavItem: true,
      seoMetadata: aboutPageData.seo
    }).returning();

    // --- 2. SYNC SECTIONS (Layer 2 & 3) ---
    console.log(`  > Inserting ${aboutPageData.sections.length} ordered sections for '${aboutPageData.slug}'`);

    for (const section of aboutPageData.sections) {
      /**
       * Since we cleared the tables above, we perform a clean insert.
       * This guarantees that the orderIndex (1, 2, 3...) is preserved 
       * exactly as defined in the about-us.seed.ts file.
       */
      await db.insert(pageSections).values({
        pageId: pageRecord.id,
        type: section.type,
        orderIndex: section.orderIndex,
        contentEn: section.contentEn,
        contentEl: section.contentEl,
        isActive: true,
      });
    }

    console.log("✅ [CMS-SEED] Success: Database synchronized with fresh modular data.");
    
  } catch (error) {
    console.error("❌ [CMS-SEED] Seeding failed:");
    console.error(error);
    process.exit(1);
  } finally {
    // Close the process after completion
    process.exit(0);
  }
}

seed();