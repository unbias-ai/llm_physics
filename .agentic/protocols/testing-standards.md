# Testing Standards Protocol

**Version**: 1.0.0
**Applies To**: All AI agents
**Status**: Required

---

## Overview

All code MUST have >95% test coverage across all metrics (lines, statements, functions, branches).

---

## Test Types

### 1. Unit Tests (Jest)

**Purpose**: Test individual functions in isolation

**Location**: `tests/lib/`, `tests/utils/`

**Example**:
```typescript
// app/lib/formatData.ts
export function formatData(value: number | null): string {
  if (value === null) return 'N/A'
  return String(value)
}

// tests/lib/formatData.test.ts
import { formatData } from '@/app/lib/formatData'

describe('formatData', () => {
  it('should format number as string', () => {
    expect(formatData(42)).toBe('42')
  })

  it('should handle null as N/A', () => {
    expect(formatData(null)).toBe('N/A')
  })

  it('should handle zero', () => {
    expect(formatData(0)).toBe('0')
  })

  it('should handle negative numbers', () => {
    expect(formatData(-42)).toBe('-42')
  })
})
```

### 2. Component Tests (React Testing Library)

**Purpose**: Test component rendering and user interactions

**Location**: `tests/components/`, `tests/`

**Example**:
```typescript
// app/components/Counter.tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}

// tests/components/Counter.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from '@/app/components/Counter'

describe('Counter Component', () => {
  it('should render initial count', () => {
    render(<Counter />)
    expect(screen.getByText(/count: 0/i)).toBeInTheDocument()
  })

  it('should increment count when button clicked', async () => {
    render(<Counter />)

    const incrementButton = screen.getByRole('button', { name: /increment/i })
    await userEvent.click(incrementButton)

    expect(screen.getByText(/count: 1/i)).toBeInTheDocument()
  })

  it('should reset count to zero', async () => {
    render(<Counter />)

    // Increment first
    const incrementButton = screen.getByRole('button', { name: /increment/i })
    await userEvent.click(incrementButton)
    await userEvent.click(incrementButton)

    // Then reset
    const resetButton = screen.getByRole('button', { name: /reset/i })
    await userEvent.click(resetButton)

    expect(screen.getByText(/count: 0/i)).toBeInTheDocument()
  })
})
```

### 3. E2E Tests (Playwright)

**Purpose**: Test complete user flows

**Status**: Planned for future implementation

**Example** (for reference):
```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('user can navigate to about page', async ({ page }) => {
  await page.goto('http://localhost:3000')

  await page.click('a[href="/about"]')

  await expect(page).toHaveURL('http://localhost:3000/about')
  await expect(page.locator('h1')).toContainText('About')
})
```

---

## Coverage Requirements

### Hard Requirements

All PRs MUST meet these thresholds:

```json
{
  "lines": 95,
  "statements": 95,
  "functions": 95,
  "branches": 95
}
```

### Checking Coverage

```bash
# Run tests with coverage
npm test -- --coverage

# View summary in terminal
# Detailed report: coverage/lcov-report/index.html

# Check specific file coverage
npm test -- --coverage --collectCoverageFrom="app/components/WarpUI.tsx"
```

### Coverage Report Example

```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |
 page.tsx |     100 |      100 |     100 |     100 |
----------|---------|----------|---------|---------|-------------------
```

---

## Test Structure

### Standard Test Template

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Component from '@/app/components/Component'

