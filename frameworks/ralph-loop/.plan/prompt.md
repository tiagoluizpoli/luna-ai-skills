---
issueId: auto
---

# MANDATORY CONTEXT

Read `.plan/RULES.md` first.
Then read `agents.local.md`.
Then read `.plan/PRD.md`.
Then read `.plan/index.md`.

# TASK SELECTION

Pick the next task from `.plan/index.md`.

If there are no more tasks, emit `<promise>NO MORE TASKS</promise>`.

# EXECUTION

Complete only the selected task.

If anything blocks completion, emit `<promise>ABORT</promise>`.

# LOGGING

Write the outcome to `.plan/progress.txt`.
