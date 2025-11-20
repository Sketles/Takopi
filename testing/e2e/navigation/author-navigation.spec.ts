import { test, expect } from '@playwright/test';

// NOTE: This test assumes there is at least one public content card on /explore and a logged-in user.
// Requires E2E_TEST_USER_EMAIL and E2E_TEST_USER_PASSWORD env vars.

test.describe('Author navigation links', () => {
  test('author link on content card navigates to proper profile route', async ({ page }) => {
    const email = process.env.E2E_TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.E2E_TEST_USER_PASSWORD || 'password123';

    await page.goto('/auth/login');
    await page.fill('input[name=email]', email);
    await page.fill('input[name=password]', password);
    await page.click('button[type=submit]');

    // Go to explore
    await page.goto('/explore');

    // Find first author element inside a content card
    const authorButton = page.locator('div:has(.text-xs:has-text("Creado por"))').first();
    await expect(authorButton).toBeVisible();

    // Click and expect navigation to either /profile or /user/:id
    // We'll click and just verify URL pattern
    await authorButton.click();
    await page.waitForLoadState('networkidle');

    const url = page.url();
    expect(url).toMatch(/\/profile$|\/user\/.+/);
  });
});
