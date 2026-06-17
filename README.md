# Luna AI Skills

Centralized framework source for the Ralph Loop workflow, installable skills,
runner scripts, and supporting docs.

## Ralph Loop Installer

The preferred path is now installer-based, not symlink-based.

Prerequisite:

```bash
npx skills@latest add mattpocock/skills
```

Then run the framework bootstrap from the target repository root:

```bash
curl -fsSL https://raw.githubusercontent.com/tiagoluizpoli/luna-ai-skills/master/frameworks/ralph-loop/installer/install.sh | bash
```

Safer manual variant:

```bash
curl -O https://raw.githubusercontent.com/tiagoluizpoli/luna-ai-skills/master/frameworks/ralph-loop/installer/install.sh
less install.sh
bash install.sh
```

The installer:

- prompts for targeted agents (Hermes, Codex, AGY) first, followed by a single run-level availability mode (local or global)
- validates dynamically required external prerequisite skills from `mattpocock/skills` needed by the mandatory skills
- provisions `.plan/` via manifest-driven starter provisioning
- provisions framework-owned shared assets (helper scripts, templates)
- provisions agent-specific runner scripts (`ralph-loop-hermes.sh`, `ralph-loop-codex.sh`, `ralph-loop-agy.sh`) only for the selected agents, removing unselected ones
- installs the mandatory framework-owned skill set (`luna-grill-with-docs`, `luna-to-prd`, `luna-to-issues`, `commit`, and `code-review`)
- records installation metadata, selected agents, timestamps, and target locations in `.plan/.framework-install.json` (an installer-generated metadata artifact, not listed in framework-files.json managed assets) to support settings reuse/override during updates.

## Legacy Symlink Flow

The older symlink flow is still possible for ad hoc local reuse, but it is no
longer the preferred path for new repositories.

```bash
SKILLS_REPO="/path/to/luna-ai-skills"
mkdir -p .agents
ln -sfnT "$SKILLS_REPO/.agents/skills" .agents/skills
ln -sfnT "$SKILLS_REPO/ralph-loop-agy.sh" ralph-loop-agy.sh
ln -sfnT "$SKILLS_REPO/ralph-loop-codex.sh" ralph-loop-codex.sh
ln -sfnT "$SKILLS_REPO/ralph-loop-hermes.sh" ralph-loop-hermes.sh
```

## Framework Planning

The current Ralph Loop framework plan lives in [docs/ralph-loop-framework.md](/home/tiago/01-dev-env/personal-repos/luna-ai-skills/docs/ralph-loop-framework.md).
The ownership-boundary companion for SpecKit versus the general skill library
lives in [docs/speckit-split-plan.md](/home/tiago/01-dev-env/personal-repos/luna-ai-skills/docs/speckit-split-plan.md).
