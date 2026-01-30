import { pgTable, text, timestamp, jsonb, serial, uuid, integer } from "drizzle-orm/pg-core";
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

// 2. Phase 8: Institutional Intelligence Audit Ledger (New)
// Purpose: High-integrity tracking for ESG score overrides by staff to ensure regulatory compliance.
export const intelligenceAuditLogs = pgTable("intelligence_audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Ticker identifier for the entity being certified (e.g., 'AAPL')
  ticker: text("ticker").notNull(),
  
  // The Staff Member responsible for the manual override
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  
  // Scoring Delta for historical delta analysis and MLOps monitoring
  previousScore: integer("previous_score").notNull(),
  certifiedScore: integer("certified_score").notNull(),
  
  // Qualitative Justification (Institutional policy requires 20+ chars)
  commentary: text("commentary").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});