---
type: task
id: T-21
epic: E-09
status: ready
blocked-by: []
default-model: medium
---

## What to Build

Register the Claude agent provider and loop runner script as framework assets, configure the skill manifests to support local and global targets for Claude under `.claude/skills` and `~/.claude/skills`, and update CLI argument warnings.

## Context

The installer resolves supported agents and target installation paths from `skills-manifest.json` and `framework-files.json`. We need to define Claude's settings so the installer properly tracks and deploys the new provider.

## Acceptance Criteria

- [ ] `runner-claude` is registered as an agent-specific asset in `framework-files.json` pointing to `ralph-loop-claude.sh`.
- [ ] `claude` is listed in `selectionContract.installAgents` inside `skills-manifest.json`.
- [ ] All 18 skills list `"claude-local"` and `"claude-global"` targets in `skills-manifest.json`.
- [ ] All 18 skills map `"claude-local"` to `.claude/skills/<skill-id>` and `"claude-global"` to `~/.claude/skills/<skill-id>` in `skills-manifest.json`.
- [ ] `~/.claude/skills/` is added to the installer's external skill discovery helper list.
- [ ] Legacy argument parsing warnings check includes `claude`.

## Sub-Tasks

### ST-01 - Register Claude Asset and Install Agent

status: ready
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Add `runner-claude` asset to `agentSpecificAssets` in `framework-files.json`.
- Add `claude` to `selectionContract.installAgents` in `skills-manifest.json`.

files-to-touch:
- `frameworks/ralph-loop/framework-files.json`
- `frameworks/ralph-loop/skills-manifest.json`

verification:
- Validate JSON structures and verify the additions exist under `runner-claude` and `claude`.

### ST-02 - Map Claude Target Installation Paths to Skills

status: ready
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- For each of the 18 skills in `skills-manifest.json`, add `"claude-local"` and `"claude-global"` to `supportedTargets`.
- Set `"claude-local": ".claude/skills/<skill-id>"` and `"claude-global": "~/.claude/skills/<skill-id>"` in `installPathTemplates` for all 18 skills.

files-to-touch:
- `frameworks/ralph-loop/skills-manifest.json`

verification:
- Inspect `skills-manifest.json` to ensure every skill maps the new Claude targets.

### ST-03 - Update Search Paths and Argument Warnings in Installer

status: ready
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Update `findExternalSkill` in `index.mjs` to search under `path.join(os.homedir(), ".claude", "skills", skillName, "SKILL.md")`.
- Update the legacy argument parsing error message in `index.mjs` to list `claude` (`Use --agents <hermes,codex,agy,claude>`).

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`

verification:
- Ensure CLI warning message lists `claude` and skill searches check the Claude directory.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
