import { pgTable, text, timestamp, serial, index } from "drizzle-orm/pg-core";

/**
 * Hybrid CMS Content Schema
 * Path: packages/database/schema/cms.ts
 */

export const contentBlocks = pgTable("content_blocks", {
  id: serial("id").primaryKey(),
  pageId: text("page_id").notNull(), 
  sectionId: text("section_id").notNull(), 
  contentEn: text("content_en").notNull(),
  contentEl: text("content_el").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("cms_page_idx").on(table.pageId),
  index("cms_section_idx").on(table.sectionId),
]);