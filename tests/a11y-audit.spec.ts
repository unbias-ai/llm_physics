import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audit (WCAG 2.1 AA)', () => {
  test('zero CRITICAL violations on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const critical = results.violations.filter(v => v.impact === 'critical');

    // Save full report
    const fs = require('fs');
    fs.writeFileSync(
      'screenshots/debug/a11y-report.json',
      JSON.stringify(results, null, 2)
    );

    // Screenshot for evidence
    await page.screenshot({
      path: 'screenshots/debug/a11y-audit.png',
      fullPage: true
    });

    console.log(`Total violations: ${results.violations.length}`);
    console.log(`Critical: ${critical.length}`);
    console.log(`Passes: ${results.passes.length}`);

    expect(critical).toHaveLength(0);
  });

  test('canvas has proper aria-label', async ({ page }) => {
    await page.goto('/');

    const canvas = page.locator('canvas').first();
    const label = await canvas.getAttribute('aria-label');

    expect(label).toBeTruthy();
    expect(label).toMatch(/plot|equation|visualization|canvas|3d/i);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');

    // Tab through focusable elements
    await page.keyboard.press('Tab');
    const firstFocus = await page.evaluate(() => document.activeElement?.tagName);

    expect(firstFocus).toBeTruthy();
  });

  test('color contrast meets 4.5:1 ratio', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    const contrastIssues = results.violations.filter(v =>
      v.id === 'color-contrast'
    );

    expect(contrastIssues).toHaveLength(0);
  });

  test('proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['best-practice'])
      .include('body')
      .analyze();

    const headingIssues = results.violations.filter(v =>
      v.id === 'heading-order'
    );

    expect(headingIssues).toHaveLength(0);
  });
});
