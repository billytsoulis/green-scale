/**
 * GreenScale Database Schema Index
 * Path: packages/database/schema.ts
 * * Refactored: Modularized into domain-specific files.
 * * This file re-exports everything to maintain compatibility with 
 * internal workspace imports and Drizzle migrations.
 */

export * from "./schema/enums";
export * from "./schema/auth";
export * from "./schema/cms";
export * from "./schema/business";
export * from "./schema/audit";
export * from "./schema/projects"