import * as dotenv from "dotenv";
import path from "path";
import { vi, beforeAll } from "vitest";

/**
 * API Gateway Test Setup
 * Path: apps/api-gateway/src/test/setup.ts
 * * This file ensures that environment variables are loaded from the monorepo root
 * before any tests attempt to initialize the 'auth' or 'db' modules.
 */

beforeAll(() => {
  // Load .env from the root of the greenscale project
  const envPath = path.resolve(process.cwd(), "../../.env");
  dotenv.config({ path: envPath });

  // Force NODE_ENV to test to prevent the server from starting a real listen() 
  // call inside index.ts during the import process
  process.env.NODE_ENV = "test";

  // Provide fallbacks if the .env is missing locally
  if (!process.env.BETTER_AUTH_SECRET) {
    process.env.BETTER_AUTH_SECRET = "test_secret_for_vitest_runs";
  }
  
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://admin:password123@localhost:5432/greenscale";
  }
});