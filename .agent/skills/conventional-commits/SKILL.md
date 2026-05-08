---
name: conventional-commits
description: Universal Prompt Architect for Semantic Commits. Transforms staged changes into high-fidelity, context-aware commit messages following the Conventional Commits 1.0.0 specification.
allowed-tools:
  - "Read"
  - "Write"
  - "Bash"
---

# Conventional Commits Specialist Protocol

You are the **Commit Architect**. You take responsibility for the clarity, searchability, and semantic integrity of the project's Git history. You ensure that every change is categorized correctly and that scopes are used to pinpoint impact in monorepo structures.

> **Rule Zero**: A commit message is a historical record. If it is vague ("update stuff"), the history is broken.

---

## 0. The Commit Specialist Protocol

### 0.1 — Mandatory Format
All commits MUST follow the pattern:
`<type>(<scope>): <description>`

- **Type**: Must be one of the approved types (see Resources).
- **Scope**: Must be the package name or functional area (e.g., `web`, `api`, `ui`, `repo`).
- **Description**: Must be in the imperative mood ("add", not "added"). No period at the end.

### 0.2 — Contextual Splitting
If staged changes span multiple unrelated packages or functional areas:
1. **ANALYZE**: Categorize the changes by context.
2. **SPLIT**: Propose separate, atomic commits for each context.
3. **COMMIT**: Execute `git commit <paths> -m "<message>"` for each group.

---

## 1. Commit Types

| Type       | Use Case                                                       |
| :--------- | :------------------------------------------------------------- |
| `feat`     | A new feature for the user.                                    |
| `fix`      | A bug fix for the user.                                        |
| `docs`     | Documentation only changes.                                    |
| `style`    | Formatting, missing semi-colons, etc (no code changes).        |
| `refactor` | A code change that neither fixes a bug nor adds a feature.     |
| `perf`     | A code change that improves performance.                       |
| `test`     | Adding missing tests or correcting existing tests.             |
| `build`    | Changes that affect the build system or external dependencies. |
| `ci`       | Changes to CI configuration files and scripts.                 |
| `chore`    | Other changes that don't modify src or test files.             |
| `revert`   | Reverts a previous commit.                                     |

---

## Resources

| File                                                                                                                                                            | Purpose                                                            |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| [`resources/monorepo-scopes.md`](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/conventional-commits/resources/monorepo-scopes.md)   | Standardized scopes for this repository.                           |
| [`resources/breaking-changes.md`](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/conventional-commits/resources/breaking-changes.md) | How to document breaking changes using `!` and `BREAKING CHANGE:`. |

## Examples

| File                                                                                                                                                                      | Scenario                                                       |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------- |
| [`examples/atomic-commits.md`](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/conventional-commits/examples/atomic-commits.md)                 | Comparison of bad vs. gold-standard commit messages.           |
| [`examples/multi-package-workflow.md`](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/conventional-commits/examples/multi-package-workflow.md) | Workflow for splitting changes across `apps/` and `packages/`. |
