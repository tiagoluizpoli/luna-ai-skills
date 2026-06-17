---
type: task
id: T-20
epic: E-08
status: ready
blocked-by: [T-18, T-19]
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

- [ ] One canonical verification trail exists for the hardened installer’s local
      and public/bootstrap paths.
- [ ] README and framework docs describe framework assets and the current
      selection/update contract accurately.
- [ ] Stale task-history, run-summary, and rollout-status contradictions are
      reconciled to one consistent truth.
- [ ] Verification artifacts clearly separate wording drift from behavior bugs.

## Sub-Tasks

### ST-01 - Re-run canonical installer verification after hardening

status: ready
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

- No execution notes yet.

### ST-02 - Reconcile stale docs and planning evidence

status: ready
model: medium
escalate-if: [historical-evidence-conflicts-cannot-be-resolved-from-repo-state]
blocked-by: [ST-01]

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

- No execution notes yet.

---

<!-- INDEX SYNC: After completing a sub-task, run
.plan/helper-scripts/sync-state.sh and update the parent epic.md checklist and
.plan/index.md in the same turn. -->
