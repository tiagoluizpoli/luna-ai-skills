---
type: task
id: T-16
epic: E-05
status: done
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

- [x] Interactive install asks for install agents before availability mode.
- [x] Interactive install uses a single run-level availability choice and does
      not show manual framework-skill selection in the normal v1 path.
- [x] Automation inputs for agent and availability selection fail with clear,
      user-facing validation errors instead of raw exceptions.
- [x] Tests cover the full 3×2 selection matrix and assert the agents-first
      interaction contract.

## Sub-Tasks

### ST-01 - Replace the fused target and skill-selection flow

status: done
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

- Replaced legacy `--all` / `--bundles` / `--skills` / `--targets` selection
  paths with explicit `--agents` plus `--availability` handling and user-facing
  validation errors.
- Moved the manifest to a `selectionContract` plus `mandatorySkillIds` model so
  the standard v1 path always installs the full framework-owned skill set.
- Verified a non-interactive 3-agent local install against a clean throwaway Git
  repository with a fake HOME that provided only the external prerequisite skill
  stubs required by the installer.
- Verified the interactive prompt order reaches agent selection first and
  availability selection second before later asset-routing prompts. The later
  Codex/AGY destination collision remains for the asset-routing task, not this
  selection-contract sub-task.

### ST-02 - Add matrix and validation coverage for the selection contract

status: done
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

- Added a dedicated Node test suite under `frameworks/ralph-loop/installer/tests/selection-contract.test.mjs` and a package script so the installer contract can be verified with `node --test`.
- Covered all six concrete agent/availability pairs by asserting `resolveSelection()` plus `assertTargetCoverage()` over the 3×2 matrix.
- Added regression coverage for legacy flags, invalid agent values, invalid availability values, and missing non-interactive agent selection so failures stay user-facing.
- Added an interactive-contract test that proves the prompt order is agents first and availability second without any manual framework-skill selection prompt.
- Verified a throwaway-repository install writes the new selection metadata and installs the mandatory framework skill closure for the selected agents.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
