# Engineering Rules

> Read this file first on every Ralph Loop iteration.

This file is the canonical rules document for the Luna AI Skills source
repository when it is working on its own Ralph Loop framework.

## Contract

- Treat this repo as the source of truth for the Ralph Loop framework.
- Keep framework-managed source under `frameworks/ralph-loop/`.
- Keep the live planning and documentation surface for this repo under `.plan/`.
- `agents.local.md` is optional repo-local context. Read it only if present.
- Treat current pointer files and current handoff pointers under `.plan/` as
  canonical selectors for cross-session planning phases.
- Respect blocked state. Do not select blocked work unless an explicit unblock
  transition has been recorded.
- Work at the sub-task level. A task or epic status is derived, not invented.
- Pick one dependency-safe executable sub-task per iteration.
- Use `.plan/helper-scripts/sync-state.sh` after atomic state changes.
- Update `.plan/progress.txt` during the run, not only at the end.
- Persist current machine state in `.plan/.run-state.json`.
- Persist structured history in `.plan/.run-history.jsonl`.
- Persist durable carry-forward context in `.plan/.run-summary.md`.
- Use `.plan/helper-scripts/retrieve-history.sh` before implementation when the
  current work touches previously-worked areas.
- Historical retrieval is bounded to three rounds. If still insufficient, block
  the sub-task and continue only with other dependency-safe executable work.
- Do not reintroduce `.specify/memory` ownership into the Ralph Loop framework.

## Repo-specific expectations

- Keep Matt Pocock skills as external prerequisites rather than vendoring them.
- Keep framework-owned skills namespaced on disk and simple in public naming.
- Keep the installer interactive-first in v1.
- Treat clean local repo verification as the minimum acceptance bar before
  applying the framework to a real consumer repository.
