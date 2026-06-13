---
type: task
id: T-07
epic: E-03
status: done
blocked-by: []
default-model: medium
---

## What to Build

Build the installer bootstrap and Node installer package that owns install,
update, adoption, skill provisioning, and manifest recording.

## Context

The framework required a public bootstrap path, interactive installer UX,
target-specific skill installs, and manifest recording of install provenance.

## Acceptance Criteria

- [x] Bash bootstrap exists.
- [x] Node installer package exists and uses `@clack/prompts`.
- [x] Install/update/adoption logic is implemented.

## Sub-Tasks

### ST-01 - Create installer bootstrap and Node package

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- Implement the Bash bootstrap and Node installer package under
  `frameworks/ralph-loop/installer/`.

files-to-touch:
- `frameworks/ralph-loop/installer/install.sh`
- `frameworks/ralph-loop/installer/package.json`
- `frameworks/ralph-loop/installer/src/index.mjs`

verification:
- `node --check frameworks/ralph-loop/installer/src/index.mjs`
- `bash -n frameworks/ralph-loop/installer/install.sh`

#### Execution Notes

- Completed in `a3716bf`.
