---
type: task
id: T-12
epic: E-04
status: done
blocked-by: []
default-model: high
---

## What to Build

Wire the full runner state machine to the new `.plan` contract so retries,
model escalation, blocked work, and retrieval rounds are enforced by the real
automation path instead of only documented in the contract.

## Context

The current framework source documents the state machine, but the runner scripts
do not yet enforce the full retry/escalation/retrieval logic end to end.

## Acceptance Criteria

- [x] Runner automation reads sub-task model metadata.
- [x] Retry counts and escalation decisions are persisted and respected.
- [x] Retrieval rounds and blocked-state transitions are enforced.

## Sub-Tasks

### ST-01 - Teach the runners to consume the full runtime contract

status: done
model: high
escalate-if: [failing-twice, cross-file-refactor, architecture-choice]
blocked-by: []

what-to-do:
- Extend runner and helper-script behavior so the documented state machine
  becomes the actual runtime behavior.

files-to-touch:
- `ralph-loop-agy.sh`
- `ralph-loop-codex.sh`
- `ralph-loop-hermes.sh`
- `.plan/helper-scripts/*`

verification:
- A representative task flow shows retries, escalation, and blocking behavior.

#### Execution Notes

- Added `.plan/helper-scripts/runtime-state.sh` and the framework starter copy to parse task/sub-task runtime metadata, persist attempt/retrieval/escalation state in `.run-state.json`, and synchronize blocked/done transitions through `sync-state.sh`.
- Wired `ralph-loop-hermes.sh`, `ralph-loop-codex.sh`, and `ralph-loop-agy.sh` to load the selected sub-task contract before each attempt, inject bounded retrieval bundles into the agent prompt, and persist success/retry/blocked outcomes after each run.
- Verified on temporary `.plan` fixtures that repeated retries escalate after the second failure, auto-block after the third bounded retrieval with no code change, and mark the task done on success while updating epic/index aggregates.
