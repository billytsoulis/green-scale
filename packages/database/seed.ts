import { db, schema, client } from './index';
import { contentBlocks } from "./schema/cms";
import { aboutBlocks } from "./cms/about-us.seed";

/**
 * GreenScale Master Seeder
 * Path: packages/database/seed.ts
 * Logic: 
 * 1. Synchronizes Auth (Users/Accounts)
 * 2. Synchronizes CMS Content (About Us, etc.) via Upsert
 */

async function main() {
  console.log('--- 🚀 Starting Master Seeder ---');

  if (!process.env.BETTER_AUTH_SECRET) {
    console.error('❌ FATAL: BETTER_AUTH_SECRET is missing!');
    process.exit(1);
  }

  const now = new Date();

  try {
    // --- 1. AUTH SEEDING ---
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

    // --- 2. CMS SEEDING ---
    console.log("🌱 [CMS] Synchronizing dynamic content blocks...");
    const allBlocks = [...aboutBlocks];

    for (const block of allBlocks) {
      await db.insert(contentBlocks).values(block).onConflictDoUpdate({
        target: [contentBlocks.pageId, contentBlocks.sectionId],
        set: {
          contentEn: block.contentEn,
          contentEl: block.contentEl,
          updatedAt: now
        }
      });
    }

    console.log(`✅ Success: Auth and ${allBlocks.length} CMS blocks synchronized.`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    process.exit(0);
  }
}

main();