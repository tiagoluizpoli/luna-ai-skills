# Installer Bug Audit

Date: 2026-06-16
Scope: Ralph Loop installation process
Reviewer: Hermes + code-review cross-check

## Why this file lives here

This bug list is stored under `.plan/summaries/` because it is:
- durable implementation evidence worth keeping,
- not yet approved decomposition work,
- a good upstream source for a later PRD / epic / task breakdown.

Recommended workflow from here:
1. review / amend this audit,
2. decide whether it becomes a hardening PRD addendum or a new PRD,
3. decompose approved items into epics/tasks under `.plan/epics/`.

## Executive Summary

The installer matches the framework directionally, but it does not fully satisfy
its own rollout and hardening criteria yet.

Strong areas:
- external prerequisites remain external,
- framework-owned skills install separately,
- update/adopt mostly preserve workflow-owned state.

Main gaps:
- invalid CLI args crash instead of failing cleanly,
- clean install ignores the declared managed/workflow-owned file contract,
- target selection is narrower than the intended multi-agent install surface,
- docs and plan state drift from what the code really guarantees.

Out of scope for this audit after user clarification:
- legacy root-file / `.specify/memory` migration is intentionally manual and
  should not be treated as an installer bug in the current contract.

## Bug List

### BUG-001 — Invalid bundle argument crashes installer

Severity: high
Status: open
Area: installer CLI / automation safety

Criteria violated:
- PRD v2 requires concrete, auditable dependency behavior and a usable install
  surface: `.plan/prds/PRD-v2-installable-ralph-loop-framework-core.md:28-32,
  107-110, 141-145`
- Public/bootstrap and verification tasks imply real-path robustness rather than
  syntax-only success: `.plan/epics/03-installer-and-verification/tasks/02-local-verification.md:12-26`,
  `.plan/epics/03-installer-and-verification/tasks/03-public-bootstrap-validation.md:12-25`

Evidence:
- `frameworks/ralph-loop/installer/src/index.mjs:293-317`
- Real reproduction in throwaway repo:
  - command: `node .../index.mjs --yes --bundles nope --targets codex-local ...`
  - output: `Cannot read properties of undefined (reading 'skills')`

Why this is a bug:
- A typo in `--bundles` causes a raw JS exception instead of a controlled,
  user-facing validation error.
- This makes the non-interactive path brittle and hard to trust in automation.

Recommended fix:
- Validate every bundle id before dereferencing it.
- Fail with a clear message listing valid bundle ids.
- Add a verification case for invalid bundle handling.

---

### BUG-002 — Invalid target argument crashes installer

Severity: high
Status: open
Area: installer CLI / automation safety

Criteria violated:
- Same robustness criteria as BUG-001.
- Target selection is part of the install contract: namespaced targets are a
  documented surface in `.plan/prds/PRD-v2-installable-ralph-loop-framework-core.md:104-110`
  and `.plan/.run-summary.md:17-19`.

Evidence:
- `frameworks/ralph-loop/installer/src/index.mjs:132-140`
- `frameworks/ralph-loop/installer/src/index.mjs:368-394`
- Real reproduction in throwaway repo:
  - command: `node .../index.mjs --yes --bundles ralph-loop-core --targets made-up-target ...`
  - output: `Cannot read properties of undefined (reading 'replace')`

Why this is a bug:
- A typo in `--targets` crashes during path-template resolution.
- This is another raw exception on the automation path.

Recommended fix:
- Validate target ids before use.
- Reject unsupported targets with a friendly error and list valid targets.
- Add a verification case for invalid target handling.

---

### BUG-003 — Fresh install copies files outside the declared framework contract

Severity: high
Status: open
Area: install/update ownership boundary

Criteria violated:
- PRD v2 says install/update behavior must preserve explicit boundaries between
  framework-managed and workflow-owned files:
  `.plan/prds/PRD-v2-installable-ralph-loop-framework-core.md:18-20, 38-42, 100-103, 143-145`
- Framework README documents a managed vs workflow-owned split:
  `frameworks/ralph-loop/README.md:35-61`

