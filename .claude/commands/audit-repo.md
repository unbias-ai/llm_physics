---
name: audit-repo
usage: "/audit-repo [level]"
description: >
  Triggers a full repo audit for security, perf, and a11y using all enabled agents.
---

# Audit Repo Command

Comprehensive repository audit for security, performance, and accessibility compliance.

## Usage

```bash
/audit-repo [level]
```

## Levels

- `CRITICAL`: Only critical security and compliance issues
- `HIGH`: Critical + high priority issues (default)
- `FULL`: Complete audit including all severity levels

## Examples

```bash
/audit-repo
/audit-repo CRITICAL
/audit-repo FULL
```

## Steps

1. **Security Scan**
   - Run repo-auditor agent in security mode
   - Scan for exposed secrets, credentials, API keys
   - Check authentication and authorization patterns
   - Validate rate limiting on public endpoints
   - Scan dependencies for known vulnerabilities
   - Check for security anti-patterns

2. **Performance Check**
   - Validate performance budgets
   - Analyze bundle sizes (must be < 350KB gzipped)
   - Check Core Web Vitals compliance
   - Identify performance regressions
   - Analyze build times and optimization opportunities

3. **Accessibility Checks**
   - Run automated a11y scanning
   - Validate WCAG 2.1 AA compliance
   - Check keyboard navigation
   - Validate ARIA attributes
   - Test screen reader compatibility
   - Verify color contrast ratios

4. **Code Quality**
   - Run lint checks
   - Validate TypeScript strict mode compliance
   - Check test coverage (must be >95%)
   - Identify code smells and anti-patterns
   - Review error handling patterns

5. **Dependency Audit**
   - Check for outdated packages
   - Scan for security vulnerabilities
   - Validate license compliance
   - Check for unused dependencies

6. **Generate Report**
   - Create structured audit log (JSON)
   - Generate human-readable summary
   - Calculate severity-based scores
   - Produce actionable recommendations

## Output

- Detailed audit report in `artifacts/audit_logs/`
- PR comment with summary
- Severity-based exit code
- Compliance pass/fail status

## Blocking Conditions

- Any CRITICAL findings block merge
- Security vulnerabilities block merge
- Exposed secrets block merge
- Coverage below 95% blocks merge (if level >= HIGH)

## Audit Log Format

```json
{
  "timestamp": "ISO-8601",
  "level": "HIGH|CRITICAL|FULL",
  "findings": [
    {
      "category": "security|performance|accessibility|quality",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "file": "path/to/file.ts",
      "line": 123,
      "message": "Description of finding",
      "recommendation": "How to fix"
    }
  ],
  "summary": {
    "critical": 0,
    "high": 2,
    "medium": 5,
    "low": 8
  },
  "status": "PASS|FAIL"
}
```
