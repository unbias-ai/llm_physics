# Pull Request

## Description

<!-- Provide a brief description of the changes -->

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] Test coverage improvement

## Pre-Merge Checklist

### Diff-Based Coding (MANDATORY)
- [ ] Changes are **diff-only** (no full-file rewrites unless justified)
- [ ] Each commit represents a single logical change
- [ ] Commit messages follow format: `<type>: <description>`
- [ ] No unrelated changes in commits

### Testing (MANDATORY)
- [ ] All tests pass locally: `npm test`
- [ ] Coverage 80%: `npm run test:coverage`
- [ ] Accessibility tests pass (if UI changes): `npm run test:a11y`
- [ ] Build succeeds: `npm run build`
- [ ] **Husky pre-commit hook ran successfully** (or manually ran all checks)

### Coverage Artifacts (MANDATORY)
- [ ] `coverage/lcov.info` exists and is non-empty
- [ ] `coverage/lcov.info` starts with `TN:` or `SF:`
- [ ] `coverage/coverage-summary.json` exists

### Security (MANDATORY)
- [ ] No secrets/credentials in code
- [ ] No untrusted PR checkouts in workflows
- [ ] All environment variables use `.env` or Vercel dashboard
- [ ] No `ref: ${{ github.event.pull_request.head.ref }}` with write permissions

### Code Quality
- [ ] TypeScript strict mode (no `any` unless justified)
- [ ] ESLint passes with 0 errors: `npm run lint`
- [ ] Code follows project conventions (see CLAUDE.md)
- [ ] Complex logic has comments
- [ ] Function/component names are descriptive

### Documentation
- [ ] README updated (if user-facing changes)
- [ ] CLAUDE.md updated (if policy changes)
- [ ] Code comments added for complex logic
- [ ] API documentation updated (if applicable)

## Testing Evidence

<!-- Paste evidence of local testing -->

```bash
# Example output:
 Lint: PASS
 Tests: PASS (X/X tests)
 Coverage: PASS (X% all metrics)
 Build: PASS
```

## Diff Audit

**Estimated lines changed:** <!-- Will be auto-filled by GitHub -->
**Files changed:** <!-- Will be auto-filled by GitHub -->
**Full-file rewrites:** <!-- Must be 0 unless justified below -->

<!-- If full-file rewrites exist, justify here: -->

## Screenshots (if UI changes)

<!-- Add screenshots/videos of UI changes -->

## Breaking Changes

<!-- List any breaking changes and migration guide -->

## Additional Context

<!-- Add any other context about the PR here -->

---

## Reviewer Checklist

- [ ] Code changes are minimal and focused
- [ ] Tests adequately cover changes
- [ ] No security vulnerabilities introduced
- [ ] Documentation is clear and complete
- [ ] Commit history is clean (no WIP commits)
