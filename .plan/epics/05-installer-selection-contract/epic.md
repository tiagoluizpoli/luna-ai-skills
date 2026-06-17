---
type: epic
id: E-05
name: "Installer Selection Contract"
status: done
blocked-by: []
---

## About this Epic

Replace the live fused-target, skills-first installer flow with the locked v1
selection contract: explicit agent selection first, one run-level availability
mode second, and no manual framework-skill selection in the normal path.

## Context

The current installer still exposes bundle and skill selection plus a narrow
`codex-local` / `hermes-global` target surface. The PRD and handoff lock a
three-agent by two-availability contract instead.

## Child Tasks

| Task ID | Task | Status | Blocked By | File |
| --- | --- | --- | --- | --- |
| T-16 | Installer selection contract: agents first, one availability mode, no manual skill-selection path | done | — | `.plan/epics/05-installer-selection-contract/tasks/01-installer-selection-contract.md` |

---

<!-- INDEX SYNC: After completing or modifying any child task file, run
.plan/helper-scripts/sync-state.sh and update .plan/index.md in the same turn. -->
