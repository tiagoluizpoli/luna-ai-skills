---
name: to-epic-issues
description: Break a plan or PRD into vertical slices and create them as `.plan` epics and task files. Use when the user says `to-epic-issues`, `epic issues`, or asks to turn a PRD into `.plan` execution files.
---

# To Epic Issues

Convert a plan or PRD into the project's `.plan` epic and task structure.

This skill wraps `to-issues` for decomposition, but writes the approved output
into the Ralph Loop execution tree instead of a generic issue tracker.

## Output Structure

```text
.plan/
├── index.md
├── PRD.md
├── prds/
├── epics/
│   └── <num>-<slug>/
│       ├── epic.md
│       └── tasks/
│           └── <num>-<slug>.md
└── shared/
    ├── epic-template.md
    └── task-template.md
```

## Contract

- Use `to-issues` first for the vertical slice breakdown.
- Only write `.plan` files after the user approves the slice structure.
- Create one epic directory per approved epic.
- Create one task file per approved slice.
- Emit task-level `default-model`.
- Emit sub-task-level `status`, `model`, `escalate-if`, `blocked-by`,
  `what-to-do`, `files-to-touch`, and `verification`.
- Use `medium` as the default model unless the slice clearly justifies `high`.
- If you are uncertain about escalation tier, default to `medium`.

## Index Synchronization

After writing or updating epic/task files:

1. update the epic's task table
2. update `.plan/index.md`
3. keep IDs stable

The canonical atomic execution state lives in sub-task entries inside task
files. Epic and task aggregate state is derived later by helper scripts.

## Naming

### Epic naming

- Directory: `<num>-<kebab-case-slug>/`
- Epic file: `epic.md`
- Epic ID: `E-<num>`

### Task naming

- File: `<num>-<kebab-case-slug>.md`
- Task ID: `T-<num>`
- Sub-task IDs: `ST-01`, `ST-02`, ...

## PRD Rules

- Treat `.plan/PRD.md` as the thin index.
- Treat `.plan/prds/*.md` as the full versioned PRD bodies.
- Only one PRD row may be marked `CURRENT`.
- Do not inline the full PRD into `.plan/PRD.md`.

## Templates

- Use `.plan/shared/epic-template.md` for new epic files.
- Use `.plan/shared/task-template.md` for new task files.

## References

- [PRD Merging](references/prd-merging.md)
- [Task Schema](references/task-schema.md)
