# PRD Index Rules

`luna-to-prd` treats `.plan/PRD.md` as a thin index over versioned PRD bodies
stored under `.plan/prds/`.

## Required Index Behavior

- Add a new row for every new PRD version.
- Mark the newest active row as `CURRENT`.
- Demote the previous `CURRENT` row to `SUPERSEDED`.
- Keep a `Canonical Record` column pointing to the authoritative PRD body.
- Never inline the full PRD body into `.plan/PRD.md`.
- Never delete older rows.

## Naming

- File format: `PRD-vN-<slug>.md`
- Example: `PRD-v3-installer-hardening.md`

## Related Workspace Updates

If `.plan/index.md` includes a "Current PRD" pointer, update it in the same
turn as the PRD index row.
