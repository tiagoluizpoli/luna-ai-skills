---
type: task
id: T-14
epic: E-02
status: done
blocked-by: []
default-model: medium
---

## What to Build

Create `luna-grill-with-docs` as a framework-owned wrapper around
`grill-with-docs`, targeting persistent grilling session state under
`.plan/grilling/`.

## Context

The user wanted to keep the original `grill-with-docs` questioning behavior,
but make the session resumable by persisting the starting context, current
question, future queue, and answered questions to disk after every turn.

## Acceptance Criteria

- [x] `.agents/skills/luna-grill-with-docs/SKILL.md` exists.
- [x] The skill explicitly delegates the grilling behavior to `grill-with-docs`.
- [x] The skill requires persistent session files under `.plan/grilling/`.
- [x] The framework manifest includes `luna-grill-with-docs` in the core bundle.

## Sub-Tasks

### ST-01 - Package `luna-grill-with-docs` as a persistent grilling wrapper

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Create the wrapper skill and document the persistent grilling session format.

files-to-touch:
- `.agents/skills/luna-grill-with-docs/SKILL.md`
- `.agents/skills/luna-grill-with-docs/references/grilling-session-format.md`

verification:
- Inspect the skill contract and confirm `.plan/grilling/` plus the
  current/future/answered question sections are the target surfaces.

#### Execution Notes

- Added as a framework-owned wrapper skill after the initial framework build.
