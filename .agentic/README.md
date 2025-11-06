# Universal Agentic Orchestration Layer

**Version**: 1.0.0
**Last Updated**: 2025-11-06

---

## Overview

This directory contains **universal protocols, standards, and examples** for AI agent development in the llm_physics repository.

**Key Principle**: These protocols are **agent-agnostic**. They work for Claude, GPT-4, Gemini, and any future AI system with basic file system and command execution capabilities.

---

## Directory Structure

```
.agentic/
├── protocols/              # Core protocol definitions
│   ├── core-workflow.md    # PTIV workflow (mandatory)
│   ├── testing-standards.md # Test coverage and patterns
│   ├── security-compliance.md # Security and audit requirements
│   └── git-conventions.md  # Git workflow and commit standards
│
├── examples/               # Reference implementations
│   ├── test-generation-workflow.md
│   ├── feature-implementation-workflow.md
│   └── bug-fix-workflow.md (planned)
│
├── templates/              # Reusable templates
│   ├── agent-spec-template.md (planned)
│   ├── workflow-template.md (planned)
│   └── test-template.tsx (planned)
│
└── README.md              # This file
```

---

## Quick Start for New Agents

### 5-Minute Onboarding

1. **Read Core Documentation** (in order):
   ```bash
   Read: /AGENTS.md          # Universal agent guide (15 min)
   Read: /CLAUDE.md          # Project policies (10 min)
   Read: /ARCHITECTURE.md    # System design (15 min)
   ```

2. **Read Protocols** (in order):
   ```bash
   Read: .agentic/protocols/core-workflow.md
   Read: .agentic/protocols/testing-standards.md
   Read: .agentic/protocols/security-compliance.md
   Read: .agentic/protocols/git-conventions.md
   ```

3. **Study Examples**:
   ```bash
   Read: .agentic/examples/test-generation-workflow.md
   Read: .agentic/examples/feature-implementation-workflow.md
   ```

4. **Verify Capabilities**:
   ```bash
   node --version    # Should be 20.x+
   npm --version     # Should be present
   git --version     # Should be present
   ```

5. **Health Check**:
   ```bash
   npm ci
   npm run lint && npm test && npm run build
   node scripts/verify_audit_block.js
   ```

---

## Protocols

### Core Workflow (MANDATORY)

**File**: `protocols/core-workflow.md`

**Description**: The PTIV (Plan → Test → Implement → Verify) workflow that ALL agents MUST follow for code changes.

**Key Points**:
- Plan: Break down tasks, create subtask list
- Test: Write tests first (TDD) or alongside implementation
- Implement: Write minimal code to pass tests
- Verify: Run lint, test, build, audit (all must pass)

### Testing Standards (MANDATORY)

**File**: `protocols/testing-standards.md`

**Description**: Test coverage requirements (>95%) and patterns.

**Key Points**:
- Unit tests with Jest
- Component tests with React Testing Library
- >95% coverage required (lines, statements, functions, branches)
- Test behavior, not implementation
- Descriptive test names

### Security and Compliance (MANDATORY)

**File**: `protocols/security-compliance.md`

**Description**: Security rules and compliance levels.

**Key Points**:
- Never commit secrets
- Validate all inputs
- CRITICAL findings block merge
- Run audit script before commit
- Use environment variables for secrets

### Git Conventions (MANDATORY)

**File**: `protocols/git-conventions.md`

**Description**: Branch naming, commit messages, and git workflow.

**Key Points**:
- Branch format: `<type>/<description>`
- Commit format: Conventional Commits
- Agent branches: `<agent-name>/<type>-<description>`
- Atomic commits (one logical change per commit)
- Test before committing

---

## Examples

### Test Generation Workflow

**File**: `examples/test-generation-workflow.md`

**Description**: Complete example of generating comprehensive tests for an existing component.

**Learn**:
- How to analyze component for test cases
- Test organization (describe blocks)
- Achieving 100% coverage
- Testing edge cases and accessibility

### Feature Implementation Workflow

