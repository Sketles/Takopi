import { test, expect } from '@playwright/test';

// NOTE: This test requires a test user to be seeded in the database and accessible via env variables.
// Set E2E_TEST_USER_EMAIL and E2E_TEST_USER_PASSWORD in your environment before running the tests.

test.describe('Profile ownership on username change', () => {
  test('keeps ownership after username change', async ({ page }) => {
    const email = process.env.E2E_TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.E2E_TEST_USER_PASSWORD || 'password123';

    await page.goto('/auth/login');
    await page.fill('input[name=email]', email);
    await page.fill('input[name=password]', password);
    await page.click('button[type=submit]');

    // Wait for navigation to profile
    await page.waitForURL('**/profile');

    // Ensure we are on our profile and we can see edit buttons
    await expect(page.locator('button:has-text("Editar")')).toBeVisible();

    // Open profile edit modal or find username input (this depends on UI implementation)
    // We'll assume there's an "Editar Perfil" button that opens an editor
    if (await page.locator('button:has-text("Editar Perfil")').count() > 0) {
      await page.click('button:has-text("Editar Perfil")');
      // Wait for editor to show
      await expect(page.locator('input[name=username]')).toBeVisible();

      const newUsername = `testuser_${Date.now().toString().slice(-6)}`;
      await page.fill('input[name=username]', newUsername);
      await page.click('button:has-text("Guardar")');

      // Wait for update and verify that Edit button still exists and we are still on /profile
      await page.waitForURL('**/profile');
      await expect(page.locator('button:has-text("Editar")')).toBeVisible();
    }
  });
});
