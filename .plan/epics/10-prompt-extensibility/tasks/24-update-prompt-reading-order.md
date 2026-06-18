---
type: task
id: T-24
epic: E-10
status: ready
blocked-by: []
default-model: medium
---

## What to Build

Update `frameworks/ralph-loop/.plan/prompt.md` to expand the Mandatory Context reading order from 7 steps to 9 steps: insert `CONTEXT.md` (if exists) at step 2, and add `prompt.local.md` (if exists) at step 9 as the final consumer extension point.

## Context

- File: `frameworks/ralph-loop/.plan/prompt.md`
- Current reading order has 7 steps; target is 9 steps per PRD v5.
- `CONTEXT.md` is the repo-root domain glossary — read after `RULES.md`, before `agents.local.md`.
- `prompt.local.md` is the repo-root consumer extension — read last, after all framework context.
- Both steps are conditional: "if the file exists, read it."
- PRD implementation decision §2 defines the exact new ordering.

## Acceptance Criteria

- [ ] Reading order list has exactly 9 steps.
- [ ] Step 2 reads `CONTEXT.md` if it exists at repo root.
- [ ] Step 9 reads `prompt.local.md` if it exists at repo root.
- [ ] Step 9 includes explicit instruction: "If `prompt.local.md` exists at the repo root, read it now."
- [ ] No other changes to `prompt.md` content.

## Sub-Tasks

### ST-01 - Update Mandatory Context reading order in prompt.md

status: ready
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Open `frameworks/ralph-loop/.plan/prompt.md` and locate the Mandatory Context section.
- Replace the current 7-step numbered list with the 9-step list from PRD v5 §2.
- Step 2: `CONTEXT.md` if it exists (repo root domain glossary).
- Step 9: `prompt.local.md` if it exists — append explicit instruction "If `prompt.local.md` exists at the repo root, read it now." after the list.
- Preserve all surrounding text verbatim.

files-to-touch:
- `frameworks/ralph-loop/.plan/prompt.md`

verification:
- `grep -n "prompt.local.md" frameworks/ralph-loop/.plan/prompt.md` — must appear at step 9.
- `grep -n "CONTEXT.md" frameworks/ralph-loop/.plan/prompt.md` — must appear at step 2.
- Count numbered steps in the Mandatory Context list: must equal 9.

#### Execution Notes

- No execution notes yet.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
