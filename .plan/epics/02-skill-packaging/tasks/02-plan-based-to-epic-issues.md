---
type: task
id: T-05
epic: E-02
status: done
blocked-by: []
default-model: medium
---

## What to Build

Move `to-epic-issues` off the old `.specify`-bound assumptions and make it a
framework-owned `.plan` adapter on top of `to-issues`.

## Context

The Hermes-local wrapper existed already, but it targeted `.specify/memory/`.
The new framework required the same decomposition role with `.plan` output.

## Acceptance Criteria

- [x] A repo-owned `to-epic-issues` skill exists.
- [x] The skill targets `.plan`, not `.specify`.
- [x] The skill documents task schema and PRD merge rules.

## Sub-Tasks

### ST-01 - Repackage `to-epic-issues` for `.plan`

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Create a framework-owned `.plan`-based `to-epic-issues` skill and references.

files-to-touch:
- `.agents/skills/to-epic-issues/SKILL.md`
- `.agents/skills/to-epic-issues/references/*`

verification:
- Inspect the skill contract and confirm `.plan` paths are used consistently.

#### Execution Notes

- Completed in `a3716bf`.
