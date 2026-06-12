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
- **Plan**: Create the `ralph-loop` skill.
  - [x] Align on terminology and update `CONTEXT.md` glossary.
  - [x] Initialize local context files (This file).
  - [x] Create `.agents/skills/ralph-loop/SKILL.md` with instructions, Phase 0 permissions request, and 10-iteration loop lifecycle.

- **Plan**: Create the `ralph-loop` bash script.
  - [x] Create `ralph-loop.sh` with interactive prompts, automatic `agy` execution, and termination parsing.
  - [x] Update `README.md` to include symlink and gitignore setup instructions for `ralph-loop.sh`.
