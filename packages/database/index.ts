import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as dotenv from "dotenv";

// 1. Load the environment variables from the monorepo root
dotenv.config({ path: "../../.env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in the .env file at the root");
}

/**
 * Staff Engineer Tip:
 * We export 'client', 'db', and 'schema' here. 
 * Exporting 'schema' as a named export allows scripts like our seeder
 * to use relational queries (db.query.users...) with full type safety.
 */
export const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Export the schema object itself and all its members
export { schema };
export * from "./schema";

// --- INFERRED TYPES FOR WORKSPACE USAGE ---
export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

export type Portfolio = InferSelectModel<typeof schema.portfolios>;
export type NewPortfolio = InferInsertModel<typeof schema.portfolios>;

export type Transaction = InferSelectModel<typeof schema.transactions>;
export type NewTransaction = InferInsertModel<typeof schema.transactions>;

export type ESGHistory = InferSelectModel<typeof schema.esgHistory>;
export type AuditLog = InferSelectModel<typeof schema.auditLogs>;