import { expect, test } from '@playwright/test';

test.describe('smoke', () => {
  test('landing links to catalog', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /abrir catálogo/i }).first().click();
    await expect(page).toHaveURL(/\/problems/);
    await expect(page.getByRole('heading', { name: /catálogo/i })).toBeVisible();
  });

  test('changelog page renders', async ({ page }) => {
    await page.goto('/changelog');
    await expect(page.locator('main header h1')).toHaveText(/^Novidades$/i);
    await expect(page.locator('main article')).toContainText('2026-05-04');
  });
});
