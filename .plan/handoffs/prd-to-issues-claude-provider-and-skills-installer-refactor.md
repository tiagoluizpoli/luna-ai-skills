# Handoff: PRD To Issues

Date: 2026-06-17
Source PRD: .plan/prds/PRD-v4-claude-provider-and-skills-installer-refactor.md
Status: ready-for-issues
Scope: decompose the Claude Loop Runner Script integration and multi-select conflict resolution PRD into execution slices.

## Locked Decisions

- Register the Claude runner script (`ralph-loop-claude.sh`) as a framework asset under `agentSpecificAssets` in `framework-files.json`.
- Add `claude` to `selectionContract.installAgents` in `skills-manifest.json`.
- All 18 skills in `skills-manifest.json` will support `claude-local` and `claude-global` targets mapping directly to `.claude/skills/<skill-id>` and `~/.claude/skills/<skill-id>`.
- The installer's external skill discovery path in `index.mjs` will include `~/.claude/skills/`.
- Replace individual `p.select` prompts in `installSkills` with a single consolidated `p.multiselect` prompt showing `<skillName> (<target>)`.
- Unselected options in the multiselect will skip overwriting but retain their existing metadata and installation timestamps in `.framework-install.json`.
- The legacy argument warning message in `index.mjs` will be updated to explicitly include `claude`.

## Decomposition Constraints

- Break the work into vertical slices: manifest/asset registration first, installer logic refactoring second, and validation testing third.
- Preserve existing external prerequisite validation and the neutral `.plan/` workspace structure.
- Include testing decisions for conflict scenarios, ensuring correct overwrite and metadata behavior.

## Out Of Scope

- Support for other custom target structures not defined in the manifest.
- Custom keybinding overrides in `@clack/prompts`.
- Deleting user-created custom skills that are not part of the framework manifest.

## Next Step

- Run `luna-to-issues` using this handoff plus the canonical PRD.
