---
name: luna-to-prd
description: Wrap Matt Pocock's `to-prd` flow for the Ralph Loop framework. Generate a versioned PRD under `.plan/prds/`, update the thin index in `.plan/PRD.md`, and keep the current PRD pointer aligned with the `.plan` workspace.
---

# Luna To PRD

Use this skill when the user wants to turn the current conversation and codebase
understanding into a framework-native PRD for the Ralph Loop workflow.

This is a wrapper around Matt Pocock's `to-prd` skill. It keeps the synthesis
discipline, but writes the output into the `.plan` workspace instead of
publishing to an external issue tracker.

## Purpose

- generate a new versioned PRD file under `.plan/prds/`
- update `.plan/PRD.md` as the thin index
- mark only one PRD row as `CURRENT`
- preserve older PRDs as metadata and historical references

## Prerequisites

- Matt Pocock's `to-prd` skill must already be available
- `.plan/PRD.md` must exist
- `.plan/prds/` must exist

## Workflow

1. Read `.plan/PRD.md` to understand the existing PRD index.
2. Read the current conversation context and relevant repo documents.
3. Use the same synthesis quality bar as `to-prd`:
   - do not re-interview the user
   - synthesize what is already known
   - produce a real PRD, not a sketch
4. Determine the next PRD version number and a stable kebab-case slug.
5. Write the full PRD body to:
   - `.plan/prds/PRD-vN-<slug>.md`
6. Update `.plan/PRD.md`:
   - add a new row
   - mark the new row `CURRENT`
   - demote the previous current row to `SUPERSEDED`
   - keep the `Canonical Record` column populated
7. If `.plan/index.md` tracks the current PRD explicitly, update that pointer
   in the same turn.

## Rules

- Do not inline the full PRD into `.plan/PRD.md`.
- Keep the full authoritative body in the versioned PRD file.
- Never replace or delete older rows from `.plan/PRD.md`.
- Only one row may be marked `CURRENT`.
- Use the project's glossary vocabulary where possible.
- Keep implementation decisions high-signal and avoid brittle file-path detail.

## Output Shape

The versioned PRD should follow the same sections expected from `to-prd`:

- Problem Statement
- Solution
- User Stories
- Implementation Decisions
- Testing Decisions
- Out of Scope
- Further Notes

## Reference

- [PRD Index Rules](references/prd-index-rules.md)
