# Luna AI Skills Context

Central glossary for terms used in the Luna AI Skills Ecosystem.

## Language

**Ralph Loop**:
An autonomous, iterative, instruction-based execution cycle where the agent reads tasks/prompts and checks specified issues to perform code updates, logging progress to a tracking file. The loop executes for a maximum of 10 iterations per run, stopping early on success or blockages.
_Avoid_: Baton loop, build loop (which specifically refers to the Stitch build loop)

**Prompt MD**:
The markdown file containing task-specific instructions or prompt content, located at the repository root (`/prompt.md`). It supports YAML frontmatter specifying fields like `issueId` and `maxIterations`.
_Avoid_: next-prompt.md

**Prod MD**:
The markdown file containing production specifications, constraints, or configurations (e.g., API endpoints and environment rules), located at the repository root (`/prod.md`).

**Progress TXT**:
The plain text file in the repository root (`/progress.txt`) updated by the Ralph Loop to track execution status. It follows a structured, append-only format recording timestamps, iteration numbers, changes made, and percent completion.

**Issue**:
A specification document located under `.specify/memory/issues/` describing a specific task or bug that the Ralph Loop needs to check and address. The loop targets the issue specified in the frontmatter of `prompt.md`, defaulting to the most recently modified issue file in that directory.

## Example Dialogue

**Developer**: I need to fix the session timeout bug. Should I just write a new script?
**Domain Expert**: No, we should use the **Ralph Loop** for that. First, create an **Issue** in `.specify/memory/issues/` describing the timeout bug.
**Developer**: Got it. Then do I create a **Prompt MD** at the root of the project?
**Domain Expert**: Yes, create `/prompt.md` and set the `issueId` frontmatter to point to the issue you just created. Then specify the task details in the body.
**Developer**: Okay. Do I need to modify `/prod.md` as well?
**Domain Expert**: Only if there are new production environment rules or configurations. The **Ralph Loop** will read **Prod MD** (`/prod.md`) to ensure it doesn't violate any production constraints.
**Developer**: Excellent. Where can I see what the agent is doing during each iteration?
**Domain Expert**: You can watch `/progress.txt`. The agent will write its log and current completion percentage to **Progress TXT** on every iteration until it succeeds or hits the 10-iteration limit.
