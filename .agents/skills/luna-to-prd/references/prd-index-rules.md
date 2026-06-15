# PRD Index Rules

`luna-to-prd` treats `.plan/PRD.md` as a thin index over versioned PRD bodies
stored under `.plan/prds/`.

It also treats `.plan/grilling/` as the default PRD input surface.

## Source Resolution

- If the user names a specific grilling file, use it.
- Otherwise use the latest relevant file under `.plan/grilling/`.
- Prefer an `in-progress` grilling session when one exists.
- Otherwise use the most recent completed grilling session.
- The resolved grilling file is the source context passed into `to-prd`.

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
