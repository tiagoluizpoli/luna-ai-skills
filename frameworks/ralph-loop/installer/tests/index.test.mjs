import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  CONSUMER_STARTER_CONTENT,
  installSkills,
  readJson,
  resolveMandatorySkillIds,
  resolveSkillClosure,
  writeFrameworkMetadata
} from "../src/index.mjs";

const testFilePath = fileURLToPath(import.meta.url);
const testsDir = path.dirname(testFilePath);
const installerRoot = path.dirname(testsDir);
const repoRoot = path.resolve(installerRoot, "../../..");
const installerEntrypoint = path.join(installerRoot, "src", "index.mjs");
const skillManifestPath = path.join(repoRoot, "frameworks", "ralph-loop", "skills-manifest.json");
const frameworkFilesPath = path.join(repoRoot, "frameworks", "ralph-loop", "framework-files.json");
const skillManifest = readJson(skillManifestPath);
const frameworkFiles = readJson(frameworkFilesPath);
const resolvedSkills = resolveSkillClosure(skillManifest, resolveMandatorySkillIds(skillManifest));

function createTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function createFakeHome() {
  const fakeHome = createTempDir("ralph-loop-fake-home-");
  const prerequisiteSkills = ["grill-with-docs", "to-prd", "to-issues"];
  for (const skillName of prerequisiteSkills) {
    const skillDir = path.join(fakeHome, ".agents", "skills", skillName);
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, "SKILL.md"), `# ${skillName}\n`);
  }
  return fakeHome;
}

function createGitRepo() {
  const repoDir = createTempDir("ralph-loop-target-repo-");
  execFileSync("git", ["init", "-b", "main", repoDir], { encoding: "utf8" });
  return repoDir;
}

function runInstaller({ args = [], env = {}, repoDir = createGitRepo() } = {}) {
  const fakeHome = env.HOME ?? createFakeHome();
  const result = spawnSync(
    process.execPath,
    [
      installerEntrypoint,
      "--source-root", repoRoot,
      "--target-root", repoDir,
      "--repo-url", "https://example.com/ralph-loop.git",
      "--ref", "main",
      "--sha", "deadbeef",
      ...args
    ],
    {
      cwd: repoRoot,
      encoding: "utf8",
      env: { ...process.env, HOME: fakeHome, ...env }
    }
  );
  return { ...result, repoDir, fakeHome };
}

// --- installSkills unit tests ---

test("installSkills conflict prompt shows consolidated multiselect with all conflicting skills", async () => {
  const tmpTarget = createTempDir("rl-install-conflict-");
  // Use a non-local target so targetPathForSkill returns the template path directly
  // (local targets prepend repoRoot, which would mangle absolute paths)
  const target = "hermes-global";
  const skill = resolvedSkills[0];
  const destDir = path.join(tmpTarget, skill.publicName);
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, "SKILL.md"), "# existing\n");

  const prompts = {
    async multiselect(config) {
      assert.match(config.message, /already exist.*Select which ones to overwrite/);
      assert.ok(config.options.length >= 1, "at least one option in conflict list");
      const key = `${skill.id}::${target}`;
      assert.ok(
        config.options.some((o) => o.value === key),
        `option ${key} should appear`
      );
      return []; // skip all
    },
    isCancel() {
      return false;
    }
  };

  const patchedSkills = resolvedSkills.map((s) => ({
    ...s,
    installPathTemplates: { [target]: path.join(tmpTarget, s.publicName) }
  }));

  const installed = await installSkills({
    sourceRoot: repoRoot,
    repoRoot: tmpTarget,
    resolvedSkills: patchedSkills,
    targets: [target],
    force: false,
    yesMode: false,
    prompts
  });

  // Conflicting skill was skipped → not in returned installedSkills
  assert.equal(
    installed.some((s) => s.publicName === skill.publicName),
    false,
    "skipped skill should not appear in returned installedSkills"
  );
});

