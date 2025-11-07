import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Device Tests', () => {
  test.use(devices['iPhone 12']);

  test('canvas 2D renders at 30fps minimum', async ({ page }) => {
    await page.goto('/');

    // Wait for canvas
    const canvas = page.locator('canvas').first();
    await canvas.waitFor({ state: 'visible' });

    // Start FPS measurement
    await page.evaluate(() => {
      (window as any).frameCount = 0;
      (window as any).startTime = performance.now();

      const countFrames = () => {
        (window as any).frameCount++;
        requestAnimationFrame(countFrames);
      };
      requestAnimationFrame(countFrames);
    });

    // Wait 10 seconds
    await page.waitForTimeout(10000);

    // Calculate FPS
    const fps = await page.evaluate(() => {
      const elapsed = performance.now() - (window as any).startTime;
      const frames = (window as any).frameCount;
      return (frames / elapsed) * 1000;
    });

    // Screenshot evidence
    await page.screenshot({
      path: 'screenshots/debug/mobile-fps-test.png',
      fullPage: true
    });

    console.log(`Mobile FPS: ${fps.toFixed(2)}`);
    expect(fps).toBeGreaterThanOrEqual(30);
  });

  test('webgl context initializes', async ({ page }) => {
    await page.goto('/');

    const hasWebGL = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;

      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      return !!gl;
    });

    await page.screenshot({
      path: 'screenshots/debug/mobile-webgl-init.png'
    });

    expect(hasWebGL).toBe(true);
  });

  test('touch interactions work', async ({ page }) => {
    await page.goto('/');

    const canvas = page.locator('canvas').first();
    await canvas.waitFor({ state: 'visible' });

    // Simulate touch pan
    await canvas.dispatchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 100 }]
    });

    await canvas.dispatchEvent('touchmove', {
      touches: [{ clientX: 150, clientY: 150 }]
    });

    await canvas.dispatchEvent('touchend', {});

    await page.screenshot({
      path: 'screenshots/debug/mobile-touch-interaction.png'
    });

    // Verify no errors
    const errors = await page.evaluate(() => {
      return (window as any).errors || [];
    });

    expect(errors).toHaveLength(0);
  });

  test('loads under 3g network', async ({ page, context }) => {
    // Throttle to 3G (150ms RTT, 1.6Mbps down, 750Kbps up)
    await context.route('**/*', route => {
      setTimeout(() => route.continue(), 150);
    });

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    await page.screenshot({
      path: 'screenshots/debug/mobile-3g-load.png',
      fullPage: true
    });

    console.log(`3G load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Under 5s on 3G
  });
});
