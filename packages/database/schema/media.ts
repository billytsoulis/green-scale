import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

/**
 * Media Gallery Schema - GS-17
 * Path: packages/database/schema/media.ts
 * Logic: Centralized asset management for all CMS blocks.
 */

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // Friendly name for searching
  url: text("url").notNull(), // Cloudfront/S3/Public URL
  altEn: text("alt_en").notNull(), // Essential for SEO/Accessibility
  altEl: text("alt_el").notNull(),
  mimeType: text("mime_type").notNull(), // image/webp, image/png
  width: integer("width"),
  height: integer("height"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});