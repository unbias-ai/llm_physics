# RESEARCH_AGENT.md  Read-Only Agent Codebase Guide

**Purpose**: Enable external research agents (read-only) to analyze, understand, and report on llm_physics codebase

**Last Updated**: 2025-11-06

---

## Quick Start

**What is this repo?**
Monorepo for reproducible physics LLM tooling. Next.js frontends + agentic automation workflows. Claude Code orchestration with TDD, audit trails, reproducibility focus.

**Your role as research agent:**
- Analyze codebase structure
- Document patterns/conventions
- Identify issues/improvements
- Report findings to write-enabled agents
- NO code modifications

---

## Repository Structure

### Root Level

```
/
 app/                    # Next.js App Router (React 19)
 public/                 # Static assets
 tests/                  # Test suites (Jest, RTL, Playwright)
 scripts/                # Build/automation scripts
 artifacts/              # Generated outputs (audit logs, reports)
 mocks/                  # Test mocks/fixtures
 .claude/                # Claude Code config (agents, commands)
 .claude-plugin/         # Plugin marketplace definitions
 .agentic/               # Agentic workflow protocols/examples
 CLAUDE.md               # PRIMARY: Agent policies (READ THIS FIRST)
 RESEARCH_AGENT.md       # This file
 AGENTS.md               # Agent capabilities/usage
 ARCHITECTURE.md         # System architecture
 CONTRIBUTING.md         # Contribution guidelines
 package.json            # Dependencies
```

### Key Directories

#### `/app`  Next.js Application
- **App Router** (not Pages Router)
- React Server Components by default
- `layout.tsx`: Root layout
- `page.tsx`: Home page
- Structure: `app/[route]/page.tsx`

#### `/tests`  Test Suites
- Unit tests: `*.test.tsx`, `*.test.ts`
- Component tests: React Testing Library
- E2E tests: Playwright
- Coverage: 95% minimum threshold
- Run: `npm test`

