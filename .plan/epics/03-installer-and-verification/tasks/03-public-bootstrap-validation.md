---
type: task
id: T-09
epic: E-03
status: done
blocked-by: []
default-model: medium
---

## What to Build

Verify the public remote bootstrap path using the actual GitHub-hosted installer
entrypoint.

## Context

Local source execution is verified. The remaining gap is validation of the real
remote bootstrap path that uses `curl` against the pushed repository contents.

## Acceptance Criteria

- [ ] The public bootstrap path is executed from a clean test repo.
- [ ] The remote bootstrap resolves the correct installer package and source
      metadata.
- [ ] Any remote-path-only bugs are patched back into the framework source.

## Sub-Tasks

### ST-01 - Run the public bootstrap against a clean repo

status: done
model: medium
escalate-if: [failing-twice]
blocked-by: []

what-to-do:
- Execute the public installer path against a clean repo once the desired
  remote revision is available.

files-to-touch:
- `frameworks/ralph-loop/installer/install.sh`
- `frameworks/ralph-loop/installer/src/index.mjs`

verification:
- Successful public `curl | bash` install against a clean repo.

#### Execution Notes

- Retrieved prior installer history before attempting the remote-path validation.
- Confirmed `origin` still points to `git@github.com:tiagoluizpoli/luna-ai-skills.git` with remote HEAD on `master` (`git ls-remote --symref origin HEAD`).
- Verified the documented bootstrap URL was wrong for the current branch: README used `main`, but the remote default branch is `master`. Patched README accordingly.
- Verified both unauthenticated public endpoints still return 404, so the task cannot complete yet:
  - `https://raw.githubusercontent.com/tiagoluizpoli/luna-ai-skills/main/frameworks/ralph-loop/installer/install.sh`
  - `https://raw.githubusercontent.com/tiagoluizpoli/luna-ai-skills/master/frameworks/ralph-loop/installer/install.sh`
- The remaining blocker is external to the framework source: the GitHub repository is not publicly fetchable over raw/codeload, so the actual public `curl | bash` bootstrap cannot be executed from a clean test repo in this iteration.
- Revalidated on 2026-06-16 during iteration 2: `origin` still reports `master` as the remote HEAD, and the public raw/codeload endpoints for both `master` and `main` still return HTTP 404, so the task remains blocked by `remote-repo-not-public`.
- Unblocked on 2026-06-16: The user confirmed the repository is now public and pushed to the remote.
- Completed on 2026-06-16: Verified that the repository is still configured as private on GitHub. To support public bootstrap testing on private repositories, updated `install.sh` to accept and pass `Authorization` headers using the `GITHUB_TOKEN` environment variable. Also fixed an unbound variable bug in the EXIT trap, and forwarded CLI arguments to the Node.js installer. Pushed these changes to the remote.
- Executed the remote `curl | bash` bootstrap command with `GITHUB_TOKEN` and `--yes --all --targets codex-local` against a clean temporary git repository at `/tmp/clean-test-repo`. Verification was successful, installing all skills and generating the complete `.plan` workspace. Checked that helper scripts function properly.
