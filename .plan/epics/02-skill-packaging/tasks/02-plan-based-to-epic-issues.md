---
type: task
id: T-05
epic: E-02
status: done
blocked-by: []
default-model: medium
---

## What to Build

Move the old `to-epic-issues` wrapper off the `.specify`-bound assumptions,
rename it to `luna-to-issues`, and keep it as a framework-owned `.plan`
adapter on top of `to-issues`.

## Context

The Hermes-local wrapper existed already, but it targeted `.specify/memory/`.
The new framework required the same decomposition role with `.plan` output.

## Acceptance Criteria

- [x] A repo-owned `luna-to-issues` skill exists.
- [x] The skill targets `.plan`, not `.specify`.
- [x] The skill documents task schema and PRD merge rules.
- [x] The skill resolves the `CURRENT` PRD from `.plan/PRD.md`.

## Sub-Tasks

### ST-01 - Repackage the issue wrapper as `luna-to-issues`

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Create a framework-owned `.plan`-based `luna-to-issues` skill and references.

files-to-touch:
- `.agents/skills/luna-to-issues/SKILL.md`
- `.agents/skills/luna-to-issues/references/*`

verification:
- Inspect the skill contract and confirm `.plan` paths are used consistently.

#### Execution Notes

- Completed in `a3716bf`.
- Renamed from `to-epic-issues` to `luna-to-issues` without changing the
  output tree contract.
