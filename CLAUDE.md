# CLAUDE.md — Agentic Policy for llm_physics

## Project Overview

Monorepo for reproducible physics LLM tooling with Next.js/Tailwind frontends and agentic automation workflows. This project implements cutting-edge Claude Code orchestration patterns, emphasizing reproducibility, auditability, and maintainability.

## Tech Stack

- **Framework**: Next.js 16+ (App Router), React 19+
- **Language**: TypeScript (strict mode, no `any` unless justified)
- **Styling**: Tailwind CSS v4 (utility-first, minimal custom CSS)
- **Testing**: Jest (unit), React Testing Library (components), Playwright (E2E)
- **Deployment**: Vercel (with MCP integration)
- **Orchestration**: Claude Code 2.0 with multi-agent workflows

## Architecture Principles

1. **Reproducibility**: No external assets; all dependencies explicit in package.json
2. **Auditability**: All automated actions logged to artifacts/audit_logs/
3. **Maintainability**: Clear separation of concerns, comprehensive tests
4. **Extensibility**: Agent-based architecture for progressive feature addition

## Naming Conventions

- **Components**: lowercase-hyphenated (warp-ui, audit-console, orb-panel)
- **Files**: PascalCase for components (WarpUI.tsx), camelCase for utilities (formatData.ts)
- **Tests**: ComponentName.test.tsx or __tests__/ComponentName.test.tsx
- **Formatting**: Minimal, no emojis, no noise
- **Conciseness**: Extreme brevity required. Sacrifice grammar for concision. Apply to all commits, messages, documentation

## Code Style

- All files use strict TypeScript with no `any` unless explicitly justified in comments
- Prefer functional components and React Server Components by default
- Use Tailwind utility classes; custom CSS only for design tokens
- Explicit error handling with proper TypeScript error types
- Prefer composition over inheritance
- Keep functions small and single-purpose
- Document complex logic with clear comments

## Diff-Based Coding Practice

**Core Principle**: All coding agents must work "with diff" rather than "without diff" to ensure precision, traceability, and reproducibility.

### What is Coding with Diff?

When you code "with diff," you work only with the exact lines that changed between two versions of a file, as shown by commands like `git diff`. This approach keeps both humans and AI assistants focused on the delta instead of the entire repository.

### Benefits of Diff-Based Coding

1. **Prevents Accidental Edits**: By focusing only on changed lines, you avoid unintentional modifications to unrelated code
2. **Reduces Noise**: Reviews and commits contain only relevant changes, making them easier to understand
3. **Ensures Traceability**: Every suggestion is anchored to a specific change, creating a clear audit trail
4. **Maintains Concise Commits**: Commit messages stay focused on the actual changes made
5. **Guarantees Reproducibility**: The AI's context is explicitly bounded to the diff block, preventing hallucinated edits
6. **Simplifies Reviews**: Reviewers see exactly what changed without wading through unchanged code

### Diff-Based vs. Whole-File Coding

**Coding WITH Diff (Required)**:
- Context limited to changed lines from `git diff`
- Edits are precise and traceable
- Commit messages reflect actual changes
- Audit trail is clean and verifiable
- Reviews focus on relevant changes only

**Coding WITHOUT Diff (Discouraged)**:
- Entire file or repository exposed as context
- Risk of bloated commits with unrelated changes
- Potential for hallucinated or accidental edits
- Broken audit trails and unclear change rationale
- Difficult to review and verify changes

### Implementation Guidelines

1. **Always Review Diffs**: Before making changes, run `git diff` to understand the current state
2. **Anchor Context**: When editing, reference only the lines shown in the diff
3. **Verify Changes**: After editing, run `git diff` again to confirm only intended lines changed
4. **Atomic Commits**: Each commit should represent a single logical change visible in its diff
5. **Clear Boundaries**: If a change requires touching unrelated code, consider splitting into multiple commits

### Example Workflow

```bash
# 1. Check current diff
git diff

# 2. Make focused changes to only the lines that need modification
# (using Edit tool with exact line matches from the diff)

# 3. Verify the diff contains only intended changes
git diff

# 4. Commit with a message that describes the diff
git commit -m "fix: correct validation logic in user input handler"

# 5. Review the committed diff
git show HEAD
```

