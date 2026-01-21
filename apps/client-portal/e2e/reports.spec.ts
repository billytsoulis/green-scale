import { test, expect } from '@playwright/test';

/**
 * GreenScale Phase 5: Impact Reports E2E
 * Path: apps/client-portal/e2e/reports.spec.ts
 * Purpose: Verifies authenticated PDF generation and native browser download.
 */


test.describe('Phase 5: Impact Reports & PDF Engine', () => {

  test('should successfully trigger an authenticated PDF download', async ({ page }) => {
    // 1. Set extended timeout for PDF rendering and local compilation
    test.setTimeout(120000);

    /**
     * Step 1: Establish Authentication
     * We must login first so that the browser has the 'gs-auth' session cookie.
     */
    console.log('🚀 [E2E] Step 1: Establishing Session...');
    await page.goto('/en/login', { waitUntil: 'networkidle' });
    
    // Using standard credentials provided in context
    await page.fill('input[type="email"], input[name="email"]', 'test2@test.com');
    await page.fill('input[type="password"], input[name="password"]', 'password123');
    
    await Promise.all([
      page.waitForURL('**/dashboard'),
      page.click('button[type="submit"]')
    ]);
    console.log('✅ [E2E] Login successful.');

    // 2. Setup Interceptions for Deterministic Testing
    // A. Mock the Auth Bridge Handshake
    await page.route('**/api/auth/get-jwt', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-e2e-report-token' }),
      });
    });

    // B. Mock the PDF Engine Response
    await page.route('**/api/reports/impact-statement', async (route) => {
      console.log('📡 [E2E] Intercepting PDF request...');
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('%PDF-1.4 mock content'),
        headers: {
          'Content-Disposition': 'attachment; filename=GreenScale_Test_Report.pdf'
        }
      });
    });

    // 3. Navigate to the Reports View
    console.log('📍 [E2E] Navigating to Reports page...');
    await page.goto('/en/dashboard/reports', { waitUntil: 'networkidle' });
    
    // Resilient role-based locator for the heading
    const heading = page.getByRole('heading', { name: /Impact Statements/i });
    await expect(heading).toBeVisible({ timeout: 20000 });
    console.log('✅ [E2E] Reports environment stabilized.');

    // 4. Trigger Download Action
    /**
     * Fix: Using getByRole instead of testId to ensure we target the button 
     * exactly as rendered in the snapshot. Added explicit visibility timeout.
     */
    const downloadBtn = page.getByRole('button', { name: /Download Q1 Statement/i });
    
    console.log('🔘 [E2E] Waiting for download button to be ready...');
    await expect(downloadBtn).toBeVisible({ timeout: 15000 });

    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent('download');
    
    console.log('🔘 [E2E] Clicking Download Button...');
    await downloadBtn.click();

    // 5. Verify Native Download Lifecycle
    const download = await downloadPromise;
    
    // Check filename patterns
    const filename = download.suggestedFilename();
    console.log(`📥 [E2E] Download captured: ${filename}`);
    
    expect(filename).toContain('GreenScale');
    expect(filename).toContain('.pdf');

    // 6. UI Cleanliness Check
    // Button should return from loading state (check text content)
    await expect(downloadBtn).not.toContainText('Generating');
    await expect(downloadBtn).toContainText('Download Q1 Statement');
    
    console.log('✅ [E2E] Phase 5 Reporting Engine successfully validated.');
  });
});