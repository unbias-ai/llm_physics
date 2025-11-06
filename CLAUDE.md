# CLAUDE.md — llmphysics agentic coding spec

## Mandates
- Reproducibility: no external assets; keep dependencies explicit in package.json.
- Naming: warp-ui, audit-console, orb-panel (lowercase, hyphenated).
- Audit: each visualization will log inputs/outputs in plain ASCII blocks.
- Formatting: minimal, no emojis, no noise.

## Progress tracking
Claude must update PR comments with:
- Completed, In-progress, Pending modules
- CI status summary
- Next actionable steps

## Review rules
- Verify no hidden deps and reproducible build.
- Confirm Next.js App Router and Tailwind structure.
- Confirm presence of tests and CI workflow.
- Suggest resizable panel plan for PR #2.

## Triggers
Comment in PR:
@claude review this PR for reproducibility, audit logic, and CI/test coverage
@claude summarize progress and propose minimal resizable panel implementation for PR #2
