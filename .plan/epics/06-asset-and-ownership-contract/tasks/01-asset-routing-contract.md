---
type: task
id: T-17
epic: E-06
status: done
blocked-by: []
default-model: medium
---

## What to Build

Model framework assets explicitly as shared versus agent-specific, treat runner
scripts as first-class install payload, and enforce routing so unselected
agents never receive agent-specific assets.

## Context

The PRD treats wrong-agent routing as a high-severity correctness bug. The live
installer and metadata still behave like a coarse skills-only system, which is
not enough for runner scripts and other agent-specific framework assets.

## Acceptance Criteria

- [ ] The installer distinguishes shared framework assets from agent-specific
      assets in code and metadata.
- [ ] Runner scripts are treated as first-class installed assets.
- [ ] Agent-specific assets are installed only for selected agents.
- [ ] Tests cover wrong-agent routing failures and selected-agent routing for
      all supported agents.

## Sub-Tasks

### ST-01 - Implement explicit shared versus agent-specific asset routing

status: done
model: medium
escalate-if: [asset-classification-forces-large-installer-refactor]
blocked-by: []

what-to-do:
- Define the asset classes the installer needs to route.
- Update install planning so shared assets and agent-specific assets are handled
  separately.
- Ensure agent-specific runner scripts and similar payloads are installed only
  for selected agents.

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`
- `frameworks/ralph-loop/framework-files.json`
- `frameworks/ralph-loop/skills-manifest.json`
- `ralph-loop-hermes.sh`
- `ralph-loop-codex.sh`
- `ralph-loop-agy.sh`

verification:
- Run a throwaway-repository install for multiple agent combinations and inspect
  the installed assets for each selected and unselected agent.

#### Execution Notes

- No execution notes yet.

### ST-02 - Add routing regression coverage for wrong-agent installs

status: done
model: medium
escalate-if: [routing-verification-needs-fixtures-or-sandbox-runner]
blocked-by: []

what-to-do:
- Add automated regression coverage asserting that unselected agents never
  receive agent-specific assets.
- Cover runner-script bookkeeping as part of the installed asset set.
- Make wrong-agent routing failures explicit in the test expectations.

files-to-touch:
- `frameworks/ralph-loop/installer/tests/*`
- `frameworks/ralph-loop/installer/package.json`
- `frameworks/ralph-loop/installer/src/index.mjs`

verification:
- Execute the installer test suite and confirm wrong-agent routing checks fail
  on regression and pass on the hardened implementation.

#### Execution Notes

- No execution notes yet.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
