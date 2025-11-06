---
name: deploy-vercel
usage: "/deploy-vercel"
description: >
  Command to trigger a Vercel deployment via MCP, monitor, and report status.
---

# Deploy Vercel Command

Trigger and monitor a Vercel deployment with automated health checks and rollback capabilities.

## Usage

```bash
/deploy-vercel
```

## Prerequisites

- All tests must pass
- Test coverage must meet threshold (>95%)
- Lint checks must pass
- No CRITICAL audit findings

## Steps

1. **Pre-deployment Validation**
   - Verify tests pass
   - Check coverage threshold
   - Run lint and build checks
   - Validate no secrets in code

2. **Initiate Deployment**
   - Use MCP tool `vercel-create-deployment`
   - Target project: llm_physics
   - Git source: current branch
   - Log deployment ID and metadata

3. **Monitor Deployment**
   - Poll deployment status via `vercel-get-deployment`
   - Wait for "ready" or "failed" status
   - Stream deployment logs
   - Track progress and timing

4. **Post-deployment Health Checks**
   - Verify deployment URL responds
   - Check Core Web Vitals
   - Validate bundle size < 350KB
   - Run smoke tests

5. **Success Actions**
   - Update statusline with deployment URL
   - Comment on PR with deployment details
   - Log successful deployment
   - Archive deployment artifacts

6. **Failure Handling**
   - Trigger automatic rollback to last good deployment
   - Log detailed error information
   - Raise compliance error
   - Notify relevant stakeholders

## Output

- Deployment URL (on success)
- Deployment logs and metadata
- Health check results
- Performance metrics
- Audit log entry

## Rollback Conditions

- Deployment fails
- Health checks fail
- Performance budgets exceeded
- Core Web Vitals fail
