# Example: Feature Implementation Workflow

**Scenario**: Implement dark mode toggle feature

**Goal**: Add dark mode support with toggle button in settings

---

## Step 1: PLAN

```
Task: Implement dark mode toggle

Requirements:
1. User can toggle between light and dark themes
2. Preference persisted in localStorage
3. All components respect theme
4. Smooth transition between themes
5. Accessible toggle button

Architecture:
- Theme context provider (React Context)
- Theme hook (useTheme)
- Toggle component
- CSS variables for colors
- localStorage persistence

Subtasks:
- [ ] Create theme context and provider
- [ ] Create useTheme hook
- [ ] Add CSS variables for light/dark themes
- [ ] Create ThemeToggle component
- [ ] Update root layout to use ThemeProvider
- [ ] Add localStorage persistence
- [ ] Write tests for all components
- [ ] Update documentation
```

---

## Step 2: TEST (Write Tests First)

### Test 1: Theme Context

```typescript
// tests/lib/ThemeContext.test.tsx
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '@/app/lib/ThemeContext'

// Test component that uses the hook
function TestComponent() {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should provide light theme by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
  })

  it('should allow changing theme', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('Set Dark'))

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })

  it('should persist theme to localStorage', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('Set Dark'))

    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('should load theme from localStorage', () => {
    localStorage.setItem('theme', 'dark')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })

  it('should throw error if useTheme used outside provider', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useTheme must be used within ThemeProvider')

    spy.mockRestore()
  })
})
```

### Test 2: Theme Toggle Component

```typescript
// tests/components/ThemeToggle.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/app/lib/ThemeContext'
import ThemeToggle from '@/app/components/ThemeToggle'

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('should show current theme icon', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    // Light theme by default, should show moon icon (for switching to dark)
    expect(screen.getByLabelText(/toggle to dark mode/i)).toBeInTheDocument()
  })

  it('should toggle theme when clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole('button')

    // Click to switch to dark
    await userEvent.click(button)
    expect(screen.getByLabelText(/toggle to light mode/i)).toBeInTheDocument()

    // Click to switch back to light
    await userEvent.click(button)
    expect(screen.getByLabelText(/toggle to dark mode/i)).toBeInTheDocument()
  })

  it('should apply theme class to document', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole('button')

    // Initially light
    expect(document.documentElement.classList.contains('light')).toBe(true)

    // Click to dark
    await userEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
```

---

## Step 3: IMPLEMENT

### Implementation 1: Theme Context

```typescript
// app/lib/ThemeContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) {
      setThemeState(stored)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setThemeState(prefersDark ? 'dark' : 'light')
    }
    setMounted(true)
  }, [])

  // Update localStorage and document class when theme changes
  useEffect(() => {
    if (!mounted) return

    localStorage.setItem('theme', theme)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
```

### Implementation 2: Theme Toggle Component

```typescript
// app/components/ThemeToggle.tsx
'use client'

import { useTheme } from '@/app/lib/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Toggle to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  )
}
```

### Implementation 3: CSS Variables

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Light mode colors */
  --color-background: #ffffff;
  --color-foreground: #000000;
  --color-primary: #3b82f6;
  --color-secondary: #64748b;

  /* Dark mode colors */
  --color-background-dark: #0f172a;
  --color-foreground-dark: #f1f5f9;
  --color-primary-dark: #60a5fa;
  --color-secondary-dark: #94a3b8;
}

:root {
  background-color: var(--color-background);
  color: var(--color-foreground);
}

.dark {
  background-color: var(--color-background-dark);
  color: var(--color-foreground-dark);
}

