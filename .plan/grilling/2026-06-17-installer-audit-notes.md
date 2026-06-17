# Installer Audit Notes (intermediate, not final)

Date: 2026-06-17
Status: parked until grilling session is fully finished
Source: intermediate review run during installer target-model re-grill

Purpose:
- preserve the implementation-audit findings without pretending the grilling is complete
- allow later comparison once Q65/Q66/Q67 and any follow-up questions are fully locked

Current findings snapshot

1. High — behavior bug + model drift
- Installer only supports two fused targets: `codex-local` and `hermes-global`.
- Evidence:
  - `frameworks/ralph-loop/installer/src/index.mjs:357-365`
  - `frameworks/ralph-loop/skills-manifest.json` currently models only those fused targets.
- Likely mismatch with current re-grill contract requiring 3 agents × 2 scopes.

2. High — behavior bug
- Flow is still skills-first, not agents-first.
- Evidence:
  - `frameworks/ralph-loop/installer/src/index.mjs:618-622`
  - `chooseSkillSelection()` runs before target resolution.

3. High — behavior bug
- Manual skill/bundle selection still exists, but current re-grill direction says all framework skills are mandatory in v1.
- Evidence:
  - `frameworks/ralph-loop/installer/src/index.mjs:253-355`
  - `frameworks/ralph-loop/skills-manifest.json` still contains optional bundles/defaults.

4. High — behavior bug
- Update writes metadata but does not read recorded state back to drive defaults.
- Evidence:
  - metadata write: `frameworks/ralph-loop/installer/src/index.mjs:576-597`
  - update path still prompts/parses current args rather than loading prior state.

5. High — asset-routing gap
- Framework docs say runner scripts are framework-owned assets, but installer currently installs `.plan` files + skills only.
- Evidence:
  - doc ownership: `docs/ralph-loop-framework.md:38-43`
  - installer payload paths: `frameworks/ralph-loop/framework-files.json`, `frameworks/ralph-loop/installer/src/index.mjs:485-574`

6. Medium — data-model drift
- Recorded metadata is too flat for the current asset/shared-vs-agent-specific model.
- Evidence:
  - manifest shape in `frameworks/ralph-loop/installer/src/index.mjs:582-594`

7. Low — wording / UX drift
- Prompts still speak in terms of skill bundles / install targets rather than framework assets / agent + availability mode.
- Evidence:
  - `frameworks/ralph-loop/installer/src/index.mjs:267-337, 415-442`

Important note
- These notes were captured before the grilling session was finished.
- Do not treat them as final findings until the remaining queued questions are answered and the session is formally closed.
