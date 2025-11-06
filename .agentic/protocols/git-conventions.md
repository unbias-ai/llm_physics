# Git Conventions Protocol

**Version**: 1.0.0
**Applies To**: All AI agents
**Status**: Required

---

## Overview

Consistent git practices enable better collaboration, easier debugging, and clearer history.

---

## Branch Naming

### Format

```
<type>/<short-description>
```

### Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat/dark-mode` |
| `fix` | Bug fix | `fix/null-pointer` |
| `docs` | Documentation only | `docs/api-guide` |
| `test` | Tests only | `test/warp-ui` |
| `refactor` | Code refactoring | `refactor/extract-utils` |
| `ci` | CI/CD changes | `ci/add-coverage-check` |
| `chore` | Maintenance | `chore/update-deps` |

### Agent Branches

For AI agents, include agent identifier:

```
<agent-name>/<type>-<description>
```

Examples:
- `claude/feat-dark-mode`
- `gpt4/fix-api-error`
- `gemini/test-coverage`

### Examples

```bash
# Human developer
git checkout -b feat/user-authentication

# Claude agent
git checkout -b claude/feat-dark-mode-toggle

# GPT-4 agent
git checkout -b gpt4/fix-memory-leak

# Gemini agent
git checkout -b gemini/test-api-integration
```

---

## Commit Messages

### Format (Conventional Commits)

```
<type>: <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests
- `refactor`: Code refactoring
- `chore`: Maintenance
- `ci`: CI/CD changes
- `perf`: Performance improvement
- `style`: Code style (formatting, no logic change)

### Rules

1. **First line** (subject):
   - Max 72 characters
   - Lowercase (except proper nouns)
   - No period at end
   - Imperative mood ("add" not "added" or "adds")

2. **Body** (optional):
   - Wrap at 72 characters
   - Explain WHAT and WHY, not HOW
   - Separate from subject with blank line

3. **Footer** (optional):
   - Breaking changes: `BREAKING CHANGE: description`
   - Issue references: `Refs: #123` or `Closes: #456`

### Examples

#### Simple Commit

```bash
git commit -m "feat: add dark mode toggle to settings"
```

#### Detailed Commit

```bash
git commit -m "$(cat <<'EOF'
feat: implement user authentication system

Add JWT-based authentication with the following features:
- User registration and login
- Password hashing with bcrypt
- Token refresh mechanism
- Protected API routes

This lays the foundation for personalized user experiences
and role-based access control to be added in future updates.

Refs: #123
EOF
)"
```

#### Bug Fix

```bash
git commit -m "$(cat <<'EOF'
fix: prevent null pointer exception in WarpUI component

The component was not checking for null data before rendering,
causing crashes when API returned empty responses.

Added null check and loading state to handle this case gracefully.

Closes: #456
EOF
)"
```

#### Breaking Change

```bash
git commit -m "$(cat <<'EOF'
feat: migrate to new API endpoint

BREAKING CHANGE: The /api/v1/data endpoint has been replaced with
/api/v2/data. Clients must update their API calls.

The new endpoint provides better performance and additional fields
in the response object.

Migration guide: docs/MIGRATION.md

Refs: #789
EOF
)"
```

---

## Commit Frequency

### Guidelines

**DO commit frequently**:
- After completing a subtask
- When tests pass
- Before switching context
- At logical checkpoints

**DON'T commit**:
- Broken code (unless WIP on personal branch)
- Failing tests
- Code that doesn't lint

### Atomic Commits

Each commit should represent a single logical change:

```bash
# ✅ GOOD - Atomic commits
git commit -m "feat: add User model"
git commit -m "feat: add user registration endpoint"
git commit -m "test: add tests for user registration"

# ❌ BAD - Monolithic commit
git commit -m "add user feature with tests and docs"
```

---

## Commit Workflow

### Standard Workflow

```bash
# 1. Check status
git status

# 2. Review changes
git diff

# 3. Stage files
git add app/components/NewComponent.tsx
git add tests/NewComponent.test.tsx

# 4. Commit with message
git commit -m "feat: add NewComponent with tests"

# 5. Push to remote
git push origin feat/new-component
```

### Using HEREDOC for Multi-line Messages

```bash
git commit -m "$(cat <<'EOF'
feat: implement dark mode toggle

Add comprehensive dark mode support:
- Theme context provider
- Toggle button in settings
- CSS variables for colors
- Persistence in localStorage

All components now respect user theme preference.

Refs: #123
EOF
)"
```

---

## Branch Management

### Creating Branches

```bash
# Create and switch to new branch
git checkout -b feat/new-feature

# Or (newer Git)
git switch -c feat/new-feature
```

### Keeping Branches Updated

```bash
# Fetch latest changes
git fetch origin

# Rebase onto main (keep history clean)
git rebase origin/main

# Or merge (preserves branch history)
git merge origin/main

# Resolve conflicts if needed
git status
# Edit conflicting files
git add <resolved-files>
git rebase --continue  # or git merge --continue
```

### Deleting Branches

```bash
# Delete local branch (after merge)
git branch -d feat/completed-feature

# Force delete (if not merged)
git branch -D feat/abandoned-feature

# Delete remote branch
git push origin --delete feat/completed-feature
```

---

## Pull Requests

