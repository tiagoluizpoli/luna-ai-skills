---
type: task
id: T-01
epic: E-01
status: done
blocked-by: []
default-model: medium
---

## What to Build

Replace the old mixed workspace assumptions with a `.plan`-based contract that
separates framework-managed files from workflow-owned files and keeps only one
backlog surface.

## Context

The grilling session locked the shift from `.specify/memory` and root workflow
files into a neutral `.plan/` workspace with explicit ownership boundaries.

## Acceptance Criteria

- [x] The starter workspace uses `.plan/`.
- [x] `deferred-backlog` is removed in favor of one backlog with `status` and
      `horizon`.
- [x] Starter templates and docs reflect the new contract.

## Sub-Tasks

### ST-01 - Replace starter placeholders with the `.plan` contract

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Update starter files to reflect the `.plan` contract and ownership split.

files-to-touch:
- `frameworks/ralph-loop/.plan/*`
- `frameworks/ralph-loop/README.md`

verification:
- Review starter file layout and confirm `deferred-backlog` is gone.

#### Execution Notes

- Completed in `a3716bf`.
