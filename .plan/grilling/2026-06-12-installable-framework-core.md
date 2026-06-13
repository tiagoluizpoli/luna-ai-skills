# Grilling Session: Installable Ralph Loop Framework Core

Date: 2026-06-12
Scope: convert the long design session into a durable record with the exact
question trail, local context for each question, and the final accepted
decision.

## Session Context

The session started from a narrow split problem, but it quickly became clear
that the real objective was larger:

- stop mixing the Ralph Loop workflow with SpecKit ownership and branding
- move the live workflow state to `.plan/`
- build an installable framework instead of relying on symlinks
- keep Matt Pocock skills as external prerequisites
- package the framework-owned skills and installer behavior in this repository
- make the framework reusable, but optimize v1 for the user's own workflow first

The answers below preserve the question trail that produced the current
framework contract.

## Exact Question Register

### Q1
Exact question:
"For the installer, do you want `.plan/` to be treated as two classes of files?"

Context:
The user wanted prompt and rule files to stay framework-owned while PRD, index,
backlog, and execution state stayed owned by the live workflow.

Decision:
Yes. Split `.plan` into framework-managed files and workflow-owned files.

### Q2
Exact question:
"Where should model escalation be decided?"

Context:
The user wanted risky sub-task slices to run on stronger models without making
the weaker model guess when it was too weak.

Decision:
Use sub-task metadata, not free-form runtime guessing.

### Q3
Exact question:
"Should `to-issues` stay focused on publishing top-level implementation slices,
with a separate Ralph Loop framework skill responsible for turning approved
slices into `.plan` epics/tasks/sub-tasks?"

Context:
The user explained that Matt Pocock's `to-issues` already existed and should
not be overloaded with framework-specific file-tree responsibilities.

Decision:
Yes. Keep `to-issues` generic and split the `.plan` adapter role elsewhere.

### Q4
Exact question:
"When we do find or recreate `to-epic-issues`, should it become a
framework-managed installable skill alongside the `.plan` starter, instead of
remaining Hermes-only?"

Context:
The user was already using `/to-epic-issues` and wanted the framework to own
that wrapper instead of leaving it buried in a Hermes-only path.

Decision:
Yes. `to-epic-issues` belongs to the framework overlay.

### Q5
Exact question:
"When we bring `to-epic-issues` into this repo, should we preserve the split
between `to-issues` = decomposition engine and `to-epic-issues` = filesystem
adapter?"

Context:
The located Hermes wrapper already had this shape, but it targeted the old
SpecKit-style filesystem.

Decision:
Yes. Keep `to-issues` generic and make `to-epic-issues` the `.plan` adapter.

### Q6
Exact question:
"Do you want the installer for this framework to have a hard prerequisite step
like: install Matt Pocock shared skills, install/update the Ralph Loop
framework, and verify both are present?"

Context:
The user clarified that Matt Pocock skills were not optional helpers but real
prerequisites for the workflow.

Decision:
Yes. The prerequisite boundary must be explicit.

### Q7
Exact question:
"Should this repo vendor a local copy of the Matt Pocock shared skills, or
should the installer pull/install them from the upstream source each time and
treat them as external?"

Context:
The framework needed to avoid forking Matt Pocock's skills into a second source
of truth.

Decision:
Use the upstream source and keep Matt Pocock skills external.

### Q8
Exact question:
"How should the installer locate the upstream Matt Pocock skills?"

Context:
This question was asked before the user clarified that Matt already provides
his own installer command.

Decision:
Superseded. The final rule is to use Matt Pocock's own installer command and
not invent a new source locator UX.

### Q9
Exact question:
"When our framework installer runs and Matt Pocock’s skills are missing, should
it hard-stop with a clear prerequisite error instead of trying to continue?"

Context:
The user wanted the prerequisite to be real, not a soft recommendation.

Decision:
Yes. Missing Matt Pocock skills must hard-stop the framework install.

### Q10
Exact question:
"Should our installer check for the specific required Matt Pocock skills instead
of merely checking that 'some Matt Pocock skills' are installed?"

Context:
The user wanted dependency validation that was concrete and auditable.

Decision:
Yes. Validate named external skills, not vague presence.

### Q11
Exact question:
"For the `.plan` installer/update command, should it update only the
framework-managed files and leave all workflow-owned files untouched, even if
they differ from the starter?"

Context:
The user wanted re-installs and updates to refresh framework assets without
destroying live project planning state.

Decision:
Yes. Only framework-managed files are overwritten by default.

### Q12
Exact question:
"Where should the installer record which framework version/layout was last
applied so future updates can patch safely?"

Context:
Update behavior needed durable metadata rather than file-guessing.

Decision:
Use `.plan/.framework-install.json`.

