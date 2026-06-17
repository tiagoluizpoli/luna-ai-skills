# Ralph Loop Starter

Reusable starter assets for repositories that want the Ralph Loop workflow
without tying operational memory to SpecKit.

## Layout

- `.plan/prompt.md`
- `.plan/RULES.md`
- `.plan/PRD.md`
- `.plan/index.md`
- `.plan/backlog.md`
- `.plan/progress.txt`
- `.plan/.run-state.json`
- `.plan/.run-history.jsonl`
- `.plan/.run-summary.md`
- `.plan/prds/`
- `.plan/handoffs/`
- `.plan/epics/`
- `.plan/sessions/`
- `.plan/grilling/`
- `.plan/summaries/`
- `.plan/archive/`
- `.plan/shared/epic-template.md`
- `.plan/shared/task-template.md`
- `.plan/helper-scripts/*`

## Root-level expectation

`agents.local.md` is optional. If it exists, the runners may read it as
additional repo-local context. The framework does not require it.

Everything else in the Ralph Loop contract lives under `.plan/`.

## Managed vs workflow-owned

Framework-managed files:

- `.plan/prompt.md`
- `.plan/RULES.md`
- `.plan/shared/*`
- `.plan/helper-scripts/*`
- `.plan/.framework`

Workflow-owned files:

- `.plan/PRD.md`
- `.plan/index.md`
- `.plan/backlog.md`
- `.plan/progress.txt`
- `.plan/.run-state.json`
- `.plan/.run-history.jsonl`
- `.plan/.run-summary.md`
- `.plan/epics/*`
- `.plan/prds/*`
- `.plan/handoffs/*`
- `.plan/sessions/*`
- `.plan/grilling/*`
- `.plan/summaries/*`
- `.plan/archive/*`

Generated artifacts (written by the installer):

- `.plan/.framework-install.json` (verified)

## Installer selection & update contract

The install/update flow is implemented under `frameworks/ralph-loop/installer/` and follows a strict contract:

1. **Prerequisites**: Before running the installer, you must install the dynamic prerequisites:
   ```bash
   npx skills@latest add mattpocock/skills
   ```
2. **Interactive selection**: The interactive flow prompts for target agents (Hermes, Codex, AGY) first, followed by a single run-level availability mode (local or global). Skill-level subset selection is removed in favor of a mandatory skill bundle.
3. **Asset routing**:
   - Shared assets (helper scripts, templates) are installed to `.plan/`.
   - Agent-specific runner scripts (`ralph-loop-hermes.sh`, `ralph-loop-codex.sh`, `ralph-loop-agy.sh`) are copied to the repo root only for selected agents. Any unselected agent runner scripts are cleaned up.
4. **Skills routing**: The mandatory `Ralph Loop Core` skill set is installed under `.agents/skills/luna-ai/` (for local availability) or `~/.hermes/skills/luna-ai/` (for global availability).
5. **Metadata & State Updates**: 
   - Installation state is tracked in `.plan/.framework-install.json`, recording concrete installed assets, selected agents, target paths, and install/update timestamps. This file is not listed under `framework-files.json` managed files as it is a generated artifact.
   - During updates, the installer presents previously recorded settings for verification. The user can either confirm and reuse the previous state, or choose to explicitly override it to target different agents or availability.

## Phase pointers

The planning wrappers use durable repo-local pointers instead of guessing from
directory listings:

- `.plan/grilling/.current-session`
- `.plan/prds/.current-prd`
- `.plan/handoffs/.current-grill-handoff`
- `.plan/handoffs/.current-prd-handoff`

Use the helper scripts under `.plan/helper-scripts/` to set and resolve those
pointers deterministically across sessions.

## Migration note

If a consumer repo currently stores workflow state in `.specify/memory/` or at
the repo root, migrate those files into `.plan/` and update local prompts and
rules to match the new paths.