### Integration with Agent Workflows

- **test-autogen-agent**: Generates tests based on diff context, ensuring tests cover only changed functionality
- **vercel-deploy-specialist**: Deploys based on diff analysis, triggering only affected build steps
- **repo-auditor**: Audits changes in the diff, not the entire codebase, for faster feedback

### Compliance

- All PRs must show clean, focused diffs
- Commits containing unrelated changes will be flagged in review
- Agents that produce noisy diffs will be corrected or disabled
- Diff-based coding is enforced by code review and audit processes

## Testing Policy

### Coverage Requirements

- **Minimum coverage**: 95% for all metrics (lines, statements, functions, branches)
- **Enforcement**: CI blocks merge if coverage below threshold
- **Exceptions**: Explicitly documented in test files with justification

### Testing Strategy

1. **TDD Workflow**: Prefer test-first development
   - Write failing test
   - Implement minimal code to pass
   - Refactor while keeping tests green

2. **Unit Tests**: Jest for business logic, utilities, and hooks
   - Test pure functions in isolation
   - Mock external dependencies
   - Test edge cases and error conditions

3. **Component Tests**: React Testing Library
   - Test user interactions
   - Validate accessibility
   - Test component behavior, not implementation

4. **E2E Tests**: Playwright for critical user flows
   - Test complete user journeys
   - Validate integration with backend services
   - Test across browsers when necessary

### Test Organization

- Place tests in `__tests__` directories or adjacent `*.test.ts(x)` files
- Group related tests with `describe` blocks
- Use descriptive test names that explain expected behavior
- Include setup/teardown as needed
- Ensure tests are deterministic and isolated

### Coverage Enforcement

**Minimum Threshold**: 80% global coverage (lines, branches, functions, statements)

**Tools**: Vitest + c8 (primary) or Jest + Istanbul

**CI Enforcement**:
- CI fails if coverage drops below 80%
- PR blocked on coverage regression
- Coverage delta reported in PR comments

**Coverage Reporting**:
- HTML report: `coverage/index.html`
- LCOV format for CI integration
- Uploaded as artifact on every PR

**Exclusions** (documented only):
- Auto-generated files (justified in config)
- Type definitions (*.d.ts)
- Test setup files

**Agent Requirements**:
- Every new/modified function must have tests
- No PR without tests for business logic
- Coverage gaps trigger `/@claude check coverage`
- Agent must run `npm run test:coverage` before commit

**Manual Triggers**:
- `/@claude check coverage`: Full coverage audit + gap report
- `/generate-tests [path]`: Auto-generate missing tests

## Compliance and Audit

### Audit Requirements

- All PRs require passing repo-auditor workflow
- Block merge on any CRITICAL findings
- All deployments produce audit log artifacts
- Audit logs retained for 90 days minimum

### Security Auditing

**CRITICAL Issues (block merge):**
- Exposed secrets, credentials, or API keys
- Known security vulnerabilities
- Missing authentication on protected endpoints
- SQL injection or XSS vulnerabilities

**HIGH Issues (should fix before merge):**
- Missing rate limiting on public APIs
- Weak password policies
- Insecure direct object references
- Missing CSRF protection

### Performance Auditing

**Requirements:**
- Home/root page must pass Core Web Vitals
- Maximum bundle size: 350KB (gzipped)
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.8s
- Failed performance budgets trigger deployment rollback

### Accessibility Auditing

**Requirements:**
- All UIs must be accessible (WCAG 2.1 AA minimum)
- Keyboard navigation fully functional
- Screen reader compatible
- Proper ARIA attributes
- Color contrast ratios meet standards
- A11y agent runs on every PR

## Security Rules

### Authentication and Authorization

- All endpoints require explicit authentication
- Use environment variables for all secrets
- Never commit secrets, keys, or credentials
- Rate limit all public APIs and heavy actions
- Validate and sanitize all user inputs
- Use HTTPS for all external communications

### Environment Variables

- Store in Vercel dashboard, never in code
- Required variables documented in .mcp.json
- Validate presence at application startup
- Use different values for dev/staging/production

### Agent and Plugin Security

- Only agents/plugins listed in .claude/settings.json enabled
- All MCP calls logged for audit trail
- MCP permissions start read-only, escalate only with review
- Regular security audits of agent configurations