### Q13
Exact question:
"Should the installer also own a lock file for the framework contract, separate
from the manifest, so the runtime can tell 'this repo is on the Ralph Loop
framework' without parsing all of `.plan/`?"

Context:
The framework needed a cheap installed-state check as well as a richer manifest.

Decision:
Yes. Use a simple marker file in addition to the manifest.

### Q14
Exact question:
"How should the single backlog file distinguish 'do soon' from 'defer for
later'?"

Context:
The user rejected separate backlog files and wanted one backlog with clear
urgency semantics.

Decision:
Use `status` and `horizon` columns in one backlog file.

### Q15
Exact question:
"Where should the model-tier metadata live for execution?"

Context:
The user wanted precise model-tier control at the smallest execution unit
without bloating every task.

Decision:
Put a task-level default on the task and allow sub-task overrides.

### Q16
Exact question:
"Should `to-epic-issues` itself write that model metadata into the generated
task files, instead of relying on humans to add it afterward?"

Context:
The user wanted the generated task tree to be operational from day one.

Decision:
Yes. `to-epic-issues` must emit the model metadata.

### Q17
Exact question:
"When `to-epic-issues` is uncertain about model tier, should it default to
`medium`, or should it force a human decision during generation?"

Context:
The user wanted sane defaults without turning generation into an interactive
burden.

Decision:
Default to `medium`, elevate only for known risk patterns.

### Q18
Exact question:
"Do you want this metadata embedded directly in markdown like that, or do you
want YAML frontmatter per sub-task block?"

Context:
After discussing runtime escalation state, the user wanted a readable but
parseable encoding for sub-task metadata.

Decision:
Use inline markdown fields, not nested YAML frontmatter.

### Q19
Exact question:
"Do you want the framework to use this three-way split:
`.run-state.json`, `progress.txt`, and `.run-history.jsonl`?"

Context:
The user pushed back on making `progress.txt` either the only durable machine
memory or only a human log.

Decision:
Yes. Use run-state, progress, and structured run-history.

### Q20
Exact question:
"When a new clean Ralph Loop run starts, how much history should it load from
`.plan/.run-history.jsonl`?"

Context:
The user was worried about context bloat, but also worried about missing older
important history.

Decision:
Superseded by later refinement. The final rule is not "load the last N lines"
but "load a small curated summary by default and retrieve older history
deterministically when relevant."

### Q21
Exact question:
"Do you want a separate always-load summary file, in addition to the full
history log?"

Context:
The user wanted older important facts to remain discoverable without polluting
every run's default context.

Decision:
Yes. Add `.run-summary.md`.

### Q22
Exact question:
"Who should write `.plan/.run-summary.*`?"

Context:
The summary needed to stay current without becoming a manual maintenance burden.

Decision:
The runner updates it incrementally, but only with durable conclusions.

### Q23
Exact question:
"Should `.run-summary.md` be scoped to the current PRD/run family, with older
summaries archived when a new PRD becomes current?"

Context:
The user plans per feature/run family rather than keeping one gigantic eternal
PRD tree.

Decision:
Yes. Active summary per current run family, archived older summaries.

### Q24
Exact question:
"Should the same scoping rule apply to the epic/task execution tree itself?"

Context:
The user did not want dozens of finished tasks and epics bloating the active
workspace forever.

Decision:
Yes. Active execution tree stays small; older run families are archived.

### Q25
Exact question:
"Do you want the framework to require an explicit historical retrieval phase
before any sub-task execution that touches previously-worked areas?"

Context:
The user wanted the framework to be AFK-safe and able to search its own prior
work without human intervention.

Decision:
Yes. Historical retrieval is a mandatory phase when relevant.

### Q26
Exact question:
"Should retrieval be based primarily on structured keys first, and full-text
search second?"

Context:
The user wanted the retrieval process to be deterministic, cheap, and as
non-hallucinatory as possible.

Decision:
Yes. Structured keys first, tags second, full text last.

### Q27
Exact question:
"Do you want the retrieval script to return ranked matches plus a compact
synthesized bundle, instead of dumping raw matching files?"

Context:
The user wanted retrieval to help the model, not recreate the context-bloat
problem.

Decision:
Yes. Return ranked hits plus a compact bundle.

### Q28
Exact question:
"Do you want the framework to allow up to 2 bounded retrieval rounds by
default?"

Context:
The user raised the edge case where one retrieval pass points to a second
important source.

Decision:
Adjusted by the user from 2 to 3. Final rule: three bounded retrieval rounds.

### Q29
Exact question:
"When a sub-task/task becomes blocked, should Ralph Loop continue with the next
dependency-safe executable task in the active run family, and only abort if no
executable work remains?"

Context:
The user did not want one blocked slice to stop the whole run if other
independent work still existed.

Decision:
Yes. Continue with other dependency-safe executable work if possible.