### Creating PR

```bash
# 1. Push branch
git push -u origin feat/new-feature

# 2. Create PR via GitHub UI or CLI
gh pr create --title "feat: add new feature" --body "Description..."

# Or get URL from git push output
# Visit: https://github.com/user/repo/pull/new/feat/new-feature
```

### PR Title

Same format as commit messages:

```
feat: add dark mode toggle
fix: resolve memory leak in API client
docs: update contribution guidelines
```

### PR Description Template

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
- [ ] Unit tests added
- [ ] Component tests added
- [ ] E2E tests added (if applicable)
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Audit passes (`node scripts/verify_audit_block.js`)
- [ ] Documentation updated
- [ ] No secrets in code
- [ ] Ready for review
```

---

## Git Hygiene

### Before Committing

```bash
# 1. Run linter
npm run lint

# 2. Run tests
npm test

# 3. Build
npm run build

# 4. Audit
node scripts/verify_audit_block.js

# 5. Review changes
git diff

# 6. Stage and commit
git add .
git commit -m "..."
```

### Amending Commits

```bash
# Fix typo in last commit message
git commit --amend -m "new message"

# Add forgotten file to last commit
git add forgotten-file.ts
git commit --amend --no-edit

# ⚠️ WARNING: Only amend commits that haven't been pushed
# If already pushed, create new commit instead
```

### Interactive Rebase (Advanced)

```bash
# Rebase last 3 commits
git rebase -i HEAD~3

# Options:
# pick = keep commit
# reword = change commit message
# squash = combine with previous commit
# drop = remove commit

# ⚠️ WARNING: Only rebase commits not yet pushed
```

---

## Merge Strategies

### Squash and Merge (Preferred)

**Use for**: Feature branches with many small commits

```bash
# Via GitHub UI: "Squash and merge" button

# Or locally:
git checkout main
git merge --squash feat/new-feature
git commit -m "feat: add new feature"
```

**Result**: Clean main branch history with one commit per feature

### Merge Commit

**Use for**: Important branches where commit history matters

```bash
git checkout main
git merge feat/new-feature
```

**Result**: Preserves all commits and branch structure

### Rebase and Merge

**Use for**: Small, well-organized branches

```bash
git checkout feat/new-feature
git rebase main
git checkout main
git merge --ff-only feat/new-feature
```

**Result**: Linear history without merge commits

---

## Resolving Conflicts

### Step-by-Step

```bash
# 1. Attempt merge or rebase
git merge main
# or
git rebase main

# 2. Git reports conflicts
# CONFLICT (content): Merge conflict in app/page.tsx

# 3. Check conflicted files
git status

# 4. Open file and look for conflict markers
# <<<<<<< HEAD
# Your changes
# =======
# Their changes
# >>>>>>> main

# 5. Resolve conflicts (choose one or combine)
# Remove conflict markers
# Keep desired code

# 6. Stage resolved files
git add app/page.tsx

# 7. Complete merge
git merge --continue
# or for rebase
git rebase --continue

# 8. Verify resolution
npm test
git diff HEAD^
```

### Conflict Prevention

- Pull/fetch frequently
- Keep branches short-lived
- Communicate with team
- Use clear commit messages

---

## Git Commands Reference

### Status and History

```bash
git status                    # Current status
git log                       # Commit history
git log --oneline             # Compact history
git log --graph --all         # Visual history
git show <commit>             # Show commit details
git diff                      # Unstaged changes
git diff --staged             # Staged changes
git diff main...feat/branch   # Branch differences
```

### Branching

```bash
git branch                    # List branches
git branch -a                 # List all branches (including remote)
git checkout -b <branch>      # Create and switch
git switch <branch>           # Switch branch
git branch -d <branch>        # Delete branch
```

### Staging and Committing

```bash
git add <file>                # Stage file
git add .                     # Stage all changes
git add -p                    # Stage interactively
git reset <file>              # Unstage file
git commit -m "message"       # Commit with message
git commit --amend            # Amend last commit
```

### Remote Operations

```bash
git fetch                     # Fetch updates
git pull                      # Fetch and merge
git push                      # Push commits
git push -u origin <branch>   # Push and set upstream
git remote -v                 # List remotes
```

### Undoing Changes

```bash
git checkout -- <file>        # Discard changes
git reset --soft HEAD^        # Undo last commit (keep changes)
git reset --hard HEAD^        # Undo last commit (discard changes)
git revert <commit>           # Create inverse commit
```

---

## Git Aliases (Optional)

Add to `.gitconfig`:

```ini
[alias]
  st = status
  co = checkout
  br = branch
  ci = commit
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = log --graph --oneline --all
```

---

## Best Practices Summary

1. **Commit frequently** with clear messages
2. **Follow naming conventions** for branches and commits
3. **Test before committing** (lint, test, build, audit)
4. **Keep commits atomic** (one logical change per commit)
5. **Write descriptive messages** (explain WHAT and WHY)
6. **Update branches regularly** (fetch/rebase often)
7. **Review before pushing** (use `git diff`)
8. **Never force push** to main/master without approval
9. **Resolve conflicts carefully** (test after resolving)
10. **Delete merged branches** (keep repo clean)

---

*Consistent Git practices make collaboration seamless and debugging easier.*
