# Installer Target Model Hardening

## Problem Statement

The Ralph Loop installer no longer matches the locked installer contract from the
finished re-grill. The current implementation still behaves like an older,
fused-target, skills-first installer: it exposes only a narrow target surface,
keeps optional bundle and skill selection in the flow, models install targets as
opaque combined labels, routes framework assets too coarsely, and records state
in a way that is too flat to safely drive update behavior. That drift is now a
correctness problem, not a harmless wording mismatch.

The current branch is a bug-fix planning and execution branch. The goal is not
to preserve outdated assumptions for compatibility theater. The goal is to keep
what is already correct, and replace, remove, or update what is wrong so the
installer follows the strict decisions locked in the latest grilling session.

## Solution

Redefine the installer around the canonical v1 model that the grilling session
finished with: the framework supports three install agents (Hermes, Codex, AGY)
across two availability modes (local and global), all framework skills are
mandatory, and the interactive flow stays minimal by asking only which agents
to target and which run-level availability mode to apply. The installer must
separate shared framework assets from agent-specific assets, install
agent-specific assets only for the selected agents, and treat any wrong-agent
routing as a high-severity bug.

The redesign should preserve correct existing foundations such as the neutral
`.plan/` workspace, external prerequisite validation, and durable installation
metadata, while replacing the obsolete fused-target model, manual skill
selection, incomplete asset coverage, and misleading summaries. Update behavior
should reuse trustworthy recorded state only as a visible default, never as a
silent assumption, and the audit trail should distinguish wording drift from
real behavior bugs.

## User Stories

1. As a framework consumer, I want the installer to support Hermes, Codex, and
   AGY explicitly, so that the advertised install surface matches reality.
2. As a framework consumer, I want local and global availability to exist for
   every supported install agent, so that missing agent-scope pairs are treated
   as real bugs instead of silent omissions.
3. As a framework consumer, I want the installer to ask which agents I use
   first, so that the flow matches my mental model.
4. As a framework consumer, I want the installer to ask for one availability
   mode for the whole run after agent selection, so that the interaction stays
   simple.
5. As a framework consumer, I want all framework skills installed by default in
   v1, so that I do not have to manage a misleading optional skill-selection
   branch.
6. As a framework maintainer, I want obsolete bundle-first and manual skill
   selection surfaces removed from the normal install path, so that the product
   does not preserve known-wrong UX.
7. As a framework consumer, I want the installer to describe its work as making
   framework assets available to my selected agents, so that it does not imply
   the agents themselves are being installed.
8. As a framework maintainer, I want shared framework assets and agent-specific
   assets modeled separately, so that routing logic cannot accidentally install
   the wrong things.
9. As a framework maintainer, I want agent-specific runner scripts treated as
   first-class framework assets, so that installer scope is not reduced to
   skills only.
10. As a framework consumer, I want agent-specific assets installed only for the
    agents I selected, so that multi-agent runs remain correct.
11. As a framework maintainer, I want wrong-agent asset routing classified as a
    high-severity correctness failure, so that the audit can distinguish real
    bugs from wording drift.
12. As a framework consumer, I want install to always ask me which agents to
    target even if previous state exists, so that a new install never hides a
    stale default.
13. As a framework consumer, I want update to show the recorded state it plans
    to reuse before proceeding, so that I can confirm or override it.
14. As a framework consumer, I want update to offer an explicit override path,
    so that convenience does not trap me in a stale selection.
15. As a framework maintainer, I want recorded installer state to track concrete
    installed assets with timestamps and availability details, so that update
    behavior can be correct and auditable.
16. As a framework maintainer, I want availability information stored where the
    asset behavior actually differs, so that the model does not pretend every
    asset follows the same scope rules.
17. As a framework maintainer, I want the manifest, installer planning logic,
    and recorded metadata to describe the same asset model, so that docs, code,
    and runtime state stop drifting apart.
18. As a framework consumer, I want the installer to preserve what is already
    correct about prerequisite validation and `.plan/` ownership boundaries, so
    that this hardening effort does not regress good behavior.
19. As a framework maintainer, I want implementation findings grouped into stale
    wording drift versus real behavior bugs, so that review and execution focus
    on the dangerous mismatches first.
20. As a framework maintainer, I want legacy fused-target assumptions replaced
    rather than carried forward, so that the implementation follows the finished
    grilling session instead of earlier contradictory planning.
21. As a framework consumer, I want uninstall to stay out of scope for this
    branch, so that install and update correctness are fixed before new lifecycle
    surface area is added.
22. As a reviewer, I want the PRD to drive execution against the current code,
    manifests, and framework docs, so that the branch corrects the live system
    instead of producing a detached redesign.

## Implementation Decisions

- The canonical installer model is a 3×2 matrix: three install agents
  (Hermes, Codex, AGY) multiplied by two availability modes (local, global).
  Missing combinations are contract failures.
