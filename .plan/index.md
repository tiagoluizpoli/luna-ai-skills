# Index

> Read this file before any work.
> This is a derived navigation surface. The canonical execution state lives in
> task-file sub-task blocks. Aggregate status must be synchronized by
> `.plan/helper-scripts/sync-state.sh`.

## Current Run Family

- Current PRD: `.plan/prds/PRD-v4-claude-provider-and-skills-installer-refactor.md`
- Current PRD pointer: `.plan/prds/.current-prd`
- Current grilling pointer: `.plan/grilling/.current-session`
- Current grill handoff pointer: `.plan/handoffs/.current-grill-handoff`
- Current PRD handoff pointer: `.plan/handoffs/.current-prd-handoff`
- Active summary: `.plan/.run-summary.md`
- Last archived family: `none`

## Grilling Sessions

- [2026-06-12 Framework Grill](.plan/grilling/2026-06-12-installable-framework-core.md)
- [2026-06-17 Claude Provider Grill](.plan/grilling/2026-06-17-claude-provider-and-skills-installer-refactor.md)

## PRD History

| Status | Version | Title | File | Canonical Record | Date |
| --- | --- | --- | --- | --- | --- |
| SUPERSEDED | v1 | Installable Ralph Loop Framework Core | `.plan/prds/PRD-v1-installable-ralph-loop-framework-core.md` | `.plan/prds/PRD-v1-installable-ralph-loop-framework-core.md` | 2026-06-13 |
| SUPERSEDED | v2 | Installable Ralph Loop Framework Core | `.plan/prds/PRD-v2-installable-ralph-loop-framework-core.md` | `.plan/prds/PRD-v2-installable-ralph-loop-framework-core.md` | 2026-06-15 |
| SUPERSEDED | v3 | Installer Target Model Hardening | `.plan/prds/PRD-v3-installer-target-model-hardening.md` | `.plan/prds/PRD-v3-installer-target-model-hardening.md` | 2026-06-17 |
| CURRENT | v4 | Claude Provider Integration & Skills Installer Refactor | `.plan/prds/PRD-v4-claude-provider-and-skills-installer-refactor.md` | `.plan/prds/PRD-v4-claude-provider-and-skills-installer-refactor.md` | 2026-06-17 |

## Epics

| Epic ID | Epic | Status | Blocked By | File |
| --- | --- | --- | --- | --- |
| E-01 | Framework Contract And Starter | done | — | `.plan/epics/01-framework-contract/epic.md` |
| E-02 | Skill Packaging And Ownership | done | — | `.plan/epics/02-skill-packaging/epic.md` |
| E-03 | Installer And Verification | done | — | `.plan/epics/03-installer-and-verification/epic.md` |
| E-04 | Rollout And Runtime Hardening | done | — | `.plan/epics/04-rollout-and-hardening/epic.md` |
| E-05 | Installer Selection Contract | done | — | `.plan/epics/05-installer-selection-contract/epic.md` |
| E-06 | Asset And Ownership Contract | done | — | `.plan/epics/06-asset-and-ownership-contract/epic.md` |
| E-07 | Update State Contract | done | — | `.plan/epics/07-update-state-contract/epic.md` |
| E-08 | Verification And Reconciliation | done | — | `.plan/epics/08-verification-and-reconciliation/epic.md` |
| E-09 | Claude Provider Integration & Skills Installer Refactor | in-progress | — | `.plan/epics/09-claude-provider-and-installer-refactor/epic.md` |

## Tasks

