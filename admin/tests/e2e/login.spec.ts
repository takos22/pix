import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  })

  test('s\'identifier en tant que super admin', async ({ page }) => {
    await page.getByPlaceholder('Adresse e-mail').fill('superadmin@example.net');
    await page.getByPlaceholder('Mot de passe').fill('pix123');
    await page.getByRole('button', { name: 'Je me connecte' }).click();
    await expect(page).toHaveURL('/organizations/list');
  });
})