### Q30
Exact question:
"Do you want `blocked` to be a first-class durable status in both the task file
and `.plan/index.md`, with the runner forbidden from selecting blocked work
unless an explicit unblock action has happened?"

Context:
The blocked state needed to persist across future clean runs rather than being
forgotten.

Decision:
Yes. `blocked` is durable and respected.

### Q31
Exact question:
"What should count as an explicit unblock action?"

Context:
The blocked status needed a deterministic way to clear, not model optimism or a
new run.

Decision:
Only concrete recorded transitions may unblock work.

### Q32
Exact question:
"Should task status be derived from sub-task states, with a task becoming
`blocked` only when no executable sub-tasks remain?"

Context:
The user pushed back on the earlier coarse idea that one blocked sub-task should
block the entire parent task.

Decision:
Yes. Task status is derived from sub-task state.

### Q33
Exact question:
"Should the epic status also be derived the same way from its tasks?"

Context:
The same aggregation logic that applied to tasks needed to extend upward.

Decision:
Yes. Epic status is derived from task state.

### Q34
Exact question:
"Do you want the runner to compute those aggregate statuses itself every run, or
should there be a local helper script that recomputes and syncs `.plan/index.md`
and task/epic statuses deterministically?"

Context:
The aggregation logic is deterministic and should not burn tokens or rely on
model improvisation.

Decision:
Use a local helper script.

### Q35
Exact question:
"Should the runner be forbidden from editing aggregate statuses directly by
hand, and only allowed to change atomic state plus invoke the sync script?"

Context:
The user wanted one clear source of truth for derived state.

Decision:
Yes. Only atomic state is edited directly; aggregates are script-derived.

### Q36
Exact question:
"What should be the atomic source of truth for execution state?"

Context:
The framework needed one canonical durable state surface rather than dual-write
drift between task files and index files.

Decision:
Sub-task entries inside task files are the atomic source of truth.

### Q37
Exact question:
"Do you want each sub-task to have an explicit stable identifier, so runtime
state, history, retrieval, and blocking can all refer to it deterministically
even if the prose title changes?"

Context:
The user wanted durable machine references that would survive wording changes.

Decision:
Yes. Every sub-task gets a stable ID.

### Q38
Exact question:
"Should task files move from 'loose markdown headings' to a strict parseable
sub-task schema, still in markdown, so scripts can read/write them safely?"

Context:
The new helper scripts and runtime logic required more than loose prose.

Decision:
Yes. Keep markdown, but enforce a strict schema.

### Q39
Exact question:
"Should that strict schema be designed to be append-friendly, so the runner can
add execution notes under a sub-task without mutating the core planning fields?"

Context:
The user wanted to preserve clean planning fields while still leaving local
execution notes close to the task.

Decision:
Yes. Split planning fields from execution notes.

### Q40
Exact question:
"Should execution notes inside task files be treated as local task context
only, while durable cross-task/cross-run memory still belongs in
`.run-history.jsonl` and `.run-summary.md`?"

Context:
The user did not want task files to bloat into the primary history surface.

Decision:
Yes. Task notes are local only.

### Q41
Exact question:
"Should the install/update flow also provision the helper scripts that this
design now depends on, not just markdown templates?"

Context:
The runtime contract was no longer just static markdown.

Decision:
Yes. Helper scripts are part of the installed framework surface.

### Q42
Exact question:
"Do you want the helper scripts to live under `.plan/scripts/` and be Bash by
default, only introducing another language if a specific script becomes too
awkward in Bash?"

Context:
This was the initial wording before the user refined the folder name.

Decision:
Superseded. Final rule: `.plan/helper-scripts/`, Bash-first.

### Q43
Exact question:
"Should the framework-managed manifest include the helper script list too, so
the installer knows exactly which files under `.plan/helper-scripts/` it owns
and may overwrite on update?"

Context:
The installer needed explicit managed ownership over helper scripts.

Decision:
Yes. Helper scripts are tracked in the managed file metadata.

### Q44
Exact question:
"Should the framework installer itself also live as a helper script inside the
framework, or do you want installation to stay outside `.plan` because `.plan`
does not exist yet at first install?"

Context:
The user wanted bootstrap/install logic clearly separated from the runtime
surface installed into target repos.

Decision:
Keep the installer outside `.plan`.

### Q45
Exact question:
"Do you want the public install UX to be a single documented one-liner of the
form `curl ... | bash`, with a second safer/manual alternative right below it?"

Context:
The user wanted a convenient bootstrap path but also a way to inspect it first.

Decision:
Yes. Provide both paths.

### Q46
Exact question:
"Should the installer support both install and update modes through the same
bootstrap entrypoint?"

Context:
The user wanted one stable command rather than separate commands for first-time
setup vs refresh.

