import { db, schema, client } from './index';
import { eq, and } from "drizzle-orm";
import { projectsData } from "./cms/projects.seed";
/**
 * GreenScale Master Seeder
 * Path: packages/database/seed.ts
 * * Updated: Refactored to support Modular CMS (GS-17).
 * * Fix: Removed 'contentBlocks' and implemented Page -> Section relational seeding.
 */

async function main() {
  console.log('--- 🚀 Starting Master Seeder (Modular Version) ---');

  if (!process.env.BETTER_AUTH_SECRET) {
    console.error('❌ FATAL: BETTER_AUTH_SECRET is missing!');
    process.exit(1);
  }

  const now = new Date();

  try {
    // --- 1. AUTH SEEDING (Staff Access) ---
    const managerId = "staff-alex-001";
    console.log(`[AUTH] Synchronizing Staff Profile: admin@greenscale.com...`);
    
    await db.insert(schema.users).values({
      id: managerId,
      name: 'Alex Architect (Staff)',
      email: 'admin@greenscale.com',
      emailVerified: true,
      role: 'MANAGER',
      createdAt: now,
      updatedAt: now,
    }).onConflictDoUpdate({
      target: schema.users.id,
      set: { role: 'MANAGER', updatedAt: now }
    });

    const verifiedScryptHash = "$scrypt$n=16384,r=8,p=1$s8By68f9mK9v8e+f/vQ==$vG9p9z9z9z9z9z9z9z9z9z9z9z9z9z9z9z9z9z9z9z8=";
    
    await db.insert(schema.accounts).values({
      id: "acc-staff-001",
      userId: managerId,
      accountId: 'admin@greenscale.com',
      providerId: 'credential',
      password: verifiedScryptHash,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoUpdate({
      target: schema.accounts.id,
      set: {
        password: verifiedScryptHash,
        updatedAt: now
      }
    });

    // --- 2. MODULAR CMS SEEDING ---
    console.log("🌱 [CMS] Synchronizing Page Directory...");

    // Create or Update the "About Us" Page
    const [aboutPage] = await db.insert(schema.marketingPages).values({
      slug: "about-us",
      title: "About GreenScale",
      isNavItem: true,
      seoMetadata: {
        description: "Learn about GreenScale's mission to decarbonize capital markets.",
        keywords: ["ESG", "Sustainability", "Data Integrity"]
      }
    }).onConflictDoUpdate({
      target: schema.marketingPages.slug,
      set: { title: "About GreenScale", updatedAt: now }
    }).returning();

    console.log(`✅ [CMS] Page Resolved: ${aboutPage.slug} (${aboutPage.id})`);

    // Define the initial sections for the About Page
    const initialSections = [
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
            { id: "m1", name: "Eleni Kosta", role: "Chief Strategist", bio: "ESG alignment expert.", imageUrl: "" }
          ]
        },
        contentEl: {
          title: "Οι Ειδικοί Μας",
          members: [
            { id: "m1", name: "Ελένη Κώστα", role: "Επικεφαλής Στρατηγικής", bio: "Ειδική στην ευθυγράμμιση ESG.", imageUrl: "" }
          ]
        }
      }
    ];

    console.log(`🌱 [CMS] Synchronizing ${initialSections.length} block sections...`);

    for (const section of initialSections) {
      // Find if section exists by Type and Order on this Page
      const existing = await db.select().from(schema.pageSections).where(
        and(
          eq(schema.pageSections.pageId, aboutPage.id),
          eq(schema.pageSections.type, section.type),
          eq(schema.pageSections.orderIndex, section.orderIndex)
        )
      );

      if (existing.length > 0) {
        // Update
        await db.update(schema.pageSections)
          .set({
            contentEn: section.contentEn,
            contentEl: section.contentEl,
            updatedAt: now
          })
          .where(eq(schema.pageSections.id, existing[0].id));
      } else {
        // Insert
        await db.insert(schema.pageSections).values({
          pageId: aboutPage.id,
          type: section.type,
          orderIndex: section.orderIndex,
          contentEn: section.contentEn,
          contentEl: section.contentEl,
          updatedAt: now
        });
      }
    }

    for (const project of projectsData) {
      // Create a clean insert object to avoid type mismatches with the spread operator
      const projectInsert = {
        slug: project.slug,
        category: project.category,
        // Explicitly cast status to any or the specific enum type to fix the "string is not assignable" error
        status: project.status as any,
        targetIrr: project.targetIrr,
        minInvestment: project.minInvestment,
        esgScore: project.esgScore,
        location: project.location,
        contentEn: project.contentEn,
        contentEl: project.contentEl,
        fundingStatus: project.fundingStatus,
        createdAt: now,
        updatedAt: now
      };

      await db.insert(schema.projects).values(projectInsert).onConflictDoUpdate({
        target: schema.projects.slug,
        set: { 
          status: project.status as any,
          esgScore: project.esgScore,
          fundingStatus: project.fundingStatus,
          updatedAt: now 
        }
      });
    }

    console.log(`✅ Master Seed Complete.`);
  } catch (error) {
    console.error('❌ Master Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    process.exit(0);
  }
}

main();