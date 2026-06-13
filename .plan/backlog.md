# Backlog

This file tracks ideas and follow-up work deliberately deferred during planning
or grilling sessions.

Status values: `ready` | `in-progress` | `blocked` | `done`
Horizon values: `now` | `soon` | `later`

| Status | Horizon | Area | Item | Notes | Linked |
| --- | --- | --- | --- | --- | --- |
| ready | now | Verification | Validate the public GitHub `curl | bash` bootstrap path against the pushed remote revision. | Local installer validation is complete; remote bootstrap still needs a live run. | `.plan/epics/03-installer-and-verification/tasks/03-public-bootstrap-validation.md` |
| ready | soon | Rollout | Apply the framework to `neighborhood-showcase` using the installer and migrate its live state into `.plan/`. | User explicitly deferred real consumer migration until the framework itself was complete. | `.plan/epics/04-rollout-and-hardening/tasks/01-consumer-repo-rollout.md` |
| ready | later | Runtime | Replace scaffold helper scripts with richer deterministic retrieval, sync, and archive behavior. | Current scripts are valid and usable, but still minimal v1 scaffolds. | `.plan/epics/04-rollout-and-hardening/tasks/02-helper-script-hardening.md` |
| ready | later | Runtime | Enforce the full model escalation and retry state machine from runners and helper scripts. | The contract is documented, but the automation is not yet end-to-end. | `.plan/epics/04-rollout-and-hardening/tasks/03-runner-state-machine.md` |
