# Grilling Session: Installable Ralph Loop Framework Core

Date: 2026-06-12
Primary outcome: lock the framework contract for an installable, `.plan`-based
Ralph Loop system that treats Matt Pocock skills as external prerequisites.

## Context

The user wanted to stop mixing SpecKit concepts with the workflow actually being
used: grilling, PRD creation, issue decomposition, epics/tasks/sub-tasks, and
Ralph Loop execution. The goal shifted from "split SpecKit from the rest" into
"create a standalone Ralph Loop framework that can be installed into clean
repositories and later applied to `neighborhood-showcase`."

## High-Level Decisions

- The framework workspace is `.plan/`.
- SpecKit remains available, but separate.
- Matt Pocock skills are manual external prerequisites.
- The installer is interactive-first in v1.
- The framework owns starter files, helper scripts, wrapper skills, and install
  orchestration.
- Live execution state uses run-state/history/summary surfaces instead of only a
  single progress log.

## Question Ledger

Q1. File ownership split:
Framework-managed vs workflow-owned file classes were accepted.

Q2. Model escalation source:
Model tier belongs in sub-task metadata, not runtime guesswork.

Q3. Decomposition split:
`to-issues` stays focused; framework-specific planning remains separate.

Q4. Wrapper ownership:
`to-epic-issues` must become a framework-managed installable skill.

Q5. Adapter split:
Keep `to-issues` as the decomposition engine and `to-epic-issues` as the
filesystem/workspace adapter.

Q6. Matt Pocock dependency:
His skill set is a hard prerequisite for the framework.

Q7. Upstream ownership:
Do not vendor Matt Pocock skills locally; treat them as external.

Q8. Upstream installation source:
Do not invent a new source locator; rely on Matt Pocock's own installer.

Q9. Missing prerequisites:
Hard-stop if Matt Pocock skills are missing.

Q10. Dependency validation:
Validate specific required external skills, not just vague installation.

Q11. Update scope:
Only framework-managed files are auto-updated.

Q12. Install manifest:
Record framework installation metadata in `.plan/.framework-install.json`.

Q13. Marker file:
Use a cheap marker file alongside the detailed manifest.

Q14. Backlog shape:
Use one backlog file with `status` and `horizon`, not a deferred backlog file.

Q15. Model metadata location:
Task files get `default-model`; sub-tasks can override.

Q16. Generator responsibility:
`to-epic-issues` should emit model metadata by default.

Q17. Default model rule:
Default to `medium`, escalate to `high` only when clearly justified.

Q18. Encoding format:
Keep model metadata as parseable inline markdown fields, not nested YAML.

Q19. Runtime state split:
Use `.run-state.json`, `.run-history.jsonl`, and human-readable
`progress.txt`.

Q20. History loading:
Do not load all history by default; bounded and targeted retrieval is required.

Q21. Active durable summary:
Add `.run-summary.md` for always-load carry-forward context.

Q22. Summary authorship:
The runner should maintain the summary incrementally using durable conclusions
only.

Q23. Summary scope:
Active summary is scoped to the current PRD/run family; older ones are archived.

Q24. Execution-tree scope:
The same scoping rule applies to epics/tasks so finished runs do not bloat
active context.

Q25. Historical retrieval:
Historical retrieval before relevant execution should be mandatory.

Q26. Retrieval priority:
Use structured keys first, metadata tags second, full text last.

Q27. Retrieval output:
Return ranked matches plus a compact bundle, not raw dumps.

Q28. Retrieval rounds:
Allow bounded iterative retrieval and use three rounds as the default cap.

Q29. Retrieval exhaustion behavior:
Block the affected work if context is still insufficient, but continue with
other dependency-safe executable work if available.

Q30. Blocked status durability:
Blocked must be a first-class durable status across task surfaces.

Q31. Explicit unblock rule:
Only concrete recorded unblock transitions may clear blocked state.

Q32. Task aggregation:
Task status is derived from sub-task states; one blocked sub-task does not
automatically block the whole task.

Q33. Epic aggregation:
Epic status is derived from task states.

Q34. Aggregation mechanism:
Use a helper script to compute aggregate status and sync `.plan/index.md`.

