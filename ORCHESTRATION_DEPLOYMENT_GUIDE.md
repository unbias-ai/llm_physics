# ORCHESTRATION_DEPLOYMENT_GUIDE.md
Version: 2.0
Purpose: Step-by-step deployment of agent orchestration system
Created: 2025-11-06

---

## DEPLOYMENT OVERVIEW

Time: 45 minutes
Files: 12 (9 new, 3 initialization)
Breaking changes: None (backward compatible)
Rollback: Keep v1.0 files as backup

---

## PRE-DEPLOYMENT CHECKLIST

- [ ] Git repo clean (no uncommitted changes)
- [ ] All tests passing: npm test
- [ ] Coverage >= 80%: npm run test:coverage
- [ ] No emojis in existing files: grep -r '[^\x00-\x7F]' *.md

---

## TIER 1: CORE SYSTEM (10 minutes)

### Step 1.1: Deploy START_HERE.txt
```bash
cp START_HERE.txt /home/user/llm_physics/
```

### Step 1.2: Deploy AGENT_PROGRESS_LOG_v2.md
```bash
cp AGENT_PROGRESS_LOG_v2.md /home/user/llm_physics/
```

### Step 1.3: Deploy enforce-no-emoji.yml
```bash
cp enforce-no-emoji.yml /home/user/llm_physics/.github/workflows/
```

### Step 1.4: Deploy SCALE_CODEC.md
```bash
cp SCALE_CODEC.md /home/user/llm_physics/
```

### Step 1.5: Deploy this file
```bash
cp ORCHESTRATION_DEPLOYMENT_GUIDE.md /home/user/llm_physics/
```

---

## TIER 2: SYSTEM FILES (5 minutes)

### Step 2.1: Update agent-config.yaml
```bash
# Already exists, verify self-healing rules present
grep "self_healing" .claude/agent-config.yaml
```

### Step 2.2: Deploy SELF_HEALING_PLAYBOOK.md
```bash
cp SELF_HEALING_PLAYBOOK.md /home/user/llm_physics/
```

### Step 2.3: Deploy FOUNDATIONAL_PATTERNS.md
```bash
cp FOUNDATIONAL_PATTERNS.md /home/user/llm_physics/
```

### Step 2.4: Deploy CHANGELOG_v1_to_v2.md
```bash
cp CHANGELOG_v1_to_v2.md /home/user/llm_physics/
```

---

## TIER 3: INITIALIZATION (3 minutes)

### Step 3.1: Create PROJECT_REFERENCES.yaml
```bash
cat > PROJECT_REFERENCES.yaml << 'YAML'
# PROJECT_REFERENCES.yaml
# Static context loaded once per agent session
# Token cost: ~200 tokens

stack:
  framework: Next.js 22.x
  styling: Tailwind CSS
  testing: Jest + Playwright
  ci_cd: GitHub Actions
  deployment: Vercel
  node: 22.x

mandates:
  coverage_threshold: 80
  emoji_enforcement: true
  diff_only_commits: true
  security_audit: required
  pre_commit_checks: [lint, test, coverage, build, security]

routing_rules:
  "app/*.tsx": [test-worker, accessibility-worker]
  ".github/workflows/*.yml": [security-auditor]
  "jest.config.js": [coverage-validator]
  "tests/*.test.ts": [test-generation-worker]

performance_targets:
  ci_total_time_sec: 60
  coverage_minimum_pct: 80
  lighthouse_score: 95
  a11y_violations: 0
  security_violations: 0
YAML
```

### Step 3.2: Create SESSION_DELTAS.log (empty)
```bash
touch SESSION_DELTAS.log
```

### Step 3.3: Create PROJECT_METRICS.tsv (with headers)
```bash
cat > PROJECT_METRICS.tsv << 'TSV'
timestamp	agent	task	status	lines_added	lines_removed	commits	duration_min	tokens_used
TSV
```

### Step 3.4: Create .diffs/ directory
```bash
mkdir -p .diffs/archive
echo "*.diff" >> .gitignore
echo ".diffs/" >> .gitignore
```

---

## TIER 4: UPDATE CLAUDE.MD (5 minutes)

Add self-healing section to CLAUDE.md after "Agent Memory & Coordination Files":

