import { defineConfig } from 'vitest/config';

/**
 * API Gateway Testing Configuration
 * Path: apps/api-gateway/vite.config.ts
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Ensures environment variables are loaded during tests
    setupFiles: ['./src/test/setup.ts'],
  },
});