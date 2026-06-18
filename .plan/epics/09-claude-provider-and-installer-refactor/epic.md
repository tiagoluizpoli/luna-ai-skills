---
type: epic
id: E-09
name: "Claude Provider Integration & Skills Installer Refactor"
status: ready
blocked-by: []
---

## About this Epic

This epic integrates the Claude CLI runner script as a framework asset and target provider, and refactors the skills installer to present conflicts in a single multi-select prompt rather than prompting for each skill individually. It also ensures metadata preservation and test coverage.

## Context

- Manifest files: `frameworks/ralph-loop/framework-files.json` and `frameworks/ralph-loop/skills-manifest.json`
- Installer script: `frameworks/ralph-loop/installer/src/index.mjs`

## Child Tasks

| Task ID | Task | Status | Blocked By | File |
| --- | --- | --- | --- | --- |
| T-21 | Register Claude Agent and Runner Script Assets | ready | — | `.plan/epics/09-claude-provider-and-installer-refactor/tasks/01-register-claude-assets-and-targets.md` |
| T-22 | Refactor Installer to Prompt in Bulk with Multi-select List | ready | T-21 | `.plan/epics/09-claude-provider-and-installer-refactor/tasks/02-bulk-overwrite-multiselect-prompt.md` |
| T-23 | Retain Metadata and Verification Testing | ready | T-22 | `.plan/epics/09-claude-provider-and-installer-refactor/tasks/03-metadata-retention-and-testing.md` |

---

<!-- INDEX SYNC: After completing or modifying any child task file, run
.plan/helper-scripts/sync-state.sh and update .plan/index.md in the same turn. -->
