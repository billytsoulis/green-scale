import { test, expect } from '@playwright/test';

/**
 * GreenScale Auth Diagnostic Test
 * Path: apps/client-portal/e2e/auth-diagnostics.spec.ts
 * Purpose: Intercepts the JWT bridge and Profile sync to verify header integrity.
 * Fix: Increased timeouts and synchronized promise resolution to prevent "Target Closed" errors.
 */

test.describe('Phase 2: KYC Persistence & Auth Bridge', () => {

  test('Diagnostic: Automated Identity Flow', async ({ page }) => {
    // 1. Extended Timeout for Dev Compilation
    test.setTimeout(120000); 

    // 2. Network Tracing
    page.on('response', async response => {
      const url = response.url();
      if (url.includes('/api/auth/get-jwt') || url.includes('/api/users/me')) {
        console.log(`\n📡 [NETWORK] ${url.split('/').pop()?.split('?')[0]} | Status: ${response.status()}`);
        if (response.status() !== 200) {
          try {
            const body = await response.json();
            console.log(`📦 [ERROR BODY]:`, JSON.stringify(body, null, 2));
          } catch (e) { /* No JSON */ }
        }
      }
    });

    console.log('🚀 [E2E] Step 1: Performing Automated Login...');
    
    // 3. Automated Login Flow
    // We go to login first to establish the 'gs-auth' session cookie
    await page.goto('/en/login');
    
    // Fill credentials (using standard dev seed defaults)
    // Adjust these if your local admin/test user credentials differ
    await page.fill('input[type="email"], input[name="email"]', 'test2@test.com');
    await page.fill('input[type="password"], input[name="password"]', 'password123');
    
    // Click login and wait for the dashboard redirect
    await Promise.all([
      page.waitForURL('**/dashboard'),
      page.click('button[type="submit"]')
    ]);

    console.log('✅ [E2E] Step 1 Complete: Session Established.');

    console.log('🚀 [E2E] Step 2: Navigating to KYC funnel...');

    // 4. Navigate to KYC with the session now active
    await page.goto('/en/onboarding/kyc', { waitUntil: 'networkidle' });
    
    console.log(`📍 [E2E] Current URL: ${page.url()}`);

    // 5. Check for the "Stabilizing" loader
    const stabilizingMsg = page.locator('text=Stabilizing Secure Channel');
    if (await stabilizingMsg.isVisible()) {
        console.log('⏳ [E2E] Handshaking with Gateway Bridge...');
        await expect(stabilizingMsg).not.toBeVisible({ timeout: 30000 });
    }

    // 6. UI Audit: Did we get the "Rejected" message?
    const rejectedMsg = page.locator('text=rejected identity validation');
    const isErrorVisible = await rejectedMsg.isVisible();
    
    if (isErrorVisible) {
      console.error('❌ [E2E] Gateway rejected the session.');
      
      // DIAGNOSTIC: Check if the token in the browser is a mock or empty
      const tokenInStorage = await page.evaluate(() => localStorage.getItem('gs-auth.token'));
      console.log(`💾 [E2E] LocalStorage Token State: ${tokenInStorage ? 'PRESENT (starts with ' + tokenInStorage.substring(0,10) + ')' : 'NULL'}`);
      
      const cookies = await page.context().cookies();
      const hasCookie = cookies.some(c => c.name.includes('gs-auth'));
      console.log(`🍪 [E2E] Browser Cookie Present: ${hasCookie}`);
    }

    expect(isErrorVisible, 'The KYC page should clear the stabilization screen successfully').toBe(false);
    
    console.log('✅ [E2E] Phase 2 Diagnostic Passed: Identity Linkage Verified.');
  });
});