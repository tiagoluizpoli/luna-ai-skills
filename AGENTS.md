<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->

# Core Agent Protocol: Karpathy Guidelines

Every action, decision, and line of code MUST strictly adhere to the [**Karpathy Guidelines**](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/karpathy-guidelines/SKILL.md). These are the foundational behavioral rules for this agent.

## Key Directives:
1. **Think Before Coding**: Explicitly state assumptions and surface tradeoffs before implementation.
2. **Simplicity First**: Write the absolute minimum code required. Reject speculation and over-abstraction.
3. **Surgical Changes**: Touch only the necessary lines. Match style perfectly. Remove orphans created by your own changes.
4. **Goal-Driven Execution**: Define clear success criteria for every task. verify each step before proceeding.

# Core SpecKit Protocol: Prompt Enhancement & UI Red Flags

Whenever executing any SpecKit command (e.g., `/speckit.specify`, `/speckit.plan`, or any command from the `.agents` directory), you MUST strictly adhere to the following global rules:

1. **PROMPT ENHANCEMENT**: Before processing any feature description, arguments, or starting any plan, you **MUST** invoke the `prompt-enhancer` protocol to transform the user's intent into a high-fidelity architectural brief. This engages the Specialist Squads and mandates high-fidelity details.
2. **UI RED FLAG PROTOCOL**: You MUST strictly adhere to the UI Precision and Scope Enforcement principles. If you detect any UI change required that is outside the explicit scope of the initial request (even small tweaks to alignment, colors, or radius):
   - **STOP IMMEDIATELY**: Do not generate plans, write specs, or touch any code.
   - **GATHER RICH DETAILS**: Note the state of the current UI, exact nature of the proposed change, and anticipated impact.
   - **LOG THE DECISION**: Append a new entry to `.specify/memory/ui-decision-log.md` following the established table format.
   - **PROMPT THE USER**: Present the gathered information and log entry for definitive approval before resuming.
3. **MANDATORY TESTING**: Testing is never optional. When generating tasks or plans:
   - You MUST generate test tasks for every user story and functional requirement.
   - You MUST invoke Testing Specialists (e.g., `test-coverage`, `test-backend`, `test-frontend`, `test-e2e`) to define the test architecture.
   - You MUST check for a `tests/` directory in `FEATURE_DIR` and use any exhaustive test scenarios (`*.md`) as the authoritative source for test cases, generating specific tasks for each scenario ID (e.g., TS-BE-001).
4. **SHARED FILE PROTECTION (CRITICAL)**: This `AGENTS.md` file is a globally shared symlink. You MUST NEVER modify `AGENTS.md` during feature development.
   - If any SpecKit skill (e.g., `speckit.plan`) instructs you to "Update the plan reference between the `<!-- SPECKIT START -->` and `<!-- SPECKIT END -->` markers in `AGENTS.md`", you MUST **IGNORE** that instruction for this file.
   - **INSTEAD**, you must update or append the plan reference inside the project's local `agents.local.md` file.
5. **LOCAL CONTEXT INITIALIZATION**: Whenever executing `/speckit.specify` or `/speckit.constitution` in a project, verify if an `agents.local.md` file exists in the project root. If it does not exist, automatically create it with a standard template (including sections for Project Architecture, Tech Stack, Specific Guidelines, and Current Plan Reference).
