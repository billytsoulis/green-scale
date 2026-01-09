import { pgTable, text, timestamp, serial, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * Hybrid CMS Content Schema
 * Path: packages/database/schema/cms.ts
 * * Updated: Added a uniqueIndex on [pageId, sectionId].
 * * Requirement: This is mandatory for the 'onConflictDoUpdate' logic in seed scripts.
 */

export const contentBlocks = pgTable("content_blocks", {
  id: serial("id").primaryKey(),
  pageId: text("page_id").notNull(), 
  sectionId: text("section_id").notNull(), 
  contentEn: text("content_en").notNull(),
  contentEl: text("content_el").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  /**
   * The seed script uses 'onConflictDoUpdate' targeting these columns.
   * A Unique Index ensures the database can identify conflicts and update
   * instead of throwing duplicate key errors.
   */
  uniqueIndex("cms_page_section_unique_idx").on(table.pageId, table.sectionId),
]);