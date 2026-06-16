# Handoff: Grilling To PRD

Date: 2026-06-15
Source Session: .plan/grilling/2026-06-12-installable-framework-core.md
Status: ready-for-prd
Scope: turn the full framework grilling session into the canonical PRD input for
the installable Ralph Loop framework.

## Starting Point

- This handoff exists because the original grilling session was completed before
  the deterministic handoff workflow was added to the framework.
- The canonical grilling record is:
  `.plan/grilling/2026-06-12-installable-framework-core.md`
- The active grilling pointer should continue to resolve to that file.
- There is already a baseline PRD at:
  `.plan/prds/PRD-v1-installable-ralph-loop-framework-core.md`
  Treat it as an existing artifact to compare against, not as a replacement for
  the grilling session source.

## Stable Decisions

- The live framework workspace is `.plan/`, not `.specify/memory/`.
- The framework must be installable into clean repositories and must not depend
  on symlink-only setup.
- Matt Pocock skills remain external prerequisites and must not be vendored.
- Framework-owned skills are packaged and installed separately from Matt
  Pocock's skill set.
- The default framework-owned skill bundle is:
  `luna-grill-with-docs`, `luna-to-prd`, `luna-to-issues`, `commit`, and
  `code-review`.
- The installer is interactive-first in v1.
- Framework-managed files and workflow-owned files are intentionally separated.
- The workflow uses a single backlog file.
- Run state, run history, and run summary are separate artifacts.
- Cross-session planning phases now depend on repo-local pointers and handoff
  files instead of directory-guessing.
- `luna-grill-with-docs` owns persistent grilling state under `.plan/grilling/`.
- `luna-to-prd` must create the current PRD and the PRD-to-issues handoff.
- `luna-to-issues` must decompose the current PRD into `.plan` epics and task
  files.

## Important Constraints

- Do not reintroduce SpecKit-branded runtime ownership into the Ralph Loop
  framework.
- Do not move Matt Pocock skills into this repository as owned assets.
- Do not flatten the workflow back into root-level prompt or PRD files.
- Keep the PRD grounded in the actual grilling decisions, not in later drift or
  assumptions.
- Preserve the user’s intent that this framework be finished properly, not as a
  shallow starter.

## Open Tensions

- The existing PRD may not fully reflect every locked decision from the full
  grilling record; the next PRD pass should explicitly check for coverage gaps.
- Public GitHub bootstrap validation is still pending.
- Consumer rollout into a real repo is still pending.
- Some runtime automation remains scaffold-level compared with the fully locked
  workflow contract, especially deeper runner-state enforcement.

## PRD Expectations

- The PRD should fully represent the framework contract established in the
  grilling session.
- The PRD should cover the planning chain end to end:
  grilling -> PRD -> issues -> execution.
- The PRD should preserve the ownership boundaries:
  framework-managed assets, workflow-owned state, external prerequisites, and
  framework-owned wrapper skills.
- The PRD should preserve the deterministic cross-session model:
  canonical pointers, durable handoffs, and repo-local planning surfaces.
- The PRD should keep phase continuity explicit enough that another clean
  session can continue without guessing.
- The PRD should treat the existing baseline PRD as a comparison artifact and
  refresh it if coverage gaps are found.

## Recommended Inputs For `luna-to-prd`

- Primary source:
  `.plan/grilling/2026-06-12-installable-framework-core.md`
- Current run summary:
  `.plan/.run-summary.md`
- Existing PRD index:
  `.plan/PRD.md`
- Existing baseline PRD for comparison:
  `.plan/prds/PRD-v1-installable-ralph-loop-framework-core.md`

## Next Step

- Run `luna-to-prd` using this handoff plus the canonical grilling session.
- Compare the generated/refreshed PRD against
  `.plan/prds/PRD-v1-installable-ralph-loop-framework-core.md`.
- If the refreshed PRD is materially better or more complete, make it the new
  `CURRENT` PRD and let `luna-to-issues` decompose from that result.
