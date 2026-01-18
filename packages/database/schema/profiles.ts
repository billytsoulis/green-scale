import { pgTable, text, timestamp, uuid, integer, numeric, jsonb, pgEnum } from "drizzle-orm/pg-core";
// @ts-ignore - Importing base users from the modular auth schema
import { users } from "./auth"; 

/**
 * GreenScale Engineering Phase 1: Persistence Layer
 * Path: greenscale/packages/database/schema/profiles.ts
 * Purpose: Defines Investor Profiles, Assets, and Transactions in a modular structure.
 * Logic: Links domain-specific investor data to the core auth user table.
 */

// 1. KYC Status Enum for Onboarding tracking
export const kycStatusEnum = pgEnum("kyc_status", ["PENDING", "VERIFIED", "REJECTED"]);

// 2. User Profiles: 1-to-1 relationship with the 'user' table
// Stores investor-specific metadata without bloating the authentication schema.
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  // @ts-ignore - references the 'id' column (text) from auth.ts
  userId: text("user_id")
    .notNull()
    .unique() // Ensures a single profile per auth user
    .references(() => users.id, { onDelete: "cascade" }),
  
  // From Phase 1: Interactive Discovery
  valueIntent: text("value_intent"), 
  persona: text("persona"), // e.g., 'The Eco-Guardian', 'The Social Architect'
  
  // From Phase 4: Onboarding & KYC
  kycStatus: kycStatusEnum("kyc_status").default("PENDING"),
  kycStep: integer("kyc_step").default(1),
  annualNetWorth: text("annual_net_worth"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Linked Assets: Stores synchronized holdings from Phase 2
export const linkedAssets = pgTable("linked_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  // @ts-ignore - Links assets directly to the auth user
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  name: text("name").notNull(),
  type: text("type").notNull(), // STOCK, BOND, ETF, etc.
  value: numeric("value", { precision: 20, scale: 2 }).notNull(),
  esgScore: integer("esg_score").notNull(),
  sector: text("sector").notNull(),
  status: text("status").default("ACTIVE"), // ACTIVE or DIVESTED
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Rebalance Ledger: Records the "Ethical Pivot" history from Phase 3
export const rebalanceTransactions = pgTable("rebalance_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  // @ts-ignore
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  previousAggregateScore: integer("previous_score").notNull(),
  newAggregateScore: integer("new_score").notNull(),
  totalValuePivot: numeric("total_value", { precision: 20, scale: 2 }).notNull(),
  // JSON snapshot of the trades (Sells and Buys) for audit logs
  trades: jsonb("trades_snapshot").notNull(), 
  executedAt: timestamp("executed_at").defaultNow().notNull(),
});

/**
 * Technical Note: 
 * We keep this separate from 'auth.ts' to maintain 'Better-Auth' compatibility.
 * By using a 1-to-1 profile table, we can add as many domain-specific fields 
 * as needed (like ESG preferences) without affecting the core authentication logic.
 */