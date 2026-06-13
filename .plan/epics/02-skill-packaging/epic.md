---
type: epic
id: E-02
name: "Skill Packaging And Ownership"
status: done
blocked-by: []
---

## About this Epic

Package the framework-owned skills, separate them from Matt Pocock
prerequisites, and define the install bundles plus dependency metadata.

## Context

The user wanted framework-owned skills installable either repo-locally or
globally, while keeping Matt Pocock skills external and validated rather than
vendored.

## Child Tasks

| Task ID | Task | Status | Blocked By | File |
| --- | --- | --- | --- | --- |
| T-04 | Create the `commit` skill from workflow guidance | done | — | `.plan/epics/02-skill-packaging/tasks/01-create-commit-skill.md` |
| T-05 | Rewrite `to-epic-issues` for `.plan` output | done | — | `.plan/epics/02-skill-packaging/tasks/02-plan-based-to-epic-issues.md` |
| T-06 | Add skill bundles and dependency metadata | done | — | `.plan/epics/02-skill-packaging/tasks/03-skill-manifest-and-bundles.md` |
