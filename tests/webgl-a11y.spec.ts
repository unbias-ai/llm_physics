/**
 * WebGL Renderer Accessibility Tests
 * Verify keyboard navigation and WCAG compliance
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('WebGL Renderer Accessibility', () => {
  test('should have keyboard-navigable scene', async ({ page }) => {
    await page.goto('/webgl-demo'); // Will create demo page later

    const scene = page.locator('[role="img"][aria-label*="3D"]');
    await expect(scene).toBeAttached();

    // Verify focusable
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    expect(focused).toContain('3D');
  });

  test('should have ARIA label on visualization', async ({ page }) => {
    await page.goto('/webgl-demo');

    const scene = page.locator('[role="img"]');
    await expect(scene).toHaveAttribute('role', 'img');
    await expect(scene).toHaveAttribute('aria-label', '3D physics visualization');
  });

  test('should pass WCAG 2.1 AA compliance', async ({ page }) => {
    await page.goto('/webgl-demo');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should display performance metrics', async ({ page }) => {
    await page.goto('/webgl-demo');

    await expect(page.locator('text=/FPS:/')).toBeVisible();
    await expect(page.locator('text=/Draw Calls:/')).toBeVisible();
  });

  test('should show device capabilities', async ({ page }) => {
    await page.goto('/webgl-demo');

    await expect(page.locator('text=/WebGL/')).toBeVisible();
    await expect(page.locator('text=/GPU:/')).toBeVisible();
  });

  test('should display interaction help', async ({ page }) => {
    await page.goto('/webgl-demo');

    await expect(page.locator('text=Drag to rotate')).toBeVisible();
    await expect(page.locator('text=Pinch to zoom')).toBeVisible();
  });

  test('should announce keyboard shortcuts', async ({ page }) => {
    await page.goto('/webgl-demo');

    // Future enhancement: keyboard shortcut help modal
    // For now, verify controls are documented
    const controls = await page.locator('text=/Controls:/').textContent();
    expect(controls).toBeTruthy();
  });
});
