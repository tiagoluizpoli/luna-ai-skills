---
type: task
id: T-19
epic: E-07
status: ready
blocked-by: [T-17]
default-model: medium
---

## What to Build

Upgrade installer metadata and update behavior so the recorded state tracks
selected agents, concrete installed assets, timestamps, and availability
nuance, while update visibly shows what it plans to reuse and lets the user
confirm or override that state.

## Context

The PRD allows update to reuse trustworthy recorded state, but only as a visible
default. Install must always ask explicitly which agents to target. The current
`.framework-install.json` shape is too flat to safely drive the hardened update
flow.

## Acceptance Criteria

- [ ] Recorded installer state captures selected agents, installed assets,
      timestamps, and relevant availability details.
- [ ] Update presents the recorded state it plans to reuse before applying it.
- [ ] Update offers an explicit override path for agent and availability
      selection.
- [ ] Tests cover state reuse, explicit override, and stale-or-invalid recorded
      state handling.

## Sub-Tasks

### ST-01 - Expand metadata to support trustworthy update behavior

status: ready
model: medium
escalate-if: [metadata-shape-breaks-existing-update-flow]
blocked-by: []

what-to-do:
- Redesign installer state so it records concrete assets, selected agents,
  timestamps, and availability details where asset behavior differs.
- Keep install explicit while preparing update to consume trustworthy recorded
  state.
- Preserve auditable metadata rather than flattening everything into coarse
  target labels.

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`
- `frameworks/ralph-loop/framework-files.json`
- `frameworks/ralph-loop/installer/tests/*`

verification:
- Run install and update flows in throwaway repositories and inspect the written
  `.plan/.framework-install.json` contents.

#### Execution Notes

- No execution notes yet.

### ST-02 - Add visible reuse and explicit override in update flow

status: ready
model: medium
escalate-if: [update-ux-needs-separate-planning-pass]
blocked-by: [ST-01]

what-to-do:
- Change update so it shows the recorded state it plans to reuse before
  proceeding.
- Provide an explicit override path for different agents or availability.
- Reject stale or invalid recorded state instead of silently applying it.

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`
- `frameworks/ralph-loop/installer/install.sh`
- `frameworks/ralph-loop/installer/tests/*`

verification:
- Execute the installer test suite and at least one manual update verification
  pass covering confirm, override, and invalid-state fallback behavior.

#### Execution Notes

- No execution notes yet.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
