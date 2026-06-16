---
type: epic
id: E-04
name: "Rollout And Runtime Hardening"
status: in-progress
blocked-by: []
---

## About this Epic

Take the verified framework source into a real consumer repository and deepen
the runtime automation beyond the current v1 scaffolds.

## Context

The source framework is implemented, but the real consumer rollout and richer
runtime behavior were explicitly left for the next phase.

## Child Tasks

| Task ID | Task | Status | Blocked By | File |
| --- | --- | --- | --- | --- |
| T-10 | Apply the framework to a real consumer repository | ready | — | `.plan/epics/04-rollout-and-hardening/tasks/01-consumer-repo-rollout.md` |
| T-11 | Harden helper scripts into richer automation | ready | — | `.plan/epics/04-rollout-and-hardening/tasks/02-helper-script-hardening.md` |
| T-12 | Wire the full runner state machine to the new contract | ready | — | `.plan/epics/04-rollout-and-hardening/tasks/03-runner-state-machine.md` |
| T-15 | Add deterministic phase handoffs and planning pointers | done | — | `.plan/epics/04-rollout-and-hardening/tasks/04-deterministic-phase-handoffs.md` |