test("installSkills conflict prompt groups by provider and asks multiple times", async () => {
  const tmpTarget = createTempDir("rl-install-grouped-conflict-");
  const targetHermes = "hermes-global";
  const targetCodex = "codex-global";
  const skill = resolvedSkills[0];

  const destHermes = path.join(tmpTarget, "hermes", skill.publicName);
  const destCodex = path.join(tmpTarget, "codex", skill.publicName);
  fs.mkdirSync(destHermes, { recursive: true });
  fs.writeFileSync(path.join(destHermes, "SKILL.md"), "# existing\n");
  fs.mkdirSync(destCodex, { recursive: true });
  fs.writeFileSync(path.join(destCodex, "SKILL.md"), "# existing\n");

  const promptsCalled = [];
  const prompts = {
    async multiselect(config) {
      promptsCalled.push(config.message);
      return []; // skip all
    },
    isCancel() {
      return false;
    }
  };

  const patchedSkills = resolvedSkills.map((s) => ({
    ...s,
    installPathTemplates: {
      [targetHermes]: path.join(tmpTarget, "hermes", s.publicName),
      [targetCodex]: path.join(tmpTarget, "codex", s.publicName)
    }
  }));

  await installSkills({
    sourceRoot: repoRoot,
    repoRoot: tmpTarget,
    resolvedSkills: patchedSkills,
    targets: [targetHermes, targetCodex],
    force: false,
    yesMode: false,
    prompts
  });

  assert.equal(promptsCalled.length, 2);
  assert.ok(promptsCalled.some(msg => msg.includes("for Hermes")), "should prompt for Hermes");
  assert.ok(promptsCalled.some(msg => msg.includes("for Codex")), "should prompt for Codex");
});

test("installSkills skips unselected conflicting skills and overwrites selected ones", async () => {
  const tmpTarget = createTempDir("rl-skip-overwrite-");
  // Use global target so targetPathForSkill returns absolute path directly
  const target = "hermes-global";
  const [skillA, skillB, ...rest] = resolvedSkills;

  const destA = path.join(tmpTarget, skillA.publicName);
  const destB = path.join(tmpTarget, skillB.publicName);
  fs.mkdirSync(destA, { recursive: true });
  fs.writeFileSync(path.join(destA, "SKILL.md"), "# old A\n");
  fs.mkdirSync(destB, { recursive: true });
  fs.writeFileSync(path.join(destB, "SKILL.md"), "# old B\n");

  const patchedSkills = resolvedSkills.map((s) => ({
    ...s,
    installPathTemplates: { [target]: path.join(tmpTarget, s.publicName) }
  }));

  const prompts = {
    async multiselect() {
      // Select only skillA to overwrite; skip skillB
      return [`${skillA.id}::${target}`];
    },
    isCancel() {
      return false;
    }
  };

  const installed = await installSkills({
    sourceRoot: repoRoot,
    repoRoot: tmpTarget,
    resolvedSkills: patchedSkills,
    targets: [target],
    force: false,
    yesMode: false,
    prompts
  });

  // skillA was overwritten → in returned list
  assert.ok(
    installed.some((s) => s.publicName === skillA.publicName),
    "selected skillA should be in installedSkills"
  );
  // skillB was skipped → NOT in returned list
  assert.equal(
    installed.some((s) => s.publicName === skillB.publicName),
    false,
    "skipped skillB should not be in installedSkills"
  );
});

// --- writeFrameworkMetadata skip-preservation unit test ---

