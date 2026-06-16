# Ralph Loop Starter

Reusable starter assets for repositories that want the Ralph Loop workflow
without tying operational memory to SpecKit.

## Layout

- `.plan/prompt.md`
- `.plan/RULES.md`
- `.plan/PRD.md`
- `.plan/index.md`
- `.plan/backlog.md`
- `.plan/progress.txt`
- `.plan/.run-state.json`
- `.plan/.run-history.jsonl`
- `.plan/.run-summary.md`
- `.plan/prds/`
- `.plan/handoffs/`
- `.plan/epics/`
- `.plan/sessions/`
- `.plan/grilling/`
- `.plan/summaries/`
- `.plan/archive/`
- `.plan/shared/epic-template.md`
- `.plan/shared/task-template.md`
- `.plan/helper-scripts/*`

## Root-level expectation

`agents.local.md` is optional. If it exists, the runners may read it as
additional repo-local context. The framework does not require it.

Everything else in the Ralph Loop contract lives under `.plan/`.

## Managed vs workflow-owned

Framework-managed files:

- `.plan/prompt.md`
- `.plan/RULES.md`
- `.plan/shared/*`
- `.plan/helper-scripts/*`
- `.plan/.framework`
- `.plan/.framework-install.json`

Workflow-owned files:

- `.plan/PRD.md`
- `.plan/index.md`
- `.plan/backlog.md`
- `.plan/progress.txt`
- `.plan/.run-state.json`
- `.plan/.run-history.jsonl`
- `.plan/.run-summary.md`
- `.plan/epics/*`
- `.plan/prds/*`
- `.plan/handoffs/*`
- `.plan/sessions/*`
- `.plan/grilling/*`
- `.plan/summaries/*`
- `.plan/archive/*`

## Installer contract

The install/update flow for this starter is implemented under
`frameworks/ralph-loop/installer/`.

It expects Matt Pocock's skills to already be installed with:

```bash
npx skills@latest add mattpocock/skills
```

Repo:

`https://github.com/mattpocock/skills`

## Phase pointers

The planning wrappers use durable repo-local pointers instead of guessing from
directory listings:

- `.plan/grilling/.current-session`
- `.plan/prds/.current-prd`
- `.plan/handoffs/.current-grill-handoff`
- `.plan/handoffs/.current-prd-handoff`

Use the helper scripts under `.plan/helper-scripts/` to set and resolve those
pointers deterministically across sessions.

## Migration note

If a consumer repo currently stores workflow state in `.specify/memory/` or at
the repo root, migrate those files into `.plan/` and update local prompts and
rules to match the new paths.
