# FOUNDATIONAL_PATTERNS.md
Version: 2.0
Purpose: Repo-wide orchestration best practices
Created: 2025-11-06

---

## PATTERN: DIFF-ONLY COMMITS

**Problem**: Agents edit entire files, causing noisy commits

**Solution**: Edit only changed lines via git diff

**Implementation**:
```bash
# Before editing
git diff app/page.tsx

# Edit only lines shown in diff
# Use Edit tool with exact line matches

# After editing
git diff app/page.tsx
# Verify only intended lines changed
```

**Mandate**: CLAUDE.md enforces diff-only commits

---

## PATTERN: CHECKPOINT-REWIND

**Problem**: Multi-commit fix loops (11 commits for 1 feature)

**Solution**: Checkpoint before risky edits, rewind on failure

**Implementation**:
```bash
# Before experimental work
git commit -m "checkpoint: before [task]"

# Attempt fix
npm test
# If fail:
/rewind  # Restore to checkpoint

# Retry with different approach
# If success:
git commit -m "feat: [task]"  # ONE commit
```

**Mandate**: Max 3 commits per feature, enforced by CI

---

## PATTERN: REFERENCE-BASED LOGGING

**Problem**: Full session logs consume 2500 tokens

**Solution**: Load static references once, append delta logs

**Implementation**:
```python
# Agent startup
refs = load_yaml('PROJECT_REFERENCES.yaml')  # 200 tokens, once
deltas = tail('SESSION_DELTAS.log', 30)       # 50 tokens

# Total: 250 tokens (vs 2500 in v1.0)
```

**Mandate**: v2.0 format only, enforced by token budget

---

## PATTERN: SELF-HEALING CI

**Problem**: Emojis bypass manual checks

**Solution**: CI auto-detects and auto-fixes violations

**Implementation**:
```yaml
# .github/workflows/enforce-no-emoji.yml
- Detect non-ASCII
- Remove emojis
- Commit fix
- Log to SESSION_DELTAS.log
```

**Mandate**: All violations auto-fix, no manual cleanup

---

## PATTERN: ORCHESTRATOR + WORKERS

**Problem**: Sequential task execution (60s CI time)

**Solution**: Orchestrator routes tasks to parallel workers

**Implementation**:
```
Sonnet 4.5 (Orchestrator)
  - Decompose PR into tasks
  - Route app/*.tsx -> test-worker + a11y-worker
  - Route .github/workflows/*.yml -> security-auditor
  - Validate outputs, integrate

Haiku 4.5 (Workers, parallel)
  - test-worker: Generate Jest tests
  - a11y-worker: Run Playwright + axe-core
  - security-auditor: Scan for vulnerabilities
```

**Benefit**: 3x cost savings, 2x faster (15s vs 60s)

**Mandate**: .claude/agent-config.yaml routing rules

---

## PATTERN: FAIL-FAST VALIDATION

**Problem**: Soft-fail (exit 0) masks CI errors

**Solution**: Fail-fast (exit 1) on any violation

**Implementation**:
```bash
# Bad (soft-fail)
if [ ! -f coverage/lcov.info ]; then
  echo "Warning: file missing"
  exit 0  # CI passes despite error
fi

# Good (fail-fast)
if [ ! -f coverage/lcov.info ]; then
  echo "ERROR: file missing"
  exit 1  # CI fails immediately
fi
```

**Mandate**: All validation steps fail-fast

---

## PATTERN: DELTA APPEND-ONLY LOGS

**Problem**: Rewriting logs loses history

**Solution**: Append-only SESSION_DELTAS.log

**Implementation**:
```bash
# Append (good)
echo "[entry]" >> SESSION_DELTAS.log

# Overwrite (bad)
echo "[entry]" > SESSION_DELTAS.log
```

**Benefit**: Queryable history, no data loss

---

## PATTERN: EXTERNAL DIFF STORAGE

**Problem**: Inline diffs bloat context

**Solution**: Save diffs to .diffs/, load on-demand

**Implementation**:
```bash
# After commit
git diff HEAD~1 > .diffs/$(date -u +%Y-%m-%dT%H:%M:%SZ).diff

# Load when needed
cat .diffs/2025-11-06T14:30:00Z.diff
```

**Benefit**: 0 tokens unless explicitly loaded

---

## PATTERN: TSV METRICS

**Problem**: Unstructured logs hard to query

**Solution**: Tab-separated PROJECT_METRICS.tsv

**Implementation**:
```bash
# Append row
echo -e "$timestamp\t$agent\t$task\t$status\t$lines" >> PROJECT_METRICS.tsv

# Query
awk -F'\t' '$2 == "sonnet-4.5"' PROJECT_METRICS.tsv
```

**Benefit**: Queryable, aggregatable, parseable

---

END OF FOUNDATIONAL_PATTERNS.md
For self-healing patterns, see SELF_HEALING_PLAYBOOK.md
