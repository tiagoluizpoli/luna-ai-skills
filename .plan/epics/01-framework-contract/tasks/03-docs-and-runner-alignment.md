---
type: task
id: T-03
epic: E-01
status: done
blocked-by: []
default-model: medium
---

## What to Build

Align the framework docs and loop runners to the new contract so they stop
describing the older mixed workspace rules.

## Context

The repo docs and runners still referenced earlier conventions until the
framework source was updated.

## Acceptance Criteria

- [x] README reflects installer-first usage.
- [x] Framework planning doc reflects the current contract.
- [x] Runners treat `agents.local.md` as optional.

## Sub-Tasks

### ST-01 - Update README, planning docs, and runner prompts

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Rewrite docs and adjust runner prompt strings to the finalized contract.

files-to-touch:
- `README.md`
- `docs/ralph-loop-framework.md`
- `ralph-loop-agy.sh`
- `ralph-loop-codex.sh`
- `ralph-loop-hermes.sh`

verification:
- `bash -n ralph-loop-agy.sh ralph-loop-codex.sh ralph-loop-hermes.sh`

#### Execution Notes

- Completed in `a3716bf`.
