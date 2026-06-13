---
name: luna-to-prd
description: Wrap Matt Pocock's `to-prd` output for the Ralph Loop framework. After `to-prd` generates a PRD, wire it into `.plan/prds/`, update the thin index in `.plan/PRD.md`, and keep the current PRD pointer aligned with the `.plan` workspace.
---

# Luna To PRD

Use this skill when a PRD has already been generated and it needs to be wired
into the Ralph Loop `.plan` workspace.

This is a post-generation wrapper around Matt Pocock's `to-prd` skill. It does
not synthesize, rewrite, or extend the PRD itself. Its job is only to place the
already-generated PRD into the `.plan` structure and update the related index
surfaces.

## Purpose

- take an already-generated PRD body and store it under `.plan/prds/`
- update `.plan/PRD.md` as the thin index
- mark only one PRD row as `CURRENT`
- preserve older PRDs as metadata and historical references

## Prerequisites

- Matt Pocock's `to-prd` skill must already be available
- a PRD body must already exist from the `to-prd` flow
- `.plan/PRD.md` must exist
- `.plan/prds/` must exist

## Workflow

1. Run Matt Pocock's `to-prd` flow first and obtain the generated PRD body.
2. Read `.plan/PRD.md` to understand the existing PRD index.
3. Determine the next PRD version number and a stable kebab-case slug.
4. Write the generated PRD body to:
   - `.plan/prds/PRD-vN-<slug>.md`
5. Update `.plan/PRD.md`:
   - add a new row
   - mark the new row `CURRENT`
   - demote the previous current row to `SUPERSEDED`
   - keep the `Canonical Record` column populated
6. If `.plan/index.md` tracks the current PRD explicitly, update that pointer
   in the same turn.

## Rules

- Do not generate the PRD from scratch inside this wrapper.
- Do not rewrite the PRD body unless the user explicitly asked for PRD edits.
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
