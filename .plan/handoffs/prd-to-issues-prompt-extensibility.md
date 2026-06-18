# Handoff: PRD To Issues

Date: 2026-06-18
Source PRD: .plan/prds/PRD-v5-prompt-extensibility.md
Status: ready-for-issues
Scope: Prompt extensibility — `prompt.local.md` consumer extension, `CONTEXT.md` reading order integration, installer scaffold and ownership rules

## Summary

PRD v5 defines two consumer-owned extension points for the Ralph Loop framework:
- `prompt.local.md` — project-specific runtime instructions, read last by `prompt.md`
- `CONTEXT.md` — domain glossary, added to reading order at step 2 (after RULES.md)

Installer scaffolds both on fresh install, never overwrites on update. `RULES.md` moves from managed to consumer-owned starter. Reading order in `prompt.md` updated from 7 to 9 steps.

## Work Areas

### 1. `prompt.md` Update
- Add `CONTEXT.md` at step 2 of Mandatory Context reading order
- Add `prompt.local.md` at step 9 (final) with explicit "if exists, read it now" instruction
- This is a framework-owned file — update counts as a managed asset change

### 2. `framework-files.json` Ownership Reclassification
- Remove `RULES.md` from `managedFiles` (it must not be overwritten on update)
- Add `prompt.local.md` and `CONTEXT.md` as consumer-owned starter files
- Introduce a clear classification category for "scaffold on fresh install, never touch on update"

### 3. Installer Scaffold Logic
- On fresh install: write `prompt.local.md` starter template to repo root
- On fresh install: write `CONTEXT.md` starter template to repo root
- On update: skip both files if they exist (never overwrite)
- On update: skip `RULES.md` if it exists (never overwrite)

### 4. Installer Tests
- Fresh install: `prompt.local.md` and `CONTEXT.md` exist with starter content
- Update preserves: pre-existing `prompt.local.md`, `CONTEXT.md`, `RULES.md` survive unchanged
- `framework-files.json` classification: both files absent from `managedFiles` and `workflowOwnedFiles`

## Key Constraints

- `prompt.local.md` is free-form — no enforced headings or schema
- Root `CONTEXT.md` is canonical — `.plan/CONTEXT.md` mirrors are consumer-managed
- Migration for existing projects is manual — no automated migration step
- Consumer-owned files: `prompt.local.md`, `CONTEXT.md`, `RULES.md`, `agents.local.md`
- Framework-owned files: `prompt.md`, helper scripts, all manifests

## Next Step

- Run `luna-to-issues` using this handoff to generate epics and tasks.
