# Grilling Session: Installer Target Model Re-Grill

Date: 2026-06-16
Status: finished
Source Skill: grill-with-docs
Scope: re-grill the Ralph Loop installer target model against the existing grilling record and the current implementation, so contradictory or unstable install-target decisions can be corrected before task generation.

## Starting Context

- User prompt: "just want to understand. does that weird behavior of global hermes and local codex that was in the grilling session... run it against the implementing code to make sure we left nothing behind... now is the time for us to start a new grilling session against things that might possibly be wrong..."
- Initial reasoning:
  - The previous grilling record explicitly locked a narrow v1 target matrix, and the installer implemented it literally.
  - The code currently exposes only `codex-local` and `hermes-global`, which matches the old grilling file but feels structurally wrong under the user’s clarified mental model.
  - The first dependency was to separate domain terms before discussing capability policy or implementation metadata.
  - User also clarified that migration of legacy root files and `.specify/memory` is intentionally manual and out of scope for the installer; that thread should not contaminate this grilling branch.

## Current Question

- session closed
- the queued questions are exhausted and locked through Q67
- this grilling session is finished and ready for handoff generation

## Future Questions

- none currently queued

## Answered Questions

### Q65
Exact question:
"Should update first show the recorded state it plans to reuse before proceeding, so you can confirm or override it?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Update should first show the recorded state it plans to reuse.
- The user should be able to confirm it or override it before proceeding.

Queue impact:
- Locked the visible confirmation step for recorded-state reuse in update.
- Left no remaining queued dependency on update default behavior.

### Q66
Exact question:
"Should the audit treat any code path that installs agent-specific assets for unselected agents as a high-severity bug?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Installing agent-specific assets for unselected agents is a high-severity correctness bug.
- It should not be downgraded to wording or UX drift.

Queue impact:
- Locked the severity rule for wrong-agent asset routing in the audit.
- Left no remaining queued dependency on asset-routing severity.

### Q67
Exact question:
"Should the installer terminology use 'availability mode' in prompts instead of just 'scope' if that reads more clearly?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Prefer 'availability mode' in prompts when it reads more clearly.
- The underlying concept remains local vs global availability.

Queue impact:
- Locked the preferred prompt wording direction.
- Exhausted the currently queued wording dependencies.

### Q62
Exact question:
"Should install always ask explicitly which agents to target, even if previous state exists, while update may default from recorded state?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Install should ask explicitly which agents to target.
- Update may default from recorded state when trustworthy.

Queue impact:
- Locked the install/update behavior split.
- Made update confirmation UX and audit severity the next dependencies.

### Q63
Exact question:
"Should global/local be modeled as an attribute on each installed asset record, since some framework assets may always be local while others can be local or global?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Global/local should live on the asset record when asset behavior differs by type.
- Do not pretend every asset follows the same availability rules.

Queue impact:
- Tightened the bookkeeping model around per-asset scope.
- Strengthened the audit expectation around wrong shared assumptions.

### Q64
Exact question:
"Should the audit distinguish between stale wording bugs and real asset-routing bugs in the current implementation findings?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. The audit should separate stale wording/UX drift from real behavior bugs.
- Findings should be easier to act on when categorized this way.

Queue impact:
- Locked the reporting shape for the implementation audit.
- Unblocked the actual review work.


### Q59
Exact question:
"Should update allow an explicit override path, so you can choose different agents or a different availability mode instead of blindly reusing the recorded previous state?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Update should allow an explicit override path.
- Reusing recorded state is the default convenience path, not a trap.

Queue impact:
- Preserved update convenience without removing control.
- Unblocked the install-vs-update behavior split.

### Q60
Exact question:
"Should framework assets be categorized internally as shared vs agent-specific, so install/update only touch the selected-agent subset where appropriate?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Framework assets should be partitioned internally into shared vs agent-specific.
- Agent-specific assets must only apply to the chosen agents.

Queue impact:
- Locked internal asset partitioning.
- Made asset-record shape and wrong-agent routing severity the next dependencies.

### Q61
Exact question:
"Should the audit explicitly flag any current implementation path that still assumes all selected assets are identical across agents?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. The audit should explicitly flag any implementation path that assumes all selected assets are identical across agents.
- That assumption is now a known correctness bug pattern.

