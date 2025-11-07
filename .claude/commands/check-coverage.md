---
name: check-coverage
description: >
  Analyze test coverage, identify gaps, report uncovered code paths
---

# Check Coverage Command

Perform comprehensive test coverage analysis. Report coverage metrics, identify gaps, suggest tests for uncovered code.

## Workflow

1. **Run coverage analysis**: `npm run test:coverage`
2. **Parse coverage report**: Read `coverage/coverage-summary.json`
3. **Identify gaps**: Find files/functions below 80% threshold
4. **Generate report**: Summarize uncovered lines, branches, functions
5. **Suggest tests**: Recommend specific test cases for gaps

## Output Format

```
## Coverage Report

### Overall Metrics
- Lines: X%
- Statements: X%
- Functions: X%
- Branches: X%

### Files Below Threshold (<80%)
- file:line: uncovered code description
- file:line: uncovered code description

### Suggested Tests
1. Test case description for file:line
2. Test case description for file:line

### Status
[PASS/FAIL] - threshold met/not met
```

## Agent Responsibilities

- Run automated coverage analysis
- Cross-reference CLAUDE.md coverage requirements (80%)
- Highlight CRITICAL gaps (business logic uncovered)
- Propose specific test implementations
- Update issue/PR with findings

## Manual Usage

Comment on PR: `/@claude check coverage`

## Automated Triggers

- Every PR sync (via CI workflow)
- Post-implementation (agent self-review)
- On coverage regression detection
