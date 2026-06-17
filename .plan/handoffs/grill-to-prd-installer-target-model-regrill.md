# Handoff: Grilling To PRD

Date: 2026-06-17
Source Session: .plan/grilling/2026-06-16-installer-target-model-regrill.md
Status: ready-for-prd
Scope: turn the completed installer target-model re-grill into the canonical PRD input for the Ralph Loop installer redesign and audit-driven fixes.

## Stable Decisions

- The installer v1 is explicitly scoped to the current known matrix: 3 install agents (Hermes, Codex, AGY) and 2 availability scopes (local, global).
- Missing agent+scope pairs inside that 3×2 matrix are bugs/gaps, not acceptable omissions.
- The framework is not installing the agents themselves; it is making Ralph Loop framework assets available for agents that already exist on the machine.
- The interactive install flow should be minimal: ask which agents to target, then ask one run-level availability mode (local or global).
- All framework skills are mandatory in v1; there is no skill-selection prompt.
- The payload is broader than skills only: it includes framework assets, including agent-specific assets such as runner scripts.
- Shared assets and agent-specific assets must be modeled separately; agent-specific assets must only be installed for selected agents.
- Update may default from previously recorded state when trustworthy, but must first show that recorded state and allow explicit override.
- Install should always ask explicitly which agents to target, even if prior state exists.
- Uninstall is out of scope for this branch.
- Internal bookkeeping should exist but stay mostly invisible in normal UX.
- Bookkeeping should track concrete installed assets, including timestamps such as first-installed-at and last-updated-at.
- Global/local availability may differ by asset type, so availability information should live on asset records where needed.
- Audit findings should separate stale wording/UX drift from real behavior or asset-routing bugs.
- Any code path that installs agent-specific assets for unselected agents is a high-severity correctness bug.
- Prompt wording may use "availability mode" where clearer than "scope", while preserving the same underlying local/global concept.

## Open Tensions

- The current implementation and manifests still appear to reflect the older fused-target model (`codex-local`, `hermes-global`) and older skill/bundle-first UX; the PRD should treat those as legacy artifacts to replace.
- Some assets are shared while others are agent-specific; the PRD should be explicit about ownership, routing, and update behavior so implementation does not collapse them back together.
- Asset-level availability behavior may not be uniform; the PRD should preserve that nuance without bloating the user-facing flow.
- The intermediate audit notes were captured before formal session closure and should be treated as comparison context, not as the authoritative spec.

## PRD Expectations

- The PRD should redefine the installer around framework assets for selected agents, not around fused install targets or optional skill bundles.
- The PRD should preserve the minimal install UX: agents first, availability mode second, no skill-selection branch.
- The PRD should specify the full 3×2 supported matrix and require honest handling of every pair.
- The PRD should define internal bookkeeping that supports install/update correctness without surfacing unnecessary complexity in the normal UX.
- The PRD should define update behavior clearly: reuse trustworthy recorded state by default, show it first, and allow override.
- The PRD should explicitly distinguish shared vs agent-specific assets and define that wrong-agent asset routing is a correctness failure.
- The PRD should leave uninstall out of scope for this branch.
- The PRD should use the completed grilling session as the source of truth over older installer assumptions and older grilling decisions.

## Recommended Inputs For `luna-to-prd`

- Primary source:
  `.plan/grilling/2026-06-16-installer-target-model-regrill.md`
- Intermediate comparison notes:
  `.plan/grilling/2026-06-17-installer-audit-notes.md`
- Current installer implementation:
  `frameworks/ralph-loop/installer/src/index.mjs`
- Current installer metadata:
  `frameworks/ralph-loop/skills-manifest.json`
  `frameworks/ralph-loop/framework-files.json`
- Framework docs/context:
  `docs/ralph-loop-framework.md`
  `CONTEXT.md`

## Next Step

- Run `luna-to-prd` using this handoff plus the canonical grilling session.
- Generate or refresh the installer PRD so it matches the locked re-grill decisions.
- Use the PRD to drive the next implementation and review pass against the installer code and manifests.
