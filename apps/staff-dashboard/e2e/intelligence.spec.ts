import { test, expect } from '@playwright/test';

/**
 * Institutional Intelligence Suite - Automated E2E Test Suite
 * Path: apps/staff-dashboard/e2e/intelligence.spec.ts
 * Purpose: Verifies navigation, Big Data rendering, and manual overrides.
 * Fix [GS-E2E-FINAL-STABILITY]: 
 * 1. Targeted specific header area for Hub record count.
 * 2. Refactored Forge commit assertion to handle dynamic accessible name changes.
 */

// --- TEST CONFIGURATION ---
test.use({ 
  baseURL: 'http://localhost:5173',
  actionTimeout: 15000,
  navigationTimeout: 30000 
});

const ML_STATS_MOCK = {
  total_indexed: 10000,
  anomalies: 142,
  drift_24h: 18,
  sync_state: "SYNCHRONIZED",
  last_updated: new Date().toISOString()
};

const TICKER_MOCK = {
  ticker: "AAPL",
  name: "Apple Inc.",
  sector: "Technology",
  market_cap: 2800.5,
  raw_score: 72,
  ai_adjusted_score: 85,
  anomaly_detected: false,
  last_audit: "2025-01-20",
  esg_trend: "UPWARD"
};

const AUTH_SESSION_MOCK = {
  user: {
    id: "admin-uuid",
    name: "Alex Architect",
    email: "admin@greenscale.com",
    role: "MANAGER"
  },
  session: {
    id: "session-uuid",
    expiresAt: new Date(Date.now() + 3600000).toISOString()
  }
};

test.describe('Institutional Intelligence Lifecycle', () => {
  
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    // 1. Mock Authentication Endpoints
    await page.route('**/api/auth/get-session', async (route) => {
      await route.fulfill({ status: 200, json: AUTH_SESSION_MOCK });
    });

    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 200, json: { success: true } });
    });

    // 2. Mock the ML Engine API Endpoints
    await page.route('**/ml/stats', async (route) => {
      await route.fulfill({ status: 200, json: ML_STATS_MOCK });
    });

    await page.route('**/ml/overview/sectors', async (route) => {
      await route.fulfill({ status: 200, json: [
        { name: "Technology", count: 2000, risk: 12.5 },
        { name: "Renewable Energy", count: 800, risk: 45.2 }
      ]});
    });

    await page.route('**/ml/overview/matrix', async (route) => {
      await route.fulfill({ status: 200, json: [
        { ticker: "AAPL", x: 2800, y: 85, z: 120, anomaly: false },
        { ticker: "XOM", x: 450, y: 32, z: 400, anomaly: true }
      ]});
    });

    await page.route('**/ml/search', async (route) => {
      await route.fulfill({ status: 200, json: { total: 1, hits: [TICKER_MOCK] }});
    });

    await page.route('**/ml/research/AAPL', async (route) => {
      await route.fulfill({ status: 200, json: TICKER_MOCK });
    });

    // 3. Navigate directly to the dashboard
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    
    // Fallback logic for login redirect
    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', 'admin@greenscale.com');
      await page.fill('input[type="password"]', 'admin123');
      await Promise.all([
        page.waitForURL('**/dashboard'),
        page.click('button[type="submit"]')
      ]);
    }

    // 4. Navigate to the Intelligence Hub entry point
    await page.goto('/intelligence', { waitUntil: 'networkidle' });
  });

  test('Hub: Should render all analytical tools and system health', async ({ page }) => {
    // Targeted the 'heading' specifically to avoid strict mode violations 
    await expect(page.getByRole('heading', { name: 'Market Overview' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ticker Discovery' })).toBeVisible();
    
    // Verify record count in the header section
    await expect(page.locator('header')).toContainText('10,000');
    
    // Check Intelligence Hub Footer state for synchronization status
    const footer = page.locator('footer');
    await expect(footer).toContainText('SYNCHRONIZED');
  });

  test('Overview: Should visualize sector risk and market matrix', async ({ page }) => {
    // Click the tool card specifically
    await page.getByRole('heading', { name: 'Market Overview' }).click();
    await expect(page).toHaveURL(/.*overview/);

    await expect(page.locator('[data-component="SectorHeatmap"]')).toBeVisible();
    await expect(page.locator('[data-component="MarketMatrix"]')).toBeVisible();
    
    // Verify Global Drift StatCard contains mock value (+18)
    await expect(page.getByText('+18')).toBeVisible();
  });

  test('Discovery: Should execute fuzzy-search and display results', async ({ page }) => {
    await page.getByRole('heading', { name: 'Ticker Discovery' }).click();
    await expect(page).toHaveURL(/.*search/);

    const searchInput = page.locator('input[placeholder*="Search by Ticker"]');
    await searchInput.fill('AAPL');

    const table = page.locator('[data-component="TickerDiscoveryTable"]');
    await expect(table).toContainText('Apple Inc.');
    await expect(table).toContainText('AAPL');
    
    await expect(table.locator('text=Stable')).toBeVisible();
  });

  test('Forge: Should allow manual ESG score adjustment', async ({ page }) => {
    await page.goto('/intelligence/forge/AAPL', { waitUntil: 'networkidle' });
    
    // 1. Verify Identity
    await expect(page.locator('h2')).toContainText('AAPL');
    await expect(page.locator('h2')).toContainText('Apple Inc.');

    // 2. Adjust Score
    const slider = page.locator('input[type="range"]');
    await expect(slider).toBeVisible();
    await slider.fill('90');
    
    // 3. Confirm the display updates to 90
    await expect(page.getByText('90')).toBeVisible();

    // 4. Trigger Commit
    // Logic: We target the button while it still has the "Commit" label
    const commitBtn = page.getByRole('button', { name: /Commit Certification/i });
    await commitBtn.click();
    
    /**
     * 5. Verify Transactional State
     * FIX: Once clicked, the button's accessible name changes to "Syncing...".
     * Instead of using the old 'commitBtn' locator (which is filtered by the old name),
     * we look for the button in its new state.
     */
    const syncingBtn = page.getByRole('button', { name: /Syncing/i });
    await expect(syncingBtn).toBeVisible({ timeout: 10000 });
    await expect(syncingBtn).toBeDisabled();
  });

});

// eof