Queue impact:
- Locked a concrete review category for implementation bugs.
- Set up the next round around install/update flow and finding severity.


### Q56
Exact question:
"Should update default to using the previously recorded agent+scope state when possible, instead of always re-asking everything from scratch?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Update should default to using previously recorded agent+scope state when it is trustworthy.
- Re-ask only when state is missing/invalid or when the user wants a different selection.

Queue impact:
- Established a convenience default for update.
- Created the follow-up need for an explicit override path.

### Q57
Exact question:
"Should the audit and docs stop saying 'skills only' and instead describe the installer as making framework assets available for the selected agents?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Audit/docs should say framework assets, not skills only.
- The payload includes shared skills plus agent-specific scripts/items.

Queue impact:
- Corrected the language model for the review.
- Made asset partitioning and implementation assumptions the next dependencies.

### Q58
Exact question:
"For bookkeeping, should agent-specific scripts like the Ralph Loop runner be tracked as first-class installed assets alongside skills?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Agent-specific scripts/items should be tracked as first-class installed assets alongside skills.
- Otherwise bookkeeping and update history would be incomplete.

Queue impact:
- Locked the broader asset-tracking model.
- Made selected-agent routing and wrong shared-asset assumptions audit targets.


### Q54
Exact question:
"Should the richer bookkeeping stay fully internal in v1 unless debugging is needed, instead of being surfaced in normal installer/update UX?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Keep richer bookkeeping internal in v1 unless debugging needs it.
- Do not add normal installer/update UX for that state right now.

Queue impact:
- Preserved a simple visible UX.
- Made update behavior and broader asset wording the next dependencies.

### Q55
Exact question:
"Now that skill selection is gone, should the interactive flow ask in this order: (1) which agents, then (2) global or local availability?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Ask agents first, then global/local availability.
- That order matches the user's mental model.

Queue impact:
- Locked the exact question order for the minimal v1 flow.
- Unblocked the next round about update defaults and broader asset terminology.


### Q52
Exact question:
"Should the current audit treat the existing bundle/target prompt structure itself as stale UX, not just the underlying fused target matrix?"

User answer:
"I'm not sure... For the Q fifty two I'm not sure what to choose from, but I'll go along."

Decision / takeaway:
- Tentative yes.
- Treat the existing bundle/target prompt structure as stale UX alongside the stale fused target matrix.
- This should be revisited only if later implementation evidence shows some part of that flow should survive.

Queue impact:
- Expanded the audit mismatch from schema/labels into the user flow itself.
- Increased the need to update audit wording to match the simplified installer UX.

### Q53
Exact question:
"Should the internal bookkeeping explicitly track per-skill timestamps such as first-installed-at and last-updated-at?"

User answer:
"yes... but we're talking about skills, but the same goes for the script... each agent has a Ralph Loop script... and possibly other kind of agent specific items..."

Decision / takeaway:
- Yes, but broadened.
- Internal bookkeeping should track timestamps and history not only for skills, but for framework assets more generally, including agent-specific scripts/items.
- The selected agent set should determine which agent-specific assets are installed and tracked.

Queue impact:
- Corrected the bookkeeping model from 'skills only' to 'framework assets'.
- Created a follow-up need to make that broader asset model explicit in audit/docs and asset tracking.


### Q50
Exact question:
"Should uninstall remain explicitly out of scope for this installer branch until you choose to add it later?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Uninstall remains out of scope for this installer branch.
- Do not let uninstall complexity distract from making install/update correct first.

Queue impact:
- Locked the current branch boundary around install + update only.
- Removed uninstall from the immediate design surface.

### Q51
Exact question:
"Should the installer/update summary talk in terms of 'making framework skills available' rather than 'installing agents' or 'install targets'?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. The installer/update wording should describe making framework skills available.
- Avoid wording that implies the agents themselves are being installed.

Queue impact:
- Locked the user-facing language model.
- Made audit implications and bookkeeping details the next dependencies.

### Q48
Exact question:
"Should the installer keep an internal state file saying which agent+scope combinations were set up successfully, even though the user-facing flow is now just: choose agents + choose global/local?"

