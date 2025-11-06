# Example: Test Generation Workflow

**Scenario**: Generate comprehensive tests for an existing component

**Component**: `app/components/WarpUI.tsx` (hypothetical)

---

## Step 1: PLAN

```
Task: Generate tests for WarpUI component

Analysis:
1. Read component file: app/components/WarpUI.tsx
2. Identify:
   - Component props and their types
   - User interactions (clicks, input)
   - State changes
   - Conditional rendering
   - Edge cases (null, empty, error states)
3. Determine test coverage needed

Subtasks:
- [ ] Read WarpUI component
- [ ] Create test file structure
- [ ] Write tests for initial render
- [ ] Write tests for user interactions
- [ ] Write tests for edge cases
- [ ] Run tests and verify coverage
```

---

## Step 2: TEST (Write Tests)

### Read the Component

```typescript
// app/components/WarpUI.tsx (example)
'use client'

import { useState } from 'react'

interface WarpUIProps {
  initialSpeed?: number
  onSpeedChange?: (speed: number) => void
}

export default function WarpUI({ initialSpeed = 0, onSpeedChange }: WarpUIProps) {
  const [speed, setSpeed] = useState(initialSpeed)
  const [status, setStatus] = useState<'idle' | 'active'>('idle')

  const handleActivate = () => {
    setStatus('active')
    onSpeedChange?.(speed)
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    if (status === 'active') {
      onSpeedChange?.(newSpeed)
    }
  }

  return (
    <div className="warp-ui">
      <h2>Warp Drive Control</h2>

      <div>
        <label>
          Speed: {speed}
          <input
            type="range"
            min="0"
            max="10"
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
          />
        </label>
      </div>

      <button onClick={handleActivate} disabled={status === 'active'}>
        {status === 'active' ? 'Active' : 'Activate'}
      </button>

      {status === 'active' && <div className="status">Warp drive engaged at speed {speed}</div>}
    </div>
  )
}
```

### Create Test File

```typescript
// tests/components/WarpUI.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WarpUI from '@/app/components/WarpUI'

describe('WarpUI Component', () => {
  describe('initial render', () => {
    it('should render with default speed of 0', () => {
      render(<WarpUI />)

      expect(screen.getByText(/warp drive control/i)).toBeInTheDocument()
      expect(screen.getByText(/speed: 0/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /activate/i })).toBeInTheDocument()
      expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('should render with custom initial speed', () => {
      render(<WarpUI initialSpeed={5} />)

      expect(screen.getByText(/speed: 5/i)).toBeInTheDocument()
    })

    it('should not show status message initially', () => {
      render(<WarpUI />)

      expect(screen.queryByText(/warp drive engaged/i)).not.toBeInTheDocument()
    })
  })

  describe('user interactions', () => {
    it('should update speed when slider changes', async () => {
      render(<WarpUI />)

      const slider = screen.getByRole('slider')
      await userEvent.type(slider, '{ArrowRight}{ArrowRight}{ArrowRight}')

      await waitFor(() => {
        expect(screen.getByText(/speed: 3/i)).toBeInTheDocument()
      })
    })

    it('should activate warp drive when button clicked', async () => {
      render(<WarpUI />)

      const button = screen.getByRole('button', { name: /activate/i })
      await userEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/warp drive engaged/i)).toBeInTheDocument()
        expect(button).toBeDisabled()
        expect(button).toHaveTextContent(/active/i)
      })
    })

    it('should call onSpeedChange callback when activated', async () => {
      const mockCallback = jest.fn()
      render(<WarpUI initialSpeed={3} onSpeedChange={mockCallback} />)

      const button = screen.getByRole('button', { name: /activate/i })
      await userEvent.click(button)

      expect(mockCallback).toHaveBeenCalledWith(3)
    })

    it('should call onSpeedChange when speed changes after activation', async () => {
      const mockCallback = jest.fn()
      render(<WarpUI initialSpeed={0} onSpeedChange={mockCallback} />)

      // Activate first
      const button = screen.getByRole('button', { name: /activate/i })
      await userEvent.click(button)

      mockCallback.mockClear() // Clear activation call

      // Change speed
      const slider = screen.getByRole('slider')
      await userEvent.type(slider, '{ArrowRight}')

      expect(mockCallback).toHaveBeenCalledWith(1)
    })

    it('should not call onSpeedChange when speed changes before activation', async () => {
      const mockCallback = jest.fn()
      render(<WarpUI onSpeedChange={mockCallback} />)

      const slider = screen.getByRole('slider')
      await userEvent.type(slider, '{ArrowRight}')

      expect(mockCallback).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle missing onSpeedChange prop', async () => {
      render(<WarpUI />)

      const button = screen.getByRole('button')

      // Should not throw
      expect(async () => {
        await userEvent.click(button)
      }).not.toThrow()
    })

    it('should handle rapid speed changes', async () => {
      render(<WarpUI />)

      const slider = screen.getByRole('slider')

      // Rapid changes
      await userEvent.type(slider, '{ArrowRight}{ArrowRight}{ArrowRight}{ArrowLeft}{ArrowRight}')

      await waitFor(() => {
        expect(screen.getByText(/speed: 3/i)).toBeInTheDocument()
      })
    })

    it('should handle min and max speeds', async () => {
      render(<WarpUI initialSpeed={10} />)

      expect(screen.getByText(/speed: 10/i)).toBeInTheDocument()

      const slider = screen.getByRole('slider')
      await userEvent.clear(slider)
      await userEvent.type(slider, '0')

      await waitFor(() => {
        expect(screen.getByText(/speed: 0/i)).toBeInTheDocument()
      })
    })
  })

  describe('accessibility', () => {
    it('should have accessible label for slider', () => {
      render(<WarpUI />)

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAccessibleName(/speed/i)
    })

    it('should have accessible button', () => {
      render(<WarpUI />)

      const button = screen.getByRole('button', { name: /activate/i })
      expect(button).toBeInTheDocument()
    })
  })
})
```