test("writeFrameworkMetadata preserves skipped skill records and timestamps from existing manifest", () => {
  const tmpRepo = createGitRepo();
  const planDir = path.join(tmpRepo, ".plan");
  fs.mkdirSync(planDir, { recursive: true });

  const sharedAsset = frameworkFiles.sharedAssets[0];
  const now = new Date().toISOString();

  // Pre-populate manifest with two skills
  const existingManifest = {
    framework: "ralph-loop",
    mode: "install",
    adopted: false,
    source: { repoUrl: "https://example.com", ref: "main", sha: "abc" },
    selection: { agents: ["hermes"], availabilityMode: "local", targets: ["hermes-local"] },
    firstInstalledAt: "2026-01-01T00:00:00.000Z",
    lastUpdatedAt: "2026-01-01T00:00:00.000Z",
    managedFiles: sharedAsset.managedFiles,
    workflowOwnedFiles: sharedAsset.workflowOwnedFiles,
    installedAssets: [],
    installedSkills: [
      {
        publicName: "skill-alpha",
        sourcePath: ".agents/skills/skill-alpha",
        target: "hermes-local",
        installPath: "/tmp/skill-alpha",
        firstInstalledAt: "2026-01-01T00:00:00.000Z",
        lastUpdatedAt: "2026-01-01T00:00:00.000Z"
      },
      {
        publicName: "skill-beta",
        sourcePath: ".agents/skills/skill-beta",
        target: "hermes-local",
        installPath: "/tmp/skill-beta",
        firstInstalledAt: "2026-01-01T00:00:00.000Z",
        lastUpdatedAt: "2026-01-01T00:00:00.000Z"
      }
    ]
  };
  const manifestPath = path.join(planDir, ".framework-install.json");
  fs.writeFileSync(path.join(planDir, ".framework"), "ralph-loop\n");
  fs.writeFileSync(manifestPath, `${JSON.stringify(existingManifest, null, 2)}\n`);

  // Re-install only skill-alpha (skill-beta is skipped)
  writeFrameworkMetadata({
    repoRoot: tmpRepo,
    installMode: "update",
    adopted: false,
    repoUrl: "https://example.com",
    ref: "main",
    sha: "abc",
    sharedAsset,
    selectedAgents: ["hermes"],
    availabilityMode: "local",
    targets: ["hermes-local"],
    installedSkills: [
      {
        publicName: "skill-alpha",
        sourcePath: ".agents/skills/skill-alpha",
        target: "hermes-local",
        installPath: "/tmp/skill-alpha",
        installedAt: now
      }
    ],
    installedAssets: []
  });

  const written = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  // skill-alpha updated
  const alpha = written.installedSkills.find(
    (s) => s.publicName === "skill-alpha" && s.target === "hermes-local"
  );
  assert.ok(alpha, "skill-alpha should be in manifest");
  assert.equal(alpha.firstInstalledAt, "2026-01-01T00:00:00.000Z", "firstInstalledAt preserved for overwritten skill");

  // skill-beta preserved (skipped)
  const beta = written.installedSkills.find(
    (s) => s.publicName === "skill-beta" && s.target === "hermes-local"
  );
  assert.ok(beta, "skipped skill-beta should be preserved in manifest");
  assert.equal(beta.firstInstalledAt, "2026-01-01T00:00:00.000Z", "skipped skill-beta timestamp unchanged");
  assert.equal(beta.lastUpdatedAt, "2026-01-01T00:00:00.000Z", "skipped skill-beta lastUpdatedAt unchanged");
});

// --- Integration tests ---

test("skipped skills retain pre-existing timestamps in .framework-install.json", () => {
  const repoDir = createGitRepo();
  const manifestPath = path.join(repoDir, ".plan", ".framework-install.json");

  // Fresh install (all skills overwritten)
  const result1 = runInstaller({
    args: ["--yes", "--agents", "hermes", "--availability", "local"],
    repoDir
  });
  assert.equal(result1.status, 0, `${result1.stdout}${result1.stderr}`);

  const manifest1 = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.ok(manifest1.installedSkills.length > 0, "skills should be installed");

  // Snapshot timestamps from the first run
  const firstRunTimestamps = new Map(
    manifest1.installedSkills.map((s) => [`${s.publicName}::${s.target}`, s.firstInstalledAt])
  );

  // Spin briefly so timestamps can differ if updated
  const start = Date.now();
  while (Date.now() - start < 50) {}

  // Second run: --yes overwrites all skills again to verify timestamps are preserved
  const result2 = runInstaller({
    args: ["--yes", "--agents", "hermes", "--availability", "local"],
    repoDir
  });
  assert.equal(result2.status, 0, `${result2.stdout}${result2.stderr}`);

  const manifest2 = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  for (const skill of manifest2.installedSkills) {
    const key = `${skill.publicName}::${skill.target}`;
    if (firstRunTimestamps.has(key)) {
      assert.equal(
        skill.firstInstalledAt,
        firstRunTimestamps.get(key),
        `firstInstalledAt must be preserved for ${key}`
      );
    }
  }
});

