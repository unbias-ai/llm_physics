# Agent Capability Matrix

**Version**: 1.0.0
**Last Updated**: 2025-11-06

---

## Overview

This document defines the capabilities required for AI agents to effectively contribute to the llm_physics repository.

---

## Capability Levels

### Level 1: Basic Contribution (Minimum)

**Can contribute**: Simple bug fixes, documentation updates, tests

**Required Capabilities**:

| Capability | Description | Example |
|------------|-------------|---------|
| **File Read** | Read text files of any format | Read TypeScript, JSON, Markdown |
| **File Write** | Create new text files | Create new component or test file |
| **File Edit** | Modify existing files (exact string replacement) | Fix typo, update import |
| **Command Execution** | Run bash commands | `npm test`, `git status` |
| **Directory Navigation** | List files, check directory structure | `ls`, `find` (via bash) |
| **Git Basic** | Status, add, commit, push | Standard git workflow |
| **Context Management** | Remember files read in session | Reference previously read files |

**Example Tasks**:
- Fix typo in documentation
- Add missing test case
- Update dependency version
- Fix lint error

---

### Level 2: Standard Contribution (Recommended)

**Can contribute**: Features, refactoring, comprehensive testing

**Required Capabilities** (Level 1 + below):

| Capability | Description | Example |
|------------|-------------|---------|
| **Pattern Search (Glob)** | Find files by name pattern | `**/*.tsx`, `tests/*.test.ts` |
| **Content Search (Grep)** | Search file contents by regex | Find all uses of a function |
| **Multi-file Edit** | Edit multiple files in sequence | Update imports across files |
| **Code Understanding** | Parse and understand TypeScript/React | Identify component props, types |
| **Test Execution** | Run and interpret test results | `npm test`, read coverage |
| **Build Execution** | Build and interpret build output | `npm run build`, check for errors |
| **Git Advanced** | Branches, merges, rebases, diff | Feature branch workflow |
| **State Tracking** | Track task progress across turns | Use TodoWrite or equivalent |

**Example Tasks**:
- Implement new feature with tests
- Refactor component structure
- Add comprehensive test coverage
- Update multiple related files

---

### Level 3: Advanced Contribution (Optimal)

**Can contribute**: Complex features, architecture changes, multi-agent coordination

**Required Capabilities** (Level 2 + below):

| Capability | Description | Example |
|------------|-------------|---------|
| **Web Access** | Fetch and parse web content | Read docs, search for solutions |
| **Multi-modal** | Read images, PDFs, diagrams | Understand screenshots, architecture diagrams |
| **Long Context** | Handle 100K+ token contexts | Read large codebases, multiple files |
| **Parallel Operations** | Execute independent tasks concurrently | Run lint and tests simultaneously |
| **State Persistence** | Save and resume work across sessions | Checkpoint long-running tasks |
| **Agent Communication** | Coordinate with other agents | Multi-agent workflows |
| **Performance Profiling** | Analyze build and runtime performance | Bundle analysis, load time optimization |

**Example Tasks**:
- Implement complex multi-component feature
- Coordinate multi-agent workflows
- Perform architecture refactoring
- Optimize performance across app

---

## Capability Assessment

### Self-Assessment Checklist

Use this checklist to determine your capability level:

#### Level 1: Basic

- [ ] I can read TypeScript files
- [ ] I can write new files
- [ ] I can edit existing files (exact string replacement)
- [ ] I can execute bash commands (`npm test`, `git status`)
- [ ] I can navigate directories
- [ ] I can use basic git (add, commit, push)
- [ ] I can remember files I've read in current session

**If all checked**: You can contribute at Level 1

#### Level 2: Standard

- [ ] All Level 1 capabilities
- [ ] I can find files by pattern (e.g., `**/*.tsx`)
- [ ] I can search file contents by regex
- [ ] I can edit multiple files in sequence
- [ ] I can understand TypeScript types and React patterns
- [ ] I can run tests and interpret results
- [ ] I can build the app and interpret errors
- [ ] I can use git branches and merges
- [ ] I can track task state across multiple turns

**If all checked**: You can contribute at Level 2

#### Level 3: Advanced

- [ ] All Level 2 capabilities
- [ ] I can fetch and parse web content
- [ ] I can read images and PDFs
- [ ] I can handle 100K+ token contexts
- [ ] I can execute tasks in parallel
- [ ] I can save/resume work across sessions
- [ ] I can coordinate with other agents
- [ ] I can analyze performance metrics

**If all checked**: You can contribute at Level 3

---

## Capability Testing

### Quick Capability Test

Run these tests to verify your capabilities:

#### Test 1: File Operations

```bash
# Create test file
echo "test content" > /tmp/test.txt

# Read file
cat /tmp/test.txt

# Edit file (replace content)
sed -i 's/test/updated/' /tmp/test.txt

# Verify
cat /tmp/test.txt
# Should show: "updated content"

# Cleanup
rm /tmp/test.txt
```

**Pass**: You have basic file operations

#### Test 2: Command Execution

```bash
# Run command and capture output
npm --version

# Check exit code
echo $?
# Should be 0 (success)

# Run command with timeout
timeout 5s npm test
```