```markdown
## Self-Healing System

**Auto-Debug Protocol**: Agents detect, diagnose, and fix issues autonomously.

Supported patterns:
- Emoji enforcement (auto-remove non-ASCII)
- Token bloat (switch to reference format)
- Test failures (rewind checkpoint, retry)
- Coverage regression (re-run with --coverage)
- Security violations (flag + block merge)

Playbook: SELF_HEALING_PLAYBOOK.md
Patterns: FOUNDATIONAL_PATTERNS.md
Metrics: SESSION_DELTAS.log + PROJECT_METRICS.tsv
```

---

## VERIFICATION (5 minutes)

### Verify files exist
```bash
ls -1 START_HERE.txt \
     AGENT_PROGRESS_LOG_v2.md \
     SCALE_CODEC.md \
     ORCHESTRATION_DEPLOYMENT_GUIDE.md \
     SELF_HEALING_PLAYBOOK.md \
     FOUNDATIONAL_PATTERNS.md \
     CHANGELOG_v1_to_v2.md \
     PROJECT_REFERENCES.yaml \
     SESSION_DELTAS.log \
     PROJECT_METRICS.tsv \
     .github/workflows/enforce-no-emoji.yml
```

### Verify no emojis
```bash
grep -r '[^\x00-\x7F]' *.md .claude/*.md
# Should return nothing
```

### Verify git status clean
```bash
git status
# All files should be staged or committed
```

---

## COMMIT AND PUSH (2 minutes)

```bash
git add -A
git commit -m "feat: agent orchestration v2.0 (self-healing + token optimization)"
git push -u origin $(git branch --show-current)
```

---

## TEST DEPLOYMENT (15 minutes)

### Create test PR

1. Create test branch:
```bash
git checkout -b test/orchestration-v2-validation
```

2. Make small change (add comment to app/page.tsx):
```bash
echo "// Test v2.0 orchestration" >> app/page.tsx
```

3. Commit:
```bash
git add app/page.tsx
git commit -m "test: validate v2.0 orchestration"
```

4. Push:
```bash
git push -u origin test/orchestration-v2-validation
```

5. Create PR:
```bash
gh pr create --title "Test: Validate v2.0 Orchestration" --body "Testing v2.0 system"
```

### Verify CI passes

- [ ] enforce-no-emoji workflow runs
- [ ] No emojis detected
- [ ] All tests pass
- [ ] Coverage >= 80%

### Verify logging

Check SESSION_DELTAS.log populated:
```bash
tail -5 SESSION_DELTAS.log
# Should show new entry
```

Check PROJECT_METRICS.tsv populated:
```bash
tail -5 PROJECT_METRICS.tsv
# Should show new row
```

### Verify v2.0 format

Check AGENT_PROGRESS_LOG_v2.md:
```bash
tail -10 AGENT_PROGRESS_LOG_v2.md
# Should show reference format
```

---

## POST-DEPLOYMENT

### Monitor

- Check SESSION_DELTAS.log daily
- Review PROJECT_METRICS.tsv weekly
- Archive .diffs/ monthly

### Troubleshooting

If issues occur, see SELF_HEALING_PLAYBOOK.md.

Common issues:
- Emojis detected: enforce-no-emoji workflow auto-fixes
- Token usage high: Verify agents loading PROJECT_REFERENCES.yaml
- Logs not updating: Check agent append protocol

---

## ROLLBACK PROCEDURE

If critical issues:

1. Revert commit:
```bash
git revert HEAD
git push
```

2. Restore v1.0 files:
```bash
git checkout HEAD~1 AGENT_PROGRESS_LOG.md
```

3. Disable enforce-no-emoji workflow:
```bash
rm .github/workflows/enforce-no-emoji.yml
git commit -m "rollback: disable v2.0 emoji enforcement"
git push
```

---

## SUCCESS CRITERIA

- [ ] All 12 files deployed
- [ ] No emojis in any markdown file
- [ ] enforce-no-emoji workflow passing
- [ ] SESSION_DELTAS.log populating
- [ ] PROJECT_METRICS.tsv queryable
- [ ] Agents report faster startup (token reduction)
- [ ] Test PR passed all checks

---

END OF ORCHESTRATION_DEPLOYMENT_GUIDE.md
For token optimization details, see SCALE_CODEC.md