- Install agent and availability mode are separate domain concepts. The
  implementation may derive concrete destinations from them, but it must not
  collapse the model back into opaque combined target labels as the primary
  source of truth.
- The interactive v1 flow is intentionally minimal: choose agents first, then
  choose one run-level availability mode. Optional framework-skill selection is
  removed from the standard path.
- All framework skills are mandatory in v1. The installer should not preserve a
  user-facing branch for selecting subsets of framework skills.
- The installer payload is broader than skills. It includes framework assets,
  including shared assets plus agent-specific assets such as runner scripts.
- Shared assets and agent-specific assets are distinct internal classes.
  Shared assets may be installed once per repository or per agent environment as
  appropriate. Agent-specific assets must only be installed for selected agents.
- Any implementation path that installs agent-specific assets for an unselected
  agent is a high-severity correctness bug.
- The installer should preserve correct existing boundaries: the framework is
  not installing Hermes, Codex, or AGY themselves. It is making Ralph Loop
  framework assets available for agents that already exist on the machine.
- Existing valid prerequisite validation should remain, but its wording and
  planning output must align with the broader framework-asset model instead of a
  skills-only story.
- Installation state must become rich enough to drive correct updates. Recorded
  state should track concrete installed assets, selected agents, timestamps such
  as first-installed-at and last-updated-at, and availability details where
  asset behavior differs by type.
- Asset-level availability behavior may vary. The data model should allow that
  nuance instead of forcing every asset into one oversimplified scope rule.
- Update may default from previously recorded state only when that state is
  trustworthy. Before applying it, the installer must show the planned reuse and
  allow explicit confirmation or override.
- Install should always ask explicitly which agents to target, even when prior
  state exists.
- The implementation audit and the resulting execution plan should categorize
  findings into at least two buckets: wording or UX drift versus real behavior,
  routing, or data-model bugs.
- Legacy fused-target assumptions, bundle-first flow, and outdated optional
  bundle metadata should be treated as legacy artifacts to replace or remove,
  not as stable compatibility requirements.
- The manifest, planner, and metadata writer must be aligned around the same
  asset-routing contract so that the runtime state and future audits reflect the
  same truth.
- This branch should preserve correct existing behavior where it already matches
  the locked contract, and replace or remove only the surfaces that contradict
  that contract.
- Uninstall remains explicitly out of scope for this branch.

## Testing Decisions

- Good tests validate external behavior and durable installer outcomes, not
  implementation trivia.
- The hardening work should introduce behavior-focused verification for the full
  3×2 agent-by-availability matrix, including both install and update paths.
- Coverage should include invalid automation inputs and manifest mismatches,
  because the current branch is explicitly fixing correctness drift in live code.
- Tests should verify that the interactive plan is agents-first, availability-
  second, and free of manual framework-skill selection in the normal v1 flow.
- Tests should verify that all mandatory framework skills are installed without a
  subset-selection branch.
- Tests should verify shared-versus-agent-specific asset routing, especially
  that unselected agents never receive agent-specific assets.
- Tests should verify runner scripts are treated as first-class framework assets
  and appear in the install/update bookkeeping.
- Tests should verify recorded state reuse on update: trustworthy state is shown
  first, can be confirmed, and can be overridden.
- Tests should verify recorded metadata captures concrete installed assets,
  timestamps, selected agents, and relevant availability details.
- Tests should distinguish wording-only drift from behavior bugs in the audit or
  review workflow, so that correctness regressions are not hidden inside UX-only
  findings.
- Throwaway-repository or equivalent end-to-end verification remains mandatory
  prior art for installer changes, because the contract is about real install
  behavior against a live repository.
- No verification plan should rely on skipped tests for missing seed state or
  missing matrix cases; if the matrix is supported, the test harness must create
  what it needs and execute the case.
- Because this repo does not currently provide a dedicated installer test suite
  for these re-grilled decisions, execution should add the missing coverage as
  part of the hardening work rather than deferring it.

## Out of Scope

- Installing the Hermes, Codex, or AGY products themselves
- Reintroducing manual framework-skill selection in v1
- Treating missing matrix pairs as acceptable interim omissions
- Preserving the old fused-target model as the primary contract
- Adding uninstall support in this branch
- Expanding into unrelated framework migrations that were explicitly ruled out
  during the grilling session
- Keeping outdated docs, metadata, or prompts solely for backward-looking
  wording continuity when they contradict the locked installer model

## Further Notes

- This PRD supersedes the earlier framework-core PRD for the installer branch by
  making the finished installer re-grill the authoritative truth.
- The latest grilling session is the canonical design authority for this branch;
  earlier contradictory assumptions are legacy context only.
- Execution against the current installer code should keep what is already right
  and replace, remove, or update what is wrong until the code, manifests,
  metadata, and docs agree on the same installer contract.
