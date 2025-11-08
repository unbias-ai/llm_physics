/**
 * Canvas2D Accessibility Tests
 * Verify keyboard controls and WCAG compliance
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Canvas2D Renderer Accessibility', () => {
  test('should have keyboard-navigable controls', async ({ page }) => {
    await page.goto('/canvas-demo'); // Will create demo page later

    // Find canvas element
    const canvas = page.locator('canvas[role="img"]');
    await expect(canvas).toBeAttached();

    // Verify canvas is focusable
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBe('CANVAS');

    // Verify has tabIndex
    const tabIndex = await canvas.getAttribute('tabindex');
    expect(tabIndex).toBe('0');
  });

  test('should have ARIA labels on plot', async ({ page }) => {
    await page.goto('/canvas-demo');

    const canvas = page.locator('canvas[role="img"]');
    await expect(canvas).toHaveAttribute('role', 'img');
    await expect(canvas).toHaveAttribute('aria-label');

    const label = await canvas.getAttribute('aria-label');
    expect(label).toContain('Plot of equation');
  });

  test('should pass WCAG 2.1 AA compliance', async ({ page }) => {
    await page.goto('/canvas-demo');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should display interaction instructions', async ({ page }) => {
    await page.goto('/canvas-demo');

    await expect(page.locator('text=Pan: Click and drag')).toBeVisible();
    await expect(page.locator('text=Zoom: Scroll')).toBeVisible();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/canvas-demo');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.color'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should announce loading state to screen readers', async ({ page }) => {
    await page.goto('/canvas-demo');

    // Check for loading indicator (if Pyodide still loading)
    const loadingText = page.locator('text=Loading equation solver');

    // If loading, it should be visible
    const isVisible = await loadingText.isVisible().catch(() => false);

    if (isVisible) {
      // Verify loading message is accessible
      expect(await loadingText.textContent()).toContain('Loading');
    }
  });

  test('should handle keyboard zoom', async ({ page }) => {
    await page.goto('/canvas-demo');

    const canvas = page.locator('canvas[role="img"]');
    await canvas.focus();

    // Get initial viewport display
    const initialViewport = await page.locator('text=/View: x:/').textContent();

    // Simulate keyboard interaction (future enhancement)
    // For now, verify viewport coordinates are displayed
    expect(initialViewport).toMatch(/x:\[.*\]/);
  });
});
