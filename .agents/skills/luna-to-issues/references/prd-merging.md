# PRD Merging

For `.plan` projects, keep the root `PRD.md` as a thin index over versioned PRD
files under `.plan/prds/`.

## Rules

- Ask which PRD is current before editing if there is any ambiguity.
- Add a new row instead of replacing older rows.
- Mark the new row as `CURRENT`.
- Demote the prior current row to `SUPERSEDED`.
- Keep a `Canonical Record` column pointing to the authoritative file.

## Lazy Loading

Only the `CURRENT` PRD row is loaded by default during Ralph Loop execution.
Older PRDs stay available for targeted retrieval.
