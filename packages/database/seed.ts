import { db, schema, client } from './index';

/**
 * Staff Engineer Tip:
 * We import { db, schema } from './index' instead of recreating them.
 * This ensures the seeder uses the exact same configuration, environment 
 * variables, and schema mappings as the main application.
 */

async function main() {
  console.log('--- Starting GreenScale Auth-Compatible Seeder ---');

  // Helper for dates
  const now = new Date();

  try {
    // 1. Seed Staff Member (Manager)
    const managerId = "staff-alex-001";
    console.log(`Creating Staff: admin@greenscale.com...`);
    
    await db.insert(schema.users).values({
      id: managerId,
      name: 'Alex Architect (Staff)',
      email: 'admin@greenscale.com',
      emailVerified: true,
      role: 'MANAGER',
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();

    // 2. Seed Investor (Client)
    const investorId = "investor-jordan-002";
    console.log(`Creating Investor: investor@example.com...`);

    await db.insert(schema.users).values({
      id: investorId,
      name: 'Jordan Green',
      email: 'investor@example.com',
      emailVerified: true,
      role: 'INVESTOR',
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();

    // 3. Seed a Portfolio for the Investor
    console.log(`Creating Portfolio for Jordan Green...`);
    const [portfolio] = await db.insert(schema.portfolios).values({
      userId: investorId,
      name: 'Main Sustainable Growth',
      totalValue: '125000.00',
      esgScore: '78.50',
      riskLevel: 'MEDIUM',
      createdAt: now,
    }).returning();

    // 4. Seed Initial Transactions
    console.log(`Adding transactions...`);
    await db.insert(schema.transactions).values([
      {
        portfolioId: portfolio.id,
        symbol: 'ORSTED.CO',
        type: 'BUY',
        quantity: '50.00',
        pricePerShare: '412.50',
        totalAmount: '20625.00',
      },
      {
        portfolioId: portfolio.id,
        symbol: 'VESTAS.CO',
        type: 'BUY',
        quantity: '25.00',
        pricePerShare: '195.00',
        totalAmount: '4875.00',
      }
    ]);

    // 5. Add ESG History
    console.log(`Adding ESG history...`);
    await db.insert(schema.esgHistory).values([
      { entityId: portfolio.id, score: '72.00', timestamp: now },
      { entityId: portfolio.id, score: '78.50', timestamp: now },
    ]);

    console.log('--- Seed Successful ---');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    // Cleanly close the connection pool
    await client.end();
    process.exit(0);
  }
}

main();