Decision:
Yes. One entrypoint handles install and update.

### Q47
Exact question:
"Do you want drift handling to default to an interactive per-file prompt with:
overwrite, keep local / skip, abort update?"

Context:
The user wanted safety for managed-file drift but preferred a prompt over a hard
stop or silent overwrite.

Decision:
Yes. Drift uses an interactive per-file prompt.

### Q48
Exact question:
"Should the installer create automatic backups of overwritten managed files
during update, or is git expected to be the safety net?"

Context:
The user wanted to avoid cluttering repos with installer backup files.

Decision:
Use Git as the safety net; no automatic backups.

### Q49
Exact question:
"Should the installer refuse to proceed on a dirty git worktree, or merely warn
and let the user choose?"

Context:
The user works in repos that may legitimately be mid-flight during framework
updates.

Decision:
Warn and let the user choose.

### Q50
Exact question:
"Do you want `agents.local.md` to be treated as an optional repo-context
extension, never created by the installer and never required for the framework
to run?"

Context:
The user wanted to avoid tying the framework too strongly to agent-specific root
files.

Decision:
Yes. `agents.local.md` is optional only.

### Q51
Exact question:
"Should the framework installer also provision the helper wrapper skill
`to-epic-issues` into the centralized skill pool here, or should that be a
separate manual import step after the framework install?"

Context:
The user depends on `to-epic-issues` as part of the real workflow, not as an
optional extra.

Decision:
Provision it as part of the framework.

### Q52
Exact question:
"For our installer’s skill phase, should the flow be: choose scope ('install
all framework skills' vs 'choose skills manually'), then choose target for the
selected set?"

Context:
The user wanted Matt-style interactive skill installation and the ability to
control what is installed.

Decision:
Yes. The installer should offer that flow.

### Q53
Exact question:
"Should the installer become agent-aware, so `repo-local` is only offered for
agents we can actually verify support it for, instead of pretending one local
path works everywhere?"

Context:
The user uses multiple agents and wanted local install behavior grounded in real
support rather than wishful uniformity.

Decision:
Yes. Support must be agent-aware.

### Q54
Exact question:
"Should we keep the supported targets explicit and narrow like this:
Codex repo-local, Hermes global, Claude-style global/manual bridge, AGY no
separate skill target yet?"

Context:
The user wanted v1 grounded in what could be justified from actual tool
behavior.

Decision:
Yes. Keep the first target matrix narrow and explicit.

### Q55
Exact question:
"When the user chooses `install all framework skills`, should 'all' mean only
the skills tagged as `framework-portable`, not every non-SpecKit skill in this
repo?"

Context:
The repo contains many useful skills that are not actually core Ralph Loop
framework assets.

Decision:
Yes. "All" means the curated framework set only.

### Q56
Exact question:
"Where should that curated framework skill list live?"

Context:
The user wanted skill ownership and installability captured explicitly instead
of encoded in folder names.

Decision:
Keep it in a single framework-owned manifest.

### Q57
Exact question:
"Should wrapper workflows that are not yet packaged as skills, like the current
commit workflow under `.agents/workflows/commit.md`, be excluded from installer
v1 until they are converted into real `SKILL.md` packages?"

Context:
The user immediately rejected excluding `commit` and insisted it must be turned
into a real skill in this planning cycle.

Decision:
No. Convert `commit` into a real skill for v1.

### Q58
Exact question:
"Should we exclude the current `ralph-loop` skill from the v1 install set and
let the runner scripts remain the real execution surface for now?"

Context:
The user explained that the current `ralph-loop` skill came from an older
single-session loop pattern that burned too much context.

Decision:
Yes. Exclude the current `ralph-loop` skill from v1.

### Q59
Exact question:
"With `ralph-loop` removed and Matt Pocock skills excluded from our owned set,
should the v1 default framework skill set now be: `to-epic-issues`, `commit`,
`code-review`, and candidate add-ons?"

Context:
The user wanted a concrete starting slate for framework-owned skills.

Decision:
Yes, with later refinement to remove `find-skills` from default and classify
the rest as add-ons or dependencies.

### Q60
Exact question:
"Do you want the manifest to support two dependency types per skill:
`localDependencies` and `externalPrerequisites`?"

Context:
The installer needed to distinguish between owned local dependency closure and
external Matt Pocock prerequisites.

Decision:
Yes. Use both dependency types.

### Q61
Exact question:
"Should the installer fail the selected skill set if any
`externalPrerequisites` are missing, even when the user is only installing
repo-local skills?"

Context:
The user wanted installability to mean actual usability, not half-installed
broken surfaces.

Decision:
Yes. Missing external prerequisites fail the install.

### Q62
Exact question:
"Should the installer show the user the final resolved install plan before
applying it?"

