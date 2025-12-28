import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as dotenv from "dotenv";

// 1. Load the environment variables from the monorepo root
// This ensures we pull the DATABASE_URL from your central .env file
dotenv.config({ path: "../../.env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in the .env file at the root");
}

/**
 * Staff Engineer Tip:
 * We export 'client' and 'db' here so that all scripts (like our test-read.ts)
 * and future API routes share the same connection pool and configuration.
 */
export const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Export the schema for relational queries (db.query.users...)
export * from "./schema";

// --- INFERRED TYPES FOR WORKSPACE USAGE ---
// These allow the Frontend and Backend to share exactly the same data structures
export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

export type Portfolio = InferSelectModel<typeof schema.portfolios>;
export type NewPortfolio = InferInsertModel<typeof schema.portfolios>;

export type Transaction = InferSelectModel<typeof schema.transactions>;
export type NewTransaction = InferInsertModel<typeof schema.transactions>;

export type ESGHistory = InferSelectModel<typeof schema.esgHistory>;
export type AuditLog = InferSelectModel<typeof schema.auditLogs>;