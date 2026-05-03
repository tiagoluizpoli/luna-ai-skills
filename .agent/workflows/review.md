---
description: Perform a comprehensive code review focusing on Clean Code, SOLID, and the Project Constitution.
---

1.  **Identify Review Scope**
    Determine what to review:
    - If there are **staged changes**, focus the review on those modifications (`git diff --cached`).
    - If no changes are staged, focus on the **active document** or files currently open in the IDE.

2.  **Analyze Staged Changes (if any)**
    // turbo
    Run `git diff --cached` to identify modified lines and files.
    - Group by context (e.g., `packages/ui`, `apps/web`).

3.  **Perform Senior Code Review**
    Apply the [Code Review skill](file:///home/tiagoluizpoli/01-dev-env/templates/base-fullstack-template/.agents/skills/code-review/SKILL.md) to the identified scope.
    - Check for **Clean Code** violations (naming, function length, SRP).
    - Evaluate **SOLID** principle adherence.
    - Verify alignment with [.specify/memory/constitution.md](file:///home/tiagoluizpoli/01-dev-env/templates/base-fullstack-template/.specify/memory/constitution.md).
    - Check for **Next.js/React 19** best practices (Server Components, `use()`, performance).

4.  **Collate Feedback**
    Organize findings into:
    - **CRITICAL**: Blocking issues (bugs, security, constitution violations).
    - **SUGESTED**: Improvements (refactors, naming, performance).
    - **GOOD**: Positive patterns and well-implemented logic.

5.  **Present Review Report**
    Present the feedback as a detailed chat response or markdown artifact. Include specific code examples for suggested refactors.

6.  **Review Resolution**
    - Ask the user if they'd like to apply any of the suggested changes.
    - If relevant, provide a command to apply improvements or fix issues.
