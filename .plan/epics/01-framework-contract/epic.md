---
type: epic
id: E-01
name: "Framework Contract And Starter"
status: done
blocked-by: []
---

## About this Epic

Define the installable `.plan` workspace contract, runtime state surfaces,
single backlog model, helper script layout, and repo-facing docs for the Ralph
Loop framework.

## Context

- The framework had to diverge from SpecKit naming and storage.
- The repo needed a reusable starter under `frameworks/ralph-loop/.plan/`.
- The user wanted all future repositories to start from `.plan/`, not root
  workflow files and not `.specify/memory/`.

## Child Tasks

| Task ID | Task | Status | Blocked By | File |
| --- | --- | --- | --- | --- |
| T-01 | Define the `.plan` workspace contract | done | — | `.plan/epics/01-framework-contract/tasks/01-plan-workspace-contract.md` |
| T-02 | Add runtime state and helper-script surfaces | done | — | `.plan/epics/01-framework-contract/tasks/02-runtime-state-and-helper-scripts.md` |
| T-03 | Align framework docs and runners | done | — | `.plan/epics/01-framework-contract/tasks/03-docs-and-runner-alignment.md` |
