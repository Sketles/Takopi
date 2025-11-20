import { test, expect } from '@playwright/test';

// This test ensures that the logged in user's creations show the correct author in the Product modal
// Requires E2E_TEST_USER_EMAIL and E2E_TEST_USER_PASSWORD environment variables.

test.describe('Profile author display', () => {
  test('my creations show my username in product modal', async ({ page }) => {
    const email = process.env.E2E_TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.E2E_TEST_USER_PASSWORD || 'password123';

    // Login
    await page.goto('/auth/login');
    await page.fill('input[name=email]', email);
    await page.fill('input[name=password]', password);
    await page.click('button[type=submit]');

    // Go to my profile page
    await page.goto('/profile');

    // Wait for the page to load and read the username from header
    await page.waitForSelector('h1');
    const username = (await page.textContent('h1'))?.trim() || '';
    expect(username.length).toBeGreaterThan(0);

    // Click the first content card (should open modal)
    const firstCard = page.locator('.group').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Wait for modal and assert author shows username
    const authorLocator = page.locator('div:has(.text-xs:has-text("Creado por")) span.text-sm, div:has(.text-xs:has-text("Creado por")) span.text-xs.font-medium');
    await expect(authorLocator).toHaveCount(1);
    const authorText = (await authorLocator.first().textContent())?.trim() || '';

    expect(authorText).toContain(username);
  });
});