## MCP and Vercel Integration

### Deployment Strategy

- Deployment and status via MCP only
- MCP configuration in .mcp.json (update only via PR)
- Automatic rollback if performance budgets not met
- All deployments logged with audit trail

### Vercel Requirements

- VERCEL_TOKEN in GitHub Secrets
- VERCEL_PROJECT_ID configured
- OAuth for MCP authentication
- Health monitoring post-deployment
- Core Web Vitals validation

## Workflow and Development Process

### Development Workflow

1. **Plan**: Break down feature/fix into testable steps. End every plan with unresolved questions list (if any). Extreme concision required
2. **Test**: Write tests first (TDD) or alongside implementation
3. **Implement**: Write minimal code to pass tests
4. **Verify**: Run tests, lint, build locally
5. **Commit**: Extremely concise messages. Sacrifice grammar for brevity
6. **PR**: Submit via GitHub CLI (`gh pr create`). Primary method for all GitHub ops
7. **Review**: Automated + human review required
8. **Deploy**: Automated deployment on merge to main

### Branch Strategy

- `main`: Production-ready code
- `claude/*`: Feature branches for Claude Code automation
- PRs require passing CI and human approval
- Protected branches enforce all checks

### GitHub Operations

**REQUIRED**: Use GitHub CLI (`gh`) as primary method for all GitHub interactions

- **PRs**: `gh pr create`, `gh pr list`, `gh pr view`, `gh pr merge`
- **Issues**: `gh issue create`, `gh issue list`, `gh issue view`, `gh issue close`
- **Status**: `gh pr status`, `gh pr checks`
- **Reviews**: `gh pr review`, `gh pr comment`

Do NOT use web URLs or manual processes. CLI ensures reproducibility + audit trail

### Commit Messages

- Conventional commits format
- Extreme concision. Sacrifice grammar
- Reference issues/PRs when applicable
- Examples:
  - `feat: warp-ui viz component`
  - `fix: CI coverage report`
  - `docs: CLAUDE.md audit policy`
  - `test: E2E deploy flow`

## Agentic Orchestration

### Available Agents

1. **test-autogen-agent**: Autonomous test generation with TDD workflow
2. **vercel-deploy-specialist**: Deployment orchestration and monitoring
3. **repo-auditor**: Comprehensive compliance auditing

### Available Commands

- `/generate-tests [paths]`: Generate comprehensive test suites
- `/deploy-vercel`: Trigger Vercel deployment with monitoring
- `/audit-repo [level]`: Run full repository compliance audit

### Agent Behavior

- Agents follow TDD and plan-test-implement-verify workflow
- All agent actions logged for audit
- Agents respect CLAUDE.md policies and conventions
- Exactly one task in_progress at any time
- Complete current tasks before starting new ones

### Agent Self-Review and Cross-Review

**Self-Review Protocol**: Every agent MUST review its own output before completion

1. **Pre-Commit Review**: Analyze own code changes via `git diff`
   - Check coverage: all new/modified code has tests
   - Verify style: TypeScript strict, no `any`, follows conventions
   - Validate diff: only intended lines changed
   - Confirm audit trail: clear, concise commit message

2. **Post-Implementation Audit**: Run automated checks
   - Tests pass: `npm test`
   - Coverage maintained: `npm run test:coverage`
   - Build succeeds: `npm run build`
   - Lint clean: `npm run lint`

3. **Self-Critique**: Document gaps in work summary
   - Unresolved edge cases
   - Areas needing human review
   - Potential improvements

**Cross-Review Protocol**: Agents review other agents' work when triggered

1. **Conflict Detection**: Before modifying agent-touched files
   - Check `git log [file]` for recent agent commits
   - Review existing tests for overlap
   - Coordinate via commit messages if conflict likely

2. **Agent-to-Agent Review Triggers**:
   - `/@claude review-agent [agent-name]`: Full audit of agent's recent work
   - Auto-trigger: When agent modifies another agent's files (notify in commit)
   - CI failure: Agent that broke build must self-diagnose or request cross-review

3. **Review Scope**:
   - Code quality: style, structure, patterns
   - Test coverage: gaps, missing edge cases
   - Security: exposed secrets, auth issues
   - Performance: bundle size, Core Web Vitals
   - Accessibility: WCAG compliance