Q35. Runner permissions:
The runner may not invent aggregate states manually.

Q36. Canonical atomic state:
Sub-task entries inside task files are the source of truth.

Q37. Stable identifiers:
Every sub-task needs a stable ID.

Q38. Strict schema:
Task files remain markdown, but sub-task blocks become strictly parseable.

Q39. Execution notes:
Separate planning fields from execution notes inside each sub-task block.

Q40. Memory boundaries:
Execution notes stay local; durable memory stays in run history and summaries.

Q41. Installer-owned automation:
The framework installer must provision helper scripts, not only templates.

Q42. Helper script location:
Use `.plan/helper-scripts/` and Bash-first implementation.

Q43. Helper script manifest ownership:
The manifest must record the helper scripts it owns.

Q44. Installer placement:
Bootstrap installer stays outside `.plan/`.

Q45. Public install UX:
Offer a `curl | bash` path plus a safer manual path.

Q46. Single installer entrypoint:
Use one entrypoint for both install and update.

Q47. Drift handling:
Prompt per managed file with overwrite, skip, or abort.

Q48. Backups:
Do not auto-create backups; rely on Git.

Q49. Dirty worktrees:
Warn and let the user choose whether to continue.

Q50. `agents.local.md`:
Treat it as optional repo-context extension, never required or auto-created by
the framework installer.

Q51. Wrapper skill provisioning:
Framework-owned wrapper skills belong in the framework install surface.

Q52. Skill selection UX:
Let users choose all framework skills or select manually.

Q53. Repo-local installs:
Repo-local skill installs must be agent-aware rather than pretending one path
works everywhere.

Q54. Supported target matrix:
V1 explicitly supports Codex repo-local and Hermes global.

Q55. Meaning of “install all”:
It means all portable framework skills, not every general skill in this repo.

Q56. Curated skill set:
The set must live in an explicit manifest, not directory-name inference.

Q57. Workflow conversion:
The `commit` workflow must become a first-class skill in v1.

Q58. `ralph-loop` skill:
Exclude the current skill from the default install set; the runners own the
real loop.

Q59. Default and add-on skill sets:
Core vs add-ons were accepted as the initial structure.

Q60. Dependency metadata:
Use `localDependencies` and `externalPrerequisites`.

Q61. External prereq enforcement:
Missing external prerequisites must fail install.

Q62. Resolved install plan:
Show the final resolved plan before applying writes.

Q63. Dependency-only visibility:
Hide dependency-only skills from the first selection UI and show them only in
the resolved plan.

Q64. `selectable` metadata:
Represent selectability explicitly in the manifest.

Q65. `commit` dependencies:
`commit` is top-level selectable; `conventional-commits` is a local dependency.

Q66. `code-review`:
Keep it standalone and not coupled to larger specialist bundles.

Q67. Add-on strategy:
Architecture/testing/diagnostics stay manual-select add-ons in v1.

Q68. Architect role:
Use `backend-specialist` for v1 instead of inventing a new
`solutions-architect`.

Q69. Final add-on list:
Architecture/testing/diagnostics set locked.

Q70. `test-master` dependency closure:
It pulls the local testing specialist skills automatically.

Q71. Testing dependency selectability:
Those test specialists are dependency-only in v1.

Q72. Backend/frontend relationship:
Keep them independent add-ons.

Q73. React/Tailwind/Shadcn relationship:
Keep them independent add-ons too.

Q74. Review ownership:
Keep the local `code-review` skill even though Matt has `review`.

Q75. `find-skills`:
Remove it from the default framework set.

Q76. `to-epic-issues`:
Keep it in the default framework set.

Q77. `commit`:
Keep it in the default framework set.

Q78. Bundle naming:
Present the default core set as `Ralph Loop Core`.

Q79. Add-on grouping:
Group add-ons into named bundles.

Q80. Bundle default selection behavior:
Selecting a bundle preselects all of its skills.

Q81. Resolved plan presentation:
Show both bundles and concrete skills.

Q82. Ownership clarity:
Separate framework-owned installs from external prerequisite validation.

Q83. Public skill naming:
Use the public name `commit`.

