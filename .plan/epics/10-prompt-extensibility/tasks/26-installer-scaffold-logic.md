---
type: task
id: T-26
epic: E-10
status: done
blocked-by: []
default-model: medium
---

## What to Build

Update `frameworks/ralph-loop/installer/src/index.mjs` to scaffold `prompt.local.md` and `CONTEXT.md` (and respect `RULES.md`) as consumer-owned starter files: write them on fresh install, skip them on update if they already exist.

## Context

- File: `frameworks/ralph-loop/installer/src/index.mjs`
- T-25 introduces `consumerOwnedStarterFiles` in `framework-files.json` — installer reads this to know which files get scaffold-only treatment.
- Fresh install: target directory is empty or newly created — write all starter files.
- Update: target already has files — skip any `consumerOwnedStarterFiles` entry that exists on disk.
- Starter templates defined in PRD v5 §4.
- `RULES.md` already gets written on fresh install; the change is ensuring it is skipped on update.

## Acceptance Criteria

- [x] Fresh install writes `prompt.local.md` with starter content to repo root.
- [x] Fresh install writes `CONTEXT.md` with starter content to repo root.
- [x] Update skips `prompt.local.md` if file already exists.
- [x] Update skips `CONTEXT.md` if file already exists.
- [x] Update skips `RULES.md` if file already exists.
- [x] Starter content matches PRD v5 §4 templates exactly.

## Sub-Tasks

### ST-01 - Add prompt.local.md scaffold on fresh install

status: done
model: medium
escalate-if: ["starter content logic is more complex than a single write call"]
blocked-by: []

what-to-do:
- In the fresh-install path of `index.mjs`, after other scaffold writes, write `prompt.local.md` to the target root with the starter content from PRD v5 §4.
- Starter content (write exactly):
  ```
  # Project-Specific Runtime Instructions

  <!-- This file is yours. The framework's prompt.md reads it last, after loading all framework context. -->
  <!-- Add project-specific runtime instructions here: verification commands, communication style, guardrails. -->
  <!-- Example: "After every code change, run: bun run test && bun run check-types" -->
  <!-- This file is never overwritten by the framework installer. -->
  ```

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`

verification:
- Manual: run installer against a temp empty dir, check `prompt.local.md` exists with correct content.

### ST-02 - Add CONTEXT.md scaffold on fresh install

status: done
model: medium
escalate-if: []
blocked-by: []

what-to-do:
- In the fresh-install path, write `CONTEXT.md` to the target root with starter content from PRD v5 §4.
- Starter content (write exactly):
  ```
  # Domain Context

  <!-- This file is your domain glossary. Add project-specific terms and their precise definitions. -->
  <!-- The grill-with-docs skill (via domain-modeling) creates and maintains this file. -->
  <!-- The framework reads this file after RULES.md on every loop execution. -->
  <!-- This file is never overwritten by the framework installer. -->
  ```

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`

verification:
- Manual: run installer against a temp empty dir, check `CONTEXT.md` exists with correct content.

### ST-03 - Skip consumerOwnedStarterFiles on update if they exist

status: done
model: medium
escalate-if: ["update path does not have a clear exists-check seam"]
blocked-by: []

what-to-do:
- In the update path of `index.mjs`, for each file in `consumerOwnedStarterFiles` (loaded from `framework-files.json`), check if the file exists at the target path.
- If it exists: skip (do not write, do not log as overwritten).
- If it does not exist: write the starter content (first install on an existing repo that never had these files).
- This covers `RULES.md`, `prompt.local.md`, and `CONTEXT.md`.

files-to-touch:
- `frameworks/ralph-loop/installer/src/index.mjs`

verification:
- Manual: run installer update against a dir with existing `prompt.local.md` containing custom content — file must be unchanged after update.

#### Execution Notes

- No execution notes yet.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
