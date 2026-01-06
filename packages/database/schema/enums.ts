import { pgEnum } from "drizzle-orm/pg-core";

/**
 * GreenScale Global Enums
 * Path: packages/database/schema/enums.ts
 */

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "MANAGER", "ANALYST", "INVESTOR"]);
export const riskLevelEnum = pgEnum("risk_level", ["LOW", "MEDIUM", "HIGH"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["BUY", "SELL", "DIVIDEND", "TRANSFER"]);