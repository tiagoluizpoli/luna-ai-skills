# Grilling Session Format

`luna-grill-with-docs` persists each live grilling session under
`.plan/grilling/` as a single markdown file.

## Filename

- Recommended format: `YYYY-MM-DD-<slug>.md`
- Example: `2026-06-15-framework-wrapper-planning.md`

## Required Sections

```md
# Grilling Session: <Title>

Date: YYYY-MM-DD
Status: in-progress | complete
Source Skill: grill-with-docs
Scope: <short statement of what is being grilled>

## Starting Context

- User prompt: <the request that started the grilling session>
- Initial reasoning:
  - <why the first question was chosen>
  - <important assumptions or tensions already visible>

## Current Question

Question ID: Q-current
Exact question:
"..."

Why this is current:
- <short explanation>

Recommended answer:
- <recommended answer from grill-with-docs>

## Future Questions

1. Q-next-1
   Exact question: "..."
   Why it is queued: <short reason>
2. Q-next-2
   Exact question: "..."
   Why it is queued: <short reason>

## Answered Questions

### Q1
Exact question:
"..."

User answer:
"..."

Decision / takeaway:
- <what was locked or clarified>

Queue impact:
- <what changed in the future queue because of this answer>

## Pruned Questions

- Q-old-3
  Exact question: "..."
  Removed because: <why it no longer matters>
```

## Synchronization Rules

- `Current Question` must always be the question currently shown to the user.
- Every time the user answers, move the previous current question to
  `Answered Questions` before asking the next one.
- Every time reasoning changes, reorder `Future Questions` immediately.
- New questions discovered during reasoning must be appended or inserted into
  `Future Questions` in their new priority order.
- Questions that become unnecessary must be removed from `Future Questions`.
  If the removal itself matters for auditability, move them to
  `Pruned Questions`.
- The file should be resumable: another agent must be able to open it and know
  the starting prompt, what has already been answered, what is current, and
  what is still queued.