Context:
Dependency expansion, bundle selection, and multi-target installs needed a
transparent summary before any writes.

Decision:
Yes. Always show the resolved plan first.

### Q63
Exact question:
"When the user chooses `install all framework skills`, should dependency-only
skills be hidden from the first selection UI and shown only in the resolved
plan?"

Context:
The user wanted the initial skill UI to stay about meaningful top-level choices.

Decision:
Yes. Dependency-only skills stay out of the first selection UI.

### Q64
Exact question:
"Should the manifest distinguish between `selectable` skills and
`dependency-only` skills explicitly, instead of inferring that from whether
something is depended on?"

Context:
A skill can be both a dependency and a top-level choice; inference would get
messy.

Decision:
Yes. Add explicit `selectable` metadata.

### Q65
Exact question:
"Should `commit` be a top-level selectable framework skill in v1, with
`conventional-commits` marked as a local dependency rather than separately
selectable by default?"

Context:
The user wanted `commit` to feel like one coherent surface instead of exposing
its implementation detail first.

Decision:
Yes. `commit` is top-level; `conventional-commits` is a dependency.

### Q66
Exact question:
"Should `code-review` stay top-level selectable, and if it has no internal
local dependencies, be installable by itself without pulling in
architecture/testing specialists automatically?"

Context:
The user wanted `code-review` usable on its own.

Decision:
Yes. `code-review` stays standalone.

### Q67
Exact question:
"For the architecture/testing specialist candidates, should we keep them
manual-select add-ons in v1 rather than part of the default `install all
framework skills` set?"

Context:
The user wanted the default install to stay lean while still allowing stronger
bundles.

Decision:
Yes. Keep them as add-ons, not default core.

### Q68
Exact question:
"Do you want v1 to include a brand new top-level `solutions-architect` skill,
or should we treat `backend-specialist` as that role for now?"

Context:
The user thought there might already be a solutions-architect-style skill, but
disk inspection showed the closest owned fit was `backend-specialist`.

Decision:
Use `backend-specialist` for v1.

### Q69
Exact question:
"With Matt’s skills removed from our owned set, should the v1 manual-select
add-ons now be: `backend-specialist`, `frontend-specialist`,
`react-architect`, `tailwind-architect`, `shadcn-specialist`, `test-master`,
and `diagnose`?"

Context:
The add-on bundle list needed a final owned-only shape.

Decision:
Yes. That is the v1 add-on set.

### Q70
Exact question:
"Should `test-master` pull in its local testing dependencies automatically if
they are selected from our repo, for example `test-cases`, `test-backend`,
`test-frontend`, `test-e2e`, and `test-coverage`?"

Context:
The user wanted dependency completeness rather than broken specialist bundles.

Decision:
Yes. `test-master` pulls its test-skill closure.

### Q71
Exact question:
"Should those pulled-in testing skills be marked `dependency-only` in v1, with
`test-master` as the only top-level selectable testing entry by default?"

Context:
The user wanted the install UI to stay simple while keeping the internal
dependency graph complete.

Decision:
Yes. The test specialist skills are dependency-only in v1.

### Q72
Exact question:
"Should `backend-specialist` and `frontend-specialist` remain independent
top-level add-ons, or do you want one meta-skill to pull both automatically?"

Context:
The user wanted flexibility because not every repo would need both.

Decision:
Keep them independent.

### Q73
Exact question:
"Should `react-architect`, `tailwind-architect`, and `shadcn-specialist`
remain independent add-ons too, instead of being auto-pulled by
`frontend-specialist`?"

Context:
The user did not want frontend specialization to silently imply every possible
frontend stack skill.

Decision:
Yes. Keep them independent.

### Q74
Exact question:
"Should `code-review` stay in the default framework set even though you also
have Matt’s `review` skill installed separately?"

Context:
The user has both local and external review surfaces; ownership clarity mattered.

Decision:
Yes. Keep the local `code-review` skill in the framework core.

### Q75
Exact question:
"Should `find-skills` stay in the default framework set, or do you see it as a
development helper for this repo rather than something end-user repos need
installed?"

Context:
The user wanted the default set to be practical, not cluttered with authoring
helpers.

Decision:
Remove `find-skills` from the default framework set.

### Q76
Exact question:
"Should `to-epic-issues` remain in the default framework set even though it is
mainly a planning-phase skill, not an execution-phase skill?"

Context:
The user's standard lifecycle starts with PRD-to-epic decomposition, not only
the execution loop.

Decision:
Yes. `to-epic-issues` stays in the core set.

### Q77
Exact question:
"Should `commit` also remain in the default framework set even though it is a
closeout/operational skill rather than a planning or execution skill?"

Context:
The user explicitly called it one of the most important skills to have.

Decision:
Yes. `commit` stays in the core set.

