---
type: task
id: T-08
epic: E-03
status: done
blocked-by: []
default-model: medium
---

## What to Build

Run real local verification against clean throwaway Git repositories and patch
the installer until install, update, adoption, and full-bundle flows work.

## Context

The first installer pass still had real bugs: argument parsing, command wrapper
behavior in the current sandbox, and the `--yes` automation path used for
verification.

## Acceptance Criteria

- [x] Local install into a clean repo succeeds.
- [x] Update preserves workflow-owned files while refreshing managed files.
- [x] Adoption works for a compatible unmanaged `.plan`.
- [x] `--all` installs add-ons and dependency-only skills correctly.

## Sub-Tasks

### ST-01 - Verify install and patch runtime bugs

status: done
model: medium
escalate-if: [failing-twice]
blocked-by: []

what-to-do:
- Run the installer against throwaway repos and patch real failures until the
  flows work.

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`

verification:
- Successful local install/update/adopt runs in `/tmp` repos.

#### Execution Notes

- Fixed the argument parser.
- Added a command wrapper for the sandbox `spawnSync git EPERM` quirk when
  status was still zero.
- Added a narrow `--yes` path for deterministic local verification.

### ST-02 - Verify helper scripts

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Smoke test the helper scripts against the framework source workspace.

files-to-touch:
- `frameworks/ralph-loop/.plan/helper-scripts/*`

verification:
- `bash frameworks/ralph-loop/.plan/helper-scripts/validate-prereqs.sh --require to-issues`
- `bash frameworks/ralph-loop/.plan/helper-scripts/sync-state.sh`
- `bash frameworks/ralph-loop/.plan/helper-scripts/retrieve-history.sh --query Replace --limit 5`

#### Execution Notes

- Completed during local verification after the installer was stabilized.