User answer:
"yes... we can save the skill names as well... map which ones were updated, when they were updated, when they were installed... keep track on each one of them..."

Decision / takeaway:
- Yes. Keep internal bookkeeping/state.
- Track not only agent+scope setup state, but also per-skill metadata such as skill names and install/update timestamps.
- This remains internal bookkeeping for correctness and history, even though all framework skills are mandatory.

Queue impact:
- Confirmed precise internal state is wanted even with a minimal UI.
- Added a follow-up need to decide how explicit that bookkeeping model should become and whether any of it is surfaced.

### Q49
Exact question:
"Should update use the exact same no-skill-selection flow as install, since all framework skills are mandatory?"

User answer:
"Q forty nine, yes."

Decision / takeaway:
- Yes. Update should reuse the same minimal flow as install.
- No skill selection there either.

Queue impact:
- Locked symmetry between install and update.
- Left branch-boundary and wording questions as the next dependencies.


### Q47b
Exact question:
"Given that all framework skills are mandatory in v1, should the interactive flow remove skill selection entirely and ask only: (1) which agents, and (2) global or local availability?"

User answer:
"Q forty seven b Yes."

Decision / takeaway:
- Yes. Remove skill selection entirely from the v1 interactive flow.
- Ask only which agents to target and whether skills should be available globally or locally.

Queue impact:
- Locked the minimal v1 questionnaire.
- Made internal record shape and update-flow symmetry the next dependencies.

### Q45
Exact question:
"Since the full 3×2 matrix is mandatory, should any installer doc or manifest that still exposes only `codex-local` and `hermes-global` be treated as immediately stale/incorrect?"

User answer:
"Q forty five, yes."

Decision / takeaway:
- Yes. Any installer doc or manifest still exposing only `codex-local` and `hermes-global` is stale/incorrect.
- This is a real contract mismatch, not harmless legacy wording.

Queue impact:
- Tightened the drift diagnosis against the current installer docs/manifests.
- Confirmed that the audit should treat the old target surface as definitively wrong.

### Q46
Exact question:
"For v1, should the installer present skills as the primary thing being installed, with agent selection and scope selection only describing where those skills become available?"

User answer:
"every skill should be mandatory... we don't prompt the user... all skills will be installed... the only thing we require is which agents do you use and how do you want the skills to be available for them"

Decision / takeaway:
- All framework skills are mandatory in v1.
- Do not prompt the user to choose among framework skills.
- The only user choices are which agents to target and whether skills should be available globally or locally.

Queue impact:
- Removed optional skill selection from the intended v1 flow.
- Turned the remaining UI problem into a minimal agents-plus-scope questionnaire.

### Q40
Exact question:
"Should update and uninstall in v1 also allow multiple agents in one run, since the same convenience argument applies there too?"

User answer:
"For the update, yes... for uninstall, depends... if we don't have an uninstaller, defer it for later... I do not intend to uninstall this"

Decision / takeaway:
- Update: yes, allow multiple agents in one run.
- Uninstall: deferred / out of scope for the current installer branch unless intentionally added later.
- Do not let uninstall complexity distort the current install/update design.

Queue impact:
- Narrowed lifecycle focus to install + update.
- Created a later explicit scope boundary question for uninstall instead of treating it as already required.

### Q41b
Exact question:
"Should scope be chosen once per install run as the availability mode you want for the selected skills (global or local), then applied to all selected agents in that run, instead of asking scope separately per agent?"

User answer:
"yes"

Decision / takeaway:
- Yes. Scope is one run-level availability choice: global or local.
- Then the selected skills are made available to all chosen agents in that mode.

Queue impact:
- Eliminated per-agent scope questioning from the v1 flow.
- Unblocked the lifecycle and UI-framing questions around this simpler run model.


### Q43
Exact question:
"If all user skills are expected to be universally compatible across the supported agents, should the installer stop modeling per-skill compatibility exceptions entirely for v1?"

User answer:
"Well it shouldn't that shouldn't be a thing since the beginning... it's supposed to be a simple thing... the questions are for how do we install things that should be available on the agents... specifically talking about the skills..."