4. **Conflict Avoidance**:
   - Lock mechanism: One agent per file at a time (via commit messages)
   - Coordination: Agents announce intent in PR comments before major refactors
   - Merge conflicts: Agent that caused conflict resolves it

**Review Output Format**:
```
## Agent Self-Review: [agent-name]

### Changes Made
- file:line: description

### Tests Added/Updated
- test-file: coverage

### Self-Audit Results
- ✅ Tests pass
- ✅ Coverage ≥80%
- ✅ Build succeeds
- ✅ Diff clean

### Gaps/Risks
- [issue]: [description]

### Review Status
[PASS/NEEDS_HUMAN_REVIEW]
```

## Progress Tracking

### PR Updates

Claude must update PR comments with:
- ✅ Completed modules
- 🔄 In-progress modules
- ⏳ Pending modules
- 📊 CI status summary
- 📋 Next actionable steps

### Status Reporting

- Clear, concise progress updates
- No emojis unless explicitly requested
- Focus on actionable information
- Include links to relevant artifacts

## Review Rules

### Automated Review Checks

- ✅ No hidden dependencies
- ✅ Reproducible build
- ✅ Next.js App Router structure confirmed
- ✅ Tailwind configuration correct
- ✅ Tests present and passing
- ✅ CI workflow functional
- ✅ Coverage meets threshold
- ✅ No security vulnerabilities
- ✅ Audit logs generated

### Human Review Requirements

- Code quality and maintainability
- Architecture and design decisions
- User experience considerations
- Documentation completeness

## Error Handling

- All errors properly typed with TypeScript
- User-facing errors are clear and actionable
- System errors logged with context
- Graceful degradation where possible
- Never expose sensitive information in errors

## Performance Optimization

- Code splitting for large bundles
- Image optimization with Next.js Image
- Lazy loading for heavy components
- Memoization for expensive calculations
- Server-side rendering for initial load
- Static generation where possible

## Accessibility Standards

- Semantic HTML elements
- Proper heading hierarchy
- Alternative text for images
- Keyboard navigation support
- Focus management
- ARIA labels where needed
- High contrast mode support
- Screen reader testing

## Maintenance and Updates

### CLAUDE.md Maintenance

- Update on every policy or stack change
- Review quarterly for relevance
- Maintain concise, actionable format
- Version control all changes

### Dependency Management

- Regular security audits
- Update dependencies systematically
- Test thoroughly after updates
- Document breaking changes

### Documentation

- Keep README.md user-focused
- Keep CLAUDE.md policy-focused
- Document complex features inline
- Maintain changelog for releases

## Extension and Customization

### Adding New Agents

1. Create agent definition in `.claude/agents/`
2. Update `.claude-plugin/marketplace.json`
3. Add entry to `.claude/settings.json`
4. Document in CLAUDE.md
5. Submit PR with tests and examples

### Adding New Commands

1. Create command template in `.claude/commands/`
2. Update `.claude-plugin/marketplace.json`
3. Document usage in CLAUDE.md
4. Test thoroughly before enabling

### Updating MCP Integration

1. Update `.mcp.json` configuration
2. Document new permissions/tools
3. Submit PR with security review
4. Never escalate permissions without review

## Compliance Triggers

### PR Comments

```
@claude review this PR for reproducibility, audit logic, and CI/test coverage
@claude summarize progress and propose next steps
@claude audit-repo HIGH
```

### Automatic Triggers

- Every PR: Lint, test, build, audit
- Every merge to main: Deploy, monitor, log
- Nightly: Full security audit
- Weekly: Dependency vulnerability scan

## Known Limitations

- MCP integration requires manual setup (Vercel token)
- Some audit checks require additional tools
- Performance monitoring requires Vercel Pro
- Full E2E tests require deployment environment

## Future Enhancements (Planned)

- Visual regression testing with Percy
- Lighthouse CI integration
- Bundle analysis automation
- Performance budget dashboard
- Real-time monitoring integration

---

**This file is the authoritative source for project policies and is included in every Claude Code session. All contributors (human and AI) must adhere to these standards.**

*Last updated: 2025-11-06*
