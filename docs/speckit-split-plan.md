# SpecKit Split Plan

> Superseded in focus by [docs/ralph-loop-framework.md](/home/tiago/01-dev-env/personal-repos/luna-ai-skills/docs/ralph-loop-framework.md).
> This document remains useful for ownership boundaries, but the primary initiative is now the standalone Ralph Loop framework.

## Objective

Separate SpecKit assets from the general skill library so this repository stops mixing:

- the SpecKit execution engine and its commands
- general reusable skills and workflows
- shared orchestration scripts used by either side

This document is the ownership-boundary companion to the Ralph Loop framework plan.

## Current Source Inventory

### SpecKit-owned assets

- `.specify/templates/`
- `.specify/scripts/`
- `.specify/workflows/`
- `.specify/extensions/`
- `.specify/integrations/`
- `.specify/extensions.yml`
- `.specify/integration.json`
- `.specify/init-options.json`
- `.agents/skills/speckit-*`

### General skill library assets

- `.agents/skills/` for non-`speckit-*` skills
- `.agents/workflows/`
- `SKILLS_OVERVIEW.md`

These are the Matt Pocock-style or general-purpose skills that are useful outside SpecKit, even when a repo does not use `.specify`.

### Shared core assets

- `AGENTS.md`
- `agents.local.md`
- `README.md`
- `CONTEXT.md`
- `ralph-loop-agy.sh`
- `ralph-loop-codex.sh`
- `ralph-loop-hermes.sh`
- `.agents/skills/karpathy-guidelines`
- `.agents/skills/prompt-enhancer`
- `.agents/skills/code-review`
- `.agents/skills/find-skills`
- `.agents/skills/conventional-commits`

These are cross-cutting and should not be classified as SpecKit-only.

### Project-local and non-portable assets

- `.specify/memory/`
- per-consumer repo `.plan/`

These should stay in consuming repositories, not in the shared source layout.

## Immediate Conclusions

1. This repo is already the source of truth for nearly all symlinked assets used by `neighborhood-showcase`.
2. The only reusable root script present in `neighborhood-showcase` but missing here was `ralph-loop-hermes.sh`.
3. The real problem is classification and export boundaries, not missing SpecKit engine files.

## Proposed Ownership Rules

### Belongs to SpecKit

An asset belongs to SpecKit if removing `.specify` would make it meaningless, or if it defines a `speckit.*` command, workflow, template, or integration.

Examples:

- `.specify/scripts/bash/setup-plan.sh`
- `.specify/workflows/speckit/workflow.yml`
- `.agents/skills/speckit-plan/SKILL.md`
- `.agents/skills/speckit-implement/SKILL.md`

### Belongs to the general skill library

An asset belongs to the general skill library if it can be used in repositories that do not adopt SpecKit at all.

Examples:

- `triage`
- `to-issues`
- `to-prd`
- `diagnose`
- `tdd`
- `zoom-out`
- `improve-codebase-architecture`
- `setup-matt-pocock-skills`

### Belongs to shared core

An asset belongs to shared core if both sides depend on it, or if it is repo governance/orchestration rather than a domain-specific skill collection.

Examples:

- `karpathy-guidelines`
- `prompt-enhancer`
- `ralph-loop*.sh`
- `AGENTS.md`

## Target Layout

Do not move files yet. First establish ownership, then migrate with compatibility shims.

### Phase 1: classify in place

- Keep the current exported paths unchanged.
- Maintain this plan and label each asset as `speckit`, `skills`, or `shared`.
- Import missing reusable scripts into this repo.

### Phase 2: create internal source partitions

Create explicit source directories such as:

- `spec-kit/`
- `skills/`
- `shared/`

Then move implementation files behind those folders while preserving the current public layout through symlinks or generated export directories.

### Phase 3: migrate consumers

- Update consuming repos to link from the partitioned exports.
- Keep backward-compatible root links during the migration.
- Remove compatibility indirection only after consumers are updated.

## First Migration Backlog

- [x] Import `ralph-loop-hermes.sh` into this repository.
- [ ] Audit every `.agents/skills/*` directory and tag it as `speckit`, `skills`, or `shared`.
- [ ] Decide whether `prompt-enhancer` stays in `shared` or gets duplicated as a SpecKit dependency surface.
- [ ] Design the exported compatibility layout before any folder move.
- [ ] Update `README.md` to describe the split once the layout is finalized.

## Risks

- Moving directories immediately would break existing symlink consumers like `neighborhood-showcase`.
- Some skills are operational dependencies of SpecKit without being SpecKit-owned.
- `AGENTS.md` is shared and symlinked, so plan references must continue to live in `agents.local.md`.