Q84. Commit workflow transition:
Keep the old workflow temporarily, then remove it after verification.

Q85. Wrapper naming:
Use the public skill name `to-epic-issues`.

Q86. Skill updates:
Installer updates framework-owned skills in the same pass as `.plan` files.

Q87. Global namespacing:
Global installs use explicit namespaced storage paths.

Q88. Codex repo-local creation:
The installer may create `.agents/skills/` if missing.

Q89. Hermes namespace:
Use `~/.hermes/skills/luna-ai/<skill-name>/`.

Q90. Codex namespace:
Use `.agents/skills/luna-ai/<skill-name>/`.

Q91. Public vs storage names:
Public names stay simple despite namespaced storage paths.

Q92. Manifest naming split:
Store public name and install path separately.

Q93. Installed-skills record:
Manifest stores target-specific install records for framework-owned skills.

Q94. Multi-target installs:
Allow the same skill set to install for multiple targets.

Q95. Per-target drift handling:
Prompt per target when drift exists.

Q96. Non-interactive mode:
Design for it later, but keep v1 interactive-first.

Q97. Uninstall:
Out of scope for v1.

Q98. Installer location:
Installer source belongs under `frameworks/ralph-loop/installer/`.

Q99. Public entrypoint path:
Use `frameworks/ralph-loop/installer/install.sh`.

Q100. Installer implementation:
Keep the Node installer package there too.

Q101. Self-contained package:
Installer lives as its own small Node package.

Q102. Target repo independence:
Do not rely on target repo dependencies.

Q103. Pinned installer dependencies:
Pin prompt/runtime deps such as `@clack/prompts`.

Q104. Bootstrap runtime checks:
Verify Node availability up front.

Q105. Git checks:
Verify Git availability up front.

Q106. Curl checks:
Verify `curl` and provide fallback guidance if missing.

Q107. Source strategy:
Fetch framework files from the repo contents instead of embedding them in the
bootstrap script.

Q108. Provenance recording:
Record resolved source SHA in the manifest.

Q109. Default ref:
Default to the repo’s default branch head while leaving room for future ref
overrides.

Q110. Source confirmation:
Show repo URL, ref, and SHA in the resolved plan.

Q111. Temporary workdir:
Use `/tmp` for bootstrap downloads and clean up on exit.

Q112. Git repository requirement:
The installer runs only inside a Git repository.

Q113. Repo root handling:
Target repo root matters.

Q114. Subdirectory behavior:
Detect and confirm repo root instead of hard-failing on subdirectory launches.

Q115. Write timing:
Only create the managed `.plan` surface after validation and confirmation.

Q116. Installed-state detection:
Use `.plan/.framework` plus `.plan/.framework-install.json`.

Q117. Existing unmanaged `.plan`:
Prompt for adopt or abort.

Q118. Adoption safety:
Only start managing the framework-owned subset when adopting.

Q119. Adoption provenance:
Record fresh install vs adoption in the manifest.

Q120. Adoption compatibility:
Allow adoption only for compatible `.plan` layouts.

Q121. Supported starting states:
Recognize installed frameworks and compatible unmanaged `.plan` layouts; not
old `.specify` layouts.

Q122. Migration:
Do not auto-migrate `.specify` in v1.

Q123. Target audience:
Keep v1 messaging and assumptions single-user oriented for now.

Q124. Execution:
Stop grilling and implement the framework using the locked decisions.

## Resulting Artifact Map

The grilling session directly led to:

- `frameworks/ralph-loop/.plan/*`
- `frameworks/ralph-loop/.plan/helper-scripts/*`
- `frameworks/ralph-loop/installer/*`
- `frameworks/ralph-loop/skills-manifest.json`
- `frameworks/ralph-loop/framework-files.json`
- `.agents/skills/commit/*`
- `.agents/skills/to-epic-issues/*`

## What Was Implemented From The Session

- The core framework source was implemented and committed in `a3716bf`.
- Local verification covered install, update, adoption, and `--all` bundle
  resolution using clean throwaway Git repositories under `/tmp`.
- Remaining work is rollout and hardening, not the core framework source.