### Q78
Exact question:
"Should the installer present the default framework set as a named bundle, for
example `Ralph Loop Core`, instead of just a raw list of three skills?"

Context:
The user wanted the installer UX to feel intentional rather than flat.

Decision:
Yes. Use `Ralph Loop Core` as the default bundle name.

### Q79
Exact question:
"Should the add-ons also be grouped into named bundles in the installer UI,
instead of a flat checklist?"

Context:
The user wanted a more structured installation UI.

Decision:
Yes. Group add-ons into named bundles.

### Q80
Exact question:
"Inside those named bundles, should the installer default to: bundle selected =
all skills in that bundle selected, then user may deselect individual skills
before confirming?"

Context:
The user wanted bundles to be efficient without removing fine-grained control.

Decision:
Yes. Bundles preselect their contained skills.

### Q81
Exact question:
"Should the resolved install plan show bundles and individual skills separately,
so the user can see both what they asked for conceptually and what will actually
be installed concretely?"

Context:
The user wanted both conceptual and concrete visibility in the install plan.

Decision:
Yes. Show both.

### Q82
Exact question:
"Should the installer also show, in that resolved plan, which parts come from
our framework versus which are only validated external prerequisites from Matt
Pocock’s skill set?"

Context:
The user caught earlier confusion between local skills and Matt's skills and
wanted it made explicit.

Decision:
Yes. Separate framework-owned installs from external prerequisites in the plan.

### Q83
Exact question:
"For the new `commit` skill, should it be installed under the simple name
`commit`, even though there is already a workflow markdown file called
`.agents/workflows/commit.md` in this repo?"

Context:
The user wanted the public skill surface to be clean and global-friendly.

Decision:
Yes. Public skill name is `commit`.

### Q84
Exact question:
"When we create the new `commit` skill, should we keep
`.agents/workflows/commit.md` temporarily as an internal source/reference, or
remove it once the skill exists?"

Context:
The user wanted a migration-safe transition rather than deleting the source note
immediately.

Decision:
Keep it temporarily, then remove it after verification.

### Q85
Exact question:
"Should `to-epic-issues` also use the clean public skill name exactly as
`to-epic-issues`, regardless of where it is installed?"

Context:
The wrapper needed a stable public identity across install targets.

Decision:
Yes. Keep the public name `to-epic-issues`.

### Q86
Exact question:
"Should the framework installer support updating installed skills it owns in the
same pass as `.plan` files, using the same drift/overwrite prompt rules?"

Context:
The framework-owned skill surface and `.plan` surface needed to stay in sync.

Decision:
Yes. Update skills in the same pass.

### Q87
Exact question:
"For globally installed framework-owned skills, should the installer manage them
in an agent-specific namespace/path rather than mixing them into unrelated
global skill pools without metadata?"

Context:
The user wanted ownership boundaries visible and safer for update/uninstall.

Decision:
Yes. Use namespaced global paths.

### Q88
Exact question:
"For Codex repo-local installs, should the installer be allowed to create
`.agents/skills/` if it does not exist yet?"

Context:
Repo-local installs needed to be self-sufficient.

Decision:
Yes. The installer may create that path.

### Q89
Exact question:
"For Hermes global installs, should the installer place framework-owned skills
under a dedicated category path such as `~/.hermes/skills/luna-ai/<skill-name>/`,
instead of dropping them directly beside everything else?"

Context:
The user wanted ownership clearly visible in Hermes global installs.

Decision:
Yes. Use a `luna-ai` namespace in Hermes global installs.

### Q90
Exact question:
"Should Codex repo-local installs also use a dedicated namespace folder, for
example `.agents/skills/luna-ai/<skill-name>/`, or should they stay flat?"

Context:
The user wanted consistency between local and global install storage.

Decision:
Yes. Use the `luna-ai` namespace for Codex repo-local installs too.

### Q91
Exact question:
"Should the public skill name still remain simple, like `commit` and
`code-review`, even if the on-disk install path is namespaced under `luna-ai/`?"

Context:
The user wanted clean invocation names without giving up namespaced storage.

Decision:
Yes. Keep simple public names.

### Q92
Exact question:
"Should the skill manifest store both the public skill name and the install path
template separately, so naming stays stable even if storage layout changes
later?"

Context:
The installer metadata needed a clean separation between public contract and
storage details.

Decision:
Yes. Store them separately.

### Q93
Exact question:
"Should the installer also generate and maintain an installed-skills record in
the framework manifest, so update mode knows exactly which framework-owned
skills were installed for which agent target?"

Context:
The user wanted multi-target updates and future uninstalls to be deterministic.

Decision:
Yes. Record installed skills per target.

### Q94
Exact question:
"Should the framework allow the same skill set to be installed for multiple
targets at once, for example Codex repo-local and Hermes global?"

