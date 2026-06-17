// Validated for shared vs agent-specific asset routing (iteration 6)
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";

const LEGACY_SELECTION_FLAGS = ["all", "bundles", "skills", "targets"];

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

function parseCommaSeparatedValues(rawValue) {
  return String(rawValue)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function uniqueValues(values) {
  return [...new Set(values)];
}

function formatAllowedValues(values) {
  return values.join(", ");
}

function expandHomeDir(filePath) {
  return filePath.replace(/^~(?=\/)/, os.homedir());
}

function concreteTargetId(agent, availabilityMode) {
  return `${agent}-${availabilityMode}`;
}

function isRepoLocalTarget(target) {
  return target.endsWith("-local");
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

function validateSelectionValues(kind, values, allowedValues) {
  const allowed = new Set(allowedValues);
  const invalidValues = values.filter((value) => !allowed.has(value));

  if (invalidValues.length === 0) {
    return;
  }

  p.cancel(
    `Unsupported ${kind}: ${invalidValues.join(", ")}. Valid ${kind} values: ${formatAllowedValues(allowedValues)}`
  );
  process.exit(1);
}

function validateLegacySelectionArgs(args) {
  const usedLegacyFlags = LEGACY_SELECTION_FLAGS.filter((flag) => flag in args);

  if (usedLegacyFlags.length === 0) {
    return;
  }

  p.cancel(
    `Legacy installer flags are no longer supported: ${usedLegacyFlags.map((flag) => `--${flag}`).join(", ")}. Use --agents <hermes,codex,agy> and --availability <local|global> instead.`
  );
  process.exit(1);
}

function resolveSkillClosure(skillManifest, selectedSkillIds) {
  const skillMap = new Map(skillManifest.skills.map((skill) => [skill.id, skill]));
  const resolved = new Set(selectedSkillIds);
  const queue = [...selectedSkillIds];

  while (queue.length > 0) {
    const currentSkillId = queue.shift();
    const skill = skillMap.get(currentSkillId);

    if (!skill) {
      p.cancel(`Unknown framework skill id in manifest: ${currentSkillId}`);
      process.exit(1);
    }

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
  const template = skill.installPathTemplates?.[target];

  if (!template) {
    p.cancel(`Framework skill ${skill.publicName} does not declare an install path for target ${target}.`);
    process.exit(1);
  }

  const expandedTemplate = expandHomeDir(template);

  if (isRepoLocalTarget(target)) {
    return path.join(repoRoot, expandedTemplate);
  }

  return expandedTemplate;
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

function resolveMandatorySkillIds(skillManifest) {
  const mandatorySkillIds = skillManifest.mandatorySkillIds;

  if (!Array.isArray(mandatorySkillIds) || mandatorySkillIds.length === 0) {
    p.cancel("skills-manifest.json must declare a non-empty mandatorySkillIds array.");
    process.exit(1);
  }

  return uniqueValues(mandatorySkillIds);
}

async function chooseInstallAgents(selectionContract, prompts = p) {
  return await prompts.multiselect({
    message: "Which install agents should receive the Ralph Loop framework?",
    options: selectionContract.installAgents.map((agent) => ({
      value: agent.id,
      label: agent.label,
      hint: agent.description ?? ""
    })),
    initialValues: selectionContract.installAgents.map((agent) => agent.id)
  });
}

function chooseAgentsFromArgs(selectionContract, args) {
  if (!args.agents) {
    return null;
  }

  const selectedAgents = uniqueValues(parseCommaSeparatedValues(args.agents));

  if (selectedAgents.length === 0) {
    p.cancel(`--agents requires at least one value. Valid agents: ${formatAllowedValues(selectionContract.installAgents.map((agent) => agent.id))}`);
    process.exit(1);
  }

  validateSelectionValues(
    "agent",
    selectedAgents,
    selectionContract.installAgents.map((agent) => agent.id)
  );

  return selectedAgents;
}

async function chooseAvailabilityMode(selectionContract, prompts = p) {
  return await prompts.select({
    message: "Which availability mode should this run use?",
    options: selectionContract.availabilityModes.map((mode) => ({
      value: mode.id,
      label: mode.label,
      hint: mode.description ?? ""
    }))
  });
}

function chooseAvailabilityFromArgs(selectionContract, args) {
  if (!args.availability) {
    return null;
  }

  const values = uniqueValues(parseCommaSeparatedValues(args.availability));

  if (values.length !== 1) {
    p.cancel(`--availability accepts exactly one value. Valid availability modes: ${formatAllowedValues(selectionContract.availabilityModes.map((mode) => mode.id))}`);
    process.exit(1);
  }

  validateSelectionValues(
    "availability mode",
    values,
    selectionContract.availabilityModes.map((mode) => mode.id)
  );

  return values[0];
}

async function resolveSelection(skillManifest, args, yesMode, prompts = p) {
  validateLegacySelectionArgs(args);

  const selectionContract = skillManifest.selectionContract;

  if (!selectionContract || !Array.isArray(selectionContract.installAgents) || !Array.isArray(selectionContract.availabilityModes)) {
    p.cancel("skills-manifest.json is missing selectionContract.installAgents or selectionContract.availabilityModes.");
    process.exit(1);
  }

  let selectedAgents = chooseAgentsFromArgs(selectionContract, args);

  if (!selectedAgents && yesMode) {
    p.cancel(`Non-interactive runs must pass --agents. Valid agents: ${formatAllowedValues(selectionContract.installAgents.map((agent) => agent.id))}`);
    process.exit(1);
  }

  if (!selectedAgents) {
    selectedAgents = await chooseInstallAgents(selectionContract, prompts);
  }

  if (prompts.isCancel(selectedAgents) || selectedAgents.length === 0) {
    p.cancel("No install agents selected.");
    process.exit(1);
  }

  let availabilityMode = chooseAvailabilityFromArgs(selectionContract, args);

  if (!availabilityMode && yesMode) {
    p.cancel(`Non-interactive runs must pass --availability. Valid availability modes: ${formatAllowedValues(selectionContract.availabilityModes.map((mode) => mode.id))}`);
    process.exit(1);
  }

  if (!availabilityMode) {
    availabilityMode = await chooseAvailabilityMode(selectionContract, prompts);
  }

  if (prompts.isCancel(availabilityMode)) {
    p.cancel("Installation cancelled.");
    process.exit(1);
  }

  return {
    selectedAgents,
    availabilityMode,
    targets: selectedAgents.map((agent) => concreteTargetId(agent, availabilityMode))
  };
}

function assertTargetCoverage(resolvedSkills, targets) {
  for (const skill of resolvedSkills) {
    for (const target of targets) {
      if (!skill.installPathTemplates?.[target]) {
        p.cancel(`Framework skill ${skill.publicName} does not support required target ${target}.`);
        process.exit(1);
      }
    }
  }
}

function resolveSharedAsset(frameworkFiles) {
  const sharedAssets = frameworkFiles.sharedAssets ?? [];

  if (sharedAssets.length !== 1) {
    p.cancel("framework-files.json must declare exactly one shared asset group for the starter workspace.");
    process.exit(1);
  }

  const [sharedAsset] = sharedAssets;

  if (!Array.isArray(sharedAsset.managedFiles) || !Array.isArray(sharedAsset.workflowOwnedFiles)) {
    p.cancel(`Shared asset ${sharedAsset.id ?? "unknown"} must declare managedFiles and workflowOwnedFiles arrays.`);
    process.exit(1);
  }

  return sharedAsset;
}

// Maps selection contract agents to their corresponding agent-specific assets
function resolveAgentSpecificAssets(selectionContract, frameworkFiles, selectedAgents) {
  const agentAssetMap = new Map((frameworkFiles.agentSpecificAssets ?? []).map((asset) => [asset.id, asset]));
  const installAgents = selectionContract.installAgents ?? [];
  const selectedAgentSet = new Set(selectedAgents);
  const selectedAssets = [];
  const unselectedAssets = [];

  for (const agent of installAgents) {
    const assetIds = agent.assetIds ?? [];

    for (const assetId of assetIds) {
      const asset = agentAssetMap.get(assetId);

      if (!asset) {
        p.cancel(`Install agent ${agent.id} references unknown asset id ${assetId} in skills-manifest.json.`);
        process.exit(1);
      }

      if (asset.agent !== agent.id) {
        p.cancel(`Agent-specific asset ${asset.id} must declare agent ${agent.id}, found ${asset.agent ?? "none"}.`);
        process.exit(1);
      }

      if (selectedAgentSet.has(agent.id)) {
        selectedAssets.push(asset);
      } else {
        unselectedAssets.push(asset);
      }
    }
  }

  return {
    selectedAssets,
    unselectedAssets
  };
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

function summarizeResolvedPlan({
  selectedAgents,
  availabilityMode,
  resolvedSkills,
  targets,
  prerequisiteChecks,
  repoUrl,
  ref,
  sha,
  sharedAsset,
  agentSpecificAssets
}) {
  const topLevelSkills = resolvedSkills.filter((skill) => skill.selectable);
  const dependencySkills = resolvedSkills.filter((skill) => !skill.selectable);

  return [
    "Framework source:",
    `  repo: ${repoUrl}`,
    `  ref: ${ref}`,
    `  sha: ${sha}`,
    "",
    "Selected agents:",
    ...selectedAgents.map((agent) => `  - ${agent}`),
    "",
    "Availability mode:",
    `  - ${availabilityMode}`,
    "",
    "Framework-owned installs (mandatory in v1):",
    ...topLevelSkills.map((skill) => `  - ${skill.publicName}`),
    "",
    "Local dependency installs:",
    ...(dependencySkills.length > 0 ? dependencySkills.map((skill) => `  - ${skill.publicName}`) : ["  - none"]),
    "",
    "Shared framework assets:",
    `  - ${sharedAsset.id} (${sharedAsset.category})`,
    "",
    "Agent-specific framework assets:",
    ...(agentSpecificAssets.length > 0
      ? agentSpecificAssets.map((asset) => `  - ${asset.id} -> ${asset.installPath}`)
      : ["  - none"]),
    "",
    "External prerequisites validated:",
    ...(prerequisiteChecks.length > 0
      ? prerequisiteChecks.map((item) => `  - ${item.skillName}: ${item.foundAt ? `ok (${item.foundAt})` : "missing"}`)
      : ["  - none"]),
    "",
    "Concrete install targets:",
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

async function installSharedAsset({ sourceRoot, repoRoot, sharedAsset, installMode, force, yesMode }) {
  const sourcePlanDir = path.join(sourceRoot, sharedAsset.sourceRoot);
  const targetPlanDir = path.join(repoRoot, ".plan");
  const installedAssets = [];

  ensureDirectory(targetPlanDir);

  if (installMode === "install") {
    copyDirectory(sourcePlanDir, targetPlanDir);
  } else {
    for (const relativeManagedFile of sharedAsset.managedFiles) {
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
      }
    }

    for (const relativeWorkflowFile of sharedAsset.workflowOwnedFiles) {
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

  installedAssets.push({
    id: sharedAsset.id,
    class: sharedAsset.class,
    category: sharedAsset.category,
    installRoot: sharedAsset.installRoot,
    installPath: targetPlanDir,
    managedFiles: sharedAsset.managedFiles,
    workflowOwnedFiles: sharedAsset.workflowOwnedFiles,
    installedAt: new Date().toISOString()
  });

  return installedAssets;
}

function agentAssetTargetPath(asset, repoRoot) {
  if (asset.installRoot !== "repo") {
    p.cancel(`Unsupported installRoot for asset ${asset.id}: ${asset.installRoot}`);
    process.exit(1);
  }

  return path.join(repoRoot, asset.installPath);
}

async function installAgentSpecificAssets({ sourceRoot, repoRoot, selectedAssets, unselectedAssets }) {
  const installedAssets = [];

  for (const asset of unselectedAssets) {
    const targetPath = agentAssetTargetPath(asset, repoRoot);
    fs.rmSync(targetPath, { force: true });
  }

  for (const asset of selectedAssets) {
    const sourcePath = path.join(sourceRoot, asset.sourcePath);
    const targetPath = agentAssetTargetPath(asset, repoRoot);

    ensureDirectory(path.dirname(targetPath));
    fs.copyFileSync(sourcePath, targetPath);
    fs.chmodSync(targetPath, fs.statSync(sourcePath).mode);

    installedAssets.push({
      id: asset.id,
      class: asset.class,
      category: asset.category,
      agent: asset.agent,
      installRoot: asset.installRoot,
      installPath: targetPath,
      sourcePath: asset.sourcePath,
      availabilityBehavior: asset.availabilityBehavior,
      installedAt: new Date().toISOString()
    });
  }

  return installedAssets;
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

function writeFrameworkMetadata({
  repoRoot,
  installMode,
  adopted,
  repoUrl,
  ref,
  sha,
  sharedAsset,
  selectedAgents,
  availabilityMode,
  targets,
  installedSkills,
  installedAssets
}) {
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
    selection: {
      agents: selectedAgents,
      availabilityMode,
      targets
    },
    installedAt: new Date().toISOString(),
    managedFiles: sharedAsset.managedFiles,
    workflowOwnedFiles: sharedAsset.workflowOwnedFiles,
    installedAssets,
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
  const selectionContract = skillManifest.selectionContract;
  const { selectedAgents, availabilityMode, targets } = await resolveSelection(skillManifest, args, yesMode);
  const resolvedSkills = resolveSkillClosure(skillManifest, resolveMandatorySkillIds(skillManifest));
  const sharedAsset = resolveSharedAsset(frameworkFiles);
  const { selectedAssets, unselectedAssets } = resolveAgentSpecificAssets(selectionContract, frameworkFiles, selectedAgents);
  assertTargetCoverage(resolvedSkills, targets);
  const externalPrerequisites = collectExternalPrerequisites(resolvedSkills);
  const prerequisiteChecks = validateExternalPrerequisites(externalPrerequisites);

  if (prerequisiteChecks.some((item) => item.foundAt === null)) {
    p.cancel(
      "Missing external prerequisite skills. Install Matt Pocock's skills first with: npx skills@latest add mattpocock/skills"
    );
    process.exit(1);
  }

  const resolvedSummary = summarizeResolvedPlan({
    selectedAgents,
    availabilityMode,
    resolvedSkills,
    targets,
    prerequisiteChecks,
    repoUrl,
    ref,
    sha,
    sharedAsset,
    agentSpecificAssets: selectedAssets
  });

  if (!yesMode) {
    await confirmResolvedPlan(resolvedSummary);
  } else {
    p.note(resolvedSummary, "Resolved install plan");
  }

  const installedSharedAssets = await installSharedAsset({
    sourceRoot,
    repoRoot: confirmedRepoRoot,
    sharedAsset,
    installMode,
    force,
    yesMode
  });

  const installedAgentAssets = await installAgentSpecificAssets({
    sourceRoot,
    repoRoot: confirmedRepoRoot,
    selectedAssets,
    unselectedAssets
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
    sharedAsset,
    selectedAgents,
    availabilityMode,
    targets,
    installedSkills,
    installedAssets: [...installedSharedAssets, ...installedAgentAssets]
  });

  p.outro("Ralph Loop framework installation complete.");
}

const entrypointPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
const modulePath = fileURLToPath(import.meta.url);

if (entrypointPath === modulePath) {
  main().catch((error) => {
    p.cancel(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

export {
  assertTargetCoverage,
  chooseAvailabilityFromArgs,
  chooseAgentsFromArgs,
  concreteTargetId,
  parseArgs,
  readJson,
  resolveMandatorySkillIds,
  resolveSelection,
  resolveSkillClosure,
  summarizeResolvedPlan,
  validateLegacySelectionArgs,
  validateSelectionValues
};
