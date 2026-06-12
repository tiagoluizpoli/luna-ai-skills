# Ralph Loop Framework

## Objective

Create a reusable framework for the workflow you are actually using now:

1. grill the problem
2. write or update a PRD
3. split the PRD into issues, epics, tasks, and subtasks
4. run Ralph Loop one task at a time
5. keep operational memory and backlog outside SpecKit

SpecKit is not the owner of this workflow. It should remain available in this repository, but isolated from the Ralph Loop framework.

## Core Observation

The current `neighborhood-showcase` workflow is already a coherent framework, but its state is mislabeled:

- `.plan/prompt.md`
- `.plan/RULES.md`
- `agents.local.md`
- `.plan/PRD.md`
- `.plan/progress.txt`
- `.specify/memory/index.md`
- `.specify/memory/epics/*`
- `.specify/memory/prds/*`
- `.specify/memory/backlog.md`
- `.specify/memory/deferred_backlog.md`
- `.specify/memory/grilling_history.md`
- `.specify/memory/sessions/*`
- `.specify/memory/shared/*`

Only the path is wrong. The workflow itself is not SpecKit.

## Framework Boundaries

### Ralph Loop framework owns

- the loop runner scripts:
  - `ralph-loop-agy.sh`
  - `ralph-loop-codex.sh`
  - `ralph-loop-hermes.sh`
- the workflow contract:
  - `.plan/prompt.md`
  - `.plan/RULES.md`
  - `agents.local.md`
  - `.plan/PRD.md`
  - `.plan/progress.txt`
- the planning and execution workspace:
  - PRD versions
  - issue decomposition
  - epics
  - tasks
  - subtasks
  - grilling history
  - deferred backlog
  - session logs

### SpecKit owns

- `.specify/templates/`
- `.specify/scripts/`
- `.specify/workflows/`
- `.specify/extensions/`
- `.specify/integrations/`
- `.specify/extensions.yml`
- `.specify/integration.json`
- `.specify/init-options.json`
- `.agents/skills/speckit-*`

### Shared cross-framework assets

- `AGENTS.md`
- `README.md`
- `CONTEXT.md`
- `SKILLS_OVERVIEW.md`
- `.agents/skills/karpathy-guidelines`
- `.agents/skills/prompt-enhancer`
- `.agents/skills/code-review`
- `.agents/skills/find-skills`
- `.agents/skills/conventional-commits`
- `.agents/workflows/*`

## Proposed New Workspace

Use a framework-specific path instead of `.specify/memory`.

### Recommended path

`.plan/`

Reasoning:

- it is generic enough to survive framework changes
- it avoids future confusion with SpecKit
- it keeps the workflow hidden but repo-local
- it is easy to symlink, template, and document

### Target structure

```text
.plan/
  backlog.md
  deferred-backlog.md
  grilling/
  index.md
  prds/
  epics/
  sessions/
  shared/
    epic-template.md
    task-template.md
  prompt.md
  RULES.md
  PRD.md
  progress.txt
```

### Root-level contract files

Keep only this at the repo root:

- `agents.local.md`

Everything else in the Ralph Loop workflow contract should live under `.plan/`.

## Mapping From The Current Misplaced Layout

```text
.specify/memory/index.md                -> .plan/index.md
.specify/memory/prds/*                  -> .plan/prds/*
.specify/memory/epics/*                 -> .plan/epics/*
.specify/memory/backlog.md              -> .plan/backlog.md
.specify/memory/deferred_backlog.md     -> .plan/deferred-backlog.md
.specify/memory/grilling_history.md     -> .plan/grilling/history.md
.specify/memory/sessions/*              -> .plan/sessions/*
.specify/memory/shared/*                -> .plan/shared/*
.specify/memory/test_coverage_plan.md   -> .plan/test-coverage-plan.md
.specify/memory/ui-decision-log.md      -> .plan/ui-decision-log.md
prompt.md                               -> .plan/prompt.md
RULES.md                                -> .plan/RULES.md
PRD.md                                  -> .plan/PRD.md
progress.txt                            -> .plan/progress.txt
```

## Migration Strategy

### Phase 1: define the framework here

- document Ralph Loop as its own framework in this repository
- keep SpecKit untouched
- identify the reusable shared files and templates
- stop describing the problem as a generic SpecKit split

### Phase 2: create sharable framework assets

Add sharable source material for consumer repos, likely in a directory such as:

- `frameworks/ralph-loop/`

That directory should eventually hold:

- starter `.plan/RULES.md`
- starter `.plan/prompt.md`
- starter `.plan/PRD.md`
- starter `.plan/shared/*` templates
- migration notes from `.specify/memory` and root workflow files to `.plan/`

### Phase 3: migrate a consumer repo

Use `neighborhood-showcase` as the first real migration:

- keep SpecKit symlinked if desired
- move workflow state out of `.specify/memory`
- move root workflow files into `.plan/` except `agents.local.md`
- update Ralph Loop prompts and rules to read `.plan/*`
- verify the loop still works cold-start, one-task-per-iteration

### Phase 4: support both worlds

This repository should support two optional modes:

1. SpecKit mode
2. Ralph Loop framework mode

They can coexist in the same repo, but neither should pretend to own the other's state.

## Immediate Next Work

- [x] Import `ralph-loop-hermes.sh` into this repository.
- [x] Rename the Antigravity runner to `ralph-loop-agy.sh`.
- [ ] Audit the Ralph Loop workflow files used in `neighborhood-showcase`.
- [ ] Create a sharable starter layout for `.plan/`.
- [ ] Update consumer prompt/rules conventions to use `.plan/` instead of `.specify/memory` and root files.
- [ ] Migrate `neighborhood-showcase` as the first consumer.
- [ ] Leave SpecKit intact and documented as a separate optional framework.

## Risks

- hard-cutting paths too early will break current loops
- some docs currently mix framework rules with project rules
- `.plan/PRD.md` should preserve the current `PRD.md` index behavior used in `neighborhood-showcase`
- existing prompts, rules, and scripts explicitly mention `.specify/memory/`, so path migration must be coordinated
