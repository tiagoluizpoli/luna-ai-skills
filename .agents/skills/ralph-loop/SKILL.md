---
name: ralph-loop
description: Executes the Ralph Loop to iteratively read planning files from `.plan/`, apply focused updates, and log iteration progress. Use when the user requests Ralph Loop execution, one-task-per-iteration delivery, or `.plan/`-driven workflow automation.
---

# Ralph Loop

An autonomous, iterative execution cycle where the agent reads tasks/prompts and checks specified issues to perform code updates, logging progress to a tracking file until the issue is resolved.

## Prerequisites

- `/.plan/prompt.md`
- `/.plan/RULES.md`
- `/.plan/PRD.md`
- `/.plan/index.md`
- `/.plan/progress.txt`

## Execution Protocol

### Phase 0: Upfront Permission Gathering (Mandatory First Step)

Before performing work, verify the framework inputs exist and are readable:
1. `/.plan/prompt.md`
2. `/.plan/RULES.md`
3. `/.plan/PRD.md`
4. `/.plan/index.md`
5. `/.plan/progress.txt`

### Phase 1: Read Inputs

1. Parse `/.plan/prompt.md` to extract:
   - Optional YAML frontmatter (e.g. `issueId`, `maxIterations`).
   - The task description/instructions.
2. Read `/.plan/RULES.md` first, then `agents.local.md`, then `/.plan/PRD.md`.
3. Use `/.plan/index.md` to locate the active epic/task file.

### Phase 2: Execute Iteration & Apply Updates

1. Align the prompt instructions, rule set, PRD, and selected task requirements.
2. Make surgical code modifications in the codebase to implement the features or fix the bugs.
3. Validate your changes using existing test suites or manual verification commands.

### Phase 3: Log Progress

After each iteration, write or append a log entry to `/.plan/progress.txt` using the following structured format:
```text
[YYYY-MM-DD HH:MM:SS] Iteration X: [Brief description of changes made]. Status: [Y]% Complete.
```

### Phase 4: Loop Lifecycle & Termination

1. **Max Iterations**: The loop supports a hard limit of **10 iterations** per run.
2. **Check Status**:
   - **Success**: If all requirements from the target Issue are resolved and verified, log a final entry with `Status: 100% Complete` and terminate.
   - **Failure**: If a blocking error occurs or the iteration count reaches 10 without resolution, log a failure message and exit gracefully to prompt the user.

## Example File Templates

### `.plan/prompt.md` Template
```markdown
---
issueId: 0001-setup-authentication.md
---
Implement user session verification and check the issue specifications.
```

### `.plan/progress.txt` Example
```text
[2026-06-02 01:28:00] Iteration 1: Initialized setup and read .plan/RULES.md. Status: 10% Complete.
[2026-06-02 01:30:00] Iteration 2: Added schema validations. Status: 50% Complete.
[2026-06-02 01:35:00] Iteration 3: Fixed login routing. Status: 100% Complete. Loop Terminated.
```
