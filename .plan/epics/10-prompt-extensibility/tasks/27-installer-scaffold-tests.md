---
type: task
id: T-27
epic: E-10
status: in-progress
blocked-by: []
default-model: medium
---

## What to Build

Add installer tests to `frameworks/ralph-loop/installer/tests/index.test.mjs` covering: fresh install creates `prompt.local.md` and `CONTEXT.md` with starter content; update preserves pre-existing `prompt.local.md`, `CONTEXT.md`, and `RULES.md`; `framework-files.json` classification is correct.

## Context

- Test file: `frameworks/ralph-loop/installer/tests/index.test.mjs`
- Existing tests follow the pattern: create temp dir, run installer, assert file-system state.
- Also `frameworks/ralph-loop/installer/tests/selection-contract.test.mjs` for reference.
- PRD v5 §Testing Decisions defines exactly what to assert.
- Tests assert observable installer outputs, not internal logic.

## Acceptance Criteria

- [x] Test: fresh install creates `prompt.local.md` with starter content.
- [x] Test: fresh install creates `CONTEXT.md` with starter content.
- [x] Test: update run leaves pre-existing `prompt.local.md` unchanged.
- [x] Test: update run leaves pre-existing `CONTEXT.md` unchanged.
- [x] Test: update run leaves pre-existing `RULES.md` unchanged.
- [x] Test: `framework-files.json` has `prompt.local.md` absent from `managedFiles` and `workflowOwnedFiles`.
- [x] Test: `framework-files.json` has `CONTEXT.md` absent from `managedFiles` and `workflowOwnedFiles`.
- [x] All new tests pass: `cd frameworks/ralph-loop/installer && npm test`.

## Sub-Tasks

### ST-01 - Test fresh install scaffold for prompt.local.md and CONTEXT.md

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- In `index.test.mjs`, add a test block for fresh install scaffold.
- Create a temp empty dir, run the installer in fresh-install mode against it.
- Assert `prompt.local.md` exists in the target dir with the expected starter content.
- Assert `CONTEXT.md` exists in the target dir with the expected starter content.
- Follow the existing temp-dir + run-installer pattern already in the file.

files-to-touch:
- `frameworks/ralph-loop/installer/tests/index.test.mjs`

verification:
- `cd frameworks/ralph-loop/installer && npm test` — new tests pass.

### ST-02 - Test update preserves consumer-owned files

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Add a test block for update preservation.
- Set up a temp dir with pre-existing `prompt.local.md`, `CONTEXT.md`, and `RULES.md` each containing custom (non-starter) content.
- Run the installer in update mode against it.
- Assert all three files are unchanged (content matches pre-existing custom content).

files-to-touch:
- `frameworks/ralph-loop/installer/tests/index.test.mjs`

verification:
- `cd frameworks/ralph-loop/installer && npm test` — preservation tests pass.

### ST-03 - Test framework-files.json classification

status: in-progress
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Add a test that reads `framework-files.json` directly (no installer run needed).
- Assert `prompt.local.md` does not appear in `managedFiles` or `workflowOwnedFiles`.
- Assert `CONTEXT.md` does not appear in `managedFiles` or `workflowOwnedFiles`.
- Assert both appear in `consumerOwnedStarterFiles`.
- Assert `RULES.md` does not appear in `managedFiles`.

files-to-touch:
- `frameworks/ralph-loop/installer/tests/index.test.mjs`

verification:
- `cd frameworks/ralph-loop/installer && npm test` — classification tests pass.

#### Execution Notes

- No execution notes yet.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
