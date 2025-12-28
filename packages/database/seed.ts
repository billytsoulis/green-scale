import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';

// 1. Load the environment variables from the monorepo root
// This ensures we connect to the correct Docker Postgres instance
dotenv.config({ path: '../../.env' });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing for seeding. Check your .env file at the root.");
}

const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle(queryClient, { schema });

async function main() {
  console.log('--- Starting GreenScale Staff-Level Seeder ---');

  // 2. Seed Staff Member (The Manager who uses the Staff Dashboard)
  // This user will be used to demonstrate the internal administrative side.
  const [manager] = await db.insert(schema.users).values({
    email: 'admin@greenscale.com',
    fullName: 'Alex Architect (Staff)',
    role: 'MANAGER',
  }).returning();

  // 3. Seed Investor (The Client who uses the Client Portal)
  // This user will be used to demonstrate the Next.js investor experience.
  const [investor] = await db.insert(schema.users).values({
    email: 'investor@example.com',
    fullName: 'Jordan Green',
    role: 'INVESTOR',
  }).returning();

  // 4. Seed a Portfolio for the Investor
  // We initialize this with a specific ESG score to test our dashboard charts.
  const [portfolio] = await db.insert(schema.portfolios).values({
    userId: investor.id,
    name: 'Main Sustainable Growth',
    totalValue: '125000.00',
    esgScore: '78.50',
    riskLevel: 'MEDIUM',
  }).returning();

  // 5. Seed Initial Transactions (Buy some ESG Leaders)
  // These represent the historical audit trail an interviewer would expect to see.
  await db.insert(schema.transactions).values([
    {
      portfolioId: portfolio.id,
      symbol: 'ORSTED.CO', // Orsted: Global leader in offshore wind
      type: 'BUY',
      quantity: '50.00',
      pricePerShare: '412.50',
      totalAmount: '20625.00',
    },
    {
      portfolioId: portfolio.id,
      symbol: 'VESTAS.CO', // Vestas: Wind turbine manufacturer
      type: 'BUY',
      quantity: '25.00',
      pricePerShare: '195.00',
      totalAmount: '4875.00',
    },
    {
      portfolioId: portfolio.id,
      symbol: 'TSLA', // Tesla: Electric Vehicles
      type: 'BUY',
      quantity: '10.00',
      pricePerShare: '180.00',
      totalAmount: '1800.00',
    }
  ]);

  // 6. Add ESG History points
  // This allows us to render line charts showing "Impact Over Time"
  await db.insert(schema.esgHistory).values([
    { entityId: portfolio.id, score: '72.00' },
    { entityId: portfolio.id, score: '75.50' },
    { entityId: portfolio.id, score: '78.50' },
  ]);

  console.log('--- Seed Successful ---');
  console.log(`Created Manager: ${manager.email}`);
  console.log(`Created Investor: ${investor.email}`);
  console.log(`Created Portfolio: ${portfolio.name} with 3 transactions.`);
  
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});