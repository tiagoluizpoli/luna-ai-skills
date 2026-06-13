---
type: task
id: T-04
epic: E-02
status: done
blocked-by: []
default-model: medium
---

## What to Build

Turn the existing workflow guidance for commits into a real first-class skill
named `commit`.

## Context

The grilling session explicitly rejected leaving `commit` as a workflow-only
surface. It needed to be part of v1 and depend on `conventional-commits`.

## Acceptance Criteria

- [x] `.agents/skills/commit/SKILL.md` exists.
- [x] The skill depends on `conventional-commits`.
- [x] The public skill name is `commit`.

## Sub-Tasks

### ST-01 - Package `commit` as a skill

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Create the `commit` skill from the workflow guidance and align it with the
  public naming contract.

files-to-touch:
- `.agents/skills/commit/SKILL.md`

verification:
- Inspect the new skill file for dependency and workflow coverage.

#### Execution Notes

- Completed in `a3716bf`.
