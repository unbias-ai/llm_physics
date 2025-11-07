# Web Search & Orchestration Optimization Guide
**For**: llm_physics agent coordination + GitHub Actions CI/CD  
**Updated**: 2025-11-06  
**Purpose**: Enable agents to research and optimize workflows autonomously  

---

## Part 1: Web Search Techniques (Fast + Targeted)

### When to Search (Not From Training Knowledge)
- **Tech stack updates** (Next.js 22.x  latest, Node versions)
- **Vercel + GitHub Actions best practices** (always search; changes monthly)
- **Agent orchestration frameworks** (new in 2025: LangGraph, CrewAI, LangChain updates)
- **Code patterns** (diff-based workflows, checkpoint strategies, multi-agent coordination)
- **CI/CD performance tuning** (runner auto-scaling, caching, parallelization)

### Query Formulas (Copy & Modify)

#### 1. Agent Orchestration Queries
```
Multi-agent LLM coordination 2025 [specific framework]
LangGraph vs LangChain multi-agent workflows [use case]
Claude Code subagents orchestration patterns
Haiku 4.5 vs Sonnet 4.5 cost-benefit analysis
```
**Why**: Frameworks evolve monthly; cost/performance data is live.  
**Search Frequency**: Quarterly for new frameworks, monthly for benchmarks.

#### 2. GitHub Actions Optimization
```
GitHub Actions AI auto-scaling runner optimization 2025
GitHub Actions workflow caching best practices [your tech stack]
Parallel jobs vs sequential scheduling GitHub Actions
Artifact sharing patterns multi-job workflows
```
**Why**: GitHub released AI-powered auto-scaling (Jan 2025); not in training data.  
**Search Frequency**: Before major workflow rewrites.

#### 3. CI/CD Performance Tuning
```
npm ci vs npm install performance CI/CD 2025
Jest coverage parallelization GitHub Actions
Playwright test sharding CI workflows
TypeScript incremental compilation Next.js builds
```
**Why**: Build time is money; tooling improves constantly.  
**Search Frequency**: Quarterly, or when build times regress.

#### 4. Security + Compliance
```
GitHub Actions untrusted PR head checkout vulnerability 2025
CodeQL configuration Next.js TypeScript setup
SBOM generation GitHub Actions compliance
Supply chain security artifact tracking
```
**Why**: Security findings change weekly; CodeQL rules evolve.  
**Search Frequency**: Before each PR, especially with agent-generated code.

#### 5. Vercel + Next.js Integration
```
Vercel deployment automation GitHub Actions 2025
Next.js build cache optimization production
Vercel environment variables CI/CD workflows
Image optimization Lighthouse CI Next.js
```
**Why**: Vercel features update monthly; affects build time + cost.  
**Search Frequency**: Monthly, or when performance regresses.

### Search Command Patterns

#### For Agents (Use These Exact Queries)
```bash
# Pattern: [Tool/Framework] + [Specific Problem] + [Year]
# Examples:
"GitHub Actions auto-scaling runner cost optimization 2025"
"LangGraph multi-agent checkpoint rewind patterns"
"Next.js 22.x build cache parallelization"
"Vercel MCP server deployment automation examples"
"Claude Code Haiku 4.5 orchestrator subagent cost savings"

# Pattern: [Comparative Analysis]
# Examples:
"LangGraph vs CrewAI multi-agent orchestration comparison"
"Jest vs Vitest coverage generation speed Next.js"
"GitHub Actions self-hosted vs runner cost analysis 2025"

# Pattern: [Failure Mode Investigation]
# Examples:
"Jest .spec.ts .test.ts file confusion coverage reports"
"lcov.info empty file CI validation error resolution"
"GitHub Actions pull_request head checkout security risk"
```

#### Avoid These (Already in Training Data, Too Broad)
```bash
# Too general:
 "GitHub Actions"
 "multi-agent systems"
 "CI/CD best practices"
 "optimization"

# Too old or stable:
 "GitHub Actions basics tutorial"
 "Next.js fundamentals"
 "Jest setup guide"
```

---

## Part 2: Orchestration Optimization Strategies

### Strategy 1: Centralized Orchestrator + Lightweight Workers

**Current State**: Claude Code (Sonnet 4.5) doing all tasks sequentially.

