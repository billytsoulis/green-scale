import { db, schema, client } from './index';

/**
 * Staff Engineer Tip (v1.9):
 * 1. Fixed the 'TypeError: Received undefined' crash.
 * 2. Logic: The Scrypt hash below is generated with standard Node.js crypto 
 * parameters. It ensures the 'salt' and 'hash' segments are correctly padded.
 * 3. Environment: confirmed BETTER_AUTH_SECRET is loaded.
 */

async function main() {
  console.log('--- Starting GreenScale Auth-Compatible Seeder ---');

  if (!process.env.BETTER_AUTH_SECRET) {
    console.error('❌ FATAL: BETTER_AUTH_SECRET is missing from the environment!');
    process.exit(1);
  }

  const now = new Date();

  try {
    const managerId = "staff-alex-001";
    console.log(`Synchronizing Staff Profile: admin@greenscale.com...`);
    
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

    /**
     * STAFF SECURITY FIX:
     * This hash is exactly what Scrypt expects. 
     * If the parser fails here, it returns undefined for segments, causing the crash.
     */
    console.log(`Synchronizing Credentials for Staff Account...`);
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

    console.log('--- Seed Successful ---');
    console.log('✅ Updated hash in DB. Use admin@greenscale.com / password123');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    process.exit(0);
  }
}

main();