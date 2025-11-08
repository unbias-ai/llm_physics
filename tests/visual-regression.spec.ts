import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Screenshot for visual comparison
    await page.screenshot({
      path: 'screenshots/debug/homepage.png',
      fullPage: true
    });

    // Visual snapshot comparison
    expect(await page.screenshot()).toMatchSnapshot('homepage.png');
  });

  test('canvas 2d renderer', async ({ page }) => {
    await page.goto('/');

    // Wait for canvas to render
    const canvas = page.locator('canvas').first();
    await canvas.waitFor({ state: 'visible' });

    await page.screenshot({
      path: 'screenshots/debug/canvas-2d-renderer.png'
    });

    expect(await page.screenshot()).toMatchSnapshot('canvas-2d.png');
  });

  test('mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'screenshots/debug/mobile-viewport.png',
      fullPage: true
    });

    expect(await page.screenshot()).toMatchSnapshot('mobile-viewport.png');
  });
});
