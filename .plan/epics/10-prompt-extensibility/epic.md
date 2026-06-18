---
type: epic
id: E-10
name: "Prompt Extensibility"
status: ready
blocked-by: []
---

## About this Epic

Introduce two consumer-owned extension points in the Ralph Loop framework: `prompt.local.md` (project-specific runtime instructions, loaded last by `prompt.md`) and `CONTEXT.md` (domain glossary, added to reading order after `RULES.md`). The installer scaffolds both on fresh install and never touches them on update. `RULES.md` is reclassified from managed to consumer-owned starter. Reading order in `prompt.md` expands from 7 to 9 steps.

## Context

- PRD: `.plan/prds/PRD-v5-prompt-extensibility.md`
- Framework prompt: `frameworks/ralph-loop/.plan/prompt.md`
- Ownership manifest: `frameworks/ralph-loop/framework-files.json`
- Installer: `frameworks/ralph-loop/installer/src/index.mjs`
- Installer tests: `frameworks/ralph-loop/installer/tests/index.test.mjs`

## Child Tasks

| Task ID | Task | Status | Blocked By | File |
| --- | --- | --- | --- | --- |
| T-24 | Update `prompt.md` reading order | ready | — | `.plan/epics/10-prompt-extensibility/tasks/24-update-prompt-reading-order.md` |
| T-25 | Reclassify file ownership in `framework-files.json` | ready | — | `.plan/epics/10-prompt-extensibility/tasks/25-reclassify-file-ownership.md` |
| T-26 | Installer scaffold logic for consumer-owned starter files | ready | T-25 | `.plan/epics/10-prompt-extensibility/tasks/26-installer-scaffold-logic.md` |
| T-27 | Installer tests: scaffold and update preservation | ready | T-25, T-26 | `.plan/epics/10-prompt-extensibility/tasks/27-installer-scaffold-tests.md` |

---

<!-- INDEX SYNC: After completing or modifying any child task file, run
.plan/helper-scripts/sync-state.sh and update .plan/index.md in the same turn. -->