**Pass**: You can execute commands and handle output

#### Test 3: Git Operations

```bash
git status
git log --oneline -n 5
git branch

# Create test branch
git checkout -b test-capability-check
# Switch back
git checkout -
# Delete test branch
git branch -d test-capability-check
```

**Pass**: You have git capabilities

#### Test 4: Search Operations

```bash
# Find TypeScript files
find . -name "*.ts" -o -name "*.tsx" | head -5

# Search file contents
grep -r "export default" app/ | head -5

# Or with modern tools
rg "export default" app/ | head -5
```

**Pass**: You can search files and contents

#### Test 5: Multi-file Understanding

```bash
# Read multiple related files
cat app/page.tsx
cat app/layout.tsx
cat tests/page.test.tsx

# Answer: How are these files related?
```

**Pass**: You can understand relationships between files

---

## Capability Enhancement

### Upgrading from Level 1 to Level 2

**Focus Areas**:
1. **Pattern Matching**: Practice using glob patterns
2. **Regex**: Learn regex for content search
3. **TypeScript**: Study TypeScript types and React patterns
4. **Testing**: Learn Jest and React Testing Library
5. **Git**: Master branching and merging

**Resources**:
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Jest Documentation](https://jestjs.io/)
- [Git Branching Guide](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)

### Upgrading from Level 2 to Level 3

**Focus Areas**:
1. **Web Scraping**: Learn to fetch and parse web content
2. **Multi-modal**: Add image/PDF reading capabilities
3. **Context Management**: Implement efficient context window usage
4. **Parallelization**: Learn concurrent task execution
5. **Agent Coordination**: Study multi-agent patterns

**Resources**:
- [Multi-Agent Systems](https://en.wikipedia.org/wiki/Multi-agent_system)
- [Concurrent Programming](https://en.wikipedia.org/wiki/Concurrent_computing)
- [Context Window Management](https://www.anthropic.com/research/context-window)

---

## Capability-Specific Workflows

### Level 1: Documentation Fix

```
Task: Fix typo in README.md

Workflow:
1. Read README.md
2. Identify typo
3. Edit file (exact string replacement)
4. Run: npm run lint
5. Commit: "docs: fix typo in README"
6. Push

Required: File Read, File Edit, Command Execution, Git Basic
```

### Level 2: Feature Implementation

```
Task: Add dark mode toggle

Workflow:
1. Read relevant files (context, components)
2. Plan implementation
3. Write tests (TDD)
4. Implement feature
5. Run: lint, test, build, audit
6. Commit and push
7. Create PR

Required: All Level 1 + Code Understanding, Test Execution, Build, Git Advanced
```

### Level 3: Architecture Refactoring

```
Task: Refactor component structure

Workflow:
1. Search codebase for patterns (Grep)
2. Read multiple related files (Long Context)
3. Plan refactoring strategy
4. Update multiple files in parallel
5. Run full test suite
6. Analyze performance impact
7. Coordinate with other agents if needed
8. Create comprehensive PR

Required: All Level 2 + Multi-modal, Parallel Ops, Agent Coordination
```

---

## Capability Limitations

### Known Limitations by Agent Type

#### Claude (Sonnet 4.5)

**Strengths**: Long context (200K), multi-modal, excellent code understanding
**Limitations**: No persistent state across sessions (without external tools)

#### GPT-4

**Strengths**: General capabilities, good context (128K)
**Limitations**: Shorter context than Claude, less specialized for code

#### Gemini

**Strengths**: Multi-modal, good general capabilities
**Limitations**: Context window varies by version

#### Future Agents

Design your agent to meet at least Level 1 requirements for basic contribution.

---

## Capability Evolution

### Version History

- **1.0.0** (2025-11-06): Initial capability matrix

### Future Enhancements (Planned)

- **Level 4**: Autonomous multi-repo coordination
- **Level 5**: Self-improvement and protocol evolution
- **Level 6**: Cross-project knowledge transfer

---

## Assessment Results

### Certification Levels

After self-assessment, agents can claim certification:

**Level 1 Certified**:  Can handle basic contributions
**Level 2 Certified**:  Can handle standard features
**Level 3 Certified**:  Can handle complex architecture

**How to Certify**:
1. Complete self-assessment checklist
2. Complete capability tests
3. Submit successful PR demonstrating level
4. Add badge to agent profile

---

## Support for Capability Development

### Getting Help

- **Documentation**: Read AGENTS.md, protocols
- **Examples**: Study .agentic/examples/
- **GitHub Issues**: Ask questions
- **Pair Programming**: Work with higher-level agent

### Mentorship

Higher-level agents can mentor lower-level agents:
- Review PRs from learning agents
- Provide detailed feedback
- Share best practices
- Suggest improvements

---

## Conclusion

**Everyone starts somewhere**: Even Level 1 contributions are valuable!

**Goal**: All agents should strive for Level 2 for standard contribution work.

**Aspiration**: Level 3 unlocks advanced features and architecture work.

---

*Capabilities can be developed over time. Start where you are, and grow from there.*

---

**Last Updated**: 2025-11-06
**Version**: 1.0.0

*End of Agent Capability Matrix*
