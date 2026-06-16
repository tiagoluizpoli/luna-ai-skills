---
type: task
id: T-11
epic: E-04
status: done
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

- [x] `sync-state.sh` updates task and epic aggregates directly.
- [x] `retrieve-history.sh` ranks and compacts results more intelligently.
- [x] `archive-run.sh` handles run-family archival more completely.

## Sub-Tasks

### ST-01 - Harden the sync and retrieval scripts

status: done
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

- Replaced the scaffold-only `sync-state.sh` with in-place task/epic/index aggregation updates.
- Reworked `retrieve-history.sh` into a ranked local bundle over current history, archived histories, summaries, and manifests.
- Expanded `archive-run.sh` to snapshot the active execution tree, canonical pointer targets, and a per-family summary copy.
- Verified the helper scripts with `bash -n` and a temporary fixture workspace that exercised sync, retrieval, and archival end-to-end.
