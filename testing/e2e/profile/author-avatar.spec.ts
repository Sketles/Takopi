import { test, expect } from '@playwright/test';

// Verifica que el avatar del autor se muestre correctamente en el modal de producto
// Requiere E2E_TEST_USER_EMAIL y E2E_TEST_USER_PASSWORD env vars.

test.describe('Author avatar display', () => {
  test('my creations show avatar in product modal', async ({ page }) => {
    const email = process.env.E2E_TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.E2E_TEST_USER_PASSWORD || 'password123';

    // Login
    await page.goto('/auth/login');
    await page.fill('input[name=email]', email);
    await page.fill('input[name=password]', password);
    await page.click('button[type=submit]');

    // Go to profile and open first creation
    await page.goto('/profile');
    const firstCard = page.locator('.group').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Buscar imagen dentro del bloque 'Creado por'
    const avatarImg = page.locator('div:has(.text-xs:has-text("Creado por")) img').first();
    await expect(avatarImg).toBeVisible({ timeout: 5000 });

    // Optionally assert src is not empty
    const src = await avatarImg.getAttribute('src');
    expect(src && src.length).toBeGreaterThan(0);
  });
});
