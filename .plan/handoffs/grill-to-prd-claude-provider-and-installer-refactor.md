# Handoff: Grilling To PRD

Date: 2026-06-17
Source Session: .plan/grilling/2026-06-17-claude-provider-and-skills-installer-refactor.md
Status: ready-for-prd
Scope: Claude Loop Runner Script integration and multi-select conflicting skills overwrite prompts in the installer.

## Stable Decisions

- Claude agent runner script [ralph-loop-claude.sh](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/ralph-loop-claude.sh) will be registered as the `runner-claude` agent-specific asset in [framework-files.json](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/frameworks/ralph-loop/framework-files.json).
- The `claude` agent will be registered in `selectionContract.installAgents` in [skills-manifest.json](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/frameworks/ralph-loop/skills-manifest.json).
- All 18 skills in [skills-manifest.json](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/frameworks/ralph-loop/skills-manifest.json) will support `claude-local` and `claude-global` targets mapping directly to `.claude/skills/<skill-id>` and `~/.claude/skills/<skill-id>`.
- The installer's external skill discovery path in [index.mjs](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/frameworks/ralph-loop/installer/src/index.mjs) will include `~/.claude/skills/`.
- In [index.mjs](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/frameworks/ralph-loop/installer/src/index.mjs), the skill installer conflict prompt will be refactored to check all skills first and present a single consolidated `p.multiselect` list displaying each conflict as `<skillName> (<target>)`.
- Unchecked options in the multiselect will skip overwriting but retain their existing metadata and installation timestamps in `.framework-install.json`.
- The legacy argument warning message in [index.mjs](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/frameworks/ralph-loop/installer/src/index.mjs) will be updated to explicitly include `claude`.

## Open Tensions

- None. All questions have been resolved during the grilling session.

## PRD Expectations

- Ensure type safety and surgical updates.
- Keep [index.mjs](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/frameworks/ralph-loop/installer/src/index.mjs) clean, maintaining its synchronous and asynchronous orchestration logic.

## Next Step

- Run `luna-to-prd` using this handoff plus the canonical grilling session.