Decision / takeaway:
- Yes. For v1, stop modeling per-skill compatibility exceptions.
- Treat skills as universally available across the supported agents unless a real counterexample appears later.
- The installer should stay focused on where/how skills are made available, not on speculative compatibility machinery.

Queue impact:
- Collapsed the per-skill compatibility branch for v1.
- Shifted the design center further toward simple skill-availability installation.

### Q41
Exact question:
"When multiple agents are selected, should scope be chosen per agent rather than as one global scope switch for the whole run?"

User answer:
"scope is only for skill installation / availability... we don't have to care about should scope be chosen per agent... it's just for installation purposes... skills should be available... globally or locally..."

Decision / takeaway:
- Q41 as phrased was rejected as overcomplicated.
- Scope is about skill availability mode, not a rich per-agent modeling problem.
- The remaining unresolved point is whether multi-agent runs use one scope choice for the whole run or some other simpler rule.

Queue impact:
- Replaced the per-agent scope branch with the narrower Q41b run-level scope question.
- Recentered the installer around making skills available to supported agents, not around agent-specific branching.

### Q38b
Exact question:
"I think we now have a contradiction to resolve: do you want v1 to require the full 3×2 matrix to exist (Hermes/Codex/AGY × local/global), or do you still want unfinished agent+scope pairs allowed to be absent until built? Which one is canonical?"

User answer:
"as recommended."

Decision / takeaway:
- v1 requires the full 3×2 matrix.
- Any missing agent+scope pair is a real gap/bug, not an acceptable omission.

Queue impact:
- Reversed the earlier Q34 assumption that unfinished pairs could simply be absent.
- Unblocked the concrete scope-selection and compatibility-simplification questions.

### Q39
Exact question:
"Once one or more agents are chosen, should the installer show only the skills actually compatible with those selected agents, instead of a broader bundle view that includes irrelevant items?"

User answer:
"The way we are building this, all of them should be compatible. That's my skills."

Decision / takeaway:
- For v1, user skills are expected to be universally compatible across the supported agents.
- So the installer should not burden the flow with compatibility filtering logic unless reality later proves otherwise.

Queue impact:
- Potentially collapses the per-skill compatibility branch for v1.
- Creates a follow-up need to decide whether per-skill compatibility metadata/exceptions should exist at all in v1.

### Q38
Exact question:
"For one chosen agent, should local/global be a direct scope selection step only when both are implemented, and otherwise skip the question entirely?"

User answer:
"What do you mean by implemented? If we have the scopes, shouldn't they be implemented?... we're trying to simplify the flow not complicate it"

Decision / takeaway:
- Q38 as phrased was rejected as muddy.
- The real unresolved question is whether v1 requires the full 3×2 matrix, or allows some agent+scope pairs to be absent during rollout.

Queue impact:
- Replaced the old Q38 with the narrower contradiction-resolving Q38b.
- Blocks final scope-selection UX decisions until the v1 completeness rule is explicit.

### Q37
Exact question:
"For the current three agents, should the installer let the user choose multiple agents in one run, or should v1 force one agent at a time to stay simpler?"

User answer:
"multiple agents in one run... we're not actually installing the agent, we're just making our framework ready for them... there's no point making me run three times..."

Decision / takeaway:
- Allow multiple agents in one run.
- The installer is preparing framework assets for already-installed agents, not installing the agents themselves.
- For the current single-user workflow, forcing one run per agent would add pointless friction.

Queue impact:
- Rejected the one-agent-at-a-time simplification.
- Shifted the next UX questions toward how to keep multi-agent runs simple rather than whether to allow them.

### Q36
Exact question:
"Should verification for v1 be kept as implementation tests in code rather than exposed as a richer user-facing readiness model in the installer UI?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Keep verification for v1 in code/tests.
- Do not surface a richer readiness model in the installer UI right now.

Queue impact:
- Kept verification complexity out of the user-facing installer surface.
- Made multi-agent UX simplification the immediate next dependency.

