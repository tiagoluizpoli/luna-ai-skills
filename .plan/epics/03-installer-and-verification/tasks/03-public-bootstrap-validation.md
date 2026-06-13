---
type: task
id: T-09
epic: E-03
status: ready
blocked-by: []
default-model: medium
---

## What to Build

Verify the public remote bootstrap path using the actual GitHub-hosted installer
entrypoint.

## Context

Local source execution is verified. The remaining gap is validation of the real
remote bootstrap path that uses `curl` against the pushed repository contents.

## Acceptance Criteria

- [ ] The public bootstrap path is executed from a clean test repo.
- [ ] The remote bootstrap resolves the correct installer package and source
      metadata.
- [ ] Any remote-path-only bugs are patched back into the framework source.

## Sub-Tasks

### ST-01 - Run the public bootstrap against a clean repo

status: ready
model: medium
escalate-if: [failing-twice]
blocked-by: []

what-to-do:
- Execute the public installer path against a clean repo once the desired
  remote revision is available.

files-to-touch:
- `frameworks/ralph-loop/installer/install.sh`
- `frameworks/ralph-loop/installer/src/index.mjs`

verification:
- Successful public `curl | bash` install against a clean repo.

#### Execution Notes

- Not started yet.
