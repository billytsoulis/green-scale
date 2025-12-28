import { pgTable, serial, text, timestamp, numeric, uuid, pgEnum, jsonb, index } from "drizzle-orm/pg-core";

// 1. Define Enums for Fintech Roles and ESG Risk
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "MANAGER", "ANALYST", "INVESTOR"]);
export const riskLevelEnum = pgEnum("risk_level", ["LOW", "MEDIUM", "HIGH"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["BUY", "SELL", "DIVIDEND", "TRANSFER"]);

// 2. Users Table (Staff & Clients)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").default("INVESTOR").notNull(),
  metadata: jsonb("metadata"), // For flexible KYC / Profile data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Investment Portfolios
export const portfolios = pgTable("portfolios", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  totalValue: numeric("total_value", { precision: 20, scale: 2 }).default("0").notNull(),
  esgScore: numeric("esg_score", { precision: 5, scale: 2 }).default("0").notNull(),
  riskLevel: riskLevelEnum("risk_level").default("MEDIUM").notNull(),
  lastRebalanced: timestamp("last_rebalanced"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIndex: index("portfolio_user_idx").on(table.userId),
}));

// 4. Transactions (Financial Audit Trail)
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

// 5. ESG History (Time-series data for Analytics)
export const esgHistory = pgTable("esg_history", {
  id: serial("id").primaryKey(),
  entityId: text("entity_id").notNull(), // Symbol or Portfolio ID
  score: numeric("score", { precision: 5, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => ({
  entityTimestampIdx: index("entity_timestamp_idx").on(table.entityId, table.timestamp),
}));

// 6. Audit Logs (Compliance Requirement)
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  staffId: uuid("staff_id").references(() => users.id),
  action: text("action").notNull(),
  targetId: text("target_id"),
  changes: jsonb("changes"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});