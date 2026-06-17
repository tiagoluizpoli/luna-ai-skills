---
type: task
id: T-16
epic: E-05
status: ready
blocked-by: []
default-model: medium
---

## What to Build

Correct the installer’s public selection surface so install always asks which
agents to target first, then asks for one availability mode for the run, while
removing manual framework-skill selection from the normal v1 flow and adding
clean validation for automation inputs.

## Context

The live installer still exposes bundle-first and skill-selection behavior and
models install destinations as opaque fused target labels. The current PRD
locks three install agents (Hermes, Codex, AGY), two availability modes
(local, global), and a minimal agents-first interaction model.

## Acceptance Criteria

- [ ] Interactive install asks for install agents before availability mode.
- [ ] Interactive install uses a single run-level availability choice and does
      not show manual framework-skill selection in the normal v1 path.
- [ ] Automation inputs for agent and availability selection fail with clear,
      user-facing validation errors instead of raw exceptions.
- [ ] Tests cover the full 3×2 selection matrix and assert the agents-first
      interaction contract.

## Sub-Tasks

### ST-01 - Replace the fused target and skill-selection flow

status: ready
model: medium
escalate-if: [selection-model-keeps-leaking-into-installer-architecture]
blocked-by: []

what-to-do:
- Redesign the installer input model around explicit agent selection plus one
  run-level availability mode.
- Remove manual framework-skill selection from the standard v1 install path.
- Keep all framework skills mandatory in v1.

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`
- `frameworks/ralph-loop/skills-manifest.json`
- `frameworks/ralph-loop/installer/install.sh`

verification:
- Run the installer in interactive and non-interactive modes and confirm the
  public selection surface is agents-first and availability-second.

#### Execution Notes

- No execution notes yet.

### ST-02 - Add matrix and validation coverage for the selection contract

status: ready
model: medium
escalate-if: [matrix-coverage-needs-new-test-harness]
blocked-by: [ST-01]

what-to-do:
- Add automated coverage for the 3×2 agent-by-availability matrix.
- Add regression coverage for invalid automation inputs so bad agent or
  availability values fail cleanly.
- Verify the normal path no longer exposes manual framework-skill selection.

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`
- `frameworks/ralph-loop/installer/package.json`
- `frameworks/ralph-loop/installer/tests/*`

verification:
- Execute the installer test suite and at least one throwaway-repository install
  pass covering the new selection contract.

#### Execution Notes

- No execution notes yet.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
