---
name: generate-tests
usage: "/generate-tests [path(s)]"
description: >
  Command to trigger the autonomous generation of tests for specified files/dirs, following the TDD model and updating coverage reports.
---

# Generate Tests Command

Automatically generate comprehensive test suites for specified paths.

## Usage

```bash
/generate-tests [path(s)]
```

## Examples

```bash
/generate-tests app/components/WarpUI.tsx
/generate-tests app/
/generate-tests app/components app/lib
```

## Steps

1. **Analyze Code**: For each specified path, analyze for missing or insufficient tests
   - Identify untested functions, components, and modules
   - Check current test coverage levels
   - Identify edge cases and error conditions

2. **Generate Tests**: Create or update test files as per project style
   - Follow naming conventions from CLAUDE.md
   - Use appropriate testing framework (Jest, RTL, Playwright)
   - Include setup, teardown, and mocking as needed
   - Write descriptive test names and assertions

3. **Run Test Suite**: Execute tests and collect coverage data
   - Run `npm test -- --coverage`
   - Generate coverage reports
   - Calculate coverage delta

4. **Compliance Check**: Validate against coverage threshold
   - CLAUDE.md requires >95% coverage
   - Raise compliance error if below threshold
   - Report detailed coverage metrics

## Output

- Test files created/updated
- Coverage report summary
- Any compliance errors or warnings
- Actionable recommendations
