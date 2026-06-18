# PRD: Claude Provider Integration & Skills Installer Refactor

## Problem Statement

The Ralph Loop framework currently lacks integration for the Claude agent runner (`claude` CLI loop runner). While the loop script `ralph-loop-claude.sh` exists in the codebase, it is not registered in the installer assets, meaning users cannot target Claude when installing or updating framework assets.

Furthermore, the interactive installer's update process is tedious. When updating a repository that contains existing skills, the installer loops through each conflicting skill and prompts the user individually to either overwrite, skip, or abort. For a suite of 18 skills, this requires up to 18 consecutive confirmation prompts. Developers need a consolidated check-list (multi-select list) to resolve all conflicts at once.

## Solution

1.  **Claude Integration**: Register the Claude runner script (`ralph-loop-claude.sh`) as a framework asset and define the target directories for the Claude provider (`.claude/skills/` locally and `~/.claude/skills/` globally).
2.  **Consolidated Conflict Prompt**: Refactor the installer's update conflict resolution flow to collect all existing skills first, present a single consolidated multi-select prompt for all conflicts, overwrite only the selected skills, and keep existing local versions of unselected ones.
3.  **Metadata Preservation**: Retain the existing metadata and timestamps of skipped (unselected) skills in the `.framework-install.json` file so that they remain tracked under the active framework version.

## User Stories

1.  As a developer using the Ralph Loop framework, I want to run loops using the Claude agent, so that I can iteratively resolve tasks using Claude Code.
2.  As a developer running the framework installer, I want to be prompted once with a checklist of conflicting skills, so that I don't have to confirm override decisions one by one.
3.  As a developer, I want the multi-select checklist to allow me to check skills to overwrite them, and leave them unchecked to keep my local changes.
4.  As a developer, I want my skipped skills to keep their existing installation metadata and timestamps in `.framework-install.json`, so that my local modifications are still recognized and tracked.
5.  As a developer, if I specify invalid legacy CLI flags, I want the error warning message to include `claude` in the suggested valid agents list.

## Implementation Decisions

### 1. Claude Asset & Target Registration
- Register `ralph-loop-claude.sh` as an agent-specific asset under the `agentSpecificAssets` collection in `framework-files.json`.
- Add `claude` to `selectionContract.installAgents` in `skills-manifest.json`.
- Map the supported targets for all 18 skills to include `claude-local` and `claude-global` in `skills-manifest.json`.
- Map the `installPathTemplates` for all skills to point to:
  - `claude-local`: `.claude/skills/<skill-id>`
  - `claude-global`: `~/.claude/skills/<skill-id>`
- Add `~/.claude/skills/` to the array of search paths inside the installer's external skill discovery helper `findExternalSkill`.

### 2. Multi-Select Conflict Resolution
- In the installer `installSkills` function, check for the existence of all target skill directories before copying.
- If any skill directory exists and the run is interactive (no `--yes` or `--force` options):
  - Add the skill and its target destination details to a conflict list.
- Display a single `@clack/prompts` `multiselect` listing all conflicting skills.
  - The option value will be the skill/target identifier.
  - The option label will follow the format: `<skillName> (<targetName>)`.
  - The option hint will show the destination path.
- Parse the result:
  - If the user aborts or cancels, exit gracefully.
  - For each conflicting skill:
    - If it was checked (selected), delete the destination directory and copy the fresh framework version.
    - If it was unchecked (unselected), skip the copying process but keep the skill's current metadata in the tracking lists.

### 3. Metadata Recording
- Retain existing installation details and timestamps in `.framework-install.json` for skills that were skipped.
- Update timestamps and availability details only for skills that were freshly installed or overwritten.

### 4. Legacy Argument Validation
- Update the legacy command arguments validation warning message to dynamically include `claude` (or explicitly list `<hermes,codex,agy,claude>`).

## Testing Decisions

- **CLI Conflict Mocking**: Mock the existence of destination skill directories in temporary repo-local and global locations, then verify that a single multi-select list is presented.
- **Selection Assertion**: Select a subset of conflicting skills for overwrite, verify that only the selected ones have their contents replaced, and verify that unselected ones retain their pre-existing contents.
- **Metadata Inspection**: Check `.framework-install.json` after an update where some skills were skipped. Confirm that skipped skills preserve their original `installedAt` timestamps, while overwritten skills have updated timestamps.
- **Claude Target Integration**: Run the installer with `--agents claude --availability local` and `--agents claude --availability global` in a clean environment and verify that `ralph-loop-claude.sh` is copied to the repository root, and skills are correctly placed under `.claude/skills/` and `~/.claude/skills/` respectively.

## Out of Scope

- Support for other custom target structures not defined in the manifest.
- Custom keybinding overrides in `@clack/prompts`.
- Deleting user-created custom skills that are not part of the framework manifest.

## Further Notes

- Since this modifies the core installation paths and prompt interface, ensure that existing unit tests in `installer/tests/` are run and expanded as needed.
