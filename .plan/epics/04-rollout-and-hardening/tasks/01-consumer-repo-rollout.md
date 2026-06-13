---
type: task
id: T-10
epic: E-04
status: ready
blocked-by: []
default-model: medium
---

## What to Build

Apply the framework to a real target repository, starting with
`neighborhood-showcase`.

## Context

The user explicitly delayed consumer migration until the framework source was
finished and locally verified.

## Acceptance Criteria

- [ ] The installer runs in the consumer repo.
- [ ] The consumer repo receives the intended `.plan` workspace and selected
      skills.
- [ ] The live workflow state is migrated into `.plan/`.
- [ ] One real Ralph Loop iteration succeeds in the consumer repo.

## Sub-Tasks

### ST-01 - Install the framework into `neighborhood-showcase`

status: ready
model: medium
escalate-if: [failing-twice, cross-file-refactor]
blocked-by: []

what-to-do:
- Run the installer against the consumer repo and inspect the generated
  workspace.

files-to-touch:
- Consumer repo `.plan/*`
- Consumer repo `.agents/skills/luna-ai/*`

verification:
- Clean installer run in the consumer repo.

#### Execution Notes

- Not started yet.
