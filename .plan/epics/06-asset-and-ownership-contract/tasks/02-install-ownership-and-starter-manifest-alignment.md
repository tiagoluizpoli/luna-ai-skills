---
type: task
id: T-18
epic: E-06
status: done
blocked-by: []
default-model: medium
---

## What to Build

Make clean install and update obey the same starter-file ownership contract,
remove undeclared placeholder content from fresh installs unless it is
explicitly declared, and align `.framework-install.json` with the real
framework-managed or generated-file model.

## Context

The live installer still copies the entire starter tree on fresh install, which
bypasses the manifest contract and ships placeholder PRD/epic/task content. The
ownership story for `.framework-install.json` also drifts between docs,
manifest, and runtime behavior.

## Acceptance Criteria

- [ ] Fresh install provisions only the declared framework-managed and
      workflow-owned starter files.
- [ ] Placeholder PRD/epic/task content is either removed from install or
      explicitly declared and documented.
- [ ] `.framework-install.json` is consistently classified across code,
      manifest, and docs.
- [ ] Tests cover clean install against the manifest-driven ownership contract.

## Sub-Tasks

### ST-01 - Align fresh install behavior with the manifest contract

status: done
model: medium
escalate-if: [starter-layout-conflicts-with-existing-framework-bootstrap]
blocked-by: []

what-to-do:
- Replace whole-tree fresh install copying with manifest-driven starter
  provisioning.
- Decide explicitly whether placeholder planning files belong in the starter.
- Preserve workflow-owned files without letting clean install bypass the
  contract.

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`
- `frameworks/ralph-loop/framework-files.json`
- `frameworks/ralph-loop/.plan/*`

verification:
- Run a clean install into a throwaway repository and compare the installed tree
  against the declared manifest contract.

#### Execution Notes

- Replaced copyDirectory with manifest-driven copying for fresh install.
- Declared placeholder PRD, epic, and task files in framework-files.json as workflowOwnedFiles.
- Added test verifying target files match manifest contract.


### ST-02 - Reconcile generated metadata ownership and regression coverage

status: done
model: medium
escalate-if: [metadata-contract-needs-separate-schema-layer]
blocked-by: []

what-to-do:
- Classify `.framework-install.json` consistently as framework-managed or as a
  documented generated artifact.
- Update code, manifest, and docs to match that decision.
- Add regression coverage proving install/update emit the expected ownership
  metadata.

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`
- `frameworks/ralph-loop/framework-files.json`
- `frameworks/ralph-loop/README.md`
- `README.md`
- `frameworks/ralph-loop/installer/tests/*`

verification:
- Execute the installer test suite and verify a throwaway install emits the
  expected metadata file classification and contents.

#### Execution Notes

- Classified `.framework-install.json` as a documented generated artifact, not a framework-managed template file.
- Updated comments/manifest/docs across the codebase to consistently align with this classification.
- Added regression test checking install/update manifest behavior, structure, and omission from managed/workflow lists.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
