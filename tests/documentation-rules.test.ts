// tests/documentation-rules.test.ts
// Test that CLAUDE.md enforces what it claims

import { readFileSync, existsSync, statSync } from 'fs';

describe('Documentation Enforcement', () => {
  test('CLAUDE.md enforces diff-based coding', () => {
    const content = readFileSync('CLAUDE.md', 'utf-8');

    expect(content).toContain('Diff-Based Coding');
    expect(content).toContain('MANDATORY');
    expect(content).toContain('with diff');
    expect(content).toContain('git diff');
  });

  test('CLAUDE.md references automated pre-commit checks', () => {
    const content = readFileSync('CLAUDE.md', 'utf-8');

    // Should reference Husky or automated hooks
    const hasHuskyRef =
      content.includes('husky') ||
      content.includes('pre-commit hook') ||
      content.includes('git hook') ||
      content.includes('automated');

    expect(hasHuskyRef).toBe(true);
  });

  test('CLAUDE.md documents all required checks', () => {
    const content = readFileSync('CLAUDE.md', 'utf-8');

    expect(content).toContain('npm run lint');
    expect(content).toContain('npm test');
    expect(content).toContain('npm run test:coverage');
    expect(content).toContain('npm run build');
    expect(content).toContain('lcov.info');
    expect(content).toContain('coverage-summary.json');
  });

  test('CLAUDE.md enforces coverage threshold', () => {
    const content = readFileSync('CLAUDE.md', 'utf-8');

    expect(content).toContain('80%');
    expect(content).toContain('Coverage');
    expect(content).toContain('threshold');
  });

  test('CLAUDE.md enforces security audit', () => {
    const content = readFileSync('CLAUDE.md', 'utf-8');

    expect(content).toContain('Security');
    expect(content).toContain('pull_request.head');
    expect(content).toContain('untrusted');
  });

  test('CLAUDE.md references test separation', () => {
    const content = readFileSync('CLAUDE.md', 'utf-8');

    // Should mention Jest/Playwright separation or .spec.ts exclusion
    const hasTestSeparation =
      content.includes('.spec.ts') ||
      content.includes('Playwright') ||
      content.includes('test separation');

    expect(hasTestSeparation).toBe(true);
  });

  test('Husky pre-commit hook exists', () => {
    const hookExists = existsSync('.husky/pre-commit');
    expect(hookExists).toBe(true);
  });

  test('Husky pre-commit hook is executable', () => {
    if (process.platform !== 'win32') {
      const stats = statSync('.husky/pre-commit');
      const isExecutable = !!(stats.mode & 0o111);
      expect(isExecutable).toBe(true);
    }
  });

  test('Husky pre-commit hook contains all required checks', () => {
    const content = readFileSync('.husky/pre-commit', 'utf-8');

    expect(content).toContain('npm run lint');
    expect(content).toContain('npm test');
    expect(content).toContain('npm run test:coverage');
    expect(content).toContain('npm run build');
    expect(content).toContain('lcov.info');
  });

  test('PR template exists', () => {
    const templateExists = existsSync('.github/pull_request_template.md');
    expect(templateExists).toBe(true);
  });

  test('PR template enforces diff-only', () => {
    const content = readFileSync('.github/pull_request_template.md', 'utf-8');

    expect(content).toContain('diff-only');
    expect(content).toContain('MANDATORY');
    expect(content).toContain('full-file rewrites');
  });

  test('PR template requires Husky hook confirmation', () => {
    const content = readFileSync('.github/pull_request_template.md', 'utf-8');

    const hasHuskyRef = content.includes('Husky') || content.includes('pre-commit hook');
    expect(hasHuskyRef).toBe(true);
  });
});
