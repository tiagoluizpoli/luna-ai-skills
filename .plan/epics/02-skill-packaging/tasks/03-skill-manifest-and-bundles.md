---
type: task
id: T-06
epic: E-02
status: done
blocked-by: []
default-model: medium
---

## What to Build

Encode the owned skill set, bundles, selectability, dependency closure, and
target install paths in explicit framework metadata.

## Context

The installer needed a deterministic source of truth for bundle selection and
dependency resolution.

## Acceptance Criteria

- [x] Core and add-on bundles are represented explicitly.
- [x] Each skill records dependencies and target paths.
- [x] Dependency-only skills are represented as non-selectable.

## Sub-Tasks

### ST-01 - Add skill manifest and framework file metadata

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Create `skills-manifest.json` and `framework-files.json` for the installer.

files-to-touch:
- `frameworks/ralph-loop/skills-manifest.json`
- `frameworks/ralph-loop/framework-files.json`

verification:
- Parse both JSON files successfully.

#### Execution Notes

- Completed in `a3716bf`.
