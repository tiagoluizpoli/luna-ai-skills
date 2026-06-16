---
name: luna-grill-with-docs
description: Wrap Matt Pocock's `grill-with-docs` skill with persistent `.plan/grilling/` session tracking. Use when the user wants a normal `grill-with-docs` session, but also wants the question queue, current question, answered questions, and starting context synchronized to disk after every turn.
---

# Luna Grill With Docs

Use this skill when the grilling behavior should still come from
`grill-with-docs`, but the session itself must be persisted under
`.plan/grilling/`.

This is a wrapper. It does not replace `grill-with-docs`, and it must not
pretend to be a new grilling method. First follow `grill-with-docs`. On top of
that, keep the grilling state synchronized to a file after every question and
every answer.

## Purpose

- run the normal `grill-with-docs` behavior
- persist the live grilling state to `.plan/grilling/`
- keep the current question on disk aligned with the question shown in the
  console
- keep the future question queue synchronized as the reasoning changes
- preserve answered questions plus the starting context that produced the grill

## Prerequisites

- Matt Pocock's `grill-with-docs` skill must already be available
- `.plan/grilling/` must exist
- `.plan/handoffs/` must exist

## Workflow

1. Invoke and follow `grill-with-docs` for the actual questioning behavior.
2. Create or resume a grilling session file under `.plan/grilling/`.
3. As soon as the active grilling file is known, set the canonical pointer with:
   - `.plan/helper-scripts/set-current-grill.sh .plan/grilling/<file>.md`
4. Before the first question is asked, write:
   - session metadata
   - the starting user prompt
   - the initial reasoning/context that led to the first question
   - the first `Current Question`
   - the initial `Future Questions` queue
5. Ask only the `Current Question` shown in the file.
6. After each user answer, synchronize the file immediately:
   - move the answered current question into `Answered Questions`
   - update any decision or answer summary tied to that question
   - rebuild and reorder `Future Questions`
   - remove questions no longer needed
   - promote the next chosen question into `Current Question`
7. If the answer creates new questions, persist them to `Future Questions`
   during the same synchronization step.
8. If the answer resolves a queued future question implicitly, remove it from
   `Future Questions` during the same synchronization step.
9. When the grilling session is explicitly finished and stable enough for PRD
   generation, write a handoff file under `.plan/handoffs/`.
10. Set the canonical handoff pointer with:
   - `.plan/helper-scripts/set-current-grill-handoff.sh .plan/handoffs/<file>.md`
11. Repeat question by question until the grilling session is complete.

## Rules

- Do not invent a new grilling flow. Use `grill-with-docs` for the questioning.
- Do not batch updates to the grilling file. Synchronize after every turn.
- The question displayed to the user must always match `Current Question`.
- `Future Questions` must reflect the live queue, not a stale brainstorm.
- Every answered question must remain preserved in `Answered Questions`.
- Keep the starting prompt and starting reasoning in the file so the session can
  be resumed from another agent or session.
- Do not generate the official grill-to-PRD handoff until the grilling session
  is explicitly considered finished.
- If a queued question becomes unnecessary, remove it from `Future Questions`.
  If preserving the reason is useful, move it to `Pruned Questions`.

## Output Shape

Use the persistent grilling format documented in:

- [Grilling Session Format](references/grilling-session-format.md)
- [Grill To PRD Handoff Format](references/grill-to-prd-handoff.md)
