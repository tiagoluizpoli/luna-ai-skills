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

# 1. Ensure the .agent directory exists
mkdir -p .agent

# 2. Link the core components
ln -s "$SKILLS_REPO/.agent/skills" .agent/skills
ln -s "$SKILLS_REPO/.agent/workflows" .agent/workflows
ln -s "$SKILLS_REPO/AGENTS.md" .
ln -s "$SKILLS_REPO/SKILLS_OVERVIEW.md" .
```

> [!IMPORTANT]
> Replace `/path/to/luna-ai-skills` with the absolute path you copied in step 1.

### 3. Update `.gitignore` in your Target Project

Since symbolic links use local paths that may vary between machines, you should add the linked components to your target project's `.gitignore`:

```bash
# Ignore symlinked skills and config
echo ".agent/skills" >> .gitignore
echo ".agent/workflows" >> .gitignore
echo "AGENTS.md" >> .gitignore
echo "SKILLS_OVERVIEW.md" >> .gitignore
```

This prevents your local symlinks from being committed to the target project's repository.
