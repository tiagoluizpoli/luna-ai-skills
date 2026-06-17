---
type: epic
id: E-07
name: "Update State Contract"
status: done
blocked-by: []
---

## About this Epic

Harden recorded installer state so update behavior is rich enough to be
trustworthy, visibly reuses prior state by default, and always offers explicit
override instead of silently applying stale assumptions.

## Context

The PRD keeps install explicit but allows update convenience when recorded state
is trustworthy. The current metadata is too flat to support that safely.

## Child Tasks

| Task ID | Task | Status | Blocked By | File |
| --- | --- | --- | --- | --- |
| T-19 | Update-state hardening: rich metadata, visible reuse, explicit override | done | — | `.plan/epics/07-update-state-contract/tasks/01-update-state-hardening.md` |

---

<!-- INDEX SYNC: After completing or modifying any child task file, run
.plan/helper-scripts/sync-state.sh and update .plan/index.md in the same turn. -->