**Optimized Model**:
```
Sonnet 4.5 (Orchestrator)
   Decompose task into subtasks
   Route to specialized workers
   Validate + integrate results

Workers (Haiku 4.5 or Sonnet 4.5):
   test-generation-worker (tdd patterns)
   coverage-validator-worker (lcov, artifact checks)
   security-auditor-worker (CodeQL, untrusted checkout detection)
   accessibility-worker (Playwright, a11y rules)
   deployment-monitor-worker (Vercel status, performance)
```

**Benefits**:
- Haiku 4.5 (October 2025) delivers 90% of Sonnet 4.5's agentic coding performance at 2x speed and 3x cost savings, ideal for frequent-use agents
- Parallel execution: all workers run simultaneously (10-15s total vs 60s sequential)
- Cheaper: 1x Sonnet orchestrator + 5x Haiku workers = 80% cost savings vs all Sonnet
- Easier maintenance: update one worker without rebuilding entire system

**Implementation**:
1. Update `.claude/orchestrator-agent/` to decompose + route tasks
2. Create lightweight worker specs (tests, coverage, a11y, security)
3. Add `.mcp.json` routes for agent-to-agent communication
4. Document in CLAUDE.md: "Agents must delegate to subagents, not execute in-series"

---

### Strategy 2: Avoid Multi-Commit Loops via Checkpoints