### Q35
Exact question:
"Should the interactive installer ask only the minimum questions needed to resolve one or more concrete targets from that 3×2 matrix, and avoid any extra diagnostic or reconciliation UX unless it directly prevents user mistakes?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. The interactive installer should ask only the minimum questions needed to resolve the actual install.
- Avoid extra diagnostic or reconciliation UX unless it directly prevents real user mistakes.

Queue impact:
- Locked minimum-question UX as a v1 rule.
- Made verification surfacing and multi-agent batching the next simplification decisions.

### Q34
Exact question:
"Within the 3×2 matrix, if a concrete agent+scope pair is not implemented yet, should it simply be absent from v1 until built, instead of introducing extra readiness categories right now?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. If a concrete agent+scope pair is not implemented yet, keep it out of v1 until built.
- Do not add readiness-category machinery just to represent unfinished work.

Queue impact:
- Locked an intentionally narrow v1 surface.
- Made minimum-question UX and hidden-until-built behavior the operational simplification rules.

### Q33
Exact question:
"For the current installer, should we explicitly scope v1 to the known matrix only — 3 Install Agents (Hermes, Codex, AGY) × 2 Install Scopes (local, global) — and defer any more abstract expansion model beyond that?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Explicitly scope v1 to the known 3×2 matrix.
- Defer broader expansion concerns until they become real work.

Queue impact:
- Reset the design to the smallest useful product boundary.
- Made unfinished-pair handling and minimum-question UX the immediate next dependencies.

### Q32
Exact question:
"Should the installer emit a human-readable post-run reconciliation summary whenever a batch ends incomplete, listing each target’s final state and the next expected action?"

User answer:
"I'm not sure if it's needed... I'm the only user... if this becomes a public framework, then we can work on those kinds of things. But right now we just want to make it work... make it simple."

Decision / takeaway:
- Deferred / not accepted for v1.
- Do not add extra reconciliation UX unless it becomes necessary for the current single-user workflow.

Queue impact:
- Reduced emphasis on public-framework polish and explanatory UX.
- Pushed the grilling back toward minimum-surface correctness.

### Q31
Exact question:
"Should unsupported or unverified agent/scope rows still be included in the generated verification matrix as pending rows, rather than omitted entirely?"

User answer:
"I'm not sure why you are asking about unsupported or unverified agent... right now I just want to make it work as it is."

Decision / takeaway:
- Rejected as over-generalized for the current phase.
- Do not introduce extra matrix/readiness complexity beyond what is needed to make the known agent/scope set work now.

Queue impact:
- Narrowed the product boundary back to the known agents and scopes.
- Forced a reset from generalized readiness taxonomy to a smaller v1 scope decision.

### Q30
Exact question:
"Should per-target metadata record ownership at the file level so uninstall/update can act surgically instead of treating each target as one opaque blob?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Per-target metadata should record ownership at the file level.
- Update and uninstall should operate surgically rather than treating a target as one opaque blob.

Queue impact:
- Locked fine-grained ownership tracking for lifecycle operations.
- Made verification visibility and post-run recovery messaging the next branch.

### Q29
Exact question:
"Should uninstall be constrained to only framework-owned files recorded in per-target metadata, never inferred broadly from current disk contents?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Uninstall should only act on framework-owned files recorded in per-target metadata.
- Broad inference from current disk contents is too risky.

Queue impact:
- Locked metadata-bounded uninstall authority.
- Reinforced the need for precise ownership tracking and honest recovery surfaces.

### Q28
Exact question:
"Should verification status in the manifest be backed by concrete named checks per agent/scope row, rather than a single coarse boolean?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Verification status should be backed by concrete named checks per agent/scope row.
- A single boolean is too lossy for this matrix.

Queue impact:
- Increased the precision expected from the verification surface.
- Made verification visibility and uninstall safety the next concrete branches.

### Q27
Exact question:
"Should the manifest carry explicit question-order metadata for the interactive installer, so the UI flow is configurable without editing code paths?"

User answer:
"as recommended."

Decision / takeaway:
- No. Do not push questionnaire choreography into manifest metadata right now.
- Keep question-order logic in code unless configurability proves necessary.

Queue impact:
- Prevented over-modeling of the interactive flow.
- Kept the manifest focused on capability, compatibility, and verification truth.

