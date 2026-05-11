---
description: Stage all changes and commit contextually using Conventional Commits.
---

1.  **Stage All Changes**
    // turbo
    Run `git add -A` to ensure all modifications, new files, and deletions are staged.

2.  **Analyze Staged Changes**
    Identify which files have been staged and categorize them by context (e.g., `apps/web`, `packages/ui`, etc.).

3.  **Propose Contextual Commits**
    For each context identified, suggest a semantic commit message based on the [Conventional Commits skill](file:///home/tiagoluizpoli/01-dev-env/templates/base-fullstack-template/.agents/skills/conventional-commits/SKILL.md).
    - If multiple packages are modified, suggest separate commits for each.
    - If there are root files modified, suggest a `chore(repo)` or `build` commit.

4.  **Confirm and Execute**
    Present the proposed commits to the user. For each approved commit:
    // turbo
    Run `git commit <paths> -m "<message>"` for the specific files in that context.
    - **CRITICAL**: Do NOT use `git reset` or `git checkout` to clear the staging area. Selective committing by path will leave remaining files staged until their turn.

5.  **Finalize**
    Confirm that all staged changes have been committed. If any files remain staged, notify the user.
