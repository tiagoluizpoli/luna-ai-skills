---
type: task
id: T-15
epic: E-04
status: done
blocked-by: []
default-model: medium
---

## What to Build

Add deterministic phase handoffs and canonical planning pointers so grilling,
PRD generation, and issue generation can continue across sessions without
guessing from directory listings.

## Context

The wrapper skills had the right broad behavior, but they still depended too
much on skill-following and "latest relevant" inference instead of canonical
repo-local selectors and durable handoff artifacts.

## Acceptance Criteria

- [x] `.plan/handoffs/` exists in the framework starter and live workspace.
- [x] Canonical pointer files exist for the current grilling session, current
      PRD, current grill handoff, and current PRD handoff.
- [x] Helper scripts exist to set and resolve those pointers.
- [x] `luna-grill-with-docs`, `luna-to-prd`, and `luna-to-issues` are updated
      to use the pointer and handoff contract.

## Sub-Tasks

### ST-01 - Add durable phase pointers and handoff rules

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Add the `.plan/handoffs/` surface, helper scripts, and wrapper-skill
  contracts for deterministic phase transitions.

files-to-touch:
- `frameworks/ralph-loop/.plan/*`
- `frameworks/ralph-loop/framework-files.json`
- `.plan/*`
- `.agents/skills/luna-grill-with-docs/*`
- `.agents/skills/luna-to-prd/*`
- `.agents/skills/luna-to-issues/*`

verification:
- The framework starter and live workspace both expose the same canonical
  pointer files and helper scripts.

#### Execution Notes

- Added after the initial wrapper-skill pass to remove cross-session ambiguity.