### Q26
Exact question:
"Should install, update, and uninstall all consume the same canonical target-resolution engine so behavior cannot drift between commands?"

User answer:
"yes"

Decision / takeaway:
- Yes. All lifecycle commands should consume the same canonical target-resolution engine.
- Install, update, and uninstall must not drift in how they interpret agent/scope/skill targets.

Queue impact:
- Locked shared lifecycle resolution across commands.
- Made uninstall safety and metadata granularity more urgent.

### Q25
Exact question:
"Should the installer support a non-interactive machine-readable plan mode that outputs the resolved agent/scope/skill targets before any writes happen?"

User answer:
"no. Its too much. This is only used by me."

Decision / takeaway:
- No. Do not add a non-interactive machine-readable plan mode right now.
- The current value does not justify the extra surface area because this installer is primarily user-operated, not a generalized automation interface.

Queue impact:
- Narrowed the design away from overbuilding automation surfaces.
- Shifted focus toward correctness, safety, and maintainability of the interactive/lifecycle flow.

### Q24
Exact question:
"Should the verifier/test matrix be generated directly from the manifest’s agent+scope contract so every supported combination automatically becomes a required validation row?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. The verification matrix should be generated from the same canonical manifest contract.
- Every supported combination should automatically become an explicit validation row.

Queue impact:
- Locked the manifest as the source of truth for required verification coverage.
- Opened the next branch around non-interactive planning and lifecycle consistency.

### Q23
Exact question:
"Should the installer’s question flow be driven from manifest metadata rather than hardcoded prompt branches in code, so new agents/scopes can be added without rewriting the interactive flow?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. The interactive installer flow should be driven from manifest metadata.
- Hardcoded prompt branches would become the next drift source as the contract expands.

Queue impact:
- Locked the manifest as the source of truth for interactive flow behavior.
- Made non-interactive planning and shared lifecycle resolution the immediate next dependency.

### Q22
Exact question:
"Should path resolution be an explicit per-agent, per-scope capability module rather than ad hoc string templates scattered across installer code?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Path resolution should be an explicit per-agent, per-scope module.
- It should not be hidden in scattered templates or fused target branches.

Queue impact:
- Locked a clean architecture boundary between target modeling and path resolution.
- Made manifest-driven flow and verification the immediate next dependency.

### Q21
Exact question:
"Should the manifest define agent identities independently from filesystem path templates, so an agent can exist in the contract before its storage paths are finalized?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Agent identity belongs in the contract independently from filesystem path templates.
- A target can exist in the model before path resolution is fully finalized.

Queue impact:
- Separated contract truth from storage-path readiness.
- Made manifest-driven behavior the immediate next dependency.

### Q20
Exact question:
"Should the installer treat internal legacy-key adapters as strictly non-contract implementation details, with tests ensuring they never leak into prompts, manifests, or persisted install records?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Any legacy-key adapter should be strictly internal.
- Tests should prevent fused legacy keys from leaking into prompts, manifests, or persisted install records.

Queue impact:
- Fenced legacy compatibility shims away from the public contract.
- Opened the next branch around path modeling and contract-vs-filesystem separation.

### Q19
Exact question:
"Should blocked or not-yet-implemented targets surface the exact reason in the UI (for example: unsupported by skill, implemented=false, verified=false), rather than a generic unavailable label?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. The UI should surface the exact reason a target is unavailable.
- Generic unavailable labels are too lossy for a model that distinguishes compatibility, implementation, and verification status.

Queue impact:
- Locked diagnostic transparency for blocked/immature targets.
- Made the path-modeling branch the immediate next dependency.

### Q18
Exact question:
"Should the installer store both per-target status and batch-run status, so a later update can distinguish 'this target is healthy' from 'the previous multi-target run was interrupted'?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Store both layers.
- Per-target status describes the condition of each concrete destination.
- Batch-run status describes the outcome of the last multi-target execution.

Queue impact:
- Closed the two-level durable-state question.
- Opened the next branch around honest UI diagnostics and preventing legacy leakage.

### Q17
Exact question:
"Should framework-managed metadata like `.framework-install.json` be reorganized around per-target records instead of one flat target list?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Framework-managed metadata should be reorganized around per-target records.
- The storage model should match the per-target install/update/drift contract.