Context:
The user works across multiple agents and wanted one install plan to cover them.

Decision:
Yes. Multi-target install is part of the contract.

### Q95
Exact question:
"When the same public skill is installed to multiple targets, should update mode
prompt per target if drift exists, instead of treating all targets as one unit?"

Context:
Different targets can diverge independently.

Decision:
Yes. Drift handling is per target.

### Q96
Exact question:
"Should the installer support a non-interactive mode later, but keep v1
primarily interactive and optimize the implementation for that first?"

Context:
The user wanted the installer UX polished first and broader automation later.

Decision:
Yes. Interactive-first in v1.

### Q97
Exact question:
"Should v1 include uninstall support too, or should we scope v1 to
install/update only and add uninstall later?"

Context:
The user wanted to finish the valuable surface before expanding further.

Decision:
Scope v1 to install/update only.

### Q98
Exact question:
"Should the bootstrap installer script live in a dedicated source directory in
this repo, for example `frameworks/ralph-loop/installer/`, rather than at repo
root?"

Context:
The user wanted the framework implementation kept together instead of polluting
repo root.

Decision:
Yes. Use `frameworks/ralph-loop/installer/`.

### Q99
Exact question:
"Should the public one-liner fetch a stable entrypoint such as
`frameworks/ralph-loop/installer/install.sh`, with that script then downloading
any additional installer files it needs?"

Context:
The bootstrap needed one stable raw URL path.

Decision:
Yes. `install.sh` is the public entrypoint.

### Q100
Exact question:
"Should the Node interactive installer code to also live under
`frameworks/ralph-loop/installer/`, with the Bash entrypoint only bootstrapping
and delegating into it?"

Context:
The user wanted bootstrap and Node installer colocated in one dedicated source
area.

Decision:
Yes. Keep both there.

### Q101
Exact question:
"Should that installer implementation be a small self-contained Node package in
`frameworks/ralph-loop/installer/` with its own `package.json`, so the
bootstrap script can run it predictably without coupling to the target repo?"

Context:
The user wanted the installer to be self-contained and independent of target
repo dependencies.

Decision:
Yes. The installer is its own small Node package.

### Q102
Exact question:
"Should the bootstrap script avoid assuming the target repo already has Node
dependencies installed, and instead run the installer as a self-contained
package fetched from this framework source?"

Context:
The target repo should not need preexisting dependencies just to install the
framework.

Decision:
Yes. The installer is self-contained.

### Q103
Exact question:
"Should the installer package pin its own prompt/runtime dependencies
explicitly, for example `@clack/prompts`, instead of depending on transitive
availability from the user’s machine?"

Context:
The user wanted predictable installer behavior rather than ambient dependency
luck.

Decision:
Yes. Pin the installer dependencies.

### Q104
Exact question:
"Should the bootstrap script verify that a compatible `node` runtime exists
before attempting the Node installer, and fail early with a clear message if
not?"

Context:
The bootstrap needed actionable prereq failures.

Decision:
Yes. Check Node up front.

### Q105
Exact question:
"Should the bootstrap script also verify `git` availability up front, since
install/update logic depends on worktree checks and source provenance?"

Context:
Git is a core dependency of the framework lifecycle.

Decision:
Yes. Check Git up front.

### Q106
Exact question:
"Should the bootstrap script verify `curl` availability too, and if it’s
missing, print a manual fallback path instead of trying to continue?"

Context:
The bootstrap path itself depends on `curl`.

Decision:
Yes. Check `curl` and provide fallback guidance.

### Q107
Exact question:
"Should the installer source its framework files directly from the checked-in
repo contents on GitHub at install time, rather than embedding large file
payloads inside the bootstrap script itself?"

Context:
The user wanted a small bootstrap script and framework files owned by repo
contents rather than shell-embedded blobs.

Decision:
Yes. Fetch real repo contents at install time.

### Q108
Exact question:
"Should the installer fetch a specific ref by default, like the repository’s
default branch head, and record the resolved commit SHA in
`.plan/.framework-install.json` for reproducible updates/debugging?"

Context:
The user wanted provenance recorded and update behavior debuggable.

Decision:
Yes. Record repo URL, ref, and resolved SHA.

### Q109
Exact question:
"Should v1 default to installing from the repository’s default branch head,
while still recording the resolved commit SHA and leaving room for a future
`--ref` override?"

Context:
The bootstrap needed a simple default but still had to preserve future
flexibility.

Decision:
Yes. Default to the default branch head.

### Q110
Exact question:
"Should the installer also show the resolved framework source in the
confirmation step, for example repo URL, branch/ref used, resolved commit SHA?"

Context:
The user wanted the source provenance visible before writes happen.

Decision:
Yes. Show repo, ref, and SHA in the plan.

