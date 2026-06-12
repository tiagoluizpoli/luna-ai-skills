# Task Schema

Each generated task file must stay parseable and stable.

## Required frontmatter

- `type: task`
- `id: T-XX`
- `epic: E-XX`
- `status: ready|in-progress|blocked|done`
- `blocked-by: []`
- `default-model: medium|high`

## Required sub-task fields

- `status`
- `model`
- `escalate-if`
- `blocked-by`
- `what-to-do`
- `files-to-touch`
- `verification`

## Execution Notes

Execution notes are local context only. Durable run memory belongs in:

- `.plan/.run-history.jsonl`
- `.plan/.run-summary.md`
