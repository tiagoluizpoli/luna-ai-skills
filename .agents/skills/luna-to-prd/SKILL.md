---
name: luna-to-prd
description: Wrap Matt Pocock's `to-prd` output for the Ralph Loop framework. Resolve the current grill handoff or grilling session from `.plan/`, run `to-prd`, then wire the PRD into `.plan/prds/`, update the thin index in `.plan/PRD.md`, and keep the current PRD and PRD-handoff pointers aligned with the `.plan` workspace.
---

# Luna To PRD

Use this skill when a grilling session is finished and needs to become the
current Ralph Loop PRD with deterministic cross-session continuity.

This is a wrapper around Matt Pocock's `to-prd` skill. It resolves the current
grilling source and grill-to-PRD handoff deterministically, runs `to-prd`, then
wires the resulting PRD plus the next handoff into the `.plan` structure.

## Purpose

- resolve the latest relevant grilling session under `.plan/grilling/`
- take an already-generated PRD body and store it under `.plan/prds/`
- update `.plan/PRD.md` as the thin index
- mark only one PRD row as `CURRENT`
- preserve older PRDs as metadata and historical references

## Prerequisites

- Matt Pocock's `to-prd` skill must already be available
- `.plan/grilling/` must exist
- `.plan/handoffs/` must exist
- `.plan/PRD.md` must exist
- `.plan/prds/` must exist

## Workflow

1. Resolve the grilling session source:
   - if the user explicitly points to a grilling handoff or grilling file, use
     that input
   - otherwise read `.plan/handoffs/.current-grill-handoff` with
     `.plan/helper-scripts/get-current-grill-handoff.sh`
   - if no grill handoff exists, fall back to `.plan/grilling/.current-session`
     with `.plan/helper-scripts/get-current-grill.sh`
   - fail hard instead of guessing from directory listings
2. Run Matt Pocock's `to-prd` flow using the resolved grilling source and
   handoff context, then obtain the generated PRD body.
3. Read `.plan/PRD.md` to understand the existing PRD index.
4. Determine the next PRD version number and a stable kebab-case slug.
5. Write the generated PRD body to:
   - `.plan/prds/PRD-vN-<slug>.md`
6. Set the canonical PRD pointer with:
   - `.plan/helper-scripts/set-current-prd.sh .plan/prds/PRD-vN-<slug>.md`
7. Update `.plan/PRD.md`:
   - add a new row
   - mark the new row `CURRENT`
   - demote the previous current row to `SUPERSEDED`
   - keep the `Canonical Record` column populated
8. Write the PRD-to-issues handoff under `.plan/handoffs/`.
9. Set the canonical PRD handoff pointer with:
   - `.plan/helper-scripts/set-current-prd-handoff.sh .plan/handoffs/<file>.md`
10. If `.plan/index.md` tracks the current PRD explicitly, update that pointer
   in the same turn.

## Rules

- Treat the grilling pointer and handoff pointers as canonical phase selectors.
- Use directory scanning only as a last-resort debugging step, not as the
  normal source-selection behavior.
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
- [PRD To Issues Handoff](references/prd-to-issues-handoff.md)
