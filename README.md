# Luna AI Skills

A centralized repository for Antigravity AI skills, specification templates, and documentation. This repository allows you to manage all your custom logic in one place and share it across multiple projects using symbolic links.

## Why Centralize Skills?

- **Single Source of Truth**: Update a skill, template, or agent rule once here, and the changes are reflected across all your projects.
- **Easy Maintenance**: No need to copy-paste skill folders or configuration files between repositories.
- **Version Control**: Track changes to your core logic separately from your project-specific code.

## Sharing Components Across Projects

To use these components in another project, you can create symbolic links (symlinks) from this repository to your target project's root directory.

### 1. Get the Absolute Path to this Repository

Open a terminal in this directory and run:

```bash
pwd
```

Copy the output path. (e.g., `/home/tiago/01-dev-env/personal-repos/luna-ai-skills`)

### 2. Create the Symbolic Links in your Target Project

In the terminal, navigate to the root directory of the project where you want to use these components, and run:

```bash
# Define the path to your luna-ai-skills repo
SKILLS_REPO="/path/to/luna-ai-skills"

# 1. Ensure the .agents directory exists
mkdir -p .agents

# 2. Link the core components
ln -sfnT "$SKILLS_REPO/.agents/skills" .agents/skills
ln -sfnT "$SKILLS_REPO/.agents/workflows" .agents/workflows
ln -sfnT "$SKILLS_REPO/AGENTS.md" AGENTS.md
ln -sfnT "$SKILLS_REPO/SKILLS_OVERVIEW.md" SKILLS_OVERVIEW.md
ln -sfnT "$SKILLS_REPO/ralph-loop-agy.sh" ralph-loop-agy.sh
ln -sfnT "$SKILLS_REPO/ralph-loop-codex.sh" ralph-loop-codex.sh
ln -sfnT "$SKILLS_REPO/ralph-loop-hermes.sh" ralph-loop-hermes.sh

# 3. Ensure Speckit directory exists
mkdir -p .specify

# 4. Remove existing Speckit local configurations/folders (if any) to enforce single source of truth
rm -rf .specify/templates .specify/workflows .specify/scripts .specify/extensions .specify/integrations .specify/extensions.yml .specify/integration.json .specify/init-options.json

# 5. Link Speckit core components (leaving .specify/memory local)
ln -sfnT "$SKILLS_REPO/.specify/templates" .specify/templates
ln -sfnT "$SKILLS_REPO/.specify/workflows" .specify/workflows
ln -sfnT "$SKILLS_REPO/.specify/scripts" .specify/scripts
ln -sfnT "$SKILLS_REPO/.specify/extensions" .specify/extensions
ln -sfnT "$SKILLS_REPO/.specify/integrations" .specify/integrations
ln -sfnT "$SKILLS_REPO/.specify/extensions.yml" .specify/extensions.yml
ln -sfnT "$SKILLS_REPO/.specify/integration.json" .specify/integration.json
ln -sfnT "$SKILLS_REPO/.specify/init-options.json" .specify/init-options.json
```

> [!IMPORTANT]
> Replace `/path/to/luna-ai-skills` with the absolute path you copied in step 1.

### 3. Update `.gitignore` in your Target Project

Since symbolic links use local paths that may vary between machines, you should add the linked components to your target project's `.gitignore`:

```bash
# Ignore symlinked skills and config
echo ".agents/skills" >> .gitignore
echo ".agents/workflows" >> .gitignore
echo "AGENTS.md" >> .gitignore
echo "SKILLS_OVERVIEW.md" >> .gitignore
echo "ralph-loop-agy.sh" >> .gitignore
echo "ralph-loop-codex.sh" >> .gitignore
echo "ralph-loop-hermes.sh" >> .gitignore

# Ignore symlinked Speckit configuration
echo ".specify/templates" >> .gitignore
echo ".specify/workflows" >> .gitignore
echo ".specify/scripts" >> .gitignore
echo ".specify/extensions" >> .gitignore
echo ".specify/integrations" >> .gitignore
echo ".specify/extensions.yml" >> .gitignore
echo ".specify/integration.json" >> .gitignore
echo ".specify/init-options.json" >> .gitignore
```

This prevents your local symlinks from being committed to the target project's repository.

## Framework Planning

The current Ralph Loop framework plan lives in [docs/ralph-loop-framework.md](/home/tiago/01-dev-env/personal-repos/luna-ai-skills/docs/ralph-loop-framework.md).
The ownership-boundary companion for SpecKit versus the general skill library lives in [docs/speckit-split-plan.md](/home/tiago/01-dev-env/personal-repos/luna-ai-skills/docs/speckit-split-plan.md).