test("claude provider installs ralph-loop-claude.sh and records runner-claude in manifest", () => {
  const result = runInstaller({
    args: ["--yes", "--agents", "claude", "--availability", "local"]
  });
  const output = `${result.stdout}${result.stderr}`;
  assert.equal(result.status, 0, output);

  // File on disk
  const claudeScript = path.join(result.repoDir, "ralph-loop-claude.sh");
  assert.equal(fs.existsSync(claudeScript), true, "ralph-loop-claude.sh should be installed");

  // Other agent scripts should NOT be present
  assert.equal(fs.existsSync(path.join(result.repoDir, "ralph-loop-hermes.sh")), false, "hermes script should NOT be installed");
  assert.equal(fs.existsSync(path.join(result.repoDir, "ralph-loop-codex.sh")), false, "codex script should NOT be installed");
  assert.equal(fs.existsSync(path.join(result.repoDir, "ralph-loop-agy.sh")), false, "agy script should NOT be installed");

  // Manifest entries
  const manifestPath = path.join(result.repoDir, ".plan", ".framework-install.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const assetIds = manifest.installedAssets.map((a) => a.id);
  assert.ok(assetIds.includes("runner-claude"), "runner-claude should be in installedAssets");
  assert.ok(!assetIds.includes("runner-hermes"), "runner-hermes should NOT be in installedAssets");

  // Claude target in skills
  const claudeSkills = manifest.installedSkills.filter((s) => s.target === "claude-local");
  assert.ok(claudeSkills.length > 0, "skills should be installed for claude-local target");
  assert.equal(
    manifest.selection.targets.every((t) => t.startsWith("claude")),
    true,
    "all targets should be claude-*"
  );
});

test("all-agent install with claude includes ralph-loop-claude.sh alongside other runners", () => {
  const result = runInstaller({
    args: ["--yes", "--agents", "hermes,codex,agy,claude", "--availability", "local"]
  });
  const output = `${result.stdout}${result.stderr}`;
  assert.equal(result.status, 0, output);

  for (const agent of ["hermes", "codex", "agy", "claude"]) {
    const scriptPath = path.join(result.repoDir, `ralph-loop-${agent}.sh`);
    assert.equal(fs.existsSync(scriptPath), true, `ralph-loop-${agent}.sh should be installed`);
  }

  const manifestPath = path.join(result.repoDir, ".plan", ".framework-install.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const assetIds = manifest.installedAssets.map((a) => a.id);
  for (const agent of ["hermes", "codex", "agy", "claude"]) {
    assert.ok(assetIds.includes(`runner-${agent}`), `runner-${agent} should be in installedAssets`);
  }
});

// --- ST-01: fresh install scaffold for consumer-owned starter files ---

test("fresh install creates prompt.local.md with starter content", () => {
  const result = runInstaller({
    args: ["--yes", "--agents", "hermes", "--availability", "local"]
  });
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);

  const promptLocalPath = path.join(result.repoDir, "prompt.local.md");
  assert.ok(fs.existsSync(promptLocalPath), "prompt.local.md should exist after fresh install");
  const content = fs.readFileSync(promptLocalPath, "utf8");
  assert.equal(content, CONSUMER_STARTER_CONTENT["prompt.local.md"], "prompt.local.md content should match starter template");
});

test("fresh install creates CONTEXT.md with starter content", () => {
  const result = runInstaller({
    args: ["--yes", "--agents", "hermes", "--availability", "local"]
  });
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);

  const contextPath = path.join(result.repoDir, "CONTEXT.md");
  assert.ok(fs.existsSync(contextPath), "CONTEXT.md should exist after fresh install");
  const content = fs.readFileSync(contextPath, "utf8");
  assert.equal(content, CONSUMER_STARTER_CONTENT["CONTEXT.md"], "CONTEXT.md content should match starter template");
});