describe('Component Name', () => {
  // Setup (runs before each test)
  beforeEach(() => {
    // Reset mocks, clear state, etc.
  })

  // Teardown (runs after each test)
  afterEach(() => {
    // Cleanup
  })

  describe('initial render', () => {
    it('should render with default props', () => {
      render(<Component />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('user interactions', () => {
    it('should handle button click', async () => {
      render(<Component />)

      const button = screen.getByRole('button')
      await userEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/success/i)).toBeInTheDocument()
      })
    })
  })

  describe('edge cases', () => {
    it('should handle null props', () => {
      expect(() => render(<Component data={null} />)).not.toThrow()
    })

    it('should handle empty array', () => {
      render(<Component items={[]} />)
      expect(screen.getByText(/no items/i)).toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('should display error message on failure', async () => {
      // Mock API failure
      global.fetch = jest.fn(() => Promise.reject('API Error'))

      render(<Component />)

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })
  })
})
```

---

## Best Practices

### DO

1. **Test behavior, not implementation**
   ```typescript
   // GOOD - tests user-visible behavior
   it('should show success message after submission', async () => {
     render(<Form />)
     await submitForm()
     expect(screen.getByText(/success/i)).toBeInTheDocument()
   })

   // BAD - tests implementation detail
   it('should set isSubmitted to true', () => {
     const form = new Form()
     form.submit()
     expect(form.state.isSubmitted).toBe(true)
   })
   ```

2. **Use descriptive test names**
   ```typescript
   // GOOD
   it('should disable submit button while loading')
   it('should validate email format before submission')

   // BAD
   it('test button')
   it('should work')
   ```

3. **Test edge cases**
   - Null/undefined values
   - Empty arrays/objects
   - Very large numbers
   - Special characters in strings
   - Network errors

4. **Use `waitFor` for async operations**
   ```typescript
   await waitFor(() => {
     expect(screen.getByText(/loaded/i)).toBeInTheDocument()
   })
   ```

5. **Clean up after tests**
   ```typescript
   afterEach(() => {
     jest.clearAllMocks()
     cleanup()
   })
   ```

### DON'T

1. **Don't test implementation details**
   - Internal state
   - Private methods
   - Component structure

2. **Don't share state between tests**
   ```typescript
   // BAD
   let sharedState = {}
   it('test 1', () => { sharedState.value = 1 })
   it('test 2', () => { expect(sharedState.value).toBe(1) }) // Fragile!

   // GOOD
   it('test 1', () => {
     const localState = { value: 1 }
     expect(localState.value).toBe(1)
   })
   ```

3. **Don't use hard-coded timeouts**
   ```typescript
   // BAD
   await new Promise(resolve => setTimeout(resolve, 1000))

   // GOOD
   await waitFor(() => {
     expect(screen.getByText(/loaded/i)).toBeInTheDocument()
   }, { timeout: 3000 })
   ```

4. **Don't test third-party libraries**
   - Don't test React's rendering
   - Don't test Next.js routing
   - Focus on YOUR code

---

## Mocking

### Mock Functions

```typescript
const mockFn = jest.fn()
mockFn.mockReturnValue(42)
mockFn.mockResolvedValue('async value')
mockFn.mockRejectedValue(new Error('async error'))

expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledTimes(2)
```

### Mock Modules

```typescript
// Mock entire module
jest.mock('@/app/lib/api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mocked' }))
}))

// Use in test
import { fetchData } from '@/app/lib/api'

it('should fetch data', async () => {
  render(<Component />)

  await waitFor(() => {
    expect(fetchData).toHaveBeenCalled()
  })
})
```

### Mock Fetch

```typescript
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mocked' }),
    ok: true,
    status: 200,
  })
) as jest.Mock

// In test
it('should fetch and display data', async () => {
  render(<Component />)

  await waitFor(() => {
    expect(screen.getByText(/mocked/i)).toBeInTheDocument()
  })

  expect(global.fetch).toHaveBeenCalledWith('/api/data')
})
```

---

## Debugging Tests

### Run Specific Test

```bash
# By file
npm test -- tests/Component.test.tsx

# By test name
npm test -- -t "should handle button click"

# With verbose output
npm test -- tests/Component.test.tsx --verbose

# Watch mode
npm test -- --watch
```

### Debug in VS Code

Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache", "${file}"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "Element not found" | Use `waitFor` or check `screen.debug()` |
| "Test timeout" | Increase timeout or fix slow operation |
| "Act warning" | Wrap state updates in `act` or use `userEvent` |
| "Module not found" | Check import paths and jest config |

---

## Test Coverage Goals

### By Component Type

| Type | Coverage Target |
|------|-----------------|
| UI Components | 95-100% |
| Utilities | 100% |
| API Functions | 95-100% |
| Hooks | 95-100% |

### Coverage Strategies

**For 95%+ coverage**:
1. Test all code paths (if/else, switch cases)
2. Test all function parameters (valid, invalid, edge cases)
3. Test error handling (try/catch blocks)
4. Test async operations (loading, success, error states)

**Example**:
```typescript
function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero')
  return a / b
}

// Tests needed for 100% coverage:
it('should divide two numbers', () => {
  expect(divide(10, 2)).toBe(5)
})

it('should throw on division by zero', () => {
  expect(() => divide(10, 0)).toThrow('Division by zero')
})
```

---

## Accessibility Testing

### Basic A11y Checks

```typescript
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('should have no accessibility violations', async () => {
  const { container } = render(<Component />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Keyboard Navigation

```typescript
it('should be keyboard navigable', async () => {
  render(<Form />)

  const input = screen.getByLabelText(/email/i)
  input.focus()

  await userEvent.keyboard('{Tab}')

  const button = screen.getByRole('button', { name: /submit/i })
  expect(button).toHaveFocus()
})
```

---

## Performance Testing

### Measure Render Time

```typescript
it('should render quickly', () => {
  const start = performance.now()

  render(<LargeComponent data={largeDataset} />)

  const end = performance.now()
  const renderTime = end - start

  expect(renderTime).toBeLessThan(100) // ms
})
```

---

## Continuous Improvement

1. **Review coverage reports** after each PR
2. **Identify untested code paths** and add tests
3. **Refactor tests** for better readability
4. **Share testing patterns** with team

---

*Testing is not optional. It's the foundation of quality software.*
