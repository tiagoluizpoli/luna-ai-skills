---
type: task
id: T-13
epic: E-02
status: done
blocked-by: []
default-model: medium
---

## What to Build

Create `luna-to-prd` as a framework-owned wrapper around Matt Pocock's
`to-prd`, targeting the `.plan` PRD index and versioned PRD layout.

## Context

The framework already owns `to-epic-issues` as a `.plan` adapter, but PRD
generation still depended directly on the external `to-prd` skill. The user
wanted a local wrapper that applies our thin-index PRD structure automatically.

## Acceptance Criteria

- [x] `.agents/skills/luna-to-prd/SKILL.md` exists.
- [x] The skill writes versioned PRDs under `.plan/prds/`.
- [x] The skill updates `.plan/PRD.md` as the thin index.
- [x] The framework manifest includes `luna-to-prd` in the core bundle.

## Sub-Tasks

### ST-01 - Package `luna-to-prd` as a `.plan` PRD wrapper

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Create the wrapper skill and document the `.plan` PRD index rules.

files-to-touch:
- `.agents/skills/luna-to-prd/SKILL.md`
- `.agents/skills/luna-to-prd/references/prd-index-rules.md`

verification:
- Inspect the skill contract and confirm `.plan/PRD.md` plus `.plan/prds/` are
  the target surfaces.

#### Execution Notes

- Added as a framework-owned wrapper skill after the initial framework build.