// --- ST-02: update run preserves consumer-owned files ---

test("update run leaves pre-existing prompt.local.md, CONTEXT.md, and RULES.md unchanged", () => {
  const repoDir = createGitRepo();

  const result1 = runInstaller({
    args: ["--yes", "--agents", "hermes", "--availability", "local"],
    repoDir
  });
  assert.equal(result1.status, 0, `${result1.stdout}${result1.stderr}`);

  const customPromptLocal = "# My Custom Instructions\nDo something special\n";
  const customContext = "# My Domain Context\nTerm: means something special\n";
  const customRules = "# My Custom Rules\nRule 1: Always do X\n";

  fs.writeFileSync(path.join(repoDir, "prompt.local.md"), customPromptLocal);
  fs.writeFileSync(path.join(repoDir, "CONTEXT.md"), customContext);
  fs.writeFileSync(path.join(repoDir, ".plan", "RULES.md"), customRules);

  const result2 = runInstaller({
    args: ["--yes", "--agents", "hermes", "--availability", "local"],
    repoDir
  });
  assert.equal(result2.status, 0, `${result2.stdout}${result2.stderr}`);

  assert.equal(
    fs.readFileSync(path.join(repoDir, "prompt.local.md"), "utf8"),
    customPromptLocal,
    "prompt.local.md should be unchanged after update"
  );
  assert.equal(
    fs.readFileSync(path.join(repoDir, "CONTEXT.md"), "utf8"),
    customContext,
    "CONTEXT.md should be unchanged after update"
  );
  assert.equal(
    fs.readFileSync(path.join(repoDir, ".plan", "RULES.md"), "utf8"),
    customRules,
    "RULES.md should be unchanged after update"
  );
});

// --- ST-03: framework-files.json classification ---

test("framework-files.json: prompt.local.md and CONTEXT.md absent from managedFiles and workflowOwnedFiles", () => {
  const allManagedFiles = [
    ...(frameworkFiles.managedFiles ?? []),
    ...(frameworkFiles.sharedAssets ?? []).flatMap((a) => a.managedFiles ?? [])
  ];
  const allWorkflowOwnedFiles = [
    ...(frameworkFiles.workflowOwnedFiles ?? []),
    ...(frameworkFiles.sharedAssets ?? []).flatMap((a) => a.workflowOwnedFiles ?? [])
  ];

  assert.ok(
    !allManagedFiles.some((f) => f.includes("prompt.local.md")),
    "prompt.local.md must not appear in any managedFiles array"
  );
  assert.ok(
    !allManagedFiles.some((f) => f.includes("CONTEXT.md")),
    "CONTEXT.md must not appear in any managedFiles array"
  );
  assert.ok(
    !allWorkflowOwnedFiles.some((f) => f.includes("prompt.local.md")),
    "prompt.local.md must not appear in any workflowOwnedFiles array"
  );
  assert.ok(
    !allWorkflowOwnedFiles.some((f) => f.includes("CONTEXT.md")),
    "CONTEXT.md must not appear in any workflowOwnedFiles array"
  );

  const topLevelStarters = frameworkFiles.consumerOwnedStarterFiles ?? [];
  assert.ok(
    topLevelStarters.some((f) => f.includes("prompt.local.md")),
    "prompt.local.md must appear in top-level consumerOwnedStarterFiles"
  );
  assert.ok(
    topLevelStarters.some((f) => f.includes("CONTEXT.md")),
    "CONTEXT.md must appear in top-level consumerOwnedStarterFiles"
  );

  assert.ok(
    !allManagedFiles.some((f) => f.includes("RULES.md")),
    "RULES.md must not appear in any managedFiles array"
  );
});
