# Core Workflow Protocol

**Version**: 1.0.0
**Applies To**: All AI agents
**Status**: Required

---

## PTIV Workflow (Plan  Test  Implement  Verify)

This is the **mandatory workflow** for all code changes.

### Phase 1: PLAN

**Objective**: Understand the task and create an execution plan.

**Steps**:
1. Read task description carefully
2. Identify relevant files (use Glob/Grep)
3. Read necessary files for context
4. Break down task into subtasks
5. Create task list (use TodoWrite or equivalent tracking)
6. Identify dependencies and blockers

**Output**:
- Clear list of subtasks
- Understanding of scope
- Identification of potential risks

**Example**:
```
Task: Add dark mode toggle to settings page

Subtasks:
1. Create theme context provider
2. Add toggle button to settings UI
3. Update all components to respect theme
4. Add tests for theme switching
5. Update documentation
```

---

### Phase 2: TEST

**Objective**: Define expected behavior before implementation (TDD).

**When to write tests**:
- **Always** for new features
- **Always** for bug fixes
- **Always** for refactoring (ensure behavior unchanged)

**Steps**:
1. Create test file (if new): `tests/<ComponentName>.test.tsx`
2. Write failing test that describes desired behavior
3. Run test and verify it fails correctly
4. Document expected behavior in test name

**Test Structure**:
```typescript
describe('DarkModeToggle', () => {
  it('should switch theme when clicked', async () => {
    render(<DarkModeToggle />)

    const toggle = screen.getByRole('button', { name: /toggle theme/i })
    expect(document.body).toHaveClass('light')

    await userEvent.click(toggle)

    expect(document.body).toHaveClass('dark')
  })
})
```

**Verification**:
```bash
npm test -- tests/DarkModeToggle.test.tsx
# Should FAIL (test written before implementation)
```

---

### Phase 3: IMPLEMENT

**Objective**: Write minimal code to make tests pass.

**Principles**:
- **Minimal**: Don't over-engineer
- **Focused**: One logical change at a time
- **Readable**: Code is read more than written
- **Documented**: Comment complex logic

**Steps**:
1. Write code to satisfy test
2. Follow coding standards (see CLAUDE.md)
3. Add inline comments for non-obvious logic
4. Keep functions small and single-purpose
5. Extract reusable logic

**Example**:
```typescript
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
} | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
    document.body.className = theme === 'light' ? 'dark' : 'light'
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

---

### Phase 4: VERIFY

**Objective**: Ensure all quality checks pass.

**Required Checks**:
1. **Linting**: `npm run lint`
2. **Tests**: `npm test`
3. **Coverage**: `npm test -- --coverage` (must be >95%)
4. **Build**: `npm run build`
5. **Audit**: `node scripts/verify_audit_block.js`

**Verification Script**:
```bash
#!/bin/bash
set -e  # Exit on first error

echo "Running lint..."
npm run lint

echo "Running tests..."
npm test -- --coverage

echo "Checking coverage..."
# Verify coverage >95%
node -e "
const coverage = require('./coverage/coverage-summary.json');
const pct = coverage.total.lines.pct;
if (pct < 95) {
  console.error(\`Coverage \${pct}% below 95% threshold\`);
  process.exit(1);
}
"

echo "Building..."
npm run build

echo "Running audit..."
node scripts/verify_audit_block.js

echo " All checks passed!"
```

**If Checks Fail**:
1. Read error message carefully
2. Fix the issue
3. Re-run verification
4. Repeat until all pass

**When All Pass**:
- Proceed to commit and push

---

## Workflow Variations

### Variation A: Bug Fix

```
1. PLAN
   - Reproduce bug
   - Identify root cause
   - Plan minimal fix

2. TEST
   - Write test that reproduces bug (should fail)
   - Verify test fails in expected way

3. IMPLEMENT
   - Fix bug
   - Run test (should pass)

4. VERIFY
   - Run full test suite
   - Ensure no regressions
   - Run all checks
```

### Variation B: Refactoring

```
1. PLAN
   - Identify code smell
   - Plan refactoring approach
   - Ensure tests exist (write if missing)

2. TEST
   - Ensure comprehensive tests exist
   - Run tests (should all pass before refactoring)

3. IMPLEMENT
   - Refactor code
   - Keep tests green throughout

4. VERIFY
   - Run all tests (should still pass)
   - Verify no behavior change
   - Run all checks
```

### Variation C: Documentation Only

```
1. PLAN
   - Identify documentation gap
   - Plan content and structure

2. TEST
   - (Skip for pure documentation changes)

3. IMPLEMENT
   - Write or update documentation
   - Ensure consistency with code
   - Add examples

4. VERIFY
   - Run lint (for markdown)
   - Verify links work
   - Ensure formatting correct
```

---

## Error Recovery

### When Tests Fail

```
1. Read error message carefully
2. Identify failing test
3. Run specific test with --verbose:
   npm test -- tests/file.test.tsx --verbose
4. Debug:
   - Check test expectations
   - Verify implementation
   - Look for typos or logic errors
5. Fix and re-run
```

### When Build Fails

```
1. Read build output
2. Common issues:
   - TypeScript errors  Fix type issues
   - Import errors  Check import paths
   - Missing dependencies  Run npm ci
3. Fix and rebuild
```

### When Audit Fails

```
1. Read audit report:
   artifacts/audit_logs/audit-<timestamp>.json
2. Check severity:
   - CRITICAL  Fix immediately (blocks merge)
   - HIGH  Fix before merge
   - MEDIUM/LOW  Can defer
3. Common issues:
   - Exposed secrets  Remove from code, use env vars
   - Low coverage  Add more tests
   - Security vulnerabilities  Update dependencies
4. Fix and re-run audit
```

---

## Workflow Cheatsheet

### Quick Commands

```bash
# Full verification
npm run lint && npm test -- --coverage && npm run build && node scripts/verify_audit_block.js

# Test specific file
npm test -- tests/Component.test.tsx

# Test with watch mode (for development)
npm test -- --watch

# Build and check bundle size
npm run build && du -sh .next

# Check coverage
npm test -- --coverage && open coverage/lcov-report/index.html
```

### Common Issues

| Error | Solution |
|-------|----------|
| "Module not found" | Run `npm ci` |
| "Test failed" | Check test expectations vs. implementation |
| "Coverage below 95%" | Add more test cases |
| "Type error" | Fix TypeScript types |
| "Lint error" | Run `npm run lint -- --fix` |

---

## Workflow Metrics

Track these metrics to improve efficiency:

- **Time per phase** (aim to reduce over time)
- **Test pass rate** (aim for 100% first-time pass)
- **Coverage delta** (ensure always positive)
- **Verification failures** (aim for zero)

---

## Best Practices

1. **Always follow PTIV order** - Never skip phases
2. **Write tests first** (or alongside implementation)
3. **Commit only when all checks pass**
4. **Keep changes small and focused**
5. **Document non-obvious decisions**
6. **Ask for help when stuck** (don't guess)

---

*This protocol ensures consistent, high-quality contributions from all agents.*
