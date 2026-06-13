---
type: task
id: T-11
epic: E-04
status: ready
blocked-by: []
default-model: medium
---

## What to Build

Deepen the helper scripts from valid scaffolds into richer deterministic
automation for sync, archive, and historical retrieval.

## Context

The current helper scripts are intentionally small and readable, but still
closer to scaffolds than to full production automation.

## Acceptance Criteria

- [ ] `sync-state.sh` updates task and epic aggregates directly.
- [ ] `retrieve-history.sh` ranks and compacts results more intelligently.
- [ ] `archive-run.sh` handles run-family archival more completely.

## Sub-Tasks

### ST-01 - Harden the sync and retrieval scripts

status: ready
model: high
escalate-if: [failing-twice, architecture-choice]
blocked-by: []

what-to-do:
- Replace placeholder-oriented logic with fuller deterministic behavior while
  keeping the scripts readable.

files-to-touch:
- `.plan/helper-scripts/sync-state.sh`
- `.plan/helper-scripts/retrieve-history.sh`
- `.plan/helper-scripts/archive-run.sh`

verification:
- Script behavior matches the task and archive contract on representative data.

#### Execution Notes

- Not started yet.
