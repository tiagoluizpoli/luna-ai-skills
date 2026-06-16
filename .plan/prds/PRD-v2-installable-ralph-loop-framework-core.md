# Installable Ralph Loop Framework Core

## Problem Statement

The Ralph Loop workflow was carrying too much accidental coupling: SpecKit-owned
paths and branding, symlink-first local setup, weak cross-session continuity,
and planning state spread across surfaces that were hard to resume
deterministically. The framework needed to become installable into clean
repositories, keep its live planning state under a neutral `.plan/` workspace,
preserve Matt Pocock skills as external prerequisites, and make the full
planning chain durable from grilling through execution.

## Solution

Build the Ralph Loop framework as an installable overlay with a strict `.plan/`
workspace contract, durable local pointers and handoffs between planning
phases, framework-owned wrapper skills, and helper scripts that own
deterministic state transitions. The framework should install and update only
framework-managed assets, preserve workflow-owned planning records, and keep
the current run family small through explicit archival and retrieval behavior.

## User Stories

1. As the framework owner, I want Ralph Loop to use `.plan/` instead of
   SpecKit-branded runtime paths, so that the workflow has a neutral identity.
2. As a repository consumer, I want to install the framework into a clean repo,
   so that the workflow no longer depends on local symlink-only setup.
3. As a repository consumer, I want the installer to stop when required Matt
   Pocock skills are missing, so that the framework never installs into a known
   broken dependency state.
4. As a repository consumer, I want prerequisite validation to check named
   external skills, so that dependency failures are concrete and auditable.
5. As a framework maintainer, I want Matt Pocock skills to stay external, so
   that this repo does not fork or vendor upstream shared skills.
6. As a framework maintainer, I want framework-owned skills to install
   separately from external prerequisites, so that ownership boundaries stay
   explicit.
7. As a repository consumer, I want the installer to refresh only
   framework-managed files by default, so that updates do not overwrite live
   planning state.
8. As a planner, I want `.plan/` split between framework-managed and
   workflow-owned files, so that installation and execution can coexist safely.
9. As a planner, I want one backlog file with urgency semantics, so that near
   term and deferred work remain in one durable queue.
10. As an autonomous runner, I want deterministic pointer files for the current
    grilling session, grill handoff, PRD, and PRD handoff, so that phase
    continuity does not depend on directory guessing.
11. As a planner, I want grilling output persisted under `.plan/grilling/`, so
    that the design conversation becomes a durable source record.
12. As a planner, I want `luna-to-prd` to create a versioned PRD and mark one
    canonical current record, so that the live planning scope is unambiguous.
13. As a planner, I want `luna-to-prd` to also create a PRD-to-issues handoff,
    so that issue decomposition can resume in a clean session without
    re-deriving intent.
14. As a planner, I want `luna-to-issues` to decompose the current PRD into the
    `.plan` epic and task tree, so that execution starts from the canonical PRD
    instead of ad hoc notes.
15. As an autonomous runner, I want run state, progress, run history, and run
    summary kept as separate artifacts, so that resumability does not depend on
    one overloaded file.
16. As an autonomous runner, I want the active run summary scoped to the
    current PRD family, so that future runs load compact durable context by
    default.
17. As a maintainer, I want older run families archived instead of left active,
    so that the live workspace stays small and navigable.
18. As an autonomous runner, I want historical retrieval to be mandatory when
    relevant, so that clean sessions can safely recover prior decisions before
    executing related work.
19. As an autonomous runner, I want retrieval to prefer structured keys first,
    then tags, then full text, so that history lookup stays deterministic and
    low-noise.
20. As an autonomous runner, I want retrieval results returned as ranked hits
    plus a compact bundle, so that the model can continue without raw context
    dumps.
21. As a task author, I want strict parseable markdown task files with stable
    sub-task identifiers, so that scripts can synchronize runtime state
    reliably.
22. As a runner, I want model-tier metadata defined at the task level with
    sub-task overrides, so that stronger models can be required only where risk
    justifies it.
23. As a maintainer, I want generated task files to include that model-tier
    metadata, so that the execution tree is operational immediately.
24. As a runner, I want `blocked` to be a durable state and aggregate statuses
    derived by script, so that stalled work is not silently retried or
    misreported.
25. As a maintainer, I want helper scripts provisioned as part of the framework
    surface, so that deterministic state sync and retrieval do not depend on
    model improvisation.
