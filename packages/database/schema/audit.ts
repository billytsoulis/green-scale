import { pgTable, text, timestamp, jsonb, serial } from "drizzle-orm/pg-core";
import { users } from "./auth";

/**
 * System Audit Logs
 * Path: packages/database/schema/audit.ts
 */

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  staffId: text("staff_id").references(() => users.id),
  action: text("action").notNull(),
  targetId: text("target_id"),
  changes: jsonb("changes"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});