import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as dotenv from "dotenv";

/**
 * GreenScale Database Package
 * Shared Drizzle ORM instance and type definitions.
 */

// Load environment variables from the monorepo root
dotenv.config({ path: "../../.env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in the .env file at the root");
}

/**
 * Staff Engineer Tip:
 * We export 'client', 'db', and 'schema' here. 
 * Exporting 'schema' as a named export allows scripts and the API Gateway
 * to utilize relational queries and adapter mappings with full type safety.
 */
export const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Export the schema object itself and all its members
export { schema };
export * from "./schema";

// Auth (Identity)
export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

// Business (Legacy Wealth Management)
export type Portfolio = InferSelectModel<typeof schema.portfolios>;
export type NewPortfolio = InferInsertModel<typeof schema.portfolios>;
export type Transaction = InferSelectModel<typeof schema.transactions>;
export type NewTransaction = InferInsertModel<typeof schema.transactions>;
export type ESGHistory = InferSelectModel<typeof schema.esgHistory>;

// Intelligence & Governance (Phase 8 Audit Trail)
export type AuditLog = InferSelectModel<typeof schema.auditLogs>;
export type IntelligenceAuditLog = InferSelectModel<typeof schema.intelligenceAuditLogs>;
export type NewIntelligenceAuditLog = InferInsertModel<typeof schema.intelligenceAuditLogs>;

// Projects & CMS (Phase 6 & GS-17 Media)
export type Project = InferSelectModel<typeof schema.projects>;
export type NewProject = InferInsertModel<typeof schema.projects>;
/**
 * MediaAsset Type
 * This is now possible because of the export you selected in the Canvas.
 */
export type MediaAsset = InferSelectModel<typeof schema.mediaAssets>;
export type NewMediaAsset = InferInsertModel<typeof schema.mediaAssets>;

// Profiles & Assets (Investor Discovery Persistence)
export type UserProfile = InferSelectModel<typeof schema.userProfiles>;
export type LinkedAsset = InferSelectModel<typeof schema.linkedAssets>;
export type RebalanceTransaction = InferSelectModel<typeof schema.rebalanceTransactions>;