# Claude Code Orchestration Directory

This directory contains the Claude Code orchestration configuration for the llm_physics project.

## Structure

```
.claude/
├── agents/              # Agent definitions for specialized automation
│   ├── test-autogen-agent.md
│   ├── vercel-deploy-specialist.md
│   └── repo-auditor.md
├── commands/            # Command templates for common workflows
│   ├── generate-tests.md
│   ├── deploy-vercel.md
│   └── audit-repo.md
├── settings.json        # Claude Code configuration and hooks
└── README.md           # This file
```

## Agents

Agents are specialized AI assistants that handle specific domains:

- **test-autogen-agent**: Autonomous test generation with TDD workflow support
- **vercel-deploy-specialist**: Deployment orchestration and health monitoring
- **repo-auditor**: Comprehensive security, performance, and accessibility auditing

## Commands

Commands are reusable workflows that can be invoked via slash commands:

- `/generate-tests [paths]`: Generate comprehensive test suites for specified paths
- `/deploy-vercel`: Trigger Vercel deployment with monitoring and rollback
- `/audit-repo [level]`: Run full repository compliance audit (CRITICAL, HIGH, or FULL)

## Configuration

The `settings.json` file configures:

- Enabled plugins and agents
- Hook triggers (sessionStart, stop, etc.)
- Marketplace references
- Repository trust requirements
- Statusline configuration
- Context inclusion rules

## Usage

### Invoking Commands

In a Claude Code session or PR comment:

```
/generate-tests app/components/
/audit-repo HIGH
/deploy-vercel
```

### Triggering Agents via PR Comments

```
@claude review this PR for reproducibility, audit logic, and CI/test coverage
@claude audit-repo CRITICAL
```

### Adding New Agents

1. Create agent definition: `.claude/agents/my-new-agent.md`
2. Update marketplace: `.claude-plugin/marketplace.json`
3. Enable in settings: `.claude/settings.json`
4. Document in: `CLAUDE.md`
5. Submit PR with tests

### Adding New Commands

1. Create command template: `.claude/commands/my-command.md`
2. Update marketplace: `.claude-plugin/marketplace.json`
3. Document usage: `CLAUDE.md`
4. Test thoroughly

## Best Practices

1. **Versioning**: Always pin agent and plugin versions in marketplace.json
2. **Security**: Never include secrets or credentials in agent definitions
3. **Documentation**: Keep agent documentation clear and concise
4. **Testing**: Test all commands and agents before enabling in production
5. **Audit**: Log all automated actions for compliance and debugging

## Maintenance

- Review and update agents quarterly
- Update settings.json when adding/removing functionality
- Keep documentation synchronized with actual implementation
- Archive old agents rather than deleting (for audit trail)

## References

- Main policy document: `/CLAUDE.md`
- Plugin marketplace: `/.claude-plugin/marketplace.json`
- MCP configuration: `/.mcp.json`
- GitHub workflows: `/.github/workflows/`

---

For more information, see the [CLAUDE.md](/CLAUDE.md) file in the repository root.
