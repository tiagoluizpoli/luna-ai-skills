# Grilling Session: Prompt Extensibility and Project-Specific Context

Date: 2026-06-18
Status: complete
Source Skill: grill-with-docs
Scope: How to make the Ralph Loop prompt and framework context extensible by consuming projects without breaking framework invariants

## Starting Context

- User prompt: The current `prompt.md` is complete for the framework but lacks project-specific things like test/lint commands and guardrails. It cannot be modified by consumers because the framework depends on its current state. We need a way to make it extensible. Also, consuming projects have project-specific context (like `CONTEXT.md` in neighborhood-showcase) that should integrate into the framework without the consumer touching framework-owned files.
- Initial reasoning:
  - The neighborhood-showcase's `prompt.md` already has project-specific sections (`Required Verification Loop` with `bun run test`, `bun run check-types`, etc.) that do NOT exist in the framework's base `prompt.md` — this means the consumer manually added them post-installation, diverging from the base
  - The neighborhood-showcase's `RULES.md` is a fully consumer-owned file (as designed — framework template says "Replace this starter content")
  - `CONTEXT.md` exists as a consumer-owned domain glossary in neighborhood-showcase but is not mandated in the framework's reading order
  - The `agents.local.md` extension point already exists in the reading order but its intended scope is unclear
  - The core tension: framework needs prompt stability for invariants, but consumers need project-specific instructions (guardrails, verification steps) without touching framework-owned files

## Current Question

*(session complete)*

## Future Questions

*(none)*

## Answered Questions

### Q-01
Exact question:
"When you say `prompt.md` 'cannot be modified' by consumers — is the primary concern that the installer would overwrite consumer changes on future framework updates, or is there a deeper structural reason?"

User answer:
"Both. The framework functionality must be present in the prompt on every Ralph Loop execution — not just once, but every run. The framework depends on this content being loaded. Consumers need to add their own things on top of this without breaking what the framework requires."

Decision / takeaway:
- Framework prompt content is a **functional runtime requirement** — must be in the agent's loaded context every execution
- Extension mechanism must guarantee framework content always loads, while allowing consumer additions alongside it
- Installer overwrite risk is real but secondary — primary constraint: framework invariants untouchable, consumer additions must be purely additive

Queue impact:
- Q-02 → Q-05: mechanism shape now the priority
- Q-03: agents.local.md is optional ("if it exists") — weak guarantee, clarified in Q-03

### Q-02
Exact question:
"The neighborhood-showcase's `prompt.md` has a `Required Verification Loop` section that doesn't exist in the framework's base `prompt.md`. Was that section manually added post-installation? Is that — consumer manually hacking the framework file — the failure mode to eliminate?"

User answer:
"Yes, manually added by me. But the goal is NOT to prevent consumers from adding things — consumers MUST be able to add project-specific stuff. The problem is different projects have different commands (bun vs pnpm, `check` vs `lint`). Consumers need their own place for these without touching framework-owned files."

Decision / takeaway:
- The failure mode is NOT "consumer edited the file" — it's "consumer has no designated place to put project-specific instructions without mixing with framework content"
- Framework-owned vs consumer-owned separation is the real goal
- Every project will have different guardrail commands — this is expected variation, not a bug

Queue impact:
- Confirms: extension file (Q-05) must be the consumer's designated space, not a prohibition
- Pruned: original framing of Q-02 as "eliminate the ability to add" — that was wrong

### Q-03
Exact question:
"`agents.local.md` already exists as an optional read step. Is it the consumer's extension point for project-specific instructions — or does it serve a different purpose?"

User answer:
"Exactly as recommended — `agents.local.md` is for machine/session-local context. Different purpose from project-wide guardrails."

Decision / takeaway:
- `agents.local.md` scope = machine/session-local (developer-specific overrides, local env context)
- Project-wide guardrails (verification commands, communication style) need a DIFFERENT file

Queue impact:
- Confirms need for new extension file (Q-05)

### Q-04
Exact question:
"Should `CONTEXT.md` become a first-class mandatory read in the framework's prompt reading order, or remain optional?"

User answer:
"Not mandatory for all projects, but should be scaffolded as a starter file from installation (like RULES.md). The `grill-with-docs` skill (via domain-modeling) creates and maintains it. Framework reading order should include it as 'read if exists.'"

Decision / takeaway:
- `CONTEXT.md` = consumer-owned domain glossary, created/maintained by grill-with-docs sessions
- Framework reading order: add "if `CONTEXT.md` exists, read it" step
- Installer should scaffold a starter `CONTEXT.md` (empty or minimal template) so consumers know it exists
- Confirmed: domain-modeling skill creates CONTEXT.md lazily when first term resolves; grill-with-docs drives this

