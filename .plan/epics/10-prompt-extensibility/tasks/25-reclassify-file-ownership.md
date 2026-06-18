---
type: task
id: T-25
epic: E-10
status: done
blocked-by: []
default-model: medium
---

## What to Build

Update `frameworks/ralph-loop/framework-files.json` to introduce a `consumerOwnedStarterFiles` category (scaffolded on fresh install, never touched on update), move `RULES.md` out of `managedFiles` into it, and add `prompt.local.md` and `CONTEXT.md` as new consumer-owned starter entries.

## Context

- File: `frameworks/ralph-loop/framework-files.json`
- `managedFiles` = framework-owned, always overwritten on update.
- `RULES.md` currently appears in `managedFiles` — this conflicts with its consumer-owned status.
- New category `consumerOwnedStarterFiles`: installer writes on fresh install, skips on update if file exists.
- `prompt.local.md` and `CONTEXT.md` must NOT appear in `managedFiles` or `workflowOwnedFiles`.
- T-26 and T-27 both depend on this classification being correct.

## Acceptance Criteria

- [x] `consumerOwnedStarterFiles` array exists in `framework-files.json`.
- [x] `RULES.md` absent from `managedFiles`.
- [x] `RULES.md` present in `consumerOwnedStarterFiles`.
- [x] `prompt.local.md` present in `consumerOwnedStarterFiles`.
- [x] `CONTEXT.md` present in `consumerOwnedStarterFiles`.
- [x] `prompt.local.md` absent from `managedFiles` and `workflowOwnedFiles`.
- [x] `CONTEXT.md` absent from `managedFiles` and `workflowOwnedFiles`.
- [x] JSON remains valid.

## Sub-Tasks

### ST-01 - Add consumerOwnedStarterFiles array

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Read `frameworks/ralph-loop/framework-files.json`.
- Add a top-level `consumerOwnedStarterFiles` array.
- Populate with `RULES.md`, `prompt.local.md`, and `CONTEXT.md` entries.
- Each entry should follow the same shape as existing `managedFiles` entries (path + any metadata the schema uses).

files-to-touch:
- `frameworks/ralph-loop/framework-files.json`

verification:
- `node -e "const f=require('./framework-files.json'); console.log(f.consumerOwnedStarterFiles)"` from `frameworks/ralph-loop/` — must print the array.

### ST-02 - Remove RULES.md from managedFiles

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Remove the `RULES.md` entry from the `managedFiles` array in `framework-files.json`.
- Confirm `RULES.md` now only appears under `consumerOwnedStarterFiles`.

files-to-touch:
- `frameworks/ralph-loop/framework-files.json`

verification:
- `node -e "const f=require('./framework-files.json'); console.log(f.managedFiles.some(x=>x.includes('RULES')))"` — must print `false`.

### ST-03 - Verify prompt.local.md and CONTEXT.md absent from managed arrays

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Confirm neither `prompt.local.md` nor `CONTEXT.md` appears in `managedFiles` or `workflowOwnedFiles`.
- If either appears, remove it.

files-to-touch:
- `frameworks/ralph-loop/framework-files.json`

verification:
- `node -e "const f=require('./framework-files.json'); const managed=[...(f.managedFiles||[]),...(f.workflowOwnedFiles||[])].join(','); console.log(managed.includes('prompt.local')||managed.includes('CONTEXT'))"` — must print `false`.

#### Execution Notes

- No execution notes yet.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
