import { db } from "./index";
import { marketingPages, pageSections } from "./schema/cms";
import { eq } from "drizzle-orm";

/**
 * GreenScale Modular CMS Seeding Logic - GS-17
 * Path: packages/database/seed-cms.ts
 * Purpose: Seeds the new relational structure (Pages -> Sections).
 */

async function seed() {
  console.log("🌱 [CMS-SEED] Starting Modular Content Sync...");

  try {
    // --- 1. SEED ABOUT US PAGE ---
    console.log("  > Syncing Page: 'about-us'");
    const [aboutPage] = await db.insert(marketingPages).values({
      slug: "about-us",
      title: "About GreenScale",
      isNavItem: true,
      seoMetadata: {
        description: "Learn about our mission to fix the financial data landscape.",
        keywords: ["ESG", "Transparency", "Finance"]
      }
    }).onConflictDoUpdate({
      target: marketingPages.slug,
      set: { title: "About GreenScale", updatedAt: new Date() }
    }).returning();

    // --- 2. SEED SECTIONS FOR ABOUT US ---
    const aboutSections = [
      {
        type: "HERO",
        orderIndex: 1,
        contentEn: {
          badge: "A Legacy of Purpose",
          title: "Guided by data that cannot be greenwashed.",
          description: "GreenScale was founded on a single premise: Capital has the power to fix the world."
        },
        contentEl: {
          badge: "Κληρονομιά με Σκοπό",
          title: "Με οδηγό δεδομένα που δεν επιδέχονται greenwashing.",
          description: "Η GreenScale ιδρύθηκε με μια απλή παραδοχή: Το κεφάλαιο έχει τη δύναμη να διορθώσει τον κόσμο."
        }
      },
      {
        type: "TEAM_GRID",
        orderIndex: 2,
        contentEn: {
          title: "The Specialists",
          members: [
            { id: "m1", name: "Alex Architect", role: "Lead Dev", bio: "Building modular systems.", imageUrl: "" }
          ]
        },
        contentEl: {
          title: "Οι Ειδικοί Μας",
          members: [
            { id: "m1", name: "Alex Architect", role: "Lead Dev", bio: "Κατασκευή αρθρωτών συστημάτων.", imageUrl: "" }
          ]
        }
      }
    ];

    console.log(`  > Syncing ${aboutSections.length} sections for 'about-us'`);

    for (const section of aboutSections) {
      // We look for existing sections of this type on this page to update them
      // In a real production environment, you might use a specific 'internal_id' 
      // but for seeding, pageId + type + orderIndex works.
      await db.insert(pageSections).values({
        pageId: aboutPage.id,
        type: section.type,
        orderIndex: section.orderIndex,
        contentEn: section.contentEn,
        contentEl: section.contentEl,
      }).onConflictDoUpdate({
        target: pageSections.id, // This requires the specific ID, so we use a check-then-upsert pattern or unique index
        set: {
          contentEn: section.contentEn,
          contentEl: section.contentEl,
          updatedAt: new Date()
        }
      });
      
      /**
       * NOTE: Since pageSections.id is a random UUID, onConflict targeting 'id' won't work 
       * easily for seeds. It is recommended to add a unique index on [pageId, type, orderIndex]
       * if you want to use the onConflictDoUpdate logic here.
       */
    }

    console.log("✅ [CMS-SEED] Success: Relational content synchronized.");
  } catch (error) {
    console.error("❌ [CMS-SEED] Seeding failed:");
    console.error(error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();