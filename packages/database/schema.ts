import { pgTable, serial, text, timestamp, numeric, uuid, pgEnum } from "drizzle-orm/pg-core";

// 1. Define Enums for Fintech Roles and ESG Risk
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "MANAGER", "ANALYST", "INVESTOR"]);
export const riskLevelEnum = pgEnum("risk_level", ["LOW", "MEDIUM", "HIGH"]);

// 2. Users Table (Staff & Clients)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").default("INVESTOR").notNull(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Holdings (Specific Stocks/Assets within a Portfolio)
export const holdings = pgTable("holdings", {
  id: uuid("id").primaryKey().defaultRandom(),
  portfolioId: uuid("portfolio_id").references(() => portfolios.id).notNull(),
  symbol: text("symbol").notNull(), // e.g., 'AAPL', 'TSLA'
  shares: numeric("shares", { precision: 20, scale: 6 }).notNull(),
  averagePrice: numeric("average_price", { precision: 20, scale: 2 }).notNull(),
  currentEsgRating: text("current_esg_rating"), // 'AAA', 'AA', 'B', etc.
});