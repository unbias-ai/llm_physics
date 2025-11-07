// tests/jest-config.test.ts
// Test that Jest properly ignores Playwright .spec.ts files

import { readdirSync } from 'fs';

describe('Jest/Playwright Separation', () => {
  test('Jest config excludes .spec.ts files', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jestConfig = require('../jest.config.js');

    // Check testPathIgnorePatterns includes .spec.ts pattern
    const ignorePatterns = jestConfig.testPathIgnorePatterns || [];
    const hasSpecPattern = ignorePatterns.some((pattern: string) =>
      pattern.includes('.spec') || pattern.includes('\\.spec\\.')
    );

    expect(hasSpecPattern).toBe(true);
    expect(ignorePatterns).toContain('\\.spec\\.[jt]s$');
  });

  test('Jest testMatch only includes .test.ts(x) files', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jestConfig = require('../jest.config.js');

    const testMatch = jestConfig.testMatch || [];
    expect(testMatch.length).toBeGreaterThan(0);

    // Verify patterns match test files but not spec files
    testMatch.forEach((pattern: string) => {
      // Pattern should contain 'test' (may be in glob form like (test) or .test)
      const containsTest = pattern.includes('test');
      expect(containsTest).toBe(true);

      // Pattern should NOT contain 'spec'
      expect(pattern).not.toContain('spec');
    });
  });

  test('.spec.ts files exist for Playwright', () => {
    // Verify we actually have .spec.ts files that should be excluded
    const files = readdirSync('tests');
    const specFiles = files.filter(f => f.endsWith('.spec.ts'));

    expect(specFiles.length).toBeGreaterThan(0);
    expect(specFiles).toContain('a11y.spec.ts');
  });

  test('Playwright tests are NOT matched by Jest patterns', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jestConfig = require('../jest.config.js');
    const testMatch = jestConfig.testMatch || [];

    const playwrightFile = 'tests/a11y.spec.ts';

    // Simulate Jest's pattern matching
    const wouldMatch = testMatch.some((pattern: string) => {
      // Convert glob pattern to regex (simplified)
      // Escape backslashes first, then other special chars
      const regex = new RegExp(
        pattern
          .replace(/\\/g, '\\\\')  // Escape backslashes first
          .replace(/\*\*/g, '.*')
          .replace(/\*/g, '[^/]*')
          .replace(/\./g, '\\.')
          .replace(/\?/g, '.')
      );
      return regex.test(playwrightFile);
    });

    expect(wouldMatch).toBe(false);
  });

  test('coverageReporters includes required formats', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jestConfig = require('../jest.config.js');
    const reporters = jestConfig.coverageReporters || [];

    expect(reporters).toContain('json');
    expect(reporters).toContain('lcov');
    expect(reporters).toContain('json-summary');
    expect(reporters).toContain('html');
  });
});
