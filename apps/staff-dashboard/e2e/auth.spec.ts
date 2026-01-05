/**
 * Path: apps/staff-dashboard/e2e/auth.spec.ts
 * Description: Verifies the admin login interface is functional.
 * Optimized for GreenScale brand tokens and AuthLayout patterns.
 */

import { test, expect } from "@playwright/test";

/**
 * @ts-ignore - 'test' and 'expect' are globally available in the Playwright runner.
 */
test("should load the staff login page", async ({ page }) => {
  /**
   * @ts-ignore - Navigate to the staff dashboard root (port 3001)
   */
  await page.goto("/");
  
  /**
   * @ts-ignore - Searching for our actual brand heading and branding
   */
  const heading = page.getByText(/Welcome Back/i).or(page.getByText(/GreenScale/i));
  
  /**
   * @ts-ignore
   */
  await expect(heading).toBeVisible();
});