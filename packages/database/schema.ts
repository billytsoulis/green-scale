import { pgTable, serial, text, timestamp, numeric, uuid, pgEnum, jsonb, index, boolean } from "drizzle-orm/pg-core";

// --- EXISTING FINTECH ENUMS ---
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "MANAGER", "ANALYST", "INVESTOR"]);
export const riskLevelEnum = pgEnum("risk_level", ["LOW", "MEDIUM", "HIGH"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["BUY", "SELL", "DIVIDEND", "TRANSFER"]);

// --- AUTHENTICATION TABLES (Better-Auth Standard) ---

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  // Custom GreenScale Field: Role-Based Access
  role: userRoleEnum("role").default("INVESTOR").notNull(),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// --- FINTECH BUSINESS TABLES (Updated with String IDs for Auth Sync) ---

export const portfolios = pgTable("portfolios", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  totalValue: numeric("total_value", { precision: 20, scale: 2 }).default("0").notNull(),
  esgScore: numeric("esg_score", { precision: 5, scale: 2 }).default("0").notNull(),
  riskLevel: riskLevelEnum("risk_level").default("MEDIUM").notNull(),
  lastRebalanced: timestamp("last_rebalanced"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIndex: index("portfolio_user_idx").on(table.userId),
}));

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
}, (table) => ({
  entityTimestampIdx: index("entity_timestamp_idx").on(table.entityId, table.timestamp),
}));

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  staffId: text("staff_id").references(() => users.id),
  action: text("action").notNull(),
  targetId: text("target_id"),
  changes: jsonb("changes"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});