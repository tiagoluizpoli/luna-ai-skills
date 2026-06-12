---
name: commit
description: Stage and split changes into contextual commits using Conventional Commits. Use when the user wants to commit the current work cleanly and semantically.
allowed-tools:
  - "Read"
  - "Write"
  - "Bash"
---

# Commit

Use this skill when the user wants to turn the current working tree into one or
more clean commits.

## Workflow

1. Stage all changes with `git add -A`.
2. Inspect the staged file set and group changes by coherent context.
3. Use `conventional-commits` to derive one commit message per group.
4. Present the proposed commit plan before executing it.
5. After approval, commit each group with path-scoped `git commit`.

## Rules

- Prefer multiple atomic commits over one mixed commit.
- Never use `git reset` or `git checkout` to reshuffle staged files.
- If root-level framework files are the main change, prefer `chore(repo)` or a
  more precise repo-level scope.
- If only documentation changed, use `docs(...)`.
- If the user asked for one commit only, still propose the cleanest single
  contextual message you can justify.

## Dependency

This skill depends on `conventional-commits` for message quality and scope
selection.
