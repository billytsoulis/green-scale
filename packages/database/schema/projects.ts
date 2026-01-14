import { pgTable, text, timestamp, uuid, integer, decimal, jsonb, pgEnum } from "drizzle-orm/pg-core";

/**
 * GreenScale Projects Schema
 * Path: packages/database/schema/projects.ts
 * Purpose: High-performance storage for sustainable investment opportunities.
 * Logic: Uses JSONB for localized content and financial status to allow schema flexibility.
 */

// 1. Define the project status enum
export const projectStatusEnum = pgEnum("project_status", [
  "DRAFT", 
  "ACTIVE", 
  "FULLY_FUNDED", 
  "COMPLETED"
]);

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(), // URL-friendly identifier
  status: projectStatusEnum("status").default("DRAFT").notNull(),
  category: text("category").notNull(), // e.g., 'Solar', 'Wind', 'Reforestation'
  
  // Financial & ESG Metrics
  targetIrr: decimal("target_irr", { precision: 5, scale: 2 }).notNull(),
  minInvestment: decimal("min_investment", { precision: 12, scale: 2 }).notNull(),
  esgScore: integer("esg_score").notNull().default(0), // 1-100 scale

  // Location Data (Stored as JSONB for lat/lng/city/country flexibility)
  location: jsonb("location").$type<{
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  }>().notNull(),

  // Localized Marketing Content (JSONB)
  contentEn: jsonb("content_en").$type<{
    title: string;
    description: string;
    impactSummary: string;
  }>().notNull(),

  contentEl: jsonb("content_el").$type<{
    title: string;
    description: string;
    impactSummary: string;
  }>().notNull(),

  // Media references (Array of Asset UUIDs or URLs)
  media: jsonb("media").$type<Array<{
    type: "IMAGE" | "VIDEO";
    url: string;
    isCover?: boolean;
  }>>().default([]),

  // Real-time Funding status
  fundingStatus: jsonb("funding_status").$type<{
    totalGoal: number;
    currentRaised: number;
    investorCount: number;
  }>().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});