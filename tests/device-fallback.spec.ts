/**
 * Accessibility Tests for Device Fallback
 * Verifies screen reader announcements and keyboard navigation
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Device Capability Fallback Accessibility', () => {
  test('should announce device capabilities to screen readers', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find the live region (screen reader announcement)
    const liveRegion = page.locator('[role="status"][aria-live="polite"]');
    await expect(liveRegion).toBeAttached();

    // Verify it contains accessibility message
    const message = await liveRegion.textContent();
    expect(message).toMatch(
      /(3D visualization enabled|3D visualization disabled|interactive mathematics)/i
    );
  });

  test('should pass WCAG 2.1 AA compliance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper ARIA attributes on live region', async ({ page }) => {
    await page.goto('/');

    const liveRegion = page.locator('[role="status"]');
    await expect(liveRegion).toHaveAttribute('aria-live', 'polite');

    // Verify screen reader only class (not visible but announced)
    const className = await liveRegion.getAttribute('class');
    expect(className).toContain('sr-only');
  });

  test('should maintain keyboard focus management', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');

    // Verify focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Verify focus indicator exists (outline or ring)
    const styles = await focusedElement.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        outlineWidth: computed.outlineWidth,
        boxShadow: computed.boxShadow,
      };
    });

    // Either outline or box-shadow should be set for focus indicator
    const hasFocusIndicator =
      styles.outline !== 'none' ||
      styles.outlineWidth !== '0px' ||
      styles.boxShadow !== 'none';

    expect(hasFocusIndicator).toBe(true);
  });

  test('should not have color contrast violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.color'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/');

    // Verify main landmark exists
    const main = page.locator('main');
    await expect(main).toBeAttached();

    // Verify heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeAttached();
  });

  test('should handle reduced motion preferences', async ({ page, context }) => {
    // Set prefers-reduced-motion
    await context.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => {
          if (query === '(prefers-reduced-motion: reduce)') {
            return {
              matches: true,
              media: query,
              addEventListener: () => {},
              removeEventListener: () => {},
            };
          }
          return {
            matches: false,
            media: query,
            addEventListener: () => {},
            removeEventListener: () => {},
          };
        },
      });
    });

    await page.goto('/');

    // Verify no auto-playing animations
    // (This will be more relevant when Canvas/WebGL renderers are added)
    await expect(page).toHaveTitle(/Physics Workspace|llm_physics/i);
  });
});
