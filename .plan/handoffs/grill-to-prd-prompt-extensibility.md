# Handoff: Grilling To PRD

Date: 2026-06-18
Source Session: .plan/grilling/2026-06-18-prompt-extensibility.md
Status: ready-for-prd
Scope: Make the Ralph Loop prompt and framework context extensible by consuming projects without touching framework-owned files

## Stable Decisions

- **`prompt.md` is framework-owned and immutable.** Its content is a functional runtime requirement — must be present in the agent's context every Ralph Loop execution.

- **`prompt.local.md` is the consumer extension file.** Free-form markdown. The base `prompt.md` reads it at the very end with "if `prompt.local.md` exists, read it." Consumer puts verification commands, communication style, and any other project-specific runtime instructions here.

- **`CONTEXT.md` is the domain glossary.** Consumer-owned. Read at fixed position in the reading order (after RULES.md, before `agents.local.md`). Created and maintained by `grill-with-docs` sessions (via the `domain-modeling` skill). Not mandatory — read only if it exists.

- **`RULES.md` stays consumer-owned for architectural policy.** Guardrail *commands* (actual script names like `bun run test`, `pnpm lint`) go in `prompt.local.md`. Policy ("type-check after every change") stays in `RULES.md`. The two complement each other.

- **`agents.local.md` scope unchanged.** Machine/session-local context only. Not for project-wide guardrails.

- **Installer scaffolds both `prompt.local.md` and `CONTEXT.md` as starter files** with guiding comments so consumers discover the contract immediately.

- **Installer never touches consumer-owned files on update.** Hard rule. Consumer files: `prompt.local.md`, `CONTEXT.md`, `RULES.md`, `agents.local.md`. Framework files: `prompt.md`, helper scripts, manifests.

- **Updated reading order in `prompt.md`:**
  1. `.plan/RULES.md`
  2. `CONTEXT.md` if it exists
  3. `agents.local.md` if it exists
  4. `.plan/PRD.md`
  5. `.plan/index.md`
  6. current pointer files under `.plan/grilling/`, `.plan/prds/`, `.plan/handoffs/` when relevant
  7. current epic and task files
  8. `.plan/.run-summary.md`
  9. `prompt.local.md` if it exists ← always last

## Open Tensions

- **Migration for existing projects** (e.g., neighborhood-showcase) that already have project-specific sections embedded in `prompt.md`: the PRD should note that these projects should extract their custom sections into `prompt.local.md` and restore `prompt.md` to the framework base. This is a one-time manual migration, not an automated installer step.

- **`CONTEXT.md` location ambiguity**: neighborhood-showcase has both `/CONTEXT.md` (root) and `.plan/CONTEXT.md` (mirror). The reading order step says "if `CONTEXT.md` exists, read it" — the PRD should clarify whether this means the root file, the `.plan/` mirror, or both. Likely: root is canonical, `.plan/CONTEXT.md` is optional mirror for planning-surface convenience.

## PRD Expectations

- The PRD must define the **file ownership table** clearly: which files the installer owns (never modified by consumer) and which files the consumer owns (never overwritten by installer).
- The PRD must specify the **exact wording** of the new `prompt.md` instruction at the end (the `prompt.local.md` inclusion hook).
- The PRD must specify the **starter file templates** for both `prompt.local.md` and `CONTEXT.md` (what guiding comments they contain on first scaffold).
- The PRD must specify the **exact updated reading order** (the 9-step list above) as a replacement for the current Mandatory Context section in `prompt.md`.
- The PRD should address the **migration path** for existing projects.

## Next Step

- Run `luna-to-prd` using this handoff plus `.plan/grilling/2026-06-18-prompt-extensibility.md`.
