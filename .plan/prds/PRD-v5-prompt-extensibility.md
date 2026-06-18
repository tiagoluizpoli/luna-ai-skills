# PRD: Prompt Extensibility

## Problem Statement

The Ralph Loop `prompt.md` is a framework-owned file that must remain intact across every loop execution — it encodes functional runtime requirements that the agent depends on, not optional documentation. However, consuming projects need to add project-specific runtime instructions (verification commands, guardrails, communication style) without touching framework-owned files. Currently the only path is manual post-install editing of `prompt.md`, which diverges from the framework base and gets overwritten on the next update. Consuming projects also have a domain glossary (`CONTEXT.md`) that is created and maintained by grilling sessions, but this file is not formally integrated into the framework's reading order, so the agent may load it inconsistently or not at all.

## Solution

Introduce two formally recognized consumer-owned extension points:

1. **`prompt.local.md`** — a free-form consumer-owned file for project-specific runtime instructions. The base `prompt.md` explicitly reads it at the very end of execution via an "if `prompt.local.md` exists, read it" instruction. Framework loads first; consumer augmentation loads last.

2. **`CONTEXT.md`** — the consumer-owned domain glossary, created and maintained by `grill-with-docs` sessions (via the `domain-modeling` skill). Added to the framework's reading order at a fixed position: after `RULES.md`, before `agents.local.md`, read only if the file exists.

The installer scaffolds both files as starter files with guiding comments on fresh install. On updates, the installer never touches consumer-owned files.

## User Stories

1. As a developer consuming the Ralph Loop framework, I want a dedicated file (`prompt.local.md`) to put project-specific runtime instructions, so that I don't need to modify framework-owned files and my customizations survive framework updates.
2. As a developer, I want to put my verification commands (`bun run test`, `pnpm lint`, etc.) in `prompt.local.md`, so that the agent executes project-specific guardrails on every loop run.
3. As a developer, I want the agent to always load my `prompt.local.md` extensions after the framework base, so that project-specific instructions augment rather than replace framework behavior.
4. As a developer, I want the installer to create a starter `prompt.local.md` with guiding comments on fresh install, so that I discover the extension contract immediately without reading external documentation.
5. As a developer, I want my `prompt.local.md` to be free-form with no enforced structure, so that I can organize project-specific instructions as I see fit.
6. As a developer, I want the installer to never overwrite my `prompt.local.md` on update, so that my customizations are never lost.
7. As a developer, I want my domain glossary (`CONTEXT.md`) formally included in the framework's reading order, so that the agent consistently loads domain vocabulary before acting on tasks.
8. As a developer, I want `CONTEXT.md` read after `RULES.md` and before `agents.local.md`, so that domain terms are available when the agent interprets policy and local context.
9. As a developer, I want the installer to create a starter `CONTEXT.md` with guiding comments on fresh install, so that I know where to build my domain glossary.
10. As a developer, I want the installer to never overwrite my `CONTEXT.md` on update, so that accumulated domain vocabulary is never lost.
11. As a developer, I want a clear file ownership table — which files the installer owns and which I own — so that I understand exactly what is safe to edit.
12. As a developer with an existing project that has custom sections embedded in `prompt.md`, I want a defined migration path for extracting those sections into `prompt.local.md`, so that I can restore `prompt.md` to the framework base and benefit from future updates.

## Implementation Decisions

### 1. File Ownership Table

| File | Owner | Installer behavior on fresh install | Installer behavior on update |
|---|---|---|---|
| `prompt.md` | Framework | Write (full framework base) | Always overwrite |
| `RULES.md` | Consumer | Scaffold starter (guiding comments only) | Never touch |
| `prompt.local.md` | Consumer | Scaffold starter (guiding comments only) | Never touch if exists |
| `CONTEXT.md` | Consumer | Scaffold starter (guiding comments only) | Never touch if exists |
| `agents.local.md` | Consumer (runtime) | Not scaffolded | Never touch |
| Helper scripts | Framework | Write | Always overwrite |
| Framework manifests | Framework | Write | Always overwrite |

Consumer-owned files are those the installer scaffolds on first install but never touches again: `RULES.md`, `prompt.local.md`, `CONTEXT.md`. `agents.local.md` is fully consumer/runtime-managed — the installer never creates or modifies it.

### 2. Updated Reading Order in `prompt.md`

The Mandatory Context section in `prompt.md` replaces the current 7-step list with a 9-step list:

1. `.plan/RULES.md`
2. `CONTEXT.md` if it exists
3. `agents.local.md` if it exists
4. `.plan/PRD.md`
5. `.plan/index.md`
6. current pointer files under `.plan/grilling/`, `.plan/prds/`, and `.plan/handoffs/` when the selected phase depends on them
7. current epic and task files for the selected work
8. `.plan/.run-summary.md`
9. `prompt.local.md` if it exists ← consumer extension, always last