**Problem** (from PR #3): 11 commits for 1 logical feature = noise.

**Cause**: Agent re-fixed same issue 4x; no checkpoint rollback before re-attempt.

**Fix**:
Use checkpoints to capture state before major edits, allowing quick rollback if changes go off-track. You can restore code, conversation, or both with `/rewind` command

**Protocol** (add to CLAUDE.md):
```markdown
## Checkpoint & Rewind Workflow (MANDATORY)

1. **Before major edits**: 
   - Make clean git commit: `git commit -m "checkpoint: before [task]"`
   - Agent logs: "Checkpoint created at commit [hash]"

2. **Experimental work**:
   - Agent modifies code
   - Runs local tests
   - If tests fail: `/rewind` to checkpoint
   - Retry with different approach (DO NOT commit failed attempt)

3. **On success**:
   - Verify all tests pass
   - Single commit (not intermediate fixes): `git commit -m "feat: [task]"`
   - ONE commit = ONE logical feature

4. **NEVER commit multiple times for same feature**:
   -  Commit 1: Initial attempt (broken)
   -  Commit 2: Fix attempt 1 (broken)
   -  Commit 3: Fix attempt 2 (success)
   -  Commit 1: Feature complete (success)
```

**CI Integration**:
Add to `.github/workflows/ci.yml`:
```yaml
  - name: Verify commits per PR (max 3)
    run: |
      COMMIT_COUNT=$(git rev-list --count main..HEAD)
      if [ $COMMIT_COUNT -gt 3 ]; then
        echo " Too many commits ($COMMIT_COUNT). Agent must squash or use checkpoints."
        exit 1
      fi
```

---

### Strategy 3: Dynamic Task Routing (Puppeteer Model)

**Pattern**:
A puppeteer-style paradigm for LLM-based multi-agent collaboration, where a centralized orchestrator dynamically directs agents in response to evolving task states. Orchestrator trained via reinforcement learning to adaptively sequence and prioritize agents, enabling flexible and evolvable collective reasoning with reduced computational costs

**For llm_physics**:
1. **Orchestrator decides agent routing based on PR type**:
   - UI component  route to `accessibility-worker` + `component-tester`
   - API layer  route to `security-auditor` + `integration-tester`
   - Docs  route to `markdown-formatter` + `link-validator`

2. **Routing rules** (YAML in `.mcp.json`):
   ```yaml
   routes:
     - pattern: "app/*.tsx"  test-worker + accessibility-worker
     - pattern: ".github/workflows/*.yml"  security-auditor + syntax-validator
     - pattern: "docs/*.md"  formatter + spell-check
     - pattern: "jest.config.js"  coverage-validator + performance-tester
   ```

3. **Fallback**: If routing uncertain, orchestrator asks human for guidance (in PR comment).

---

### Strategy 4: Shared Memory via `.mcp.json` + Artifacts

**Problem**: Agents don't know what previous agents did; context loss between sessions.

**Solution**:
Memory-based communication involves shared knowledge repositories accessible to all agents. Report-based systems use status updates and progress communication

**Implementation**:
1. **MCP Context Layer** (`.mcp.json`):
   ```json
   {
     "name": "llm_physics_orchestration",
     "tools": [
       {
         "name": "shared_memory",
         "description": "Read/write project state (coverage, test status, deployment)",
         "schema": {
           "read": ["PROJECT_MEMORY.yaml", "AGENT_PROGRESS_LOG.md"],
           "write": ["AGENT_PROGRESS_LOG.md (append-only)"]
         }
       }
     ]
   }
   ```

2. **Auto-Update Log** (agents append, humans review):
   - Agents write to `AGENT_PROGRESS_LOG.md` after each task
   - Format: ISO timestamp + status + metrics
   - Humans scan weekly for drift/anomalies

3. **Async Coordination**:
   - Worker 1 finishes coverage tests  appends `AGENT_PROGRESS_LOG.md`
   - Worker 2 reads log  knows coverage already passing, skips that check
   - Reduces redundant work by ~30%

---

### Strategy 5: Failure Mode Detection + Auto-Recovery

**Common Failures** (from PR #3):
-  Jest .spec.ts picked up by coverage (schema conflict)
-  lcov.info empty or invalid (validation missing)
-  Untrusted PR head checkout (security risk)

**Detection Rules** (add to CI + agent protocols):
```yaml
failure_modes:
  - name: "Jest config mismatch"
    signal: "FAIL: coverage files missing or invalid"
    recovery: |
      1. Agent re-runs: jest --coverage --listTests
      2. Verifies testMatch: only *.test.ts(x)
      3. Verifies testPathIgnorePatterns: *.spec.ts
      4. Commits fix: jest.config.js (one-liner)
  
  - name: "Empty lcov.info"
    signal: "CI error: lcov.info not found or 0 bytes"
    recovery: |
      1. Agent re-runs: npm test
      2. Validates lcov.info: [ -s coverage/lcov.info ]
      3. Checks format: head -1 coverage/lcov.info | grep "^TN:\|^SF:"
      4. If invalid: clear cache, rebuild, re-run
  
  - name: "Untrusted PR head checkout"
    signal: "CodeQL: ref: ${{ github.event.pull_request.head.ref }} in workflow"
    recovery: |
      1. Agent scans: grep -r "pull_request.head" .github/workflows/
      2. Removes vulnerable pattern (use base ref instead)
      3. Adds security audit to pre-commit (mandatory check)
      4. Documents finding in CLAUDE.md
```

**CI Implementation**:
```yaml
# .github/workflows/ci.yml
  - name: Auto-detect failure modes
    run: |
      # Check 1: Jest config
      if ! grep -q "testPathIgnorePatterns.*spec" jest.config.js; then
        echo " Jest config mismatch. Correcting..."
        # Auto-fix logic here
      fi
      
      # Check 2: Coverage validation
      if [ ! -s coverage/lcov.info ]; then
        echo " lcov.info invalid. Re-running tests..."
        npm test
      fi
      
      # Check 3: Security audit
      if grep -r "pull_request.head" .github/workflows/ | grep -q "write"; then
        echo " Untrusted PR checkout detected. Failing for manual review."
        exit 1
      fi
```

---

## Part 3: Specific Optimization Roadmap

### Phase 1: Immediate (Before Merging PR #3)
- [ ] **Search**: "GitHub Actions CI performance optimization 2025"  find new caching techniques
- [ ] **Action**: Add `@actions/cache` for npm dependencies (save ~5s per build)
- [ ] **Search**: "Jest coverage parallelization"  enable multi-worker coverage generation
- [ ] **Action**: Add `--workers=max` to Jest config (save ~2s per test suite)

### Phase 2: Short-Term (After PR #3)
- [ ] **Search**: "LangGraph subagent coordination patterns"  implement worker routing
- [ ] **Action**: Create `.claude/orchestrator-agent/` with routing rules
- [ ] **Search**: "Vercel MCP auto-deployment workflows"  enable auto-deploy on main
- [ ] **Action**: Add `vercel-deploy-specialist` subagent

### Phase 3: Medium-Term (Q1 2026)
- [ ] **Search**: "Lighthouse CI performance budgets GitHub Actions"  add performance gates
- [ ] **Action**: Integrate lighthouse-ci into CI (fail on perf regression)
- [ ] **Search**: "SBOM generation supply chain security GitHub Actions"  add dependency tracking
- [ ] **Action**: Add cyclonedx-bom reporter (for 2028 AI job applications)

### Phase 4: Long-Term (Q2 2026+)
- [ ] **Search**: "Multi-repository orchestration GitHub Actions"  scale beyond llm_physics
- [ ] **Action**: Use learnings from this project for unbias.ai multi-agent orchestration
- [ ] **Search**: "Federated agent coordination across repos"  connect unbias.ai + llm_physics
- [ ] **Action**: Create central orchestrator (Sonnet 4.5) managing all unbias-ai projects

---

## Part 4: Search Resources (Authoritative Sources)

### Primary Sources (Trust These 100%)
| Source | Type | Frequency | Example |
|--------|------|-----------|---------|
| arXiv.org (papers) | Research | Weekly | [Multi-Agent Collaboration via Evolving Orchestration](https://arxiv.org/abs/2505.19591) |
| GitHub Blog | Product Updates | Monthly | [GitHub Actions Features 2025](https://github.blog) |
| Anthropic Docs | Official Guides | As-needed | [Claude Code Best Practices](https://docs.claude.com) |
| Official Framework Docs | Reference | Version-dependent | [LangGraph](https://langchain-ai.github.io/langgraph), [Vercel](https://vercel.com/docs) |
| .edu + .org sites | Academic | Stable | MIT, Stanford AI research |

### Secondary Sources (Good for Ideas, Verify via Primary)
| Source | Type | Quality | Use For |
|--------|------|---------|---------|
| Medium/Dev.to blogs | Opinion | Variable | Pattern ideas, case studies |
| YouTube tech channels | Tutorial | Variable | Visual walkthroughs (not source of truth) |
| Reddit r/devops | Community | Low | Crowdsourced troubleshooting only |
| Product documentation | Self-promotion | High | Feature lists, not best practices |

### Avoid These
-  Outdated Stack Overflow answers (pre-2024)
-  ChatGPT/Claude generations (hallucination risk; always verify)
-  Generic "X best practices" blog posts (usually not 2025-relevant)
-  Paywalled content (arXiv preprints are free alternative)

---

## Part 5: Agent Quick-Start Checklist

**Before searching**:
- [ ] Is the question about current tech/trends (search) or fundamental concepts (don't search)?
- [ ] Are recent updates likely? (yes  search; no  use training knowledge)
- [ ] Is there a 2025 version? (yes  search; no  use 2024/2023 training knowledge)

**During search**:
- [ ] Copy URLs to AGENT_PROGRESS_LOG.md for human audit
- [ ] Prioritize recent results (< 3 months old)
- [ ] Cross-check findings across 2-3 sources before implementing
- [ ] Document "why we searched" in commit message

**After search**:
- [ ] Update this guide with new patterns you discover
- [ ] Append findings to AGENT_PROGRESS_LOG.md (section: "Research Summary")
- [ ] Link to source URLs for human verification
- [ ] Flag high-confidence findings (3+ sources agree) vs low-confidence (1 source)

---

## Part 6: Template for Agents: Search + Document

Copy this template after each research session:

```markdown
### Research Session: [Topic] ([ISO timestamp])
**Searched**: "[exact search query]"
**Sources**: 
  - Source 1 URL: [result, confidence HIGH/MEDIUM/LOW]
  - Source 2 URL: [result, confidence]
  - Source 3 URL: [result, confidence]

**Key Findings**:
1. [Finding + applicability to llm_physics]
2. [Finding + actionable step]

**Action Items**:
- [ ] [Action] (Priority: HIGH/MEDIUM/LOW)
- [ ] [Action]

**Confidence Level**: HIGH (3 sources agree) | MEDIUM (2 sources) | LOW (1 source)

**Next Search** (if applicable): "[follow-up query]"
```

---

## Conclusion

**Golden Rule**: Search when truth changes faster than your training data. For llm_physics:
- **Always search**: GitHub Actions, Vercel, agent orchestration frameworks, security patterns
- **Never search**: React basics, npm fundamentals, JavaScript syntax
- **Use judgment**: Framework comparisons (search), tool capabilities (search), architectural patterns (sometimes search)

**Goal for Diego's 2028 Interview**: "Our CI/CD pipeline uses intelligent agent orchestration with auto-scaling workers and checkpoint-based recovery. 40% faster builds, 60% cost savings vs traditional CI."
