import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import * as p from "@clack/prompts";

function parseArgs(argv) {
  const args = {};

  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith("--")) {
      continue;
    }

    const next = argv[i + 1];

    if (!next || next.startsWith("--")) {
      args[key.replace(/^--/, "")] = true;
      continue;
    }

    args[key.replace(/^--/, "")] = next;
    i += 1;
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function runCommand(command, args, options = {}) {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      ...options
    });
  } catch (error) {
    if (error && typeof error === "object" && "status" in error && error.status === 0) {
      return error.stdout ?? "";
    }

    throw error;
  }
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function listFilesRecursively(rootDir) {
  const results = [];

  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      results.push(...listFilesRecursively(fullPath));
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

function copyDirectory(sourceDir, destinationDir, options = {}) {
  const files = listFilesRecursively(sourceDir);
  const copied = [];

  for (const filePath of files) {
    const relativePath = path.relative(sourceDir, filePath);
    const targetPath = path.join(destinationDir, relativePath);
    const targetDir = path.dirname(targetPath);

    ensureDirectory(targetDir);

    if (options.onFile) {
      options.onFile(filePath, targetPath, relativePath);
    }

    fs.copyFileSync(filePath, targetPath);
    fs.chmodSync(targetPath, fs.statSync(filePath).mode);
    copied.push(targetPath);
  }

  return copied;
}

function detectRepoRoot(targetRoot) {
  return runCommand("git", ["-C", targetRoot, "rev-parse", "--show-toplevel"]).trim();
}

function isDirtyWorktree(targetRoot) {
  const output = runCommand("git", ["-C", targetRoot, "status", "--porcelain"]).trim();

  return output.length > 0;
}

function findExternalSkill(skillName) {
  const candidatePaths = [
    path.join(os.homedir(), ".agents", "skills", skillName, "SKILL.md"),
    path.join(os.homedir(), ".hermes", "skills", skillName, "SKILL.md"),
    path.join(os.homedir(), ".hermes", "skills", "devops", skillName, "SKILL.md")
  ];

  return candidatePaths.find((candidatePath) => fs.existsSync(candidatePath)) ?? null;
}

function resolveSkillClosure(skillManifest, selectedSkillIds) {
  const skillMap = new Map(skillManifest.skills.map((skill) => [skill.id, skill]));
  const resolved = new Set(selectedSkillIds);
  const queue = [...selectedSkillIds];

  while (queue.length > 0) {
    const currentSkillId = queue.shift();
    const skill = skillMap.get(currentSkillId);

    for (const dependencyId of skill.localDependencies ?? []) {
      if (!resolved.has(dependencyId)) {
        resolved.add(dependencyId);
        queue.push(dependencyId);
      }
    }
  }

  return [...resolved].map((skillId) => skillMap.get(skillId));
}

function targetPathForSkill(skill, target, repoRoot) {
  const template = skill.installPathTemplates[target];

  if (target === "codex-local") {
    return path.join(repoRoot, template);
  }

  return template.replace(/^~(?=\/)/, os.homedir());
}

function filesAreDifferent(fileA, fileB) {
  if (!fs.existsSync(fileA) || !fs.existsSync(fileB)) {
    return true;
  }

  return fs.readFileSync(fileA).equals(fs.readFileSync(fileB)) === false;
}

async function confirmRepoRoot(targetRoot, repoRoot, yesMode) {
  if (targetRoot === repoRoot) {
    return repoRoot;
  }

  if (yesMode) {
    return repoRoot;
  }

  const value = await p.confirm({
    message: `Installer was started below the repo root. Use ${repoRoot}?`,
    initialValue: true
  });

  if (p.isCancel(value) || value === false) {
    p.cancel("Installation cancelled.");
    process.exit(1);
  }

  return repoRoot;
}

async function confirmDirtyWorktree(targetRoot, force, yesMode) {
  if (!isDirtyWorktree(targetRoot)) {
    return;
  }

  if (force || yesMode) {
    return;
  }

  const value = await p.select({
    message: "Git worktree is dirty. Continue anyway?",
    options: [
      { value: "continue", label: "Continue anyway" },
      { value: "abort", label: "Abort and come back later" }
    ]
  });

  if (p.isCancel(value) || value === "abort") {
    p.cancel("Installation cancelled due to dirty worktree.");
    process.exit(1);
  }
}

function detectInstallState(repoRoot) {
  const planDir = path.join(repoRoot, ".plan");
  const markerFile = path.join(planDir, ".framework");
  const manifestFile = path.join(planDir, ".framework-install.json");

  if (fs.existsSync(markerFile) && fs.existsSync(manifestFile)) {
    return { mode: "update", planDir, markerFile, manifestFile };
  }

  if (fs.existsSync(planDir)) {
    return { mode: "adopt-or-abort", planDir, markerFile, manifestFile };
  }

  return { mode: "install", planDir, markerFile, manifestFile };
}

function isCompatiblePlanLayout(planDir) {
  const requiredFiles = [
    "prompt.md",
    "RULES.md",
    "PRD.md",
    "index.md",
    "backlog.md"
  ];

  return requiredFiles.every((fileName) => fs.existsSync(path.join(planDir, fileName)));
}

async function chooseAdoptionMode(state, yesMode) {
  if (state.mode !== "adopt-or-abort") {
    return state.mode;
  }

  if (!isCompatiblePlanLayout(state.planDir)) {
    p.cancel("Existing .plan directory is not compatible enough for adoption. Migration is required.");
    process.exit(1);
  }

  if (yesMode) {
    return "adopt";
  }

  const value = await p.select({
    message: "A .plan directory already exists without framework markers. What do you want to do?",
    options: [
      { value: "adopt", label: "Adopt and continue" },
      { value: "abort", label: "Abort and inspect manually" }
    ]
  });

  if (p.isCancel(value) || value === "abort") {
    p.cancel("Installation cancelled.");
    process.exit(1);
  }

  return "adopt";
}

async function chooseSkillSelection(skillManifest, args) {
  const bundleOptions = skillManifest.bundles.map((bundle) => ({
    value: bundle.id,
    label: bundle.label,
    hint: bundle.defaultSelected ? "default" : ""
  }));

  let bundleMode = args.all ? "all" : null;

  if (!bundleMode && args.bundles) {
    bundleMode = "manual";
  }

  if (!bundleMode) {
    bundleMode = await p.select({
      message: "Choose the framework skill install mode",
      options: [
        { value: "all", label: "Install all framework skills" },
        { value: "manual", label: "Choose skills manually" }
      ]
    });
  }

  if (p.isCancel(bundleMode)) {
    p.cancel("Installation cancelled.");
    process.exit(1);
  }

  let selectedBundles;
  let selectedSkillIds = new Set();

  if (bundleMode === "all") {
    selectedBundles = skillManifest.bundles.map((bundle) => bundle.id);

    for (const bundle of skillManifest.bundles) {
      for (const skillId of bundle.skills) {
        selectedSkillIds.add(skillId);
      }
    }
  } else {
    if (args.bundles) {
      selectedBundles = String(args.bundles)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    } else {
      selectedBundles = await p.multiselect({
        message: "Select skill bundles",
        options: bundleOptions,
        initialValues: skillManifest.bundles.filter((bundle) => bundle.defaultSelected).map((bundle) => bundle.id)
      });
    }

    if (p.isCancel(selectedBundles) || selectedBundles.length === 0) {
      p.cancel("No bundles selected.");
      process.exit(1);
    }
  }

  const skillMap = new Map(skillManifest.skills.map((skill) => [skill.id, skill]));

  if (bundleMode !== "all") {
    for (const bundleId of selectedBundles) {
      const bundle = skillManifest.bundles.find((item) => item.id === bundleId);
      let selectedSkillValues;

      if (args.skills) {
        const explicitSkills = new Set(
          String(args.skills)
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        );
        selectedSkillValues = bundle.skills.filter((skillId) => explicitSkills.has(skillId));
      } else if (args.yes) {
        selectedSkillValues = [...bundle.skills];
      } else {
        selectedSkillValues = await p.multiselect({
          message: `Select skills for bundle: ${bundle.label}`,
          options: bundle.skills.map((skillId) => ({
            value: skillId,
            label: skillMap.get(skillId).publicName
          })),
          initialValues: [...bundle.skills]
        });
      }

      if (p.isCancel(selectedSkillValues) || selectedSkillValues.length === 0) {
        p.cancel(`No skills selected for bundle ${bundle.label}.`);
        process.exit(1);
      }

      for (const skillId of selectedSkillValues) {
        selectedSkillIds.add(skillId);
      }
    }
  }

  return {
    selectedBundles,
    selectedSkillIds: [...selectedSkillIds]
  };
}

async function chooseTargets() {
  return await p.multiselect({
    message: "Select install targets",
    options: [
      { value: "codex-local", label: "Codex repo-local (.agents/skills/luna-ai/*)" },
      { value: "hermes-global", label: "Hermes global (~/.hermes/skills/luna-ai/*)" }
    ],
    initialValues: ["codex-local"]
  });
}

function chooseTargetsFromArgs(args) {
  if (!args.targets) {
    return null;
  }

  return String(args.targets)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

async function resolveTargets(args) {
  const explicitTargets = chooseTargetsFromArgs(args);

  if (explicitTargets) {
    return explicitTargets;
  }

  const targets = await chooseTargets();

  if (p.isCancel(targets) || targets.length === 0) {
    p.cancel("No install target selected.");
    process.exit(1);
  }

  return targets;
}

function collectExternalPrerequisites(resolvedSkills) {
  const prerequisites = new Set();

  for (const skill of resolvedSkills) {
    for (const prerequisite of skill.externalPrerequisites ?? []) {
      prerequisites.add(prerequisite);
    }
  }

  return [...prerequisites];
}

function validateExternalPrerequisites(externalPrerequisites) {
  return externalPrerequisites.map((skillName) => ({
    skillName,
    foundAt: findExternalSkill(skillName)
  }));
}

function summarizeResolvedPlan({ bundleIds, resolvedSkills, targets, prerequisiteChecks, repoUrl, ref, sha }) {
  const selectedBundleLabels = bundleIds;
  const topLevelSkills = resolvedSkills.filter((skill) => skill.selectable);
  const dependencySkills = resolvedSkills.filter((skill) => !skill.selectable);

  return [
    "Framework source:",
    `  repo: ${repoUrl}`,
    `  ref: ${ref}`,
    `  sha: ${sha}`,
    "",
    "Selected bundles:",
    ...selectedBundleLabels.map((bundleId) => `  - ${bundleId}`),
    "",
    "Framework-owned installs:",
    ...topLevelSkills.map((skill) => `  - ${skill.publicName}`),
    "",
    "Local dependency installs:",
    ...(dependencySkills.length > 0 ? dependencySkills.map((skill) => `  - ${skill.publicName}`) : ["  - none"]),
    "",
    "External prerequisites validated:",
    ...(prerequisiteChecks.length > 0
      ? prerequisiteChecks.map((item) => `  - ${item.skillName}: ${item.foundAt ? `ok (${item.foundAt})` : "missing"}`)
      : ["  - none"]),
    "",
    "Targets:",
    ...targets.map((target) => `  - ${target}`)
  ].join("\n");
}

async function confirmResolvedPlan(summaryText) {
  p.note(summaryText, "Resolved install plan");

  const value = await p.confirm({
    message: "Apply this install plan?",
    initialValue: true
  });

  if (p.isCancel(value) || value === false) {
    p.cancel("Installation cancelled.");
    process.exit(1);
  }
}

async function resolveManagedFileAction(targetPath, sourcePath, force, yesMode) {
  if (!fs.existsSync(targetPath) || !filesAreDifferent(sourcePath, targetPath)) {
    return "overwrite";
  }

  if (force || yesMode) {
    return "overwrite";
  }

  const action = await p.select({
    message: `Managed file differs: ${targetPath}`,
    options: [
      { value: "overwrite", label: "Overwrite with framework version" },
      { value: "skip", label: "Keep local version and skip this file" },
      { value: "abort", label: "Abort update" }
    ]
  });

  if (p.isCancel(action) || action === "abort") {
    p.cancel("Installation cancelled during drift resolution.");
    process.exit(1);
  }

  return action;
}

async function installStarterFiles({ sourceRoot, repoRoot, frameworkFiles, installMode, force, yesMode }) {
  const sourcePlanDir = path.join(sourceRoot, "frameworks", "ralph-loop", ".plan");
  const targetPlanDir = path.join(repoRoot, ".plan");
  const copiedManagedFiles = [];

  ensureDirectory(targetPlanDir);

  if (installMode === "install") {
    copyDirectory(sourcePlanDir, targetPlanDir);
  } else {
    for (const relativeManagedFile of frameworkFiles.managedFiles) {
      const relativePath = relativeManagedFile.replace(/^[.]plan\//, "");
      const sourcePath = path.join(sourcePlanDir, relativePath);
      const targetPath = path.join(targetPlanDir, relativePath);

      if (!fs.existsSync(sourcePath)) {
        continue;
      }

      const action = await resolveManagedFileAction(targetPath, sourcePath, force, yesMode);

      if (action === "overwrite") {
        ensureDirectory(path.dirname(targetPath));
        fs.copyFileSync(sourcePath, targetPath);
        fs.chmodSync(targetPath, fs.statSync(sourcePath).mode);
        copiedManagedFiles.push(relativeManagedFile);
      }
    }

    for (const relativeWorkflowFile of frameworkFiles.workflowOwnedFiles) {
      const relativePath = relativeWorkflowFile.replace(/^[.]plan\//, "");
      const sourcePath = path.join(sourcePlanDir, relativePath);
      const targetPath = path.join(targetPlanDir, relativePath);

      if (!fs.existsSync(targetPath) && fs.existsSync(sourcePath)) {
        ensureDirectory(path.dirname(targetPath));
        fs.copyFileSync(sourcePath, targetPath);
        fs.chmodSync(targetPath, fs.statSync(sourcePath).mode);
      }
    }
  }

  return copiedManagedFiles;
}

async function installSkills({ sourceRoot, repoRoot, resolvedSkills, targets, force, yesMode }) {
  const installedSkills = [];

  for (const target of targets) {
    for (const skill of resolvedSkills) {
      const sourceDir = path.join(sourceRoot, skill.sourcePath);
      const destinationDir = targetPathForSkill(skill, target, repoRoot);
      const destinationExists = fs.existsSync(destinationDir);

      if (destinationExists && !force && !yesMode) {
        const decision = await p.select({
          message: `Framework skill already exists at ${destinationDir}`,
          options: [
            { value: "overwrite", label: "Overwrite with framework version" },
            { value: "skip", label: "Keep local version and skip this skill" },
            { value: "abort", label: "Abort update" }
          ]
        });

        if (p.isCancel(decision) || decision === "abort") {
          p.cancel("Installation cancelled during skill update.");
          process.exit(1);
        }

        if (decision === "skip") {
          continue;
        }
      }

      fs.rmSync(destinationDir, { recursive: true, force: true });
      ensureDirectory(destinationDir);
      copyDirectory(sourceDir, destinationDir);

      installedSkills.push({
        publicName: skill.publicName,
        sourcePath: skill.sourcePath,
        target,
        installPath: destinationDir,
        installedAt: new Date().toISOString()
      });
    }
  }

  return installedSkills;
}

function writeFrameworkMetadata({ repoRoot, installMode, adopted, repoUrl, ref, sha, frameworkFiles, installedSkills }) {
  const markerPath = path.join(repoRoot, ".plan", ".framework");
  const manifestPath = path.join(repoRoot, ".plan", ".framework-install.json");

  fs.writeFileSync(markerPath, "ralph-loop\n");

  const manifest = {
    framework: "ralph-loop",
    mode: installMode,
    adopted,
    source: {
      repoUrl,
      ref,
      sha
    },
    installedAt: new Date().toISOString(),
    managedFiles: frameworkFiles.managedFiles,
    installedSkills
  };

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

async function main() {
  const args = parseArgs(process.argv);
  const sourceRoot = args["source-root"];
  const targetRoot = args["target-root"];
  const repoUrl = args["repo-url"];
  const ref = args.ref;
  const sha = args.sha;
  const force = process.argv.includes("--force");
  const yesMode = Boolean(args.yes);

  const skillManifest = readJson(path.join(sourceRoot, "frameworks", "ralph-loop", "skills-manifest.json"));
  const frameworkFiles = readJson(path.join(sourceRoot, "frameworks", "ralph-loop", "framework-files.json"));

  p.intro("Ralph Loop framework installer");

  const repoRoot = detectRepoRoot(targetRoot);
  const confirmedRepoRoot = await confirmRepoRoot(targetRoot, repoRoot, yesMode);
  await confirmDirtyWorktree(confirmedRepoRoot, force, yesMode);

  const installState = detectInstallState(confirmedRepoRoot);
  const installMode = await chooseAdoptionMode(installState, yesMode);
  const { selectedBundles, selectedSkillIds } = await chooseSkillSelection(skillManifest, args);
  const targets = await resolveTargets(args);
  const resolvedSkills = resolveSkillClosure(skillManifest, selectedSkillIds);
  const externalPrerequisites = collectExternalPrerequisites(resolvedSkills);
  const prerequisiteChecks = validateExternalPrerequisites(externalPrerequisites);

  if (prerequisiteChecks.some((item) => item.foundAt === null)) {
    p.cancel(
      "Missing external prerequisite skills. Install Matt Pocock's skills first with: npx skills@latest add mattpocock/skills"
    );
    process.exit(1);
  }

  const resolvedSummary = summarizeResolvedPlan({
    bundleIds: selectedBundles,
    resolvedSkills,
    targets,
    prerequisiteChecks,
    repoUrl,
    ref,
    sha
  });

  if (!yesMode) {
    await confirmResolvedPlan(resolvedSummary);
  } else {
    p.note(resolvedSummary, "Resolved install plan");
  }

  await installStarterFiles({
    sourceRoot,
    repoRoot: confirmedRepoRoot,
    frameworkFiles,
    installMode,
    force,
    yesMode
  });

  const installedSkills = await installSkills({
    sourceRoot,
    repoRoot: confirmedRepoRoot,
    resolvedSkills,
    targets,
    force,
    yesMode
  });

  writeFrameworkMetadata({
    repoRoot: confirmedRepoRoot,
    installMode,
    adopted: installMode === "adopt",
    repoUrl,
    ref,
    sha,
    frameworkFiles,
    installedSkills
  });

  p.outro("Ralph Loop framework installation complete.");
}

main().catch((error) => {
  p.cancel(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