Queue impact:
- Locked metadata shape around target-specific records.
- Made status layering and surface-cleanliness questions the immediate next dependency.

### Q16
Exact question:
"Should the manifest normalize compatibility at the agent+scope level per skill, rather than carrying legacy fused target keys like `codex-local` anywhere in the new contract?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Normalize compatibility strictly at the agent+scope level.
- Legacy fused target keys should not survive anywhere in the new contract, except possibly in temporary internal migration adapters.

Queue impact:
- Locked the schema boundary between the corrected contract and the legacy fused-target implementation.
- Opened the next durable-state questions about how target-specific metadata should actually be stored.

### Q15
Exact question:
"Should the interactive UI hide contract-supported but unimplemented/unverified targets by default, or show them with clear status labels and block selection when necessary?"

User answer:
"as recommended."

Decision / takeaway:
- Show contract-supported targets with clear status labels and block selection when necessary.
- Do not hide contract-defined targets by default.

Queue impact:
- Locked transparent UI treatment for immature targets.
- Made schema normalization away from fused target keys the immediate next dependency.

### Q14
Exact question:
"Should the installer persist partial progress from targets completed before a fail-fast stop, or should the whole run be treated as needing explicit reconciliation on the next update?"

User answer:
"as recommended."

Decision / takeaway:
- Persist partial progress explicitly.
- Record completed targets as completed, failed target as failed, and overall batch state as incomplete / requires reconciliation.

Queue impact:
- Locked honest partial-progress recording for fail-fast batches.
- Made installer visibility for immature targets the immediate next dependency.

### Q13
Exact question:
"Should install records persist outcomes per concrete target so updates/uninstalls can reason about Hermes-local, Hermes-global, Codex-local, AGY-global, etc. independently?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Install records should persist outcomes per concrete target.
- Each agent+scope destination must be tracked independently for install, update, drift, and future uninstall behavior.

Queue impact:
- Locked target-specific durable install state as part of the contract.
- Made partial-progress semantics for fail-fast batches the immediate next dependency.

### Q12
Exact question:
"Should the installer refuse to offer a skill for an agent/scope combination that is globally supported but explicitly blocked by that skill’s compatibility metadata?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. The installer should refuse to offer globally supported but skill-blocked combinations.
- It may explain the incompatibility, but it should not present the blocked combination as selectable.

Queue impact:
- Locked strict UI/enforcement behavior for compatibility exceptions.
- Made target-specific durable install state the immediate next dependency.

### Q11
Exact question:
"Should the manifest distinguish between 'supported by contract', 'implemented in code', and 'verified in tests' for each agent/scope combination?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. The manifest should distinguish contract support, code implementation, and test verification as separate statuses.
- Intent, implementation, and confidence must not be collapsed into one readiness signal.

Queue impact:
- Added a precise maturity/status vocabulary for agent/scope combinations.
- Made UI and enforcement behavior for incompatible combinations the immediate next dependency.

### Q10
Exact question:
"If one concrete target in a multi-target run fails validation or hits drift, should the installer continue with the other targets or stop the whole run by default?"

User answer:
"as recommended."

Decision / takeaway:
- Stop the whole run by default.
- A future best-effort override may exist, but fail-fast is the standard batch behavior.

Queue impact:
- Locked the default failure policy for multi-target runs.
- Made target maturity/status vocabulary the immediate next dependency.

### Q9
Exact question:
"If a user wants both local and global installs for the same agent, should the installer allow selecting both scopes in one run, or force separate runs per scope?"

User answer:
"as recommended."

Decision / takeaway:
- Allow both scopes in one run.
- Treat each selected agent+scope pair as its own concrete install target inside the batch.

Queue impact:
- Confirmed that the installer can batch multiple concrete targets for the same agent.
- Made mixed-success / failure policy the immediate next dependency.

### Q8
Exact question:
"If a skill cannot work for a supported agent/scope combination, should that be declared as a per-skill compatibility exception rather than as a missing global capability?"

User answer:
"as recommended."

