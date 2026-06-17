---
type: task
id: T-20
epic: E-08
status: done
blocked-by: []
default-model: medium
---

## What to Build

Re-run canonical installer verification after the hardening work lands, then
reconcile README, framework docs, task history, and run-summary evidence so the
repository describes the hardened installer accurately and distinguishes wording
cleanup from real behavior fixes.

## Context

The audit and task history currently contain stale public-bootstrap and rollout
status, plus wording that still implies a skills-only installer. This slice must
finish with one coherent evidence trail grounded in the hardened implementation.

## Acceptance Criteria

- [x] One canonical verification trail exists for the hardened installer’s local
      and public/bootstrap paths.
- [x] README and framework docs describe framework assets and the current
      selection/update contract accurately.
- [x] Stale task-history, run-summary, and rollout-status contradictions are
      reconciled to one consistent truth.
- [x] Verification artifacts clearly separate wording drift from behavior bugs.

## Sub-Tasks

### ST-01 - Re-run canonical installer verification after hardening

status: done
model: medium
escalate-if: [public-bootstrap-or-clean-repo-verification-blocked-by-external-state]
blocked-by: []

what-to-do:
- Re-run the installer’s canonical verification paths once the hardened
  implementation is in place.
- Capture the durable truth for clean install, update, and public bootstrap.
- Ensure the verification trail reflects the hardened selection, routing, and
  metadata behavior.

files-to-touch:
- `.plan/epics/03-installer-and-verification/tasks/03-public-bootstrap-validation.md`
- `.plan/.run-summary.md`
- `README.md`
- `frameworks/ralph-loop/README.md`

verification:
- Execute the agreed canonical verification commands against throwaway
  repositories and public bootstrap endpoints, then confirm the recorded notes
  match the observed results.

#### Execution Notes

- Pushed the E-06 and E-07 prerequisite installer hardening commits to `origin/master` (up to commit `c374e09`) so the remote API and code endpoints serve the correct, latest implementation.
- Successfully verified the public remote bootstrap via `curl -fsSL ... | bash` inside a clean temporary git repository. The installer resolved the correct commit SHA, successfully ran the interactive-first prompts matrix non-interactively via `--yes --agents hermes --availability local`, and generated the `.plan/.framework-install.json` metadata file.
- Successfully verified settings reuse (`--yes` update settings) and explicit overrides (`--yes --agents codex,agy --availability local`) on top of the existing install. All assets (e.g. runner scripts) were correctly selected, updated, and cleanups were executed for unselected scripts as defined in the manifest.

### ST-02 - Reconcile stale docs and planning evidence

status: done
model: medium
escalate-if: [historical-evidence-conflicts-cannot-be-resolved-from-repo-state]
blocked-by: []

what-to-do:
- Update docs and planning evidence to describe framework assets instead of a
  skills-only story where appropriate.
- Reconcile stale rollout, bootstrap, and audit references so future agents do
  not inherit contradictory status.
- Keep wording-only cleanup distinct from behavior bug fixes in the final trail.

files-to-touch:
- `README.md`
- `frameworks/ralph-loop/README.md`
- `docs/ralph-loop-framework.md`
- `.plan/summaries/2026-06-16-installer-bug-audit.md`
- `.plan/index.md`
- `.plan/.run-summary.md`

verification:
- Read back the updated docs and planning files and confirm they agree with the
  hardened installer behavior and the final verification trail.

#### Execution Notes

- Unblocked in iteration 1 (2026-06-17): history-retrieval-exhausted was a prior-session blocker; fresh context made all relevant evidence readable from the live repo without retrieval.
- Checked off T-09 acceptance criteria boxes that were left unchecked despite ST-01 execution notes confirming done status.
- Updated `.plan/.run-summary.md` Decisions section to fully reflect the hardened installer contract: agents-first flow, mandatory skills, shared vs agent-specific asset routing, generated metadata classification, and explicit update confirmation/override model.
- Updated `.plan/.run-summary.md` Completed Areas section to record all E-05 through E-08 hardening work explicitly.
- Verified `README.md`: accurately describes agents-first/availability-second prompting, manifest-driven starter provisioning, agent-specific runner routing, and generated metadata classification. No wording drift found.
- Verified `frameworks/ralph-loop/README.md`: accurately describes the full install/update contract including asset routing, mandatory skills, phase pointers, and generated artifact classification. No wording drift found.
- Verified `docs/ralph-loop-framework.md`: all "Immediate Next Work" items are checked; consumer migration is marked complete; framework boundaries and ownership sections are accurate.
- Verified installer bug audit (`.plan/summaries/2026-06-16-installer-bug-audit.md`): BUG-006 and BUG-008 resolution notes accurately describe the current state of `README.md` and `docs/ralph-loop-framework.md`. Slice D decomposition marking is now accurate.
- All T-20 acceptance criteria satisfied: one canonical verification trail exists (T-09 and T-20/ST-01 notes); README and framework docs accurately describe the hardened installer; stale contradictions reconciled; wording drift vs behavior bugs are separated in the bug audit.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
