---
type: task
id: T-22
epic: E-09
status: done
blocked-by: []
default-model: medium
---

## What to Build

Refactor the installer update prompt behavior when conflicting/existing skills exist, switching from sequential single confirmation selections to a single bulk multi-select checklist.

## Context

The current `installSkills` function runs a loop over skills and prompts sequentially for each existing folder. We want to check all targets first, construct a consolidated multiselect, prompt the user once, and then copy files only for selected items.

## Acceptance Criteria

- [x] Conflicts are scanned and identified upfront before copying begins.
- [x] A single `@clack/prompts` `multiselect` checklist is presented showing options formatted as `<skillName> (<targetName>)`.
- [x] Skills selected for override have their target directories deleted and updated with fresh files.
- [x] Skills not selected (skipped) are not deleted and keep their existing local files.

## Sub-Tasks

### ST-01 - Consolidate Conflict Scanning and Prompting Logic

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Modify `installSkills` in `index.mjs` to map each target/skill combination and check if its destination path exists.
- Separate the conflicting targets from clean installation targets.
- Present a single `@clack/prompts` `multiselect` list if any conflict is detected.
- Maintain support for non-interactive modes (`--yes` and `--force`) where prompts are bypassed.

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`

verification:
- Run installer interactively on a workspace with multiple existing skills and confirm one list checklist is presented.

### ST-02 - Integrate Copy and Skip Routing

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Process the actual file-system copy/overwrite operations for all clean targets and user-selected conflicting targets.
- Ensure skipped targets do not have their folders deleted or overwritten.

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`

verification:
- Run the installer, select only half of the conflicting skills to update, and assert that skipped skill folders retain their previous state.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