---

## Step 3: IMPLEMENT (Already exists)

Component already exists, tests written to cover it.

---

## Step 4: VERIFY

```bash
# Run tests
npm test -- tests/components/WarpUI.test.tsx

# Check coverage
npm test -- --coverage --collectCoverageFrom="app/components/WarpUI.tsx"

# Expected output:
# PASS tests/components/WarpUI.test.tsx
#   WarpUI Component
#     initial render
#       ✓ should render with default speed of 0
#       ✓ should render with custom initial speed
#       ✓ should not show status message initially
#     user interactions
#       ✓ should update speed when slider changes
#       ✓ should activate warp drive when button clicked
#       ✓ should call onSpeedChange callback when activated
#       ✓ should call onSpeedChange when speed changes after activation
#       ✓ should not call onSpeedChange when speed changes before activation
#     edge cases
#       ✓ should handle missing onSpeedChange prop
#       ✓ should handle rapid speed changes
#       ✓ should handle min and max speeds
#     accessibility
#       ✓ should have accessible label for slider
#       ✓ should have accessible button
#
# Tests: 13 passed, 13 total
# Coverage: 100%
```

### If Coverage < 100%

```bash
# View detailed coverage report
open coverage/lcov-report/index.html

# Identify uncovered lines
# Add tests to cover those lines
# Re-run tests
```

---

## Step 5: COMMIT

```bash
# Stage test file
git add tests/components/WarpUI.test.tsx

# Commit
git commit -m "test: add comprehensive tests for WarpUI component

Add 13 test cases covering:
- Initial render with default and custom props
- User interactions (slider, button, callbacks)
- Edge cases (missing props, rapid changes, min/max)
- Accessibility (labels, buttons)

Coverage: 100%"

# Push
git push origin test/warp-ui-component
```

---

## Summary

**Time**: ~30 minutes
**Tests Written**: 13
**Coverage**: 100%
**Files Changed**: 1 (new test file)

**Key Learnings**:
1. Read component carefully before writing tests
2. Organize tests by category (render, interactions, edge cases, a11y)
3. Test behavior, not implementation
4. Use descriptive test names
5. Verify coverage after writing tests