#### `/.claude`  Claude Code Configuration
- **agents/**: Agent definitions (test-autogen, vercel-deploy, repo-auditor)
- **commands/**: Slash commands (/generate-tests, /deploy-vercel, /audit-repo)
- **settings.json**: Enabled agents/plugins

#### `/.agentic`  Workflow Protocols
- **protocols/**: Security, testing, git conventions, core workflow
- **examples/**: Feature implementation, test generation workflows
- READ THESE to understand agentic patterns

#### `/scripts`  Automation
- Build scripts
- Verification scripts (e.g., `verify_audit_block.js`)
- CI/CD helpers

#### `/artifacts`  Generated Outputs
- Audit logs (90-day retention)
- Deployment reports
- Test coverage reports
- DO NOT modify  read-only artifacts

---

## Critical Files (READ FIRST)

### 1. CLAUDE.md
**THE authoritative policy document**
- Read FIRST before any analysis
- Contains all coding standards, conventions, policies
- Updated with every policy change
- All agents MUST follow CLAUDE.md

### 2. ARCHITECTURE.md
- System design
- Component relationships
- Data flow patterns
- Technology stack details

### 3. AGENTS.md
- Agent capabilities
- Usage patterns
- Orchestration workflows

### 4. package.json
- All dependencies (no external CDNs)
- Scripts for build/test/deploy
- Next.js 16+, React 19+, TypeScript strict

### 5. tsconfig.json
- TypeScript strict mode
- Path aliases
- Compiler settings

---

## Tech Stack Reference

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript (strict, no `any`) |
| UI Library | React 19+ |
| Styling | Tailwind CSS v4 |
| Testing | Jest, React Testing Library, Playwright |
| Deployment | Vercel |
| Orchestration | Claude Code 2.0 |

---

## Code Conventions

### Naming
- **Components**: lowercase-hyphenated (warp-ui.tsx)
- **Files**: PascalCase components (WarpUI.tsx), camelCase utils (formatData.ts)
- **Tests**: ComponentName.test.tsx or __tests__/ComponentName.test.tsx

### Style
- TypeScript strict (no `any` unless justified in comments)
- Functional components + React Server Components
- Tailwind utilities (minimal custom CSS)
- Explicit error handling
- Small, single-purpose functions

### Communication
- **Extreme conciseness**: Sacrifice grammar for brevity
- No emojis (unless explicitly requested)
- No noise/fluff

---

## Diff-Based Coding (CRITICAL)

**All coding work uses diff-based approach:**

 **WITH Diff** (required):
- Context = changed lines only (`git diff`)
- Prevents accidental edits
- Clean audit trail
- Focused commits

 **WITHOUT Diff** (forbidden):
- Entire file/repo as context
- Bloated commits
- Hallucinated edits
- Broken audit trail

**Research agents**: When analyzing changes, focus on diffs not entire files

---

## Testing Standards

### Coverage Requirements
- **Minimum**: 95% (lines, statements, functions, branches)
- **Enforcement**: CI blocks merge if below threshold
- **TDD workflow**: Test-first development preferred

### Test Organization
- Unit: Pure functions, business logic
- Component: User interactions, a11y
- E2E: Critical user flows

### Commands
```bash
npm test                 # Run all tests
npm run test:coverage    # Coverage report
npm run test:e2e         # Playwright E2E
```

---

## Agentic Workflows

### Available Agents

1. **test-autogen-agent**
   - Autonomous test generation
   - TDD workflow
   - File: `.claude/agents/test-autogen-agent.md`
   - Command: `/generate-tests [paths]`

2. **vercel-deploy-specialist**
   - Deployment orchestration
   - Health monitoring
   - File: `.claude/agents/vercel-deploy-specialist.md`
   - Command: `/deploy-vercel`

3. **repo-auditor**
   - Compliance auditing
   - Security scanning
   - File: `.claude/agents/repo-auditor.md`
   - Command: `/audit-repo [level]`

### Agent Protocols

Read `.agentic/protocols/` for:
- **core-workflow.md**: Plan  Test  Implement  Verify
- **testing-standards.md**: TDD, coverage, test organization
- **git-conventions.md**: Commits, branches, PRs
- **security-compliance.md**: Auth, secrets, auditing

---

## Git Workflow

### Branches
- `main`: Production-ready
- `claude/*`: Feature branches (Claude Code automation)

### Commits
- Conventional commits format
- Extreme conciseness (sacrifice grammar)
- Examples:
  - `feat: warp-ui viz component`
  - `fix: CI coverage report`
  - `docs: CLAUDE.md audit policy`

### GitHub Operations
**REQUIRED**: Use GitHub CLI (`gh`) for all ops
- PRs: `gh pr create`, `gh pr list`, `gh pr view`
- Issues: `gh issue create`, `gh issue list`
- Status: `gh pr status`, `gh pr checks`

---

## Compliance & Audit

### Security (CRITICAL = block merge)
- Exposed secrets/credentials
- Known vulnerabilities
- Missing auth on protected endpoints
- SQL injection/XSS

### Performance
- Core Web Vitals must pass
- Max bundle: 350KB gzipped
- FCP < 1.8s, LCP < 2.5s, TTI < 3.8s

### Accessibility
- WCAG 2.1 AA minimum
- Keyboard navigation
- Screen reader compatible
- Proper ARIA attributes

---

## Research Agent Tasks

### Analysis Checklist

When analyzing codebase, focus on:

1. **Structure**
   - Is Next.js App Router used correctly?
   - Are components organized logically?
   - Is separation of concerns clear?

2. **Code Quality**
   - TypeScript strict mode enforced?
   - Are there `any` types without justification?
   - Functions small and single-purpose?
   - Error handling explicit?

3. **Testing**
   - 95% coverage maintained?
   - Tests follow TDD patterns?
   - All edge cases covered?

4. **Security**
   - No exposed secrets?
   - All endpoints authenticated?
   - Input validation present?

5. **Performance**
   - Bundle size under 350KB?
   - Code splitting used?
   - Images optimized?

6. **Accessibility**
   - Semantic HTML used?
   - ARIA labels present?
   - Keyboard navigation works?

7. **Diff Compliance**
   - Commits show focused diffs?
   - No unrelated changes in commits?
   - Audit trail clean?

### Reporting Format

When reporting findings to write-enabled agents:

```
## Analysis Report: [Topic]

### Summary
[1-2 line summary]

### Findings
- **CRITICAL**: [issue]
- **HIGH**: [issue]
- **MEDIUM**: [issue]
- **LOW**: [issue]

### Recommendations
1. [action item]
2. [action item]

### Unresolved Questions
- [question]?
- [question]?

### Files Analyzed
- file:line
- file:line
```

---

## Common Research Patterns

### Find Implementation Pattern
```bash
# Search for component usage
rg "ComponentName" --type tsx

# Find test coverage
rg "describe\(" tests/

# Locate API endpoints
rg "export async function (GET|POST|PUT|DELETE)" app/
```

### Analyze Dependencies
```bash
# Check package.json
cat package.json | jq '.dependencies'

# Find external dependencies in code
rg "from ['\"](?!\.|\@)" --type ts
```

### Audit Security
```bash
# Find env var usage
rg "process\.env\."

# Locate auth checks
rg "(auth|authenticate|authorize)" --type ts

# Search for secrets patterns
rg "(API_KEY|SECRET|TOKEN|PASSWORD)" --type ts
```

### Check Test Coverage
```bash
# Run coverage report
npm run test:coverage

# Find untested files
rg --files-without-match "\.test\." app/
```

---

## File Navigation Tips

### By Feature
- Auth logic: `app/api/auth/`, `app/(auth)/`
- Components: `app/components/` or `app/[feature]/components/`
- Utils: `lib/`, `utils/`
- Types: `types/`, `*.d.ts` files

### By File Type
- Pages: `app/**/page.tsx`
- Layouts: `app/**/layout.tsx`
- API Routes: `app/api/**/route.ts`
- Tests: `tests/**/*.test.tsx`
- Config: Root-level `*.config.js`, `*.json`

### By Concern
- Styling: `tailwind.config.js`, `*.css`, Tailwind classes in components
- Build: `next.config.js`, `package.json`, `/scripts`
- CI/CD: `.github/workflows/`, `.mcp.json`
- Agent Config: `.claude/`, `.agentic/`

---

## Integration Points

### Vercel (Deployment)
- Config: `.mcp.json`
- Token: GitHub Secrets (VERCEL_TOKEN)
- OAuth: MCP authentication
- Monitoring: Post-deploy health checks

### GitHub (Version Control)
- CLI primary method (`gh` commands)
- Protected branches enforce checks
- PR requires CI pass + human approval

### MCP (Agent Orchestration)
- Config: `.mcp.json`, `.claude/settings.json`
- Agents: `.claude/agents/*.md`
- Commands: `.claude/commands/*.md`
- All calls logged for audit

---

## Troubleshooting Research

### Can't find functionality?
1. Check ARCHITECTURE.md for system design
2. Search CLAUDE.md for conventions
3. Grep codebase: `rg "keyword" --type tsx`
4. Check agent protocols: `.agentic/protocols/`

### Unclear about policy?
1. CLAUDE.md is authoritative source
2. Check commit history: `git log --oneline CLAUDE.md`
3. Review `.agentic/protocols/` for detailed workflows

### Need context on agent behavior?
1. Read AGENTS.md
2. Check agent definitions: `.claude/agents/*.md`
3. Review examples: `.agentic/examples/`

---

## Limitations (What You CANNOT Do)

As read-only research agent:
-  Modify code
-  Create commits
-  Push changes
-  Execute write operations
-  Deploy applications
-  Modify configurations

You CAN:
-  Read all files
-  Analyze codebase
-  Search patterns
-  Generate reports
-  Identify issues
-  Recommend improvements
-  Document findings

---

## Next Steps

1. Read CLAUDE.md (entire file)
2. Read ARCHITECTURE.md (system design)
3. Review `.agentic/protocols/` (workflows)
4. Analyze specific area of interest
5. Generate report following format above
6. Submit findings to write-enabled agent

---

## Quick Reference Commands

```bash
# Project info
cat package.json | jq '.name, .version, .scripts'

# Run tests
npm test

# Check coverage
npm run test:coverage

# Search code
rg "pattern" --type tsx

# List changed files
git diff --name-only

# View file history
git log --follow -- path/to/file

# Check CI status
gh pr checks

# View PR
gh pr view [number]
```

---

**Remember**: You are read-only. Your value = analysis, documentation, pattern recognition. Deliver actionable insights to write-enabled agents for implementation.

*For policy updates, see CLAUDE.md*
*For architecture questions, see ARCHITECTURE.md*
*For agent capabilities, see AGENTS.md*
