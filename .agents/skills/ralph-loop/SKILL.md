---
name: ralph-loop
description: Executes the Ralph Loop to iteratively read prompts and production rules, check specified issues, apply updates, and log progress to progress.txt. Use when the user requests executing a Ralph Loop, running iteration cycles, or resolving issues via prompt.md.
---

# Ralph Loop

An autonomous, iterative execution cycle where the agent reads tasks/prompts and checks specified issues to perform code updates, logging progress to a tracking file until the issue is resolved.

## Prerequisites

- `/prompt.md` located in the root of the repository.
- `/prod.md` located in the root of the repository.
- `.specify/memory/issues/` directory containing the target issue files.
- `/progress.txt` located in the root of the repository.

## Execution Protocol

### Phase 0: Upfront Permission Gathering (Mandatory First Step)

Before performing any read or write operation, you **MUST** call `ask_permission` upfront for all target resources in a single step to prevent repeated interrupts:
1. **Read Access**:
   - `/prompt.md`
   - `/prod.md`
   - `/home/tiago/01-dev-env/personal-repos/luna-ai-skills/.specify/memory/issues/`
2. **Write Access**:
   - `/progress.txt`
   - `/home/tiago/01-dev-env/personal-repos/luna-ai-skills/` (for updating code/issues)

### Phase 1: Read Inputs

1. Parse `/prompt.md` to extract:
   - Optional YAML frontmatter (e.g. `issueId`, `maxIterations`).
   - The task description/instructions.
2. Identify the target **Issue** in `.specify/memory/issues/`:
   - Use the `issueId` from the `prompt.md` frontmatter if provided.
   - If not provided, locate and read the most recently modified markdown file inside `.specify/memory/issues/`.
3. Read the production constraints in `/prod.md`.

### Phase 2: Execute Iteration & Apply Updates

1. Align the prompt instructions and target Issue requirements.
2. Make surgical code modifications in the codebase to implement the features or fix the bugs.
3. Validate your changes using existing test suites or manual verification commands.

### Phase 3: Log Progress

After each iteration, write or append a log entry to `/progress.txt` using the following structured format:
```text
[YYYY-MM-DD HH:MM:SS] Iteration X: [Brief description of changes made]. Status: [Y]% Complete.
```

### Phase 4: Loop Lifecycle & Termination

1. **Max Iterations**: The loop supports a hard limit of **10 iterations** per run.
2. **Check Status**:
   - **Success**: If all requirements from the target Issue are resolved and verified, log a final entry with `Status: 100% Complete` and terminate.
   - **Failure**: If a blocking error occurs or the iteration count reaches 10 without resolution, log a failure message and exit gracefully to prompt the user.

## Example File Templates

### `prompt.md` Template
```markdown
---
issueId: 0001-setup-authentication.md
---
Implement user session verification and check the issue specifications.
```

### `progress.txt` Example
```text
[2026-06-02 01:28:00] Iteration 1: Initialized setup and read prod.md rules. Status: 10% Complete.
[2026-06-02 01:30:00] Iteration 2: Added schema validations. Status: 50% Complete.
[2026-06-02 01:35:00] Iteration 3: Fixed login routing. Status: 100% Complete. Loop Terminated.
```
