/**
 * GreenScale E2E Smoke Test
 * Path: apps/client-portal/e2e/landing.spec.ts
 * Description: Verifies the landing page loads correctly.
 */

import { test, expect } from "@playwright/test";

/**
 * @ts-ignore - 'test' is globally available in Playwright runner
 */
test("should load the landing page and show the hero headline", async ({ page }) => {
  /**
   * @ts-ignore - page.goto navigates to our baseURL (localhost:3000)
   */
  await page.goto("/");
  
  /**
   * @ts-ignore - getByText finds elements by visible content
   */
  const headline = page.getByText(/Invest in the Future/i);
  
  /**
   * @ts-ignore - expect provides E2E assertions
   */
  await expect(headline).toBeVisible();
});

/**
 * @ts-ignore
 */
test("should display the ethical audit widget", async ({ page }) => {
  /**
   * @ts-ignore
   */
  await page.goto("/");
  
  /**
   * @ts-ignore - Locating the input by its placeholder text
   */
  const auditInput = page.getByPlaceholder(/What do you value most/i);
  
  /**
   * @ts-ignore
   */
  await expect(auditInput).toBeVisible();
});