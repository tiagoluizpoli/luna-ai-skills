# Handoff: PRD To Issues

Date: 2026-06-15
Source PRD: .plan/prds/PRD-v2-installable-ralph-loop-framework-core.md
Status: ready-for-issues
Scope: decompose the installable Ralph Loop framework core PRD into `.plan`
epics and tasks without losing the locked planning-chain and runtime-state
contracts.

## Locked Decisions

- `.plan/` is the live Ralph Loop workspace.
- Matt Pocock skills remain external prerequisites and must not be vendored.
- Framework-managed assets and workflow-owned planning records are separate
  update classes.
- Phase continuity depends on canonical local pointers and durable handoff
  files, not directory scans.
- `luna-grill-with-docs`, `luna-to-prd`, and `luna-to-issues` are framework
  wrappers that preserve the grilling -> PRD -> issues chain.
- Active run families stay small through archival, retrieval, and thin current
  indexes.
- Atomic execution state lives in parseable task-file sub-task blocks, with
  aggregate status derived by helper scripts.

## Decomposition Constraints

- Preserve the planning chain as explicit vertical slices, not as one large
  generic "framework cleanup" epic.
- Keep installer, helper-script/runtime, wrapper-skill, and validation work
  separable where dependencies allow.
- Include tasks for deterministic pointers and handoffs, run-state surfaces,
  retrieval behavior, and task-schema enforcement rather than focusing only on
  installation.
- Keep pending validation work explicit: public bootstrap verification and real
  consumer rollout must remain visible follow-up slices.
- Do not collapse external prerequisite validation and framework-owned skill
  installation into one ownership bucket.

## Out Of Scope

- Vendoring upstream Matt Pocock skills
- Automatic migration from legacy `.specify` layouts in v1
- Uninstall support in v1
- Declaring pending rollout validations complete without performing them

## Next Step

- Run `luna-to-issues` using this handoff plus the canonical PRD.