/* Smooth transition */
* {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### Implementation 4: Update Root Layout

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { ThemeProvider } from '@/app/lib/ThemeContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'llm_physics',
  description: 'Physics LLM tooling with agentic workflows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Implementation 5: Add Toggle to Page

```typescript
// app/page.tsx
import ThemeToggle from './components/ThemeToggle'

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">llm_physics</h1>
        <ThemeToggle />
      </header>

      <main>
        <p className="text-lg">Welcome to llm_physics with dark mode support!</p>
      </main>
    </div>
  )
}
```

---

## Step 4: VERIFY

```bash
# Run linter
npm run lint
#  No errors

# Run tests
npm test
#  All tests pass

# Check coverage
npm test -- --coverage
# Coverage:
# - ThemeContext: 100%
# - ThemeToggle: 100%
# - Overall: >95% 

# Build
npm run build
#  Build successful

# Run audit
node scripts/verify_audit_block.js
#  Audit passed
```

### Manual Testing

```bash
# Start dev server
npm run dev

# Test in browser:
# 1. Visit http://localhost:3000
# 2. Click theme toggle
# 3. Verify theme changes
# 4. Refresh page
# 5. Verify theme persists
# 6. Check localStorage in DevTools
# 7. Test accessibility (keyboard navigation, screen reader)
```

---

## Step 5: COMMIT

```bash
# Stage all files
git add app/lib/ThemeContext.tsx
git add app/components/ThemeToggle.tsx
git add app/layout.tsx
git add app/page.tsx
git add app/globals.css
git add tests/lib/ThemeContext.test.tsx
git add tests/components/ThemeToggle.test.tsx

# Commit
git commit -m "$(cat <<'EOF'
feat: implement dark mode toggle with theme persistence

Add comprehensive dark mode support:
- Theme context provider for global theme state
- useTheme hook for consuming theme in components
- ThemeToggle component with accessible button
- CSS variables for light/dark color schemes
- localStorage persistence for user preference
- System preference detection as fallback
- Smooth transitions between themes

Implementation details:
- React Context API for state management
- useEffect for localStorage sync
- Prevents flash of unstyled content (FOUC)
- Fully accessible with ARIA labels
- Keyboard navigable

Tests:
- ThemeContext: 5 test cases, 100% coverage
- ThemeToggle: 4 test cases, 100% coverage
- Tests cover rendering, interactions, persistence, and a11y

Refs: #123
EOF
)"

# Push
git push origin feat/dark-mode-toggle
```

---

## Step 6: CREATE PR

```bash
# Create PR via GitHub CLI
gh pr create --title "feat: implement dark mode toggle" --body "$(cat <<'EOF'
## Description
Implements dark mode toggle feature with theme persistence.

## Motivation
Users want to customize UI appearance based on preference and reduce eye strain in low-light environments.

## Changes
- Theme context provider (`ThemeProvider`)
- Custom `useTheme` hook
- `ThemeToggle` component with icons
- CSS variables for color schemes
- localStorage persistence
- System preference detection

## Features
-  Toggle between light and dark themes
-  Preference persists across sessions
-  Smooth transitions between themes
-  Fully accessible (ARIA, keyboard)
-  Respects system preference as default
-  No flash of unstyled content (FOUC)

## Screenshots
(Add screenshots here)

## Testing
- [x] Unit tests for ThemeContext (5 cases, 100% coverage)
- [x] Component tests for ThemeToggle (4 cases, 100% coverage)
- [x] Manual testing in Chrome, Firefox, Safari
- [x] Accessibility testing with screen reader
- [x] Keyboard navigation verified

## Checklist
- [x] Code follows project style
- [x] Tests pass (`npm test`)
- [x] Linting passes (`npm run lint`)
- [x] Build succeeds (`npm run build`)
- [x] Audit passes (`node scripts/verify_audit_block.js`)
- [x] Documentation updated
- [x] No secrets in code
- [x] Ready for review
EOF
)"
```

---

## Summary

**Time**: ~2 hours
**Files Changed**: 7 (5 new, 2 modified)
**Lines of Code**: ~250
**Tests**: 9
**Coverage**: 100%

**Key Learnings**:
1. TDD approach (tests first) catches issues early
2. Context API works well for global theme state
3. localStorage persistence requires careful effect management
4. Preventing FOUC requires suppressing first render
5. Accessibility requires ARIA labels and semantic HTML
6. Comprehensive tests ensure feature works as expected

**Next Steps**:
- Wait for PR review
- Address feedback if needed
- Merge to main
- Deploy to production