Queue impact:
- Q-07 now includes CONTEXT.md as a starter file alongside prompt.local.md

### Q-05
Exact question:
"Should the extension mechanism be `prompt.local.md` — a new consumer-owned file the base prompt explicitly reads at the end?"

User answer: "Yes."

Decision / takeaway:
- `prompt.local.md` = consumer-owned extension file
- Base `prompt.md` gets an explicit "if `prompt.local.md` exists, read it" instruction at the end
- Ownership boundary: `prompt.md` = framework, `prompt.local.md` = consumer

Queue impact: none — confirmed mechanism, Q-08/Q-09 now handle details

### Q-06
Exact question:
"Should guardrail commands go in `prompt.local.md`, RULES.md, or both?"

User answer: "As recommended."

Decision / takeaway:
- `prompt.local.md` = runtime instructions for the agent (verification commands: `bun run test`, `pnpm lint`, etc.)
- RULES.md = policy ("type-check after every change", "run lint before commit")
- The two complement — policy lives in RULES.md, the commands to execute it live in `prompt.local.md`

Queue impact: none

### Q-07
Exact question:
"Should `prompt.local.md` and `CONTEXT.md` be scaffolded as starter files by the installer?"

User answer: "As recommended."

Decision / takeaway:
- Installer scaffolds both `prompt.local.md` and `CONTEXT.md` as starter files with guiding comments
- Consumer discovers the contract immediately without reading docs
- CONTEXT.md will be populated by `grill-with-docs` sessions (domain-modeling skill builds it lazily)

Queue impact: Q-08 now addresses what happens to these files on subsequent installer updates

### Q-08
Exact question:
"When installer updates an existing project, what happens to `prompt.local.md` and `CONTEXT.md`?"

User answer: "As recommended."

Decision / takeaway:
- Hard rule: installer never touches consumer-owned files on update
- Installer only manages framework-owned files (`prompt.md`, helper scripts, manifests)
- Consumer files (`prompt.local.md`, `CONTEXT.md`, `RULES.md`, `agents.local.md`) are never overwritten

Queue impact: none

### Q-09
Exact question:
"Should `prompt.local.md` have enforced structure or be free-form?"

User answer: "As recommended."

Decision / takeaway:
- Free-form — agent reads it as plain instructions appended to the base
- No enforced headings or sections
- Consumer organizes as they see fit; guiding comments in the starter file serve as documentation only

Queue impact: none

### Q-10
Exact question:
"Where does `CONTEXT.md` land in the reading order? Fixed after RULES.md, or on-demand?"

User answer: "As recommended."

Decision / takeaway:
- Fixed position: after RULES.md, "if exists read it"
- On-demand is inconsistent — agent may not always recognize when domain context matters
- Updated reading order step: 1. RULES.md → 1.5 CONTEXT.md (if exists) → 2. agents.local.md → ...

Queue impact: Q-11 now pins exact positions for both CONTEXT.md and prompt.local.md

### Q-11
Exact question:
"Reading order placement: CONTEXT.md after RULES.md, prompt.local.md at the very end — correct?"

User answer: "As recommended."

Decision / takeaway:
- Updated reading order:
  1. RULES.md
  2. CONTEXT.md (if exists)
  3. agents.local.md (if exists)
  4. PRD.md
  5. index.md
  6. pointer files (grilling/prds/handoffs when relevant)
  7. current epic and task files
  8. .run-summary.md
  9. **prompt.local.md (if exists)** ← consumer extension, always last
- Framework loads first, project-specific augmentation last

Queue impact: session complete

### Q-12
Exact question:
"Any consumer-extension concerns beyond `prompt.local.md` and `CONTEXT.md`?"

User answer: "As recommended."

Decision / takeaway:
- No other extension points needed
- Full consumer surface: `prompt.local.md` (runtime instructions) + `CONTEXT.md` (domain glossary) + `RULES.md` (architecture/policy) + `agents.local.md` (machine-local)
- Helper scripts and templates remain framework-owned

Queue impact: session complete — proceed to handoff

## Pruned Questions

- Original Q-05 (full scope list): "What is the complete set of consumer-injectable things?"
  Removed because: the answer emerged from Q-02 + Q-03 + Q-04: (a) verification/guardrail commands → prompt.local.md, (b) domain context → CONTEXT.md, (c) architecture/coding rules → RULES.md, (d) machine-local → agents.local.md. Scope is clear enough to proceed to mechanism design.