The instruction at the end of `prompt.md` must explicitly state: "If `prompt.local.md` exists at the repo root, read it now."

### 3. `CONTEXT.md` Location

`CONTEXT.md` refers to the repo-root file. The reading order step "if `CONTEXT.md` exists, read it" means the root-level `CONTEXT.md`. A `.plan/CONTEXT.md` mirror may exist in some projects for planning-surface convenience but is not the canonical file — only the root `CONTEXT.md` is part of the framework reading order.

The installer scaffolds `CONTEXT.md` at repo root (same level as `RULES.md` on fresh install is not applicable — `RULES.md` is under `.plan/`; `CONTEXT.md` scaffold goes to repo root).

### 4. Starter File Templates

**`prompt.local.md` starter content:**
```markdown
# Project-Specific Runtime Instructions

<!-- This file is yours. The framework's prompt.md reads it last, after loading all framework context. -->
<!-- Add project-specific runtime instructions here: verification commands, communication style, guardrails. -->
<!-- Example: "After every code change, run: bun run test && bun run check-types" -->
<!-- This file is never overwritten by the framework installer. -->
```

**`CONTEXT.md` starter content:**
```markdown
# Domain Context

<!-- This file is your domain glossary. Add project-specific terms and their precise definitions. -->
<!-- The grill-with-docs skill (via domain-modeling) creates and maintains this file. -->
<!-- The framework reads this file after RULES.md on every loop execution. -->
<!-- This file is never overwritten by the framework installer. -->
```

### 5. `framework-files.json` Classification

`prompt.local.md` and `CONTEXT.md` must NOT appear in `managedFiles` or `workflowOwnedFiles` in `framework-files.json`. They belong in a new `consumerOwnedStarterFiles` (or equivalent) category — scaffolded on fresh install, excluded from update operations. The installer's update logic must explicitly skip files in this category.

### 6. `RULES.md` Stays Consumer-Owned

`RULES.md` currently appears in `managedFiles`, which means the installer overwrites it on update. That conflicts with its consumer-owned status (the framework template already says "Replace this starter content"). The installer must move `RULES.md` from `managedFiles` to the consumer-owned starter category: scaffold on first install only, never overwrite on update.

### 7. Migration Path for Existing Projects

Existing projects (e.g., neighborhood-showcase) that have custom sections embedded in `prompt.md` should:
1. Extract all project-specific sections from `prompt.md` into a new `prompt.local.md` at repo root.
2. Restore `prompt.md` to the unmodified framework base (re-run the installer's update).
3. Verify the agent loads both files correctly.

This is a one-time manual migration. The installer does not automate it.

## Testing Decisions

**What makes a good test here:** tests assert observable installer outputs (which files exist, which files were not overwritten, what their content is) rather than internal installer logic. The seam is the installer's file-system output after a fresh install vs. an update run.

**Modules to test:**

- **Fresh install scaffold**: assert that `prompt.local.md` and `CONTEXT.md` are created with starter content on a clean target directory.
- **Update preserves consumer files**: assert that a pre-existing `prompt.local.md` and `CONTEXT.md` with non-starter content survive an update run unchanged.
- **`framework-files.json` classification**: assert that `prompt.local.md` and `CONTEXT.md` are absent from `managedFiles` and `workflowOwnedFiles`.
- **`RULES.md` not overwritten on update**: assert that a pre-existing `RULES.md` with consumer content survives an update run.

**Prior art:** `frameworks/ralph-loop/installer/tests/index.test.mjs` contains the existing installer behavior tests. New scaffold and update preservation tests follow the same pattern (temp directory, run installer, assert file system state).

## Out of Scope

- Automated migration of existing projects with custom `prompt.md` content.
- Enforced structure or required headings in `prompt.local.md`.
- Multiple consumer extension files beyond `prompt.local.md` and `CONTEXT.md`.
- `.plan/CONTEXT.md` mirror management — root `CONTEXT.md` is canonical; mirrors are consumer-managed and not part of this PRD.
- The `agents.local.md` contract — its scope (machine/session-local) is already established and unchanged.

## Further Notes

- The split between `prompt.local.md` (runtime instructions: commands to run) and `RULES.md` (policy: coding/architectural rules) is intentional. Policy lives in `RULES.md`; the commands that enforce it live in `prompt.local.md`. The two complement each other.
- The reading order places `CONTEXT.md` early (before `agents.local.md`) so domain vocabulary is available when the agent interprets policy and local overrides.
- `prompt.local.md` is placed last so consumer instructions can reference and override anything the framework loaded — it is the final word in the agent's context.
- The `domain-modeling` skill already creates `CONTEXT.md` lazily when the first term resolves in a grilling session. After this PRD, that file has a guaranteed reading-order slot even when the installer scaffolds the empty starter — the agent will simply read an empty (or comment-only) file and continue.
