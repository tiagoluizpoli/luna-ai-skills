---
type: task
id: T-10
epic: E-04
status: done
blocked-by: []
default-model: medium
---

## What to Build

Apply the framework to a real target repository, starting with
`neighborhood-showcase`.

## Context

The user explicitly delayed consumer migration until the framework source was
finished and locally verified.

## Acceptance Criteria

- [x] The installer runs in the consumer repo.
- [x] The consumer repo receives the intended `.plan` workspace and selected
      skills.
- [x] The live workflow state is migrated into `.plan/`.
- [x] One real Ralph Loop iteration succeeds in the consumer repo.

## Sub-Tasks

### ST-01 - Install the framework into `neighborhood-showcase`

status: done
model: medium
escalate-if: [failing-twice, cross-file-refactor]
blocked-by: []

what-to-do:
- Run the installer against the consumer repo and inspect the generated
  workspace.

files-to-touch:
- Consumer repo `.plan/*`
- Consumer repo `.agents/skills/luna-ai/*`

verification:
- Clean installer run in the consumer repo.
- Migrated `.plan` workspace resolves the current PRD, epic, and next task.
- A verification-only Ralph Loop iteration appends a success line to the
  consumer repo `.plan/progress.txt` without touching application code.

#### Execution Notes

- Ran the installer with `--bundles ralph-loop-core --targets codex-local` and
  pinned the source commit to `4a2bd6ec3dbe64ae6c33a9296d2446fb9cd005d3`.
- Installed framework-owned skills into
  `neighborhood-showcase/.agents/skills/luna-ai/`.
- Migrated legacy workflow state from root `prompt.md` / `RULES.md` /
  `PRD.md` plus `.specify/memory/` into `neighborhood-showcase/.plan/`.
- Set the current PRD pointer to
  `neighborhood-showcase/.plan/prds/PRD-v7-provider-section-reorg.md` and the
  current grilling pointer to
  `neighborhood-showcase/.plan/grilling/2026-06-10-provider-section-reorg-grilling.md`.
- Ran a verification-only Hermes Ralph Loop iteration in the consumer repo;
  it read the migrated `.plan` end-to-end and reported the next dependency-safe
  task as epic 13 task 08 (`08_meus_anuncios_detail.md`).