### Q111
Exact question:
"Should the bootstrap script use a temporary working directory under `/tmp` and
clean it up on exit, instead of leaving installer artifacts in the target repo
or home directory?"

Context:
The user did not want bootstrap residue left behind.

Decision:
Yes. Use `/tmp` and clean up on exit.

### Q112
Exact question:
"Should the installer refuse to run outside a Git repository, or should it
allow bootstrapping `.plan` into a plain directory?"

Context:
The user wanted the framework intentionally scoped around Git-based workflow.

Decision:
Require a Git repository.

### Q113
Exact question:
"Should the installer verify that the current directory is the repository root,
instead of allowing installs from arbitrary subdirectories?"

Context:
The user wanted the final write target explicit.

Decision:
Yes, but this was refined by the next question.

### Q114
Exact question:
"Should the installer detect the repo root automatically from a subdirectory and
then ask the user to confirm, or should it hard-fail unless run at the root?"

Context:
The user wanted friendly behavior without losing target-root clarity.

Decision:
Detect the repo root and confirm it.

### Q115
Exact question:
"Should the installer create the `.plan/` directory structure from the
framework starter only after all prerequisite validation and confirmation steps
pass?"

Context:
The user wanted no partial workspace writes before the plan was accepted.

Decision:
Yes. Write only after validation and confirmation.

### Q116
Exact question:
"Should the installer treat `.plan/.framework` and
`.plan/.framework-install.json` as the canonical signals for 'framework already
installed', rather than inferring from the presence of `.plan/` alone?"

Context:
The user wanted installed-state detection to be explicit and not based on weak
heuristics.

Decision:
Yes. Use the marker and manifest.

### Q117
Exact question:
"If `.plan/` exists but the framework marker/manifest do not, should the
installer treat that as an unmanaged existing directory and prompt the user
before proceeding?"

Context:
The user wanted adoption to be explicit, not accidental.

Decision:
Yes. Prompt for adopt or abort.

### Q118
Exact question:
"If the user chooses `adopt and continue`, should the installer still avoid
overwriting workflow-owned files and only start managing the framework-owned
subset from that point forward?"

Context:
The user wanted adoption to respect the same ownership split as normal updates.

Decision:
Yes. Adoption only starts managing the framework-owned subset.

### Q119
Exact question:
"Should the installer record in the manifest whether the install was a fresh
install or an adoption of a pre-existing `.plan/` directory?"

Context:
The user wanted adoption provenance recorded, not hidden.

Decision:
Yes. Record fresh install vs adoption in the manifest.

### Q120
Exact question:
"Should adoption mode be allowed only when the existing `.plan` layout is
recognized as compatible enough, and otherwise stop with a migration-needed
message?"

Context:
The user did not want the installer to pretend it could adopt arbitrary old
layouts safely.

Decision:
Yes. Only adopt compatible `.plan` layouts.

### Q121
Exact question:
"For compatibility checks, should v1 only recognize two starting states:
already-installed framework via marker/manifest, and unmanaged but compatible
`.plan` directory, and treat older `.specify`-based layouts as migration work,
not auto-adoption?"

Context:
The user wanted to keep migration out of the installer v1.

Decision:
Yes. `.specify` migration is outside v1 adoption.

### Q122
Exact question:
"Should the installer itself refuse to migrate `.specify` content in v1, and
instead point users to a separate migration command or documented manual process
later?"

Context:
The user explicitly said migration was not part of this framework build.

Decision:
Yes. No `.specify` migration in v1.

### Q123
Exact question:
"Do you want v1 to stay explicitly single-user oriented in its messaging and
assumptions, even though the framework structure is reusable later?"

Context:
The user said this framework build was for personal workflow first, not broad
public distribution yet.

Decision:
Yes. Keep v1 single-user oriented.

### Q124
Exact question:
"Should we stop expanding scope now and move from grilling into implementation
using the decisions already locked, with any remaining gaps handled during build
only if they become concrete blockers?"

Context:
The grilling session had already covered the contract deeply and the user wanted
execution, not more theorizing.

Decision:
Yes. Stop grilling and implement.

## Resulting Implementation

The decisions above directly drove:

- the installable `.plan` starter under `frameworks/ralph-loop/.plan/`
- the helper scripts under `frameworks/ralph-loop/.plan/helper-scripts/`
- the installer under `frameworks/ralph-loop/installer/`
- `frameworks/ralph-loop/skills-manifest.json`
- `frameworks/ralph-loop/framework-files.json`
- the `commit` skill
- the `.plan`-based `to-epic-issues` skill
- the local verification passes against throwaway repos

## Remaining Work

The grilling session also left a clear next-phase tail:

- validate the public GitHub bootstrap path
- apply the framework to `neighborhood-showcase`
- deepen helper script behavior
- wire the documented runner state machine into the real automation path
