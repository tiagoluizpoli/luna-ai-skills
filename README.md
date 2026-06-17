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

- validates the Matt Pocock prerequisite skill set
- provisions `.plan/`
- provisions framework-owned helper scripts
- installs selected framework-owned skills
- records framework ownership via `.plan/.framework` (framework-managed marker) and
  `.plan/.framework-install.json` (installer-generated metadata artifact)

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
