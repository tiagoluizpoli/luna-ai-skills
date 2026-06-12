# Luna AI Skills Context

Central glossary for terms used in the Luna AI Skills Ecosystem.

## Language

**Ralph Loop**:
An autonomous, iterative execution cycle where the agent selects the next executable sub-task from the active planning workspace, retrieves relevant context, performs implementation, verifies the result, and records runtime state plus durable history.
_Avoid_: Baton loop, build loop (which specifically refers to the Stitch build loop)

**Ralph Loop Framework**:
The reusable workflow built in this repository around Ralph Loop. It depends on Matt Pocock's shared skills as an external prerequisite and installs its own `.plan/` workspace, runner scripts, wrapper skills, and helper scripts on top.

**Framework-Managed File**:
A file owned by the Ralph Loop framework installation and safe to refresh from this repository during update. Examples include `.plan/prompt.md`, `.plan/RULES.md`, and `.plan/shared/*`.

**Workflow-Owned File**:
A file owned by the live planning and execution flow of a specific target repository. These files are not overwritten during framework update. Examples include `.plan/PRD.md`, `.plan/index.md`, `.plan/backlog.md`, `.plan/progress.txt`, and archived run-family artifacts.

**Plan Workspace**:
The `.plan/` directory installed into a target repository. It contains the active planning surface, runtime files, helper scripts, templates, and archives used by the Ralph Loop framework.

**Active Run Family**:
The currently active PRD-scoped execution tree in a target repository. It includes the current PRD, active epics/tasks/sub-tasks, active run summary, and active runtime/history files that should be loaded by default. Older run families are archived but remain searchable.

**Run State**:
The machine-readable current execution snapshot stored in `.plan/.run-state.json`. It tracks the active sub-task, attempt counts, model tier, escalation state, and other live execution facts for the current run.

**Run History**:
The append-only structured execution history stored in `.plan/.run-history.jsonl`. It preserves durable machine-readable event history across clean Ralph Loop runs and supports deterministic historical retrieval.

**Run Summary**:
The curated durable summary of important decisions, blockers, workarounds, and completed areas for the active run family. It is small enough to load by default and is archived per run family when the active PRD changes.

**Historical Retrieval**:
The bounded, deterministic process of querying archived run-family artifacts before execution. Retrieval is tool-driven first, based on structured keys and metadata, with up to three retrieval rounds before a sub-task is blocked for insufficient historical context.

## Example Dialogue

**Developer**: I need to fix the session timeout bug. Should I just write a new script?
**Domain Expert**: No, we should use the **Ralph Loop** for that. First, create an **Issue** in `.specify/memory/issues/` describing the timeout bug.
**Developer**: Got it. Then do I create a **Prompt MD** at the root of the project?
**Domain Expert**: Yes, create `/prompt.md` and set the `issueId` frontmatter to point to the issue you just created. Then specify the task details in the body.
**Developer**: Okay. Do I need to modify `/prod.md` as well?
**Domain Expert**: Only if there are new production environment rules or configurations. The **Ralph Loop** will read **Prod MD** (`/prod.md`) to ensure it doesn't violate any production constraints.
**Developer**: Excellent. Where can I see what the agent is doing during each iteration?
**Domain Expert**: You can watch `/progress.txt`. The agent will write its log and current completion percentage to **Progress TXT** on every iteration until it succeeds or hits the 10-iteration limit.