| Task ID | Epic ID | Task | Status | Blocked By | File |
| --- | --- | --- | --- | --- | --- |
| T-01 | E-01 | Define the `.plan` workspace contract | done | — | `.plan/epics/01-framework-contract/tasks/01-plan-workspace-contract.md` |
| T-02 | E-01 | Add runtime state and helper-script surfaces | done | — | `.plan/epics/01-framework-contract/tasks/02-runtime-state-and-helper-scripts.md` |
| T-03 | E-01 | Align framework docs and runners | done | — | `.plan/epics/01-framework-contract/tasks/03-docs-and-runner-alignment.md` |
| T-04 | E-02 | Create the `commit` skill from workflow guidance | done | — | `.plan/epics/02-skill-packaging/tasks/01-create-commit-skill.md` |
| T-05 | E-02 | Rename the `.plan` issue wrapper to `luna-to-issues` | done | — | `.plan/epics/02-skill-packaging/tasks/02-plan-based-to-epic-issues.md` |
| T-06 | E-02 | Add skill bundles and dependency metadata | done | — | `.plan/epics/02-skill-packaging/tasks/03-skill-manifest-and-bundles.md` |
| T-13 | E-02 | Create the `luna-to-prd` wrapper skill | done | — | `.plan/epics/02-skill-packaging/tasks/04-create-luna-to-prd-skill.md` |
| T-14 | E-02 | Create the `luna-grill-with-docs` wrapper skill | done | — | `.plan/epics/02-skill-packaging/tasks/05-create-luna-grill-with-docs-skill.md` |
| T-07 | E-03 | Build bootstrap and Node installer | done | — | `.plan/epics/03-installer-and-verification/tasks/01-build-installer.md` |
| T-08 | E-03 | Verify install, update, and adoption on clean local repos | done | — | `.plan/epics/03-installer-and-verification/tasks/02-local-verification.md` |
| T-09 | E-03 | Validate the public GitHub bootstrap path | done | — | `.plan/epics/03-installer-and-verification/tasks/03-public-bootstrap-validation.md` |
| T-10 | E-04 | Apply the framework to a real consumer repository | done | — | `.plan/epics/04-rollout-and-hardening/tasks/01-consumer-repo-rollout.md` |
| T-11 | E-04 | Harden helper scripts into richer automation | done | — | `.plan/epics/04-rollout-and-hardening/tasks/02-helper-script-hardening.md` |
| T-12 | E-04 | Wire the full runner state machine to the new contract | done | — | `.plan/epics/04-rollout-and-hardening/tasks/03-runner-state-machine.md` |
| T-15 | E-04 | Add deterministic phase handoffs and planning pointers | done | — | `.plan/epics/04-rollout-and-hardening/tasks/04-deterministic-phase-handoffs.md` |
| T-16 | E-05 | Installer selection contract: agents first, one availability mode, no manual skill-selection path | done | — | `.plan/epics/05-installer-selection-contract/tasks/01-installer-selection-contract.md` |
| T-17 | E-06 | Asset routing contract: shared vs agent-specific assets | done | — | `.plan/epics/06-asset-and-ownership-contract/tasks/01-asset-routing-contract.md` |
| T-18 | E-06 | Install ownership and starter manifest alignment | done | — | `.plan/epics/06-asset-and-ownership-contract/tasks/02-install-ownership-and-starter-manifest-alignment.md` |
| T-19 | E-07 | Update-state hardening: rich metadata, visible reuse, explicit override | done | — | `.plan/epics/07-update-state-contract/tasks/01-update-state-hardening.md` |
| T-20 | E-08 | Verification and documentation reconciliation against the hardened installer | done | — | `.plan/epics/08-verification-and-reconciliation/tasks/01-verification-and-documentation-reconciliation.md` |
| T-21 | E-09 | Register Claude Agent and Runner Script Assets | done | — | `.plan/epics/09-claude-provider-and-installer-refactor/tasks/01-register-claude-assets-and-targets.md` |
| T-22 | E-09 | Refactor Installer to Prompt in Bulk with Multi-select List | done | — | `.plan/epics/09-claude-provider-and-installer-refactor/tasks/02-bulk-overwrite-multiselect-prompt.md` |
| T-23 | E-09 | Retain Metadata and Verification Testing | ready | T-22 | `.plan/epics/09-claude-provider-and-installer-refactor/tasks/03-metadata-retention-and-testing.md` |
