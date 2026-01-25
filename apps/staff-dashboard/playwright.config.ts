/**
 * Path: apps/staff-dashboard/playwright.config.ts
 * Description: E2E configuration for the Staff Administrative Portal.
 * Fix: Explicitly imported process from 'node:process' to resolve type errors 
 * and updated port to 5173 to match the Vite dev environment.
 */
/// <reference types="@playwright/test" />
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  /* Using static values for local development to bypass environment variable resolution issues. */
  forbidOnly: false,
  retries: 0,
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    /* Set to true for local stability since we aren't relying on CI flags */
    reuseExistingServer: true,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 120 * 1000,
  },
});

// eof