Evidence:
- Fresh install path copies the whole starter tree:
  `frameworks/ralph-loop/installer/src/index.mjs:492-493`
- Canonical manifest only declares selected files:
  `frameworks/ralph-loop/framework-files.json:1-45`
- Real clean-install result included undeclared placeholder content:
  - `.plan/prds/PRD-v1-replace-me.md`
  - `.plan/epics/01-replace-me/epic.md`
  - `.plan/epics/01-replace-me/tasks/01-replace-me.md`

Why this is a bug:
- Clean install and update do not obey the same source-of-truth contract.
- The manifest is not actually authoritative for a first install.
- Placeholder content is being installed whether or not the contract intended it.

Recommended fix:
- Make clean install use the manifest instead of `copyDirectory(sourcePlanDir, targetPlanDir)`.
- Decide explicitly whether placeholder PRD/epic/task files belong in the
  shipped contract.
- If they do belong, add them to the manifest and docs. If they do not, stop
  shipping them on install.

---

### BUG-004 — `.framework-install.json` ownership is inconsistently modeled

Severity: medium
Status: open
Area: metadata contract / ownership model

Criteria violated:
- PRD v2 requires durable installation metadata and explicit ownership:
  `.plan/prds/PRD-v2-installable-ralph-loop-framework-core.md:109-110`

Evidence:
- Metadata is always written by the installer:
  `frameworks/ralph-loop/installer/src/index.mjs:576-596`
- Root README says it records `.plan/.framework-install.json`:
  `README.md:30-37`
- Framework README treats it as framework-managed:
  `frameworks/ralph-loop/README.md:37-45`
- But `frameworks/ralph-loop/framework-files.json:1-45` does not list it under
  `managedFiles`.
- Real install manifest check showed:
  - `MANIFEST_MANAGED_HAS_INSTALL_JSON=false`

Why this is a bug:
- The docs/code behavior say the file is framework-owned.
- The canonical manifest does not.
- That undermines the ownership model and drift resolution story.

Recommended fix:
- Add `.plan/.framework-install.json` to `managedFiles`, or
- redefine/document it as a special generated artifact outside the manifest.
- Pick one model and align code + docs + manifest.

---

### BUG-005 — Target matrix is narrower than the intended multi-agent install contract

Severity: high
Status: open
Area: install targets / agent coverage

Criteria violated:
- Grilling locked in that install support must be agent-aware:
  `.plan/grilling/2026-06-12-installable-framework-core.md:645-669`
- Grilling also locked in namespaced local/global storage plus multi-target
  installs:
  `.plan/grilling/2026-06-12-installable-framework-core.md:1059-1127, 1142-1161`
- Current user clarification supersedes the earlier narrow v1 matrix: local and
  global installs should cover both Hermes and the Codex/AGY family, rather
  than exposing only Codex-local and Hermes-global.

Evidence:
- Interactive target picker exposes only two options:
  `frameworks/ralph-loop/installer/src/index.mjs:357-365`
  - `codex-local`
  - `hermes-global`
- Skill manifest only supports those same two targets for every skill:
  `frameworks/ralph-loop/skills-manifest.json:53-60, 72-79, 91-98, 110-117,
  129-136` (same pattern repeated through the file)
- There is no target path model for:
  - Hermes repo-local
  - Codex global
  - AGY repo-local
  - AGY global

Why this is a bug:
- The installer currently hardcodes a two-target matrix that does not cover the
  broader multi-agent install surface the user wants.
- This creates an asymmetric UX:
  - local is effectively Codex-only
  - global is effectively Hermes-only
- That is inconsistent with the desired contract where local/global choices
  should apply coherently across Hermes and the Codex/AGY family.

Recommended fix:
- Define the target matrix explicitly in the manifest and installer UI.
- Add target entries for the approved local/global combinations.
- Separate "agent family" from "scope" (`local` vs `global`) so the model is
  extensible instead of baking policy into target ids like `codex-local`.
- Update docs and verification coverage to reflect the approved matrix.

---

### BUG-006 — Prerequisite validation docs overstate what is actually checked

