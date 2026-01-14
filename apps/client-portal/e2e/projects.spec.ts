import { test, expect } from '@playwright/test';

/**
 * Projects Directory E2E Diagnostics
 * Path: apps/client-portal/e2e/projects.spec.ts
 * Purpose: Reproduce and debug the category filtering visibility bug.
 * Update: Added enhanced console logging and state verification.
 */

const MOCK_PROJECTS = [
  {
    id: "1",
    slug: "solar-ark",
    category: "Renewable Energy",
    status: "ACTIVE",
    targetIrr: "8.5",
    minInvestment: "50000",
    esgScore: 94,
    contentEn: { title: "Solar Ark Messinia" },
    fundingStatus: { totalGoal: 1000000, currentRaised: 500000 }
  },
  {
    id: "2",
    slug: "aegean-wind",
    category: "Renewable Energy",
    status: "ACTIVE",
    targetIrr: "11.2",
    minInvestment: "100000",
    esgScore: 88,
    contentEn: { title: "Aegean Wind IV" },
    fundingStatus: { totalGoal: 2000000, currentRaised: 1000000 }
  }
];

test.describe('Projects Filtering Logic', () => {
  
  test.beforeEach(async ({ page }) => {
    // Intercept API calls to ensure consistent test data
    await page.route('**/api/projects', async (route) => {
      console.log(`[E2E] Intercepting fetch to: ${route.request().url()}`);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PROJECTS),
      });
    });

    // Navigate to the projects page
    await page.goto('/en/projects');
    
    // Explicitly wait for the loading spinner to be removed from DOM
    const loader = page.locator('text=Establishing Audit Session...');
    await expect(loader).not.toBeVisible({ timeout: 10000 });
  });

  test('should display all projects on initial load (ALL category)', async ({ page }) => {
    // Wait for the specific data attribute to appear
    const cards = page.locator('[data-project]');
    
    // Check internal state via logs if needed
    const count = await cards.count();
    console.log(`[E2E Debug] Initial load count: ${count}`);
    
    await expect(cards, 'Should find 2 project cards on initial load').toHaveCount(2);
  });

  test('should show empty state for categories with no matches', async ({ page }) => {
    // Click on Reforestation
    await page.click('text=Reforestation');
    
    // Use a locator that finds the empty state container
    const emptyState = page.locator('text=No active allocations currently available');
    await expect(emptyState).toBeVisible();
    
    const cards = page.locator('[data-project]');
    await expect(cards).toHaveCount(0);
  });

  test('should successfully restore visibility when switching back to a populated category', async ({ page }) => {
    // 1. Verify initial state
    await expect(page.locator('[data-project]')).toHaveCount(2);

    // 2. Switch to Reforestation (Expect 0)
    console.log('[E2E] Switching to Reforestation...');
    await page.click('text=Reforestation');
    await expect(page.locator('[data-project]')).toHaveCount(0);

    // 3. Switch back to Renewable Energy (Expect 2)
    console.log('[E2E] Switching back to Renewable Energy...');
    await page.click('text=Renewable Energy');
    
    const cards = page.locator('[data-project]');
    const count = await cards.count();
    console.log(`[E2E Debug] Count after switching back: ${count}`);
    
    await expect(cards, 'Visibility should be restored for Renewable Energy').toHaveCount(2);
  });

  test('should maintain correct results when clicking All Specialist Sectors', async ({ page }) => {
    await page.click('text=Reforestation');
    await expect(page.locator('[data-project]')).toHaveCount(0);
    
    console.log('[E2E] Clicking All Specialist Sectors...');
    await page.click('text=All Specialist Sectors');
    
    const cards = page.locator('[data-project]');
    await expect(cards).toHaveCount(2);
  });
});