# Grill To PRD Handoff

The official grilling handoff is written only when the grilling session is
finished and stable enough for PRD generation.

## Target Path

- `.plan/handoffs/grill-to-prd-<slug>.md`

## Required Sections

```md
# Handoff: Grilling To PRD

Date: YYYY-MM-DD
Source Session: .plan/grilling/<file>.md
Status: ready-for-prd
Scope: <short statement>

## Stable Decisions

- <decision>

## Open Tensions

- <remaining nuance that should still shape the PRD>

## PRD Expectations

- <what the PRD must preserve or emphasize>

## Next Step

- Run `luna-to-prd` using this handoff plus the canonical grilling session.
```
