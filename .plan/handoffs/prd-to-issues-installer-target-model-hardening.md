# Handoff: PRD To Issues

Date: 2026-06-17
Source PRD: .plan/prds/PRD-v3-installer-target-model-hardening.md
Status: ready-for-issues
Scope: decompose the installer target-model hardening PRD into execution slices
that correct the live installer, manifests, metadata, and docs to match the
finished re-grill.

## Locked Decisions

- The installer v1 supports exactly three install agents: Hermes, Codex, and
  AGY.
- The installer v1 supports exactly two availability modes: local and global.
- The full 3×2 matrix is mandatory; missing agent-scope pairs are bugs.
- Install agent and availability mode are separate concepts and must not be
  modeled primarily as opaque fused target labels.
- The interactive v1 flow is agents first, then one run-level availability
  choice.
- All framework skills are mandatory in v1; remove manual framework-skill
  selection from the normal path.
- The installer payload includes framework assets beyond skills, including
  agent-specific runner scripts.
- Shared assets and agent-specific assets must be modeled separately.
- Agent-specific assets must only be installed for selected agents.
- Wrong-agent asset routing is a high-severity correctness bug.
- Update may reuse trustworthy recorded state by default, but must show it
  first and allow explicit override.
- Install must always ask explicitly which agents to target.
- Uninstall is out of scope for this branch.

## Decomposition Constraints

- Break the work into vertical slices that fix the live system, not into vague
  documentation-only cleanup.
- Preserve correct existing behavior such as external prerequisite validation
  and the neutral `.plan/` workspace where they already match the locked
  contract.
- Separate model correction, asset-routing correction, update-state correction,
  metadata correction, and docs/audit reconciliation where dependencies allow.
- Include test work in every relevant slice; matrix coverage and wrong-agent
  routing checks are mandatory.
- Treat removal of obsolete bundle-first or skills-first flow as real execution
  work, not as optional polish.
- Keep wording drift distinct from behavior bugs so the execution order can
  prioritize correctness failures first.

## Out Of Scope

- Installing the agents themselves
- Uninstall support
- Reopening the finished grilling decisions unless new evidence proves a locked
  decision is impossible
- Preserving fused-target legacy behavior as a compatibility goal

## Next Step

- Run `luna-to-issues` using this handoff plus the canonical PRD.
