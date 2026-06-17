---
type: epic
id: E-06
name: "Asset And Ownership Contract"
status: done
blocked-by: []
---

## About this Epic

Align the installer’s asset-routing and file-ownership behavior with the locked
framework contract so selected agents receive only the correct assets and clean
install/update obey the same manifest-driven boundaries.

## Context

The current branch still routes assets too coarsely and lets fresh install copy
outside the declared framework contract. The PRD requires separate shared versus
agent-specific assets and explicit framework-managed versus workflow-owned file
boundaries.

## Child Tasks

| Task ID | Task | Status | Blocked By | File |
| --- | --- | --- | --- | --- |
| T-17 | Asset routing contract: shared vs agent-specific assets | done | — | `.plan/epics/06-asset-and-ownership-contract/tasks/01-asset-routing-contract.md` |
| T-18 | Install ownership and starter manifest alignment | done | — | `.plan/epics/06-asset-and-ownership-contract/tasks/02-install-ownership-and-starter-manifest-alignment.md` |

---

<!-- INDEX SYNC: After completing or modifying any child task file, run
.plan/helper-scripts/sync-state.sh and update .plan/index.md in the same turn. -->
