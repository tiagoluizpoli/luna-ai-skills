# Installable Ralph Loop Framework Core

## Problem Statement

The Ralph Loop workflow had become tangled with SpecKit-branded paths,
symlink-only sharing, and agent-specific conventions. The user wanted a
centralized framework that could be installed into clean repositories, keep its
live state under a neutral `.plan/` workspace, preserve SpecKit as an optional
separate system, and package the user-owned skills needed to support the flow.

## Solution

Build an installable Ralph Loop framework in this repository with:

- a reusable `.plan/` starter
- installer-managed vs workflow-owned file boundaries
- a bootstrap installer plus interactive Node installer
- bundled framework-owned skills and dependency metadata
- Matt Pocock skills treated as external prerequisites
- a deterministic local helper-script surface for state synchronization,
  prerequisite validation, retrieval, and archival

## User Stories

1. As the framework owner, I want a neutral `.plan/` workspace, so that Ralph
   Loop stops conflicting with SpecKit naming and ownership.
2. As the framework owner, I want framework-managed files separated from
   workflow-owned files, so that updates do not overwrite live execution state.
3. As a repository consumer, I want to install the framework with a single
   bootstrap command, so that I do not need local symlink setup.
4. As a repository consumer, I want the installer to validate Matt Pocock
   skills first, so that the framework never installs into a broken dependency
   state.
5. As a repository consumer, I want the installer to show a resolved install
   plan before it writes files, so that I can understand bundles, dependencies,
   and targets.
6. As a repository consumer, I want to choose whether framework-owned skills
   install into repo-local or global agent targets, so that the framework fits
   different agent workflows.
7. As a framework maintainer, I want namespaced on-disk skill installs, so that
   framework-owned skills do not collide with unrelated skills.
8. As a planner, I want `.plan` epics and tasks generated directly from the
   PRD, so that the execution tree matches the live workflow contract.
9. As a maintainer, I want the `commit` workflow packaged as a real skill, so
   that commit hygiene can be reused globally instead of staying as a local
   workflow note.
10. As a maintainer, I want the installer to support update and adoption modes,
    so that existing repos can be refreshed or brought under management.
11. As an autonomous runner, I want durable run state, run history, and run
    summary files, so that clean sessions can resume with accurate context.
12. As an autonomous runner, I want helper scripts to own deterministic state
    sync and retrieval behavior, so that models do less brittle parsing work.
13. As a user, I want local clean-repo validation before real rollout, so that
    the framework proves itself before touching production repos.

## Implementation Decisions

- The live workflow workspace is `.plan/`, not `.specify/memory/`.
- Framework-managed files include `.plan/prompt.md`, `.plan/RULES.md`,
  `.plan/shared/*`, `.plan/helper-scripts/*`, and the framework marker file.
- Workflow-owned files include `.plan/PRD.md`, `.plan/index.md`,
  `.plan/backlog.md`, `.plan/progress.txt`, active run state/history/summary
  files, and archive surfaces.
- `agents.local.md` is optional repo-local context, not a hard framework
  dependency.
- The installer uses Bash only for bootstrap and a self-contained Node package
  for the interactive flow.
- `@clack/prompts` is the prompt layer for the installer.
- The installer is interactive-first in v1, with a narrow automation path kept
  for verification.
- Skill ownership is explicit in `skills-manifest.json`.
- `commit` is a first-class framework-owned skill that depends on
  `conventional-commits`.
- `to-epic-issues` remains a wrapper around `to-issues`, but now targets `.plan`.
- The current `ralph-loop` skill is intentionally excluded from the default
  install set because the runner scripts own the real loop.
- The default bundle is `Ralph Loop Core`; architecture, testing, and diagnose
  skills are manual add-ons.
- `test-master` owns local test-skill dependency closure when selected.
- Global skill installs are namespaced per target path.
- The installer records source repo URL, ref, and resolved SHA in the framework
  manifest.
- Public bootstrap and real consumer rollout remain pending after local
  verification.

## Testing Decisions

- A good test validates real install behavior, update behavior, adoption
  behavior, and dependency resolution instead of only syntax.
- The installer, helper scripts, and generated layouts should be exercised in
  throwaway Git repos before rollout.
- Shell syntax checks are required for runner, bootstrap, and helper scripts.
- Node syntax checks are required for the installer package.
- Real local repo verification was performed for:
  install, update, adopt, and `--all` bundle expansion.

## Out Of Scope

- Automatic migration from `.specify` layouts in v1
- Uninstall support in v1
- Full public GitHub bootstrap verification before the remote path is used
- Full end-to-end runner enforcement of the model escalation state machine
- Real consumer repo rollout during framework-source implementation

## Further Notes

- This PRD is the durable record of the long grilling session that locked the
  framework contract.
- The associated grilling record keeps the numbered question trail so the
  implementation rationale stays auditable.
