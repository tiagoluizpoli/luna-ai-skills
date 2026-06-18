---
type: task
id: T-23
epic: E-09
status: ready
blocked-by: []
default-model: medium
---

## What to Build

Retain skipped skill metadata/timestamps in `.framework-install.json`, write unit and integration tests for conflict prompting and copy/skip outcomes, and perform local validation runs.

## Context

When skills are skipped, their installer record in `.framework-install.json` must preserve their pre-existing metadata and `installedAt` timestamps, rather than updating them to the current time or removing them.

## Acceptance Criteria

- [ ] Unselected skills retain their pre-existing installation details and `installedAt` timestamps in `.framework-install.json`.
- [ ] Overwritten skills have their `installedAt` timestamps updated to the current time.
- [ ] Installer test suite has tests verifying the consolidated prompting, skip/overwrite outcomes, and metadata preservation.
- [ ] Integration validation runs pass cleanly.

## Sub-Tasks

### ST-01 - Preserve Skip Metadata in Install Records

status: ready
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Modify installer's metadata writing logic to preserve previous records' details (particularly `installedAt` timestamps) for targets that were not overwritten.
- Merge the newly installed skill metadata with the preserved skipped skill metadata.

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`

verification:
- Run installer, skip one skill, inspect `.framework-install.json` and verify the skipped skill's timestamp remains unchanged.

### ST-02 - Implement Unit/Integration Test Coverage

status: ready
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Write tests simulating conflict situations (existing directories) and checking prompt formatting, selection, file installation, and metadata updating.
- Verify Claude provider installation maps targets correctly and copies `ralph-loop-claude.sh`.

files-to-touch:
- `frameworks/ralph-loop/installer/tests/index.test.mjs` (or other relevant test files in `installer/tests/`)

verification:
- Execute `npm test` inside the installer directory to verify the test suite.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