Severity: medium
Status: open
Area: docs vs implementation

Criteria violated:
- PRD v2 requires named external prerequisite validation:
  `.plan/prds/PRD-v2-installable-ralph-loop-framework-core.md:28-32, 102-103`

What passes:
- The implementation does validate named external prerequisites and abort if
  they are missing.

Where it drifts:
- README says the installer validates the "Matt Pocock prerequisite skill set":
  `README.md:30-33`
- In reality, it checks only the named prerequisites referenced by selected
  skills:
  `frameworks/ralph-loop/skills-manifest.json:48-103`
- Lookup is hardcoded to a few filesystem locations:
  `frameworks/ralph-loop/installer/src/index.mjs:102-109, 408-412`

Why this is a bug:
- The code is narrower than the docs imply.
- It may false-fail if a valid install layout exists outside the hardcoded
  search paths.

Recommended fix:
- Reword docs to say it validates named required skills, not a whole upstream
  skill set.
- Or broaden discovery so the stronger doc claim becomes true.

---

### BUG-007 — Public bootstrap validation trail is inconsistent

Severity: medium
Status: open
Area: verification history / documentation integrity

Criteria violated:
- PRD v2 says public bootstrap validation should not be treated as complete
  before it actually happens:
  `.plan/prds/PRD-v2-installable-ralph-loop-framework-core.md:135-137, 166-167`

Evidence:
- Current public endpoints now resolve:
  - `raw_master=200`
  - `raw_main=404`
  - `codeload_master=200`
- README documents the public bootstrap on `master`:
  `README.md:16-27`
- But the task file still has unchecked acceptance criteria:
  `.plan/epics/03-installer-and-verification/tasks/03-public-bootstrap-validation.md:20-25`
- The same task file also contains notes saying it was completed with
  `GITHUB_TOKEN` against a private-repo flow:
  `.plan/epics/03-installer-and-verification/tasks/03-public-bootstrap-validation.md:57-59`
- `.plan/.run-summary.md:23-25` still says public bootstrap validation is
  pending and endpoints return 404, which is stale.

Why this is a bug:
- The evidence trail contradicts itself.
- A future agent or human cannot tell what was really validated.

Recommended fix:
- Re-run and record one canonical public-bootstrap verification path.
- Update the task acceptance boxes, progress, and run summary to match the same
  truth.
- Remove contradictory stale blocker language.

---

### BUG-008 — Consumer rollout status is stale across framework docs

Severity: medium
Status: open
Area: planning/documentation consistency

Criteria violated:
- The framework needs durable, auditable planning state.
- Completed rollout work should not remain marked as pending in adjacent
  framework docs.

Evidence:
- Consumer rollout task says migration/install/verification happened:
  `.plan/epics/04-rollout-and-hardening/tasks/01-consumer-repo-rollout.md:20-27, 53-65`
- But `docs/ralph-loop-framework.md:207-215` still lists first consumer
  migration as unfinished.

Why this is a bug:
- The repo now contains two incompatible truths about rollout status.
- This will mislead future decomposition and maintenance work.

Recommended fix:
- Update `docs/ralph-loop-framework.md` so it reflects the completed rollout,
  or clearly mark the remaining gap as a separate hardening/migration follow-up.

## Suggested future decomposition slices

If you later want to turn this into work, a clean split would be:
- Slice A: CLI validation hardening (`BUG-001`, `BUG-002`)
- Slice B: install-manifest contract alignment (`BUG-003`, `BUG-004`)
- Slice C: target-matrix expansion and agent-aware install coverage (`BUG-005`)
- Slice D: docs / evidence trail reconciliation (`BUG-006`, `BUG-007`, `BUG-008`)

## Notes on review quality

- A code-review sub-pass initially produced one false positive claiming the
  legacy runner scripts were missing.
- That claim was manually rechecked and rejected because these files do exist:
  - `ralph-loop-agy.sh`
  - `ralph-loop-codex.sh`
  - `ralph-loop-hermes.sh`
- The bug list above excludes that false positive.
