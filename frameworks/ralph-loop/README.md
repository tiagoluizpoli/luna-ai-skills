# Ralph Loop Starter

Reusable starter assets for repositories that want the Ralph Loop workflow without tying operational memory to SpecKit.

## Layout

- `.plan/prompt.md`
- `.plan/RULES.md`
- `.plan/PRD.md`
- `.plan/index.md`
- `.plan/backlog.md`
- `.plan/deferred-backlog.md`
- `.plan/progress.txt`
- `.plan/shared/epic-template.md`
- `.plan/shared/task-template.md`

## Root-level expectation

Keep `agents.local.md` at the repository root.

The rest of the Ralph Loop workflow contract lives under `.plan/`.

## Migration note

If a consumer repo currently stores workflow state in `.specify/memory/` or at the repo root, migrate those files into `.plan/` and update local prompts/rules to match the new paths.
