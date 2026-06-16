# PRD To Issues Handoff

After `luna-to-prd` creates the PRD, it should also create the handoff that
lets `luna-to-issues` continue from another session without re-deriving the
intent from scratch.

## Target Path

- `.plan/handoffs/prd-to-issues-<slug>.md`

## Required Sections

```md
# Handoff: PRD To Issues

Date: YYYY-MM-DD
Source PRD: .plan/prds/<file>.md
Status: ready-for-issues
Scope: <short statement>

## Locked Decisions

- <decision>

## Decomposition Constraints

- <what the issue breakdown must preserve>

## Out Of Scope

- <what should not be pulled into this planning tree>

## Next Step

- Run `luna-to-issues` using this handoff plus the canonical PRD.
```