Decision / takeaway:
- Yes. Global capability and per-skill compatibility are separate concerns.
- A skill-level incompatibility should be declared as an explicit compatibility exception, not by pretending the platform target itself does not exist.

Queue impact:
- Preserved the distinction between installer platform truth and skill-specific constraints.
- Made same-agent multi-scope batching the immediate next dependency.

### Q7
Exact question:
"Do we want AGY treated as a first-class Install Agent now, or as a Codex-family bridge that temporarily shares capability rules until its own storage paths are verified?"

User answer:
"as recommended."

Decision / takeaway:
- AGY is a first-class Install Agent in the model.
- If AGY local/global paths are still unverified, that should be tracked as explicit status metadata rather than by collapsing AGY into Codex.

Queue impact:
- Preserved AGY as a peer beside Hermes and Codex in the domain model.
- Made platform-vs-skill compatibility separation the immediate next dependency.

### Q6
Exact question:
"When a user selects multiple agents and scopes at once, should prerequisite validation and drift handling still happen per concrete install target rather than per skill bundle?"

User answer:
"yes"

Decision / takeaway:
- Yes. Prerequisite validation and drift handling are per concrete install target.
- A multi-target run is a batch of target-specific operations, not one flattened install blob.

Queue impact:
- Preserved per-target reasoning from the older grilling, but grounded it in the new agent/scope model.
- Made AGY’s modeling status the immediate next dependency.

### Q5
Exact question:
"For agents that support both local and global installs, do you want the installer UI to ask for agent first and scope second, instead of presenting a flat list of fused target labels?"

User answer:
"yes"

Decision / takeaway:
- Yes. The installer UI should mirror the actual model:
  1. choose agent(s)
  2. choose scope(s) per supported agent
- Flat fused target labels are no longer the right install surface.

Queue impact:
- Locked the interactive installer shape around the new domain model.
- Made multi-target execution semantics the immediate next dependency.

### Q4
Exact question:
"Should the manifest own agent capabilities centrally, with skills only declaring compatibility against that shared target model instead of each skill duplicating the full target matrix?"

User answer:
"yes"

Decision / takeaway:
- Yes. Agent/scope capability truth belongs centrally in the manifest model.
- Skills should declare compatibility against that shared capability model instead of each duplicating the full target matrix.

Queue impact:
- Confirmed that capability is a platform concern and skill compatibility is a separate concern.
- Made installer UI structure the immediate next dependency.

### Q3
Exact question:
"Should capability limitations be declared explicitly in installer metadata per agent/scope combination, instead of being inferred from missing target definitions?"

User answer:
"yes"

Decision / takeaway:
- Yes. Capability limitations must be explicit installer metadata.
- They should not be inferred from omitted target definitions, missing path templates, or hidden UI omissions.

Queue impact:
- Confirmed that the target model needs a first-class capability layer.
- Made central-vs-duplicated capability ownership the immediate next dependency.


### Q1
Exact question:
"Should we redefine the installer contract around two separate concepts — agent and scope — instead of continuing with fused targets like `codex-local` and `hermes-global`?"

User answer:
"yes"

Decision / takeaway:
- Yes. The canonical model is:
  - Install Agent
  - Install Scope
  - Install Target = Agent + Scope
- Fused labels like `codex-local` are implementation artifacts, not the right domain model.

Queue impact:
- Introduced the need to define the default rule for scope support across agents.
- Led to glossary updates in `CONTEXT.md` for Install Agent, Install Scope, and Install Target.

### Q2
Exact question:
"Should every Install Agent be expected to support both scopes by default, unless we have a proven technical reason to forbid one?"

User answer:
"yes"

Decision / takeaway:
- Yes. Default rule: every supported Install Agent should expose both local and global scope.
- Any asymmetry must be an explicit documented capability limitation, not an implicit omission.

Queue impact:
- Made capability modeling the immediate next dependency.
- Narrowed the next question to where explicit limitations should live.

## Pruned Questions

- Q-old-migration
  Exact question: "Should the installer migrate legacy root workflow files and `.specify/memory` into the new framework structure?"
  Removed because: the user explicitly clarified that legacy migration is intentionally manual and out of scope for this installer branch right now.