26. As a repository consumer, I want local install, update, and adopt flows
    verified in throwaway repos first, so that the framework proves itself
    before broader rollout.
27. As the framework owner, I want pending public bootstrap validation and real
    consumer rollout preserved as explicit remaining work, so that the PRD does
    not overstate completeness.

## Implementation Decisions

- The live workflow workspace is `.plan/`; `.specify/memory` is not the active
  Ralph Loop runtime surface.
- Framework-managed assets and workflow-owned planning records are separate
  classes of files and must be treated differently by install and update flows.
- The framework keeps Matt Pocock skills as external prerequisites and validates
  the required upstream skills explicitly before installation continues.
- Framework-owned wrapper skills are installed from this repository and the
  default bundle is `luna-grill-with-docs`, `luna-to-prd`, `luna-to-issues`,
  `commit`, and `code-review`.
- The installer is interactive-first in v1, with Bash bootstrap and a
  self-contained Node installer responsible for plan resolution and file writes.
- Installation metadata is recorded durably so the runtime can identify that a
  repo is on the Ralph Loop framework without inferring from arbitrary files.
- The planning chain is explicit and durable: grilling session, grill-to-PRD
  handoff, versioned PRD, PRD-to-issues handoff, epic/task tree, and execution
  state all live under `.plan/`.
- Phase selection is driven by canonical pointer files, not "latest matching
  file" heuristics.
- `luna-grill-with-docs` owns persistent grilling state under `.plan/grilling/`
  and `luna-to-prd` owns PRD generation plus the next handoff.
- `.plan/PRD.md` is a thin index over versioned PRD files; only one row may be
  `CURRENT` and older PRDs remain as historical metadata.
- The active run family stays intentionally small; older summaries and execution
  trees are archived when a new PRD family becomes current.
- The framework uses distinct durable artifacts for run state, progress,
  structured run history, and the compact current-run summary.
- Historical retrieval is a first-class runtime phase, uses structured keys
  before broader search, and is bounded rather than open-ended.
- Task files remain markdown but move to a strict parseable schema with stable
  sub-task IDs, append-friendly execution notes, task-level model defaults, and
  per-sub-task overrides.
- `blocked` is a first-class durable state; aggregate task and epic statuses are
  derived from atomic sub-task state by local helper scripts rather than manual
  edits.
- The framework preserves the boundary between generic decomposition logic and
  Ralph Loop filesystem adapters: `to-issues` stays generic, while
  `luna-to-issues` owns `.plan`-specific output shaping.
- Public GitHub bootstrap validation, real consumer rollout, and deeper runner
  state-machine hardening remain planned work and should not be silently treated
  as complete.

## Testing Decisions

- Good tests validate external behavior and durable workflow outcomes rather
  than internal implementation details.
- Installer tests should cover prerequisite validation, clean install, update,
  adoption, bundle expansion, and non-destructive handling of workflow-owned
  files.
- Helper-script verification should cover pointer resolution, pointer mutation,
  state synchronization, and error behavior when canonical files are missing or
  invalid.
- Planning workflow checks should confirm that grilling records, PRD indexes,
  PRD handoffs, and current pointers stay aligned after each phase transition.
- Task-schema and runtime-state tests should validate strict markdown parsing,
  aggregate status derivation, blocked-state handling, and model-tier metadata
  emission.
- Retrieval tests should confirm structured-key preference, bounded retrieval
  rounds, ranked result output, and compact bundle generation.
- Throwaway-repo verification remains the required prior art for end-to-end
  install and update flows until broader consumer rollout is complete.

## Out Of Scope

- Vendoring or forking Matt Pocock's shared skills into this repository
- Reintroducing SpecKit-branded runtime ownership into the Ralph Loop framework
- Flattening the planning workflow back into root-level PRD or prompt files
- Automatic migration from older `.specify` layouts in v1
- Uninstall support in v1
- Declaring public bootstrap validation or real consumer rollout complete before
  those validations actually happen

## Further Notes

- This PRD supersedes the earlier baseline record by explicitly covering the
  deterministic handoff model, current-run-family scoping, runtime retrieval
  expectations, and atomic execution-state contract locked in the grilling
  session.
- The full grilling session remains the authoritative rationale trail when a
  later planning or implementation decision needs to be audited.
