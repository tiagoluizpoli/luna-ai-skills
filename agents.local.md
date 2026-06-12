# Local Agent Context & Guidelines

## Project Architecture
This repository contains the Luna AI Skills Ecosystem, which powers autonomous agents with specialized capabilities (e.g., SpecKit, GSTITCH, React Architecture, and Test Management).

## Tech Stack
- Markdown-based skills (`SKILL.md` template with YAML frontmatter).
- Node.js scripts for execution-level automation (when needed).
- Custom configuration files (`extensions.yml`, `skills-lock.json`).

## Specific Guidelines
- **Skill descriptions**: Keep under 1024 characters, written in the third person. Must contain a clear first sentence and a second trigger sentence starting with "Use when...".
- **Formatting**: Adhere to the markdown standards outlined in the code review guidelines.
- **Symlink protection**: Never modify the global `AGENTS.md` file. Always use `agents.local.md` for local plan references.

## Current Plan Reference
- **Plan**: Build a standalone Ralph Loop framework and keep SpecKit optional.
  - [x] Compare this repository against `neighborhood-showcase` to identify reusable shared scripts and workflow surfaces.
  - [x] Import the missing shared root script `ralph-loop-hermes.sh`.
  - [x] Rename the Antigravity runner to `ralph-loop-agy.sh`.
  - [x] Create [`docs/ralph-loop-framework.md`](/home/tiago/01-dev-env/personal-repos/luna-ai-skills/docs/ralph-loop-framework.md) with the framework boundary, target `.plan/` workspace, and migration path away from `.specify/memory` and root workflow files.
  - [x] Keep [`docs/speckit-split-plan.md`](/home/tiago/01-dev-env/personal-repos/luna-ai-skills/docs/speckit-split-plan.md) as the ownership-boundary companion for SpecKit separation.

- **Plan**: Create the `ralph-loop` skill.
  - [x] Align on terminology and update `CONTEXT.md` glossary.
  - [x] Initialize local context files (This file).
  - [x] Create `.agents/skills/ralph-loop/SKILL.md` with instructions, Phase 0 permissions request, and 10-iteration loop lifecycle.

- **Plan**: Create the `ralph-loop` bash script.
  - [x] Create `ralph-loop-agy.sh` with interactive prompts, automatic `agy` execution, and termination parsing.
  - [x] Update `README.md` to include symlink and gitignore setup instructions for `ralph-loop-agy.sh`.

- **Plan**: Create the `ralph-loop-codex` bash script.
  - [x] Copy `ralph-loop-agy.sh` into `ralph-loop-codex.sh` and adapt for `codex exec` / `codex exec resume --last`.
  - [x] Add nested Codex session guard (`$CODEX_THREAD_ID`).
  - [x] Update `README.md` symlink and gitignore blocks to include `ralph-loop-codex.sh`.

- **Plan**: Enhance Ralph Loop termination and remove Matt Pocock branding.
  - [x] Update `ralph-loop-agy.sh` to remove branding and add robust termination checks (CLI output & new `.plan/progress.txt` lines).
  - [x] Update `ralph-loop-codex.sh` to align with `ralph-loop-agy.sh` logic.