**File**: `examples/feature-implementation-workflow.md`

**Description**: End-to-end example of implementing dark mode toggle feature using TDD.

**Learn**:
- TDD approach (tests first)
- Context API usage
- localStorage persistence
- Accessibility implementation
- PR creation process

---

## Templates (Coming Soon)

### Agent Spec Template

Define new specialized agent types using standardized format.

### Workflow Template

Reusable template for documenting complex workflows.

### Test Template

Boilerplate for common test patterns.

---

## Best Practices

### For All Agents

1. **Always read before writing**: Understand existing code
2. **Follow PTIV religiously**: Plan → Test → Implement → Verify
3. **Test comprehensively**: Achieve >95% coverage
4. **Commit atomically**: One logical change per commit
5. **Document thoroughly**: Update relevant docs
6. **Ask when uncertain**: Better to ask than break things

### For Protocol Updates

1. **Propose via PR**: Protocol changes require review
2. **Version updates**: Update version number in file header
3. **Backward compatibility**: Support previous version for 2 releases
4. **Announce changes**: Document in PR and CHANGELOG
5. **Update examples**: Ensure examples reflect new protocols

---

## Agent Capability Requirements

### Minimum Capabilities

To use these protocols effectively, agents MUST have:

- **File Operations**: Read, write, edit files
- **Command Execution**: Run bash commands (npm, git, node)
- **Context Management**: Track task state across multiple turns
- **Decision Making**: Break down tasks, prioritize actions

### Recommended Capabilities

For optimal contribution:

- **Web Access**: Fetch documentation
- **Multi-modal**: Read images, diagrams
- **Long Context**: Handle 100K+ tokens
- **Parallel Operations**: Execute independent tasks concurrently

See [AGENTS.md](/AGENTS.md) for detailed capability requirements.

---

## Protocol Versioning

**Current Version**: 1.0.0

**Versioning Scheme**: Semantic Versioning (semver)

- **Major**: Breaking changes (1.0.0 → 2.0.0)
- **Minor**: New features, backward compatible (1.0.0 → 1.1.0)
- **Patch**: Bug fixes, clarifications (1.0.0 → 1.0.1)

**Deprecation Policy**:
- Deprecated features marked clearly
- Supported for at least 2 minor versions
- Migration guide provided

---

## Contributing to Protocols

### Process

1. **Identify gap or improvement**
2. **Open GitHub Issue** to discuss
3. **Create PR** with proposed changes
4. **Update version** in affected files
5. **Update examples** to reflect changes
6. **Get review** from maintainers
7. **Announce** via PR comments and documentation

### Review Criteria

- **Clarity**: Is it clear and unambiguous?
- **Completeness**: Does it cover all cases?
- **Universality**: Does it work for all agents?
- **Practicality**: Can it be followed in practice?
- **Consistency**: Does it align with existing protocols?

---

## Troubleshooting

### Common Issues

**Issue**: Protocol conflicts with agent capabilities

**Solution**: Open issue to discuss adaptation or alternative approach

**Issue**: Example doesn't match current codebase

**Solution**: Examples are reference implementations, adapt to current structure

**Issue**: Protocol unclear or ambiguous

**Solution**: Open issue to request clarification or improvement

---

## Resources

### Primary Documentation

- [AGENTS.md](/AGENTS.md) - Universal agent guide
- [CLAUDE.md](/CLAUDE.md) - Project policies
- [ARCHITECTURE.md](/ARCHITECTURE.md) - System architecture
- [CONTRIBUTING.md](/CONTRIBUTING.md) - Contribution guidelines

### External Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)

---

## Contact and Support

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas
- **Pull Requests**: Code contributions

---

## License

This documentation is part of the llm_physics project and follows the same license (see [LICENSE](/LICENSE)).

---

**Last Updated**: 2025-11-06
**Maintainers**: llm_physics team + AI agent contributors

*These protocols ensure consistent, high-quality contributions from all agents, regardless of their underlying model or provider.*

---

*End of .agentic README*
