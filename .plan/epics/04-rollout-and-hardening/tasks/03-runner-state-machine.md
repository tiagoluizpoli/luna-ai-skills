---
type: task
id: T-12
epic: E-04
status: ready
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

- [ ] Runner automation reads sub-task model metadata.
- [ ] Retry counts and escalation decisions are persisted and respected.
- [ ] Retrieval rounds and blocked-state transitions are enforced.

## Sub-Tasks

### ST-01 - Teach the runners to consume the full runtime contract

status: ready
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

- Not started yet.
