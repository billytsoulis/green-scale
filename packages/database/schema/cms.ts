import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from "drizzle-orm/pg-core";

/**
 * Modular CMS Schema - GS-17 (Refined with JSONB)
 * Path: packages/database/schema/cms.ts
 * Logic: 
 * - marketingPages: High-level route definition.
 * - pageSections: Direct block-based storage using JSONB for content.
 * This replaces the sectionContent table for better scalability.
 */

// 1. Marketing Pages - The high-level route container
export const marketingPages = pgTable("marketing_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(), // e.g., "about-us"
  title: text("title").notNull(), // Administrative title
  seoMetadata: jsonb("seo_metadata").$type<{
    description?: string;
    keywords?: string[];
    ogImage?: string;
  }>().default({}),
  isNavItem: boolean("is_nav_item").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Page Sections - The layout orchestrator and data container
export const pageSections = pgTable("page_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("page_id").notNull().references(() => marketingPages.id, { onDelete: 'cascade' }),
  type: text("type").notNull(), // e.g., "HERO", "NARRATIVE", "TEAM_GRID"
  orderIndex: integer("order_index").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  
  /**
   * JSONB Content Storage
   * Each block type (Hero, Team, etc.) defines its own schema within these objects.
   * This allows "TEAM_GRID" to store an array of members while "HERO" stores a title/badge.
   */
  contentEn: jsonb("content_en").$type<any>().default({}).notNull(),
  contentEl: jsonb("content_el").$type<any>().default({}).notNull(),
  
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});