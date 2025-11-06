# SELF_HEALING_PLAYBOOK.md
Version: 2.0
Purpose: Diagnostic patterns + autonomous fixes for common issues
Created: 2025-11-06

---

## AUTO-DEBUG PROTOCOL

When agents encounter issues, follow:
1. SCAN: Detect pattern (emoji, test failure, token bloat)
2. DIAGNOSE: Identify root cause
3. LOCATE: Find affected files/modules
4. FIX: Apply correction (isolated, testable)
5. VERIFY: Re-run checks
6. LOG: Append to SESSION_DELTAS.log

---

## PATTERN 1: EMOJI ENFORCEMENT

### Detection
```bash
grep -r '[^\x00-\x7F]' *.md .claude/*.md
```

### Root Causes
- Manual edit bypassed CI
- Copy-paste from external source
- Editor auto-inserted smart quotes

### Fix
```bash
# Remove all non-ASCII
LC_ALL=C sed -i 's/[^\x00-\x7F]//g' [file]

# Replace common patterns
sed -i 's/--/--/g' [file]  # em-dash
sed -i "s/'/'/" [file]      # smart quote
```

### Verification
```bash
grep -r '[^\x00-\x7F]' *.md
# Should return nothing
```

### Prevention
- enforce-no-emoji.yml workflow (CI auto-fix)
- Pre-commit hook validation
- Editor configured for ASCII-only

---

## PATTERN 2: TOKEN BLOAT

### Detection
```bash
wc -w AGENT_PROGRESS_LOG.md
# If > 5000 words, token bloat detected
```

### Root Cause
- Agents loading full v1.0 log instead of v2.0 references
- Inline diffs not externalized

### Fix
```bash
# Migrate to v2.0 format
python3 << 'PY'
# Extract sessions, save diffs to .diffs/
# Convert to reference format
# Update agents to load PROJECT_REFERENCES.yaml
PY
```

### Verification
```bash
wc -w PROJECT_REFERENCES.yaml SESSION_DELTAS.log
# Should be < 500 words total
```

### Prevention
- Agents load PROJECT_REFERENCES.yaml first
- CLAUDE.md mandate: use v2.0 format only

---

## PATTERN 3: TEST FAILURES

### Detection
```bash
npm test
# Exit code != 0
```

### Root Causes
- Code change broke existing tests
- Missing test coverage for new code
- Flaky test (timing, randomness)

### Fix
```bash
# Rewind to checkpoint
/rewind

# Re-run tests with verbose output
npm test -- --verbose

# Fix specific test
# Re-run
npm test
```

### Verification
```bash
npm test
# Exit code == 0, all tests pass
```

### Prevention
- Checkpoint before risky edits
- TDD workflow (test first, then code)
- Pre-commit hook runs tests

---

## PATTERN 4: COVERAGE REGRESSION

### Detection
```bash
npm run test:coverage
# Coverage < 80%
```

### Root Cause
- New code added without tests
- Existing tests deleted

### Fix
```bash
# Identify uncovered lines
npm run test:coverage -- --verbose

# Write missing tests
# Re-run coverage
npm run test:coverage
```

### Verification
```bash
grep "All files" coverage/lcov-report/index.html
# Should show >= 80%
```

### Prevention
- Pre-commit check enforces coverage threshold
- CI blocks merge if coverage drops

---

## PATTERN 5: SECURITY VIOLATIONS

### Detection
```bash
grep -r "pull_request.head" .github/workflows/
# If found with write permissions, HIGH severity
```

### Root Cause
- Workflow checks out untrusted PR code
- Write permissions + untrusted checkout = RCE risk

### Fix
```bash
# Remove untrusted checkout pattern
sed -i '/pull_request\.head/d' .github/workflows/[file]

# Use base branch instead
# ref: ${{ github.event.pull_request.base.ref }}
```

### Verification
```bash
grep -r "pull_request.head" .github/workflows/
# Should return nothing
```

### Prevention
- Pre-commit security audit
- CodeQL checks workflows
- CLAUDE.md mandate: never checkout untrusted code with write perms

---

## SELF-HEALING LOGGING

After fix, append to SESSION_DELTAS.log:

```
[timestamp] | self-heal | [pattern] | PASS | [metrics]
```

Example:
```
2025-11-06T16:00:00Z | self-heal | emoji-removal | PASS | files:3,emojis:15
```

---

## ESCALATION RULES

When to flag for human review:

1. **Fix attempt fails 3x**: Log blocker, stop execution
2. **Security HIGH/CRITICAL**: Always escalate, never auto-fix
3. **Breaking change detected**: Confirm with human before applying
4. **Unknown pattern**: Log for human analysis

Escalation format:
```
[timestamp] | ESCALATE | [issue] | [attempted fixes] | [blocker]
```

---

END OF SELF_HEALING_PLAYBOOK.md
For deployment steps, see ORCHESTRATION_DEPLOYMENT_GUIDE.md
