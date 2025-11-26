import { test, expect } from '@playwright/test';

test.describe('Appetizing Menu Page', () => {
  test('should load and display the full menu correctly', async ({ page }) => {
    await page.goto('http://localhost:4321/');

    // Check for the hero section title
    await expect(page.locator('h1')).toContainText('The Golden Spoon');

    // Check for a category title to ensure the menu rendered
    await expect(page.locator('h2').first()).toContainText('Entradas');

    // Check for a dish name
    await expect(page.locator('h3').first()).toContainText('Aros de Cebolla');

    // Check for the currency conversion text
    await expect(page.locator('span:has-text("~")').first()).toBeVisible();

    // Take a screenshot of the entire page
    await page.screenshot({ path: 'tests-output/final_menu_page.png', fullPage: true });
  });
});
