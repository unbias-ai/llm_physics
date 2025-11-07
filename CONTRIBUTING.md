# Contributing to llm_physics

**Welcome!** This guide is for **all contributors**: humans, AI agents (Claude, GPT-4, Gemini, etc.), and future autonomous systems.

---

## Quick Start

### For Humans

```bash
# 1. Fork and clone
git clone https://github.com/unbias-ai/llm_physics.git
cd llm_physics

# 2. Create branch
git checkout -b feature/your-feature-name

# 3. Install dependencies
npm ci

# 4. Make changes
# (edit files)

# 5. Test
npm run lint
npm test
npm run build

# 6. Commit
git add .
git commit -m "feat: your feature description"

# 7. Push and create PR
git push -u origin feature/your-feature-name
```

### For AI Agents

```bash
# 1. Read documentation
Read: AGENTS.md, CLAUDE.md, ARCHITECTURE.md

# 2. Verify capabilities
Run: node --version, npm --version, git --version

# 3. Install dependencies
npm ci

# 4. Health check
npm run lint && npm test && npm run build && node scripts/verify_audit_block.js

# 5. Create branch
git checkout -b <agent-name>/task-description

# 6. Follow PTIV workflow
Plan  Test  Implement  Verify

# 7. Commit and push
git add . && git commit -m "..." && git push
```

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Requirements](#testing-requirements)
6. [Documentation Standards](#documentation-standards)
7. [Pull Request Process](#pull-request-process)
8. [Agent-Specific Guidelines](#agent-specific-guidelines)
9. [Review Process](#review-process)
10. [Getting Help](#getting-help)

---

## Code of Conduct

### Core Principles

1. **Respect**: Treat all contributors (human and AI) with respect
2. **Collaboration**: Work together to improve the project
3. **Quality**: Prioritize code quality and maintainability
4. **Transparency**: Be open about decisions and changes
5. **Learning**: Help others learn and grow

### Expected Behavior

- Write clear, maintainable code
- Test your changes thoroughly
- Document your work
- Respond to feedback constructively
- Help others when you can

### Unacceptable Behavior

- Committing untested code
- Exposing secrets or credentials
- Breaking existing functionality without justification
- Ignoring project policies (CLAUDE.md)
- Bypassing security checks

---

## How to Contribute

### Types of Contributions

#### 1. **Bug Fixes**
- Find a bug (or reported issue)
- Create branch: `fix/issue-description`
- Write failing test
- Fix the bug
- Verify test passes
- Submit PR

#### 2. **New Features**
- Discuss feature in GitHub Issue first
- Get approval from maintainers
- Create branch: `feat/feature-name`
- Follow PTIV workflow (Plan  Test  Implement  Verify)
- Submit PR with documentation

#### 3. **Documentation**
- Identify documentation gap
- Create branch: `docs/topic-name`
- Write or update documentation
- Ensure consistency with existing docs
- Submit PR

#### 4. **Tests**
- Identify untested code
- Create branch: `test/component-name`
- Write comprehensive tests
- Ensure coverage >95%
- Submit PR

#### 5. **Refactoring**
- Identify code smell or improvement opportunity
- Discuss approach in issue first (for large refactors)
- Create branch: `refactor/component-name`
- Refactor while maintaining test coverage
- Ensure all tests pass
- Submit PR

#### 6. **CI/CD Improvements**
- Identify workflow optimization
- Create branch: `ci/improvement-name`
- Update workflow files
- Test in PR (workflows will run)
- Submit PR

---

## Development Workflow

### Standard Workflow (PTIV)

```
1. PLAN
    Read AGENTS.md, CLAUDE.md, relevant files
    Understand the task
    Break down into subtasks
    Create task list

2. TEST
    Write failing test (TDD)
    Or write test alongside implementation
    Ensure test is deterministic

3. IMPLEMENT
    Write minimal code to pass test
    Follow coding standards
    Add inline documentation
    Keep changes focused

4. VERIFY
    npm run lint (must pass)
    npm test (must pass, >95% coverage)
    npm run build (must succeed)
    node scripts/verify_audit_block.js (must pass)
```

### Branch Naming Convention

```
<type>/<short-description>

Types:
- feat/    New feature
- fix/     Bug fix
- docs/    Documentation
- test/    Tests only
- refactor/ Code refactoring
- ci/      CI/CD changes
- chore/   Maintenance

Examples:
- feat/dark-mode-toggle
- fix/null-pointer-crash
- docs/api-documentation
- test/warp-ui-component
- refactor/extract-utility-function
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`

**Examples**:

```bash
# Good
git commit -m "feat: add dark mode toggle to settings page"
git commit -m "fix: prevent null pointer exception in WarpUI"
git commit -m "docs: update AGENTS.md with new protocol"

# Bad
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "WIP"
```

---

## Coding Standards

### TypeScript

**Strict Mode Required**:
```typescript
// tsconfig.json has "strict": true

// Always type your variables and functions
function processData(input: string): ProcessedData {
  // ...
}

// Use explicit return types
const getData = (): Promise<Data> => {
  // ...
}

// Avoid 'any' unless justified with comment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyAPI = (data: any) => {
  // TODO: Type this properly when API docs available
}
```

### React Components

**Functional Components (Preferred)**:
```typescript
// Server Component (default)
export default function Page() {
  return <div>...</div>
}

// Client Component (when needed)
'use client'

import { useState } from 'react'

export default function Interactive() {
  const [state, setState] = useState(0)
  return <button onClick={() => setState(s => s + 1)}>{state}</button>
}
```

**Component File Structure**:
```typescript
// 1. Imports
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// 2. Types
interface Props {
  children: ReactNode
  className?: string
}

// 3. Component
export default function Component({ children, className }: Props) {
  return <div className={cn('base-class', className)}>{children}</div>
}

// 4. Helpers (if needed)
function helperFunction() {
  // ...
}
```

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `WarpUI.tsx` |
| Utilities | camelCase | `formatData.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| CSS Classes | lowercase-hyphenated | `warp-ui`, `audit-console` |
| Test Files | `*.test.tsx` | `WarpUI.test.tsx` |

### File Organization

```
app/
 components/
    ui/              # Reusable UI primitives
       Button.tsx
       Input.tsx
    features/        # Feature-specific components
        WarpUI.tsx
 lib/                 # Utility functions
    utils.ts
 hooks/               # Custom React hooks
    useWarp.ts
 types/               # Shared TypeScript types
     index.ts
```

---

## Testing Requirements

### Coverage Requirements

**Hard Requirement**: >95% coverage for all metrics

```bash
npm test -- --coverage

# Must show:
# Lines: >95%
# Statements: >95%
# Functions: >95%
# Branches: >95%
```

### Test File Location

```
tests/
 page.test.tsx          # Test for app/page.tsx
 components/
    WarpUI.test.tsx    # Test for app/components/WarpUI.tsx
 lib/
     utils.test.ts      # Test for app/lib/utils.ts
```

### Test Structure

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Component from '@/app/components/Component'

describe('Component', () => {
  // Setup (if needed)
  beforeEach(() => {
    // Reset state, mocks, etc.
  })

  // Teardown (if needed)
  afterEach(() => {
    // Cleanup
  })

  describe('when user interacts', () => {
    it('should handle click events', async () => {
      render(<Component />)

      const button = screen.getByRole('button', { name: /click me/i })
      await userEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/clicked/i)).toBeInTheDocument()
      })
    })
  })

  describe('with different props', () => {
    it('should render disabled state', () => {
      render(<Component disabled />)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('edge cases', () => {
    it('should handle null input gracefully', () => {
      expect(() => render(<Component data={null} />)).not.toThrow()
    })
  })
})
```

### What to Test

**DO test**:
- User interactions (clicks, typing, etc.)
- Component rendering with different props
- Edge cases (null, undefined, empty arrays)
- Error conditions
- Accessibility (ARIA, keyboard navigation)

**DON'T test**:
- Implementation details (internal state, private methods)
- Third-party libraries (React, Next.js)
- Styling (unless critical to functionality)

---

## Documentation Standards

### When to Update Documentation

**Always update docs when**:
- Adding new features
- Changing APIs or interfaces
- Modifying workflows or processes
- Fixing bugs that affect behavior
- Adding new agents or commands

### Documentation Locations

| Type | Location | Purpose |
|------|----------|---------|
| User docs | `README.md` | User-facing documentation |
| Agent guide | `AGENTS.md` | Universal agent protocols |
| Architecture | `ARCHITECTURE.md` | System design |
| Policies | `CLAUDE.md` | Project standards |
| Contributions | `CONTRIBUTING.md` | This file |
| Inline | Code comments | Explain complex logic |
| API docs | JSDoc comments | Document public APIs |

### Documentation Style

**Be clear and concise**:
```markdown
# Good
The `formatData` function converts raw data to display format.

# Bad
This function is really useful for formatting data in various ways
depending on what you need to do with it.
```

**Use examples**:
```markdown
# Good
Example:
\`\`\`typescript
const result = formatData({ value: 42 })
// result: "42"
\`\`\`

# Bad
You can use formatData to format your data.
```

**Keep it up-to-date**:
- Remove outdated information
- Update version numbers
- Correct broken links

---

## Pull Request Process

### Before Submitting PR

**Checklist**:
- [ ] All tests pass: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Audit passes: `node scripts/verify_audit_block.js`
- [ ] Coverage >95%: Check `coverage/coverage-summary.json`
- [ ] Documentation updated (if needed)
- [ ] Commits follow convention
- [ ] No secrets in code

### PR Title and Description

**Title Format**:
```
<type>: <short description>

Examples:
feat: add dark mode toggle
fix: resolve null pointer in WarpUI
docs: update contribution guidelines
```

**Description Template**:
```markdown
## Description
Brief summary of changes.

## Motivation
Why is this change needed?

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All checks passing
- [ ] Ready for review
```

### PR Size Guidelines

**Ideal PR**:
- < 500 lines changed
- Single logical change
- Easy to review in < 30 minutes

**Large PR (>500 lines)**:
- Break into smaller PRs if possible
- Add detailed description
- Consider splitting by component or feature

### Draft PRs

Use draft PRs for:
- Work in progress
- Seeking early feedback
- Experimenting with approaches

Mark as "Ready for review" when complete.

---

## Agent-Specific Guidelines

### For AI Agents

#### Onboarding Checklist

- [ ] Read `AGENTS.md` completely
- [ ] Read `CLAUDE.md` for project policies
- [ ] Read `ARCHITECTURE.md` for system design
- [ ] Run health check: `npm ci && npm test && npm run build`
- [ ] Verify git access: `git status`
- [ ] Test branch creation: `git checkout -b test-branch`

#### Best Practices

1. **Always follow PTIV** (Plan  Test  Implement  Verify)
2. **Use TodoWrite** or equivalent to track tasks
3. **Read before writing**: Understand existing code
4. **Test thoroughly**: Achieve >95% coverage
5. **Commit atomically**: One logical change per commit
6. **Document changes**: Update relevant docs
7. **Ask when uncertain**: Better to ask than break things

#### Common Pitfalls

**DON'T**:
- Commit without running tests
- Guess at APIs or functionality
- Make changes without understanding impact
- Ignore lint or build errors
- Skip documentation updates
- Commit secrets or credentials

**DO**:
- Verify assumptions by reading code
- Test edge cases
- Follow project conventions
- Keep changes focused and minimal
- Document complex logic
- Use environment variables for secrets

### For Human Reviewers

When reviewing agent-generated PRs:

1. **Verify tests**: Are they comprehensive and deterministic?
2. **Check logic**: Is the implementation correct and maintainable?
3. **Review docs**: Are changes documented?
4. **Test locally**: Does it work as described?
5. **Check compliance**: Did audit script pass?
6. **Provide feedback**: Clear, actionable comments

---

## Review Process

### Review Workflow

```
1. PR Opened
   
    Automated Checks (GitHub Actions)
      Lint
      Test
      Build
      Audit
   
    Automated Review (Claude PR Review)
      Coverage check
      Security scan
      Comment on PR
   
    Human Review
       Code quality
       Architecture fit
       User experience
       Approve or Request Changes

2. Changes Requested
   
    Author addresses feedback
    Automated checks re-run
    Request re-review

3. Approved
   
    Merge to main (squash or merge commit)
    Deploy to production (via Vercel)
    Close PR
```

### Review Criteria

**Code Quality**:
- Is it readable and maintainable?
- Does it follow project conventions?
- Is it well-documented?

**Functionality**:
- Does it solve the problem?
- Are there edge cases?
- Is error handling adequate?

**Testing**:
- Are tests comprehensive?
- Is coverage >95%?
- Are tests deterministic?

**Security**:
- Are inputs validated?
- Are secrets managed properly?
- Are there security vulnerabilities?

**Performance**:
- Is it efficient?
- Are there performance regressions?
- Does it meet performance budgets?

### Review Timeline

- **Automated checks**: ~5 minutes
- **Human review**: Within 24-48 hours
- **Revisions**: As needed
- **Merge**: After approval and passing checks

---

## Getting Help

### Resources

1. **Documentation**:
   - [AGENTS.md](AGENTS.md) - Universal agent guide
   - [CLAUDE.md](CLAUDE.md) - Project policies
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
   - [README.md](README.md) - User documentation

2. **GitHub**:
   - [Issues](https://github.com/unbias-ai/llm_physics/issues) - Bug reports and feature requests
   - [Discussions](https://github.com/unbias-ai/llm_physics/discussions) - Questions and ideas
   - [Pull Requests](https://github.com/unbias-ai/llm_physics/pulls) - Code contributions

3. **Community**:
   - Tag maintainers in issues or PRs
   - Use GitHub Discussions for questions
   - Be patient and respectful

### Common Questions

**Q: How do I run tests for a specific file?**
```bash
npm test -- tests/page.test.tsx
```

**Q: How do I update snapshots?**
```bash
npm test -- -u
```

**Q: How do I check coverage for my changes?**
```bash
npm test -- --coverage
# Check: coverage/coverage-summary.json
```

**Q: Can I use a different AI agent (not Claude)?**
Yes! This repository supports all AI agents. Follow the guidelines in [AGENTS.md](AGENTS.md).

**Q: What if CI fails on my PR?**
1. Check the CI logs for details
2. Run the same commands locally: `npm run lint`, `npm test`, `npm run build`
3. Fix the issues
4. Commit and push (CI will re-run)

**Q: How long until my PR is reviewed?**
Most PRs are reviewed within 24-48 hours. Complex PRs may take longer.

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see [LICENSE](LICENSE) file).

---

## Thank You!

Thank you for contributing to llm_physics! Every contributionwhether code, documentation, tests, or reviewsmakes this project better.

**Special recognition** for agent contributors: You're helping shape the future of AI-assisted development!

---

*Last Updated: 2025-11-06*
*For questions or suggestions, open a GitHub issue.*

---

*End of Contributing Guide*
