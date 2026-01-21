import { test, expect } from '@playwright/test';

/**
 * GreenScale Phase 4: Transactional Rebalance E2E
 * Path: apps/client-portal/e2e/rebalance.spec.ts
 * Purpose: Verifies the 5-step journey of the Ethical Pivot.
 */
// await emailInput.fill('test2@test.com');
// await passwordInput.fill('password123');

test.describe('Phase 4: Transactional Ledger & Rebalancing', () => {

  test('Should execute a full Ethical Pivot journey', async ({ page }) => {
    // 1. Extended Timeout for headless environments/compilation
    test.setTimeout(150000);

    console.log('🚀 [E2E] Step 1: Performing Automated Login...');
    
    // Navigate to login
    await page.goto('/en/login', { waitUntil: 'networkidle' });
    
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    try {
      await expect(emailInput).toBeVisible({ timeout: 30000 });
      console.log('📍 [E2E] Login inputs detected.');
      
      await emailInput.fill('test2@test.com');
      await passwordInput.fill('password123');

      /**
       * 2. Setup API Interception
       */
      console.log('📡 [E2E] Step 2: Configuring Mock Asset Ledger...');
      
      // A. Mock the Sync call to force a "Dirty" state (Score 55)
      // Using valid UUID formats to prevent DB driver crashes
      const MOCK_DIRTY_ID = "550e8400-e29b-41d4-a716-446655440000";
      const MOCK_CLEAN_ID = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

      await page.route('**/api/banking/sync', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            assets: [
              { id: MOCK_DIRTY_ID, name: "High-Carbon ETF", type: "ETF", value: "100000.00", esgScore: 20, sector: "Energy", status: "ACTIVE" },
              { id: MOCK_CLEAN_ID, name: "Solar Equity", type: "STOCK", value: "100000.00", esgScore: 90, sector: "Renewables", status: "ACTIVE" }
            ],
            summary: {
              totalValue: 200000,
              aggregateScore: 55,
              lastSync: new Date()
            }
          }),
        });
      });

      // B. Mock the Rebalance POST call
      // This ensures the test is deterministic and doesn't 500 if the IDs don't exist in the real DB
      await page.route('**/api/banking/rebalance', async (route) => {
        console.log('📡 [E2E] Intercepting Rebalance Execution...');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: "Rebalance committed to mock ledger." }),
        });
      });

      console.log('🔘 [E2E] Submitting Login...');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 60000 }),
        submitBtn.click()
      ]);

      console.log(`📍 [E2E] Landed on: ${page.url()}`);

      if (page.url().includes('onboarding/kyc')) {
        console.log('🔄 [E2E] Redirect detected: Moving from KYC to Dashboard...');
        await page.goto('/en/dashboard', { waitUntil: 'networkidle' });
      }

    } catch (err) {
      console.error('❌ [E2E] Step 1 Failure: Login or Navigation Timeout.', err);
      throw err;
    }

    console.log('✅ [E2E] Step 3: Session Established. Verifying Dashboard State...');

    // 3. Verification of "Dirty" State on Dashboard
    const rebalanceBtn = page.getByRole('button', { name: /Initiate Rebalance/i });
    await expect(rebalanceBtn).toBeVisible({ timeout: 30000 });
    await rebalanceBtn.click();

    // 4. Audit Page Verification (Ethical Delta)
    console.log('⚖️ [E2E] Step 4: Auditing Ethical Delta on Rebalance Page...');
    await expect(page).toHaveURL(/.*rebalance/);
    
    // Wait for the AI Engine loader to disappear
    const loader = page.locator('text=AI Optimization Engine Active');
    await expect(loader).not.toBeVisible({ timeout: 20000 });

    // Locate the container that holds the "Current" label and verify score
    const currentLabel = page.locator('p, div').filter({ hasText: /^Current$/ }).first();
    const currentBox = currentLabel.locator('..');

    // Diagnostic Log: Print everything found inside the current box to see the actual score
    const boxContent = await currentBox.innerText();
    console.log(`🔍 [DEBUG] Current Score Box Content: "${boxContent.replace(/\n/g, ' ')}"`);

    const scoreDisplay = currentBox.locator('.text-4xl');
    await expect(scoreDisplay).toHaveText('55', { timeout: 10000 });

    // 5. Execution Handshake (Network Interception)
    console.log('📡 [E2E] Step 5: Monitoring Transactional Handshake...');
    
    const rebalancePromise = page.waitForResponse(res => 
      res.url().includes('/api/banking/rebalance') && res.request().method() === 'POST',
      { timeout: 20000 }
    );

    await page.getByRole('button', { name: /Confirm Pivot/i }).click();

    const rebalanceRes = await rebalancePromise;
    expect(rebalanceRes.status()).toBe(200);
    console.log('✅ [E2E] Transaction confirmed by API.');

    // 6. Success State Verification
    console.log('✨ [E2E] Verifying Success Screen...');
    await expect(page.locator('text=Legacy Secured')).toBeVisible({ timeout: 15000 });

    // 7. Return to Cockpit
    console.log('🔄 [E2E] Step 7: Returning to Dashboard...');
    await page.getByRole('button', { name: /Return to Cockpit/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);

    console.log('✅ [E2E] Phase 4 Journey Successfully Validated.');
  });
});