import { pgTable, text, timestamp, numeric, uuid, index, serial } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { riskLevelEnum, transactionTypeEnum } from "./enums";

/**
 * Fintech Portfolio & Transaction Schema
 * Path: packages/database/schema/business.ts
 */

export const portfolios = pgTable("portfolios", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  totalValue: numeric("total_value", { precision: 20, scale: 2 }).default("0").notNull(),
  esgScore: numeric("esg_score", { precision: 5, scale: 2 }).default("0").notNull(),
  riskLevel: riskLevelEnum("risk_level").default("MEDIUM").notNull(),
  lastRebalanced: timestamp("last_rebalanced"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("portfolio_user_idx").on(table.userId),
]);

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  portfolioId: uuid("portfolio_id").references(() => portfolios.id).notNull(),
  symbol: text("symbol").notNull(),
  type: transactionTypeEnum("type").notNull(),
  quantity: numeric("quantity", { precision: 20, scale: 6 }).notNull(),
  pricePerShare: numeric("price_per_share", { precision: 20, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 20, scale: 2 }).notNull(),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
});

export const esgHistory = pgTable("esg_history", {
  id: serial("id").primaryKey(),
  entityId: text("entity_id").notNull(),
  score: numeric("score", { precision: 5, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => [
  index("entity_timestamp_idx").on(table.entityId, table.timestamp),
]);