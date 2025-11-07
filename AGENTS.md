# Universal Agentic Orchestration Guide

**Version**: 1.0.0
**Last Updated**: 2025-11-06
**Compatibility**: All AI agents (Claude, GPT-4+, Gemini, future systems)

---

## Executive Summary

This document defines the **universal agentic orchestration protocol** for the llm_physics repository. Any AI agentcurrent or futurecan use this guide to understand, contribute to, and automate workflows in this codebase.

**Key Principle**: This repository is designed for **agent-driven development** with human oversight. All agents, regardless of their underlying model or provider, should follow these standardized protocols.

---

## Table of Contents

1. [Agent Capabilities Required](#agent-capabilities-required)
2. [Repository Structure](#repository-structure)
3. [Onboarding New Agents](#onboarding-new-agents)
4. [Core Protocols](#core-protocols)
5. [Tool and API Access](#tool-and-api-access)
6. [Workflow Orchestration](#workflow-orchestration)
7. [Testing and Validation](#testing-and-validation)
8. [Security and Compliance](#security-and-compliance)
9. [Communication Protocols](#communication-protocols)
10. [Error Handling and Recovery](#error-handling-and-recovery)
11. [Multi-Agent Coordination](#multi-agent-coordination)
12. [Extensibility and Evolution](#extensibility-and-evolution)

---

## Agent Capabilities Required

### Minimum Capabilities

To contribute effectively to this repository, an AI agent MUST have:

#### 1. **File System Operations**
- Read files (any format: code, markdown, JSON, YAML, images, PDFs)
- Write/create new files
- Edit existing files (exact string replacement or line-based edits)
- Navigate directory structures
- Search files by name pattern (glob) or content (grep/ripgrep)

#### 2. **Command Execution**
- Execute shell commands (bash, npm, git, node)
- Handle command timeouts and errors
- Parse command output (stdout, stderr, exit codes)
- Run background processes and monitor output

#### 3. **Version Control (Git)**
- Clone/fetch repositories
- Create and switch branches
- Stage and commit changes
- Push to remotes
- Read git status, diff, and log

#### 4. **Code Understanding**
- Parse and understand TypeScript, JavaScript, JSX/TSX
- Understand React components and Next.js patterns
- Read and write tests (Jest, React Testing Library, Playwright)
- Analyze code structure and dependencies

#### 5. **Context Management**
- Maintain conversation history across multiple turns
- Reference previously read files
- Track task state and progress
- Handle large codebases with selective context loading

#### 6. **Decision Making**
- Break down complex tasks into steps
- Prioritize actions based on project policies
- Recognize when to ask for human clarification
- Validate own actions against defined standards

### Recommended Capabilities

For optimal contribution, agents SHOULD have:

- **Web Access**: Fetch documentation, search for solutions
- **Multi-modal**: Read images, diagrams, screenshots
- **Long Context**: Handle 100K+ token contexts for large files
- **Parallel Operations**: Execute multiple independent tasks concurrently
- **State Persistence**: Checkpoint and resume long-running tasks

---

## Repository Structure

### Critical Directories

```
llm_physics/
 .agentic/                  # Universal agentic protocols (THIS IS NEW)
    protocols/             # Standardized protocols for all agents
    examples/              # Example workflows and code
    templates/             # Reusable templates

 .claude/                   # Claude-specific configuration (REFERENCE)
    agents/                # Claude agent definitions
    commands/              # Claude slash commands
    settings.json          # Claude-specific settings

 .github/                   # GitHub automation
    workflows/             # CI/CD workflows

 app/                       # Next.js application code
    page.tsx               # Root page
    globals.css            # Global styles

 tests/                     # Test files
    *.test.tsx             # Component tests

 scripts/                   # Utility scripts
    verify_audit_block.js  # Audit and compliance checker

 artifacts/                 # Generated artifacts
    audit_logs/            # Audit trail (90-day retention)

 docs/                      # Comprehensive documentation

 AGENTS.md                  # This file - universal agent guide
 ARCHITECTURE.md            # System architecture documentation
 CONTRIBUTING.md            # Contribution guidelines for agents
 CLAUDE.md                  # Project policies and standards
 README.md                  # User-facing documentation
```

### File Priority for Context Loading

When an agent starts working, load files in this order:

1. **AGENTS.md** (this file) - Understand universal protocols
2. **CLAUDE.md** - Understand project-specific policies
3. **ARCHITECTURE.md** - Understand system design
4. **.agentic/protocols/** - Load relevant protocol definitions
5. **Task-specific files** - Load only files relevant to current task

---

## Onboarding New Agents

### Quick Start (5 Minutes)

**Step 1: Verify Capabilities**
```bash
# Agent should execute these commands and verify success:
node --version    # Should be 20.x or higher
npm --version     # Should be present
git --version     # Should be present
```

**Step 2: Read Core Documentation**
```bash
# Agent should read in this exact order:
1. AGENTS.md (this file)
2. CLAUDE.md (project policies)
3. ARCHITECTURE.md (system design)
4. .agentic/protocols/core-workflow.md
```

**Step 3: Install Dependencies**
```bash
npm ci  # Install exact versions from package-lock.json
```

**Step 4: Run Health Check**
```bash
npm run lint    # Should pass
npm test        # Should pass (100% coverage)
npm run build   # Should build successfully
node scripts/verify_audit_block.js  # Should pass all checks
```

**Step 5: Create Test Branch**
```bash
git checkout -b <agent-name>/test-$(date +%Y%m%d)
# Make a small test change
echo "# Agent test" >> test.md
git add test.md
git commit -m "test: agent onboarding verification"
git push -u origin <agent-name>/test-$(date +%Y%m%d)
# Clean up: git checkout main && git branch -D <agent-name>/test-$(date +%Y%m%d)
```

### Deep Onboarding (1 Hour)

After quick start, agents should:

1. **Read All Protocol Files**
   - `.agentic/protocols/core-workflow.md`
   - `.agentic/protocols/testing-standards.md`
   - `.agentic/protocols/security-compliance.md`
   - `.agentic/protocols/git-conventions.md`

2. **Study Example Workflows**
   - `.agentic/examples/test-generation-workflow.md`
   - `.agentic/examples/feature-implementation-workflow.md`
   - `.agentic/examples/bug-fix-workflow.md`

3. **Review Test Cases**
   - `tests/*.test.tsx` - Understand testing patterns
   - Coverage reports in `coverage/` after running tests

4. **Understand CI/CD**
   - `.github/workflows/ci.yml` - Standard CI
   - `.github/workflows/claude-pr-review.yml` - Automated review
   - `.github/workflows/claude-vercel-ci.yml` - Deployment

---

## Core Protocols

### Protocol 1: Plan  Test  Implement  Verify (PTIV)

**All agents MUST follow this workflow for every task.**

```

                  PTIV WORKFLOW                          


1. PLAN
    Read relevant files
    Understand requirements
    Break down into subtasks
    Create task list (use TodoWrite or equivalent)
    Identify dependencies

2. TEST (if applicable)
    Write failing test first (TDD)
    Or write test alongside implementation
    Ensure test is deterministic
    Run test and verify it fails correctly

3. IMPLEMENT
    Write minimal code to pass tests
    Follow code style from CLAUDE.md
    Add comments for complex logic
    Keep functions small and single-purpose

4. VERIFY
    Run: npm run lint
    Run: npm test (must achieve >95% coverage)
    Run: npm run build
    Run: node scripts/verify_audit_block.js
    If any fail, return to step 3
```

### Protocol 2: Atomic Commits

Every commit must:
- Have a clear, conventional commit message
- Pass all tests and linting
- Represent a single logical change
- Include audit trail information

**Format**:
```
<type>: <description>

<optional body>

<optional footer>
```

**Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`

**Example**:
```bash
git commit -m "feat: add dark mode toggle to settings

- Implement theme context provider
- Add toggle button to settings page
- Update all components to support theme
- Add tests for theme switching

Refs: #123"
```

### Protocol 3: Test Coverage Requirements

**Hard Requirement**: All code MUST have >95% test coverage.

- **Lines**: >95%
- **Statements**: >95%
- **Functions**: >95%
- **Branches**: >95%

**How to check**:
```bash
npm test -- --coverage
# Check: coverage/coverage-summary.json
```

If coverage drops below 95%, CI will FAIL and block merge.

### Protocol 4: Security and Secrets

**NEVER commit**:
- API keys, tokens, passwords
- `.env` files with real secrets
- Credentials of any kind

**ALWAYS**:
- Use environment variables for secrets
- Document required env vars in `.mcp.json`
- Use GitHub Secrets for CI/CD
- Run `node scripts/verify_audit_block.js` before commit

### Protocol 5: Documentation Standards

**When changing code, update docs**:
- Inline comments for complex logic
- JSDoc for public functions
- README.md for user-facing features
- CLAUDE.md for policy changes
- AGENTS.md (this file) for protocol changes
- ARCHITECTURE.md for design changes

**Documentation must be**:
- Clear and concise
- Actionable (no vague statements)
- Up-to-date (no stale information)
- Agent-readable (structured, parseable)

---

## Tool and API Access

### Required Tools

Agents must have access to:

1. **File System**: Read, write, edit, search
2. **Shell**: Bash commands (npm, git, node, etc.)
3. **Git**: Full git operations
4. **Package Manager**: npm (ci, install, run scripts)
5. **Node.js**: Execute JavaScript/TypeScript

### Optional Tools (Enhanced Capabilities)

- **Web Browser**: Fetch docs, research solutions
- **MCP Servers**: Vercel, GitHub, other integrations
- **Image Processing**: Read screenshots, diagrams
- **PDF Reading**: Read documentation PDFs

### Tool Safety

**Sandbox Mode**: Agents should operate in sandbox mode when:
- Learning the codebase (first session)
- Testing new workflows
- Executing untrusted code

**Destructive Commands**: Agents must NEVER execute:
- `rm -rf /` or similar destructive file operations
- `git push --force` to main/master without explicit approval
- Commands that drop databases or delete production data
- Any command that could cause data loss without backups

---

## Workflow Orchestration

### Single-Agent Workflows

For simple tasks (single file edit, bug fix):

```python
# Pseudocode for agent logic
def simple_workflow():
    1. Read task description
    2. Search relevant files (glob/grep)
    3. Read necessary files
    4. Plan changes (TodoWrite)
    5. Implement changes (Edit/Write)
    6. Run tests (Bash: npm test)
    7. Commit (Bash: git commit)
    8. Push (Bash: git push)
```

### Multi-Agent Workflows

For complex tasks (new feature, refactoring):

```python
# Pseudocode for orchestration
def complex_workflow():
    # Coordinator Agent
    1. Break down task into subtasks
    2. Assign subtasks to specialized agents:
       - test-autogen-agent: Generate tests
       - implementation-agent: Write code
       - review-agent: Code review
       - deployment-agent: Deploy changes

    # Parallel Execution
    3. Run independent agents in parallel

    # Sequential Execution
    4. Run dependent agents in sequence:
       tests  implementation  review  deployment

    # Consolidation
    5. Merge results
    6. Final verification
    7. Commit and push
```

### Agent Communication

Agents can communicate via:
- **Shared file system**: Write status to `artifacts/agent_state/`
- **Git commits**: Use commit messages to convey progress
- **Structured logs**: Write to `artifacts/audit_logs/`
- **PR comments**: Update PR with progress

**Standard Agent Message Format**:
```json
{
  "timestamp": "2025-11-06T13:00:00Z",
  "agent_id": "agent-name",
  "agent_type": "test-autogen",
  "task": "generate tests for WarpUI component",
  "status": "in_progress|completed|failed",
  "progress": 0.75,
  "message": "Generated 12 test cases, coverage 98%",
  "artifacts": ["tests/WarpUI.test.tsx"],
  "next_agent": "implementation-agent"
}
```

---

## Testing and Validation

### Test Types

1. **Unit Tests** (Jest)
   - Test individual functions
   - Mock external dependencies
   - Fast execution (<1s per test)

2. **Component Tests** (React Testing Library)
   - Test user interactions
   - Validate accessibility
   - Check render output

3. **E2E Tests** (Playwright)
   - Test complete user flows
   - Validate integration
   - Browser automation

### Running Tests

```bash
# All tests
npm test

# With coverage
npm test -- --coverage

# Watch mode (for development)
npm test -- --watch

# Specific test file
npm test -- tests/page.test.tsx

# Update snapshots
npm test -- -u
```

### Writing Good Tests

**DO**:
- Test behavior, not implementation
- Use descriptive test names
- Keep tests independent and isolated
- Clean up after tests (teardown)
- Test edge cases and error conditions

**DON'T**:
- Test implementation details
- Share state between tests
- Use hard-coded timeouts (use waitFor)
- Test third-party libraries
- Write flaky tests

**Example**:
```typescript
// GOOD
describe('WarpUI Component', () => {
  it('should display loading state while fetching data', async () => {
    render(<WarpUI />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/data loaded/i)).toBeInTheDocument();
    });
  });
});

// BAD
describe('WarpUI Component', () => {
  it('should set isLoading to true', () => {
    const component = new WarpUI();
    component.fetchData();
    expect(component.state.isLoading).toBe(true); // Testing implementation
  });
});
```

---

## Security and Compliance

### Security Checks

**Before every commit, agents must**:
1. Run `node scripts/verify_audit_block.js`
2. Verify no secrets in code
3. Check for known vulnerabilities
4. Validate input sanitization
5. Ensure authentication on endpoints

### Compliance Levels

**CRITICAL** (blocks merge immediately):
- Exposed secrets or credentials
- Known security vulnerabilities
- Missing authentication on protected endpoints
- SQL injection or XSS vulnerabilities

**HIGH** (should fix before merge):
- Missing rate limiting
- Weak password policies
- Insecure direct object references
- Missing CSRF protection

**MEDIUM** (fix soon):
- Outdated dependencies
- Missing security headers
- Insufficient logging

**LOW** (nice to have):
- Code quality improvements
- Performance optimizations

### Audit Logging

All agent actions must be logged to `artifacts/audit_logs/`:

```json
{
  "timestamp": "2025-11-06T13:00:00Z",
  "agent": "agent-name",
  "action": "file_edit",
  "target": "app/page.tsx",
  "changes": {
    "lines_added": 5,
    "lines_removed": 2
  },
  "test_status": "passed",
  "coverage": 98.5,
  "commit": "abc123"
}
```

---

## Communication Protocols

### Agent-to-Human Communication

**Be concise and actionable**:
-  "Tests passing. Coverage 98%. Ready for review."
-  "I've completed the implementation of the feature you requested and everything seems to be working great!"

**Report failures clearly**:
-  "Build failed. Error: Module 'react' not found. Run: npm install"
-  "Something went wrong with the build."

**Ask for clarification when needed**:
-  "Should the API endpoint use POST or PUT for updates?"
-  "I'm not sure what to do." (too vague)

### Agent-to-Agent Communication

Use structured formats:
```json
{
  "from": "test-agent",
  "to": "implementation-agent",
  "message": "Test suite ready. 15 test cases defined.",
  "artifacts": ["tests/feature.test.tsx"],
  "blocking": false,
  "priority": "normal"
}
```

---

## Error Handling and Recovery

### When Errors Occur

**Step 1: Identify Error Type**
- Syntax error  Fix code
- Test failure  Fix implementation or test
- Lint error  Fix code style
- Build error  Fix dependencies or config
- Runtime error  Add error handling

**Step 2: Attempt Auto-Recovery**
```python
def attempt_recovery(error):
    if "module not found":
        run("npm install")
    elif "test failed":
        rerun_tests_with_verbose()
    elif "lint error":
        run("npm run lint -- --fix")
    else:
        escalate_to_human(error)
```

**Step 3: Document Failure**
- Log error to `artifacts/audit_logs/`
- Update task status
- Provide clear next steps

**Step 4: Escalate if Needed**
- Can't auto-recover after 3 attempts
- Error is ambiguous or requires human decision
- Security or compliance issue detected

---

## Multi-Agent Coordination

### Coordination Patterns

#### Pattern 1: Sequential (Pipeline)
```
Agent A  Agent B  Agent C  Agent D
(tests)  (code)   (review)  (deploy)
```

#### Pattern 2: Parallel (Fan-out/Fan-in)
```
         Agent B (feature 1) 
Agent A  Agent C (feature 2)  Agent E
         Agent D (feature 3) 
```

#### Pattern 3: Hierarchical (Manager/Worker)
```
Coordinator Agent
     Worker Agent 1
     Worker Agent 2
     Worker Agent 3
```

### Conflict Resolution

**File Conflicts**:
1. Last write wins (use git merge strategies)
2. Coordinator reviews conflicts
3. Human review for complex conflicts

**Task Conflicts**:
1. Priority-based scheduling
2. Block lower-priority tasks
3. Use locks in `artifacts/locks/`

**Resource Conflicts**:
1. Coordinate via shared state files
2. Use semaphores for limited resources
3. Queue tasks if resource busy

---

## Extensibility and Evolution

### Adding New Agent Types

To add a new specialized agent:

1. **Define Agent Spec** in `.agentic/protocols/agents/<agent-name>.md`
2. **Add Examples** in `.agentic/examples/<agent-name>-workflow.md`
3. **Update Registry** in `.agentic/protocols/agent-registry.json`
4. **Document Capabilities** in this file (AGENTS.md)
5. **Submit PR** with examples and tests

### Updating Protocols

To update this document or protocols:

1. **Propose Change** via PR with detailed rationale
2. **Get Review** from maintainers and other agents
3. **Update Version** in this file header
4. **Announce** via PR comments and documentation
5. **Backward Compatibility** for at least 2 versions

### Future-Proofing

**This repository is designed to evolve**:
- New agent types can be added without breaking existing agents
- Protocols are versioned (semver)
- Deprecated features marked clearly with timelines
- Breaking changes require major version bump

---

## Quick Reference

### Essential Commands

```bash
# Setup
npm ci

# Development
npm run dev          # Start dev server
npm run lint         # Run linter
npm test            # Run tests
npm run build       # Build for production

# Audit
node scripts/verify_audit_block.js

# Git
git status
git add <files>
git commit -m "type: description"
git push -u origin <branch>
```

### Essential Files to Read

1. **AGENTS.md** (this file) - Universal protocols
2. **CLAUDE.md** - Project policies
3. **ARCHITECTURE.md** - System design
4. **.agentic/protocols/** - Detailed protocols

### Decision Tree

```

    New Task Received                

                
                
    
      Is task clear?     
    
          No          Yes
                     
    Ask for     Read relevant
    clarification   files
                     
         
              
    
      Create plan      
      (TodoWrite)      
    
             
    
      Write tests      
      (if applicable)  
    
             
    
      Implement        
    
             
    
      Run: lint, test, 
      build, audit     
    
          Fail      Pass
                   
    Fix issues   Commit & Push
                     
         
              
    
      Update docs      
      (if needed)      
    
             
    
      Task complete    
    
```

---

## Support and Resources

### Documentation
- **AGENTS.md**: This file (universal guide)
- **CLAUDE.md**: Project-specific policies
- **ARCHITECTURE.md**: System design deep-dive
- **CONTRIBUTING.md**: Contribution guidelines
- **.agentic/protocols/**: Detailed protocol specs

### Community
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: Questions and ideas
- Pull Requests: Code contributions and reviews

### Troubleshooting

**Common Issues**:

1. **Tests failing**: Run `npm test -- --verbose` for details
2. **Lint errors**: Run `npm run lint -- --fix` to auto-fix
3. **Build errors**: Delete `.next/` and `node_modules/`, run `npm ci` and `npm run build`
4. **Git conflicts**: Use `git status` to see conflicts, resolve manually
5. **Coverage below 95%**: Add more test cases or remove untested code

---

## Version History

- **1.0.0** (2025-11-06): Initial universal agentic orchestration guide

---

**This document is a living specification. All agents should check for updates regularly.**

**When in doubt, ask for human review. It's better to ask than to break things.**

---

*End of Universal Agentic Orchestration Guide*
