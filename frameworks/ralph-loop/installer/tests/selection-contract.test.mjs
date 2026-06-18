import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  assertTargetCoverage,
  getTrustworthyRecordedState,
  readJson,
  resolveMandatorySkillIds,
  resolveSelection,
  resolveSkillClosure
} from "../src/index.mjs";

const testFilePath = fileURLToPath(import.meta.url);
const testsDir = path.dirname(testFilePath);
const installerRoot = path.dirname(testsDir);
const repoRoot = path.resolve(installerRoot, "../../..");
const installerEntrypoint = path.join(installerRoot, "src", "index.mjs");
const skillManifestPath = path.join(repoRoot, "frameworks", "ralph-loop", "skills-manifest.json");
const skillManifest = readJson(skillManifestPath);
const resolvedSkills = resolveSkillClosure(skillManifest, resolveMandatorySkillIds(skillManifest));
const installAgents = skillManifest.selectionContract.installAgents.map((agent) => agent.id);
const availabilityModes = skillManifest.selectionContract.availabilityModes.map((mode) => mode.id);

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
      "--source-root",
      repoRoot,
      "--target-root",
      repoDir,
      "--repo-url",
      "https://example.com/ralph-loop.git",
      "--ref",
      "main",
      "--sha",
      "deadbeef",
      ...args
    ],
    {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        HOME: fakeHome,
        ...env
      }
    }
  );

  return { ...result, repoDir, fakeHome };
}

test("selection matrix resolves every agent/availability pair and every target is covered", async (t) => {
  for (const agent of installAgents) {
    for (const availabilityMode of availabilityModes) {
      await t.test(`${agent}-${availabilityMode}`, async () => {
        const selection = await resolveSelection(
          skillManifest,
          { agents: agent, availability: availabilityMode },
          true
        );

        assert.deepEqual(selection.selectedAgents, [agent]);
        assert.equal(selection.availabilityMode, availabilityMode);
        assert.deepEqual(selection.targets, [`${agent}-${availabilityMode}`]);
        assert.doesNotThrow(() => assertTargetCoverage(resolvedSkills, selection.targets));
      });
    }
  }
});

test("interactive selection prompts for agents first, then availability, with no manual skill-selection prompt", async () => {
  const callOrder = [];
  const prompts = {
    async multiselect(config) {
      callOrder.push({ type: "multiselect", message: config.message });
      return ["hermes", "agy"];
    },
    async select(config) {
      callOrder.push({ type: "select", message: config.message });
      return "global";
    },
    isCancel() {
      return false;
    }
  };

  const selection = await resolveSelection(skillManifest, {}, false, prompts);

  assert.deepEqual(selection.selectedAgents, ["hermes", "agy"]);
  assert.equal(selection.availabilityMode, "global");
  assert.deepEqual(selection.targets, ["hermes-global", "agy-global"]);
  assert.deepEqual(callOrder, [
    {
      type: "multiselect",
      message: "Which install agents should receive the Ralph Loop framework?"
    },
    {
      type: "select",
      message: "Which availability mode should this run use?"
    }
  ]);
});

test("automation validation errors stay user-facing for legacy and invalid selection inputs", async (t) => {
  const cases = [
    {
      name: "legacy flags are rejected",
      args: ["--yes", "--all", "--agents", "hermes", "--availability", "local"],
      expectedText:
        "Legacy installer flags are no longer supported: --all. Use --agents <hermes,codex,agy,claude> and --availability <local|global> instead."
    },
    {
      name: "invalid agent is rejected",
      args: ["--yes", "--agents", "hermes,ghost", "--availability", "local"],
      expectedText: "Unsupported agent: ghost. Valid agent values: hermes, codex, agy, claude"
    },
    {
      name: "invalid availability is rejected",
      args: ["--yes", "--agents", "hermes", "--availability", "everywhere"],
      expectedText:
        "Unsupported availability mode: everywhere. Valid availability mode values: local, global"
    },
    {
      name: "missing agents in non-interactive mode is rejected",
      args: ["--yes", "--availability", "local"],
      expectedText:
        "Non-interactive runs must pass --agents. Valid agents: hermes, codex, agy, claude"
    }
  ];

  for (const testCase of cases) {
    await t.test(testCase.name, () => {
      const result = runInstaller({ args: testCase.args });
      const combinedOutput = `${result.stdout}${result.stderr}`;

      assert.notEqual(result.status, 0, combinedOutput);
      assert.match(combinedOutput, new RegExp(testCase.expectedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    });
  }
});

test("throwaway install writes selection metadata and installs the mandatory framework skill set", () => {
  const result = runInstaller({
    args: ["--yes", "--agents", "hermes,codex,agy", "--availability", "local"]
  });
  const combinedOutput = `${result.stdout}${result.stderr}`;

  assert.equal(result.status, 0, combinedOutput);
  assert.doesNotMatch(combinedOutput, /Select skill bundles|Choose skills manually|Selected bundles/);
  assert.match(combinedOutput, /Selected agents:/);
  assert.match(combinedOutput, /Availability mode:/);
  assert.match(combinedOutput, /Framework-owned installs \(mandatory in v1\):/);

  const manifestPath = path.join(result.repoDir, ".plan", ".framework-install.json");
  assert.equal(fs.existsSync(manifestPath), true, "framework install manifest should exist");

  const installManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.deepEqual(installManifest.selection, {
    agents: ["hermes", "codex", "agy"],
    availabilityMode: "local",
    targets: ["hermes-local", "codex-local", "agy-local"]
  });

  const expectedInstallCount = resolvedSkills.length * 3;
  assert.equal(installManifest.installedSkills.length, expectedInstallCount);
  assert.equal(
    installManifest.installedSkills.every((skill) => skill.target.endsWith("-local")),
    true,
    "all installed targets should respect the selected availability mode"
  );
});

test("installer routes assets correctly and avoids installing unselected agent-specific assets", () => {
  // Test case 1: Install with only hermes selected
  const resultHermes = runInstaller({
    args: ["--yes", "--agents", "hermes", "--availability", "local"]
  });
  const outputHermes = `${resultHermes.stdout}${resultHermes.stderr}`;
  assert.equal(resultHermes.status, 0, outputHermes);

  // Assert only hermes runner is installed on disk
  const hermesScriptPath = path.join(resultHermes.repoDir, "ralph-loop-hermes.sh");
  const codexScriptPath = path.join(resultHermes.repoDir, "ralph-loop-codex.sh");
  const agyScriptPath = path.join(resultHermes.repoDir, "ralph-loop-agy.sh");

  assert.equal(fs.existsSync(hermesScriptPath), true, "hermes script should be installed");
  assert.equal(fs.existsSync(codexScriptPath), false, "codex script should NOT be installed");
  assert.equal(fs.existsSync(agyScriptPath), false, "agy script should NOT be installed");

  // Assert bookkeeping in manifest
  const manifestPathHermes = path.join(resultHermes.repoDir, ".plan", ".framework-install.json");
  const manifestHermes = JSON.parse(fs.readFileSync(manifestPathHermes, "utf8"));
  
  // The shared assets group is always installed (e.g. plan-starter)
  // Check that only hermes runner is in the installedAssets list
  const installedAssetIdsHermes = manifestHermes.installedAssets.map(a => a.id);
  assert.ok(installedAssetIdsHermes.includes("plan-starter"));
  assert.ok(installedAssetIdsHermes.includes("runner-hermes"));
  assert.ok(!installedAssetIdsHermes.includes("runner-codex"));
  assert.ok(!installedAssetIdsHermes.includes("runner-agy"));

  // Check details of runner-hermes bookkeeping
  const hermesAsset = manifestHermes.installedAssets.find(a => a.id === "runner-hermes");
  assert.equal(hermesAsset.class, "agent-specific");
  assert.equal(hermesAsset.category, "runner-script");
  assert.equal(hermesAsset.agent, "hermes");
  assert.equal(hermesAsset.installRoot, "repo");
  assert.equal(hermesAsset.installPath, hermesScriptPath);

  // Test case 2: Install with only codex and agy selected, check cleanup/omission of existing unselected ones
  // Write fake files to simulate existing pre-installed runner scripts (to check that unselected ones get removed)
  const repoDir = createGitRepo();
  const preHermesPath = path.join(repoDir, "ralph-loop-hermes.sh");
  const preCodexPath = path.join(repoDir, "ralph-loop-codex.sh");
  fs.writeFileSync(preHermesPath, "# old hermes\n");
  fs.writeFileSync(preCodexPath, "# old codex\n");

  const resultCodexAgy = runInstaller({
    args: ["--yes", "--agents", "codex,agy", "--availability", "local"],
    repoDir
  });
  const outputCodexAgy = `${resultCodexAgy.stdout}${resultCodexAgy.stderr}`;
  assert.equal(resultCodexAgy.status, 0, outputCodexAgy);

  const hermesScriptPath2 = path.join(repoDir, "ralph-loop-hermes.sh");
  const codexScriptPath2 = path.join(repoDir, "ralph-loop-codex.sh");
  const agyScriptPath2 = path.join(repoDir, "ralph-loop-agy.sh");

  assert.equal(fs.existsSync(hermesScriptPath2), false, "unselected hermes script should be deleted if existed");
  assert.equal(fs.existsSync(codexScriptPath2), true, "selected codex script should be installed");
  assert.equal(fs.existsSync(agyScriptPath2), true, "selected agy script should be installed");

  const manifestPathCodexAgy = path.join(repoDir, ".plan", ".framework-install.json");
  const manifestCodexAgy = JSON.parse(fs.readFileSync(manifestPathCodexAgy, "utf8"));
  const installedAssetIdsCodexAgy = manifestCodexAgy.installedAssets.map(a => a.id);
  assert.ok(installedAssetIdsCodexAgy.includes("plan-starter"));
  assert.ok(!installedAssetIdsCodexAgy.includes("runner-hermes"));
  assert.ok(installedAssetIdsCodexAgy.includes("runner-codex"));
  assert.ok(installedAssetIdsCodexAgy.includes("runner-agy"));
});

test("installer fresh install provisions only the declared framework-managed and workflow-owned starter files", () => {
  const result = runInstaller({
    args: ["--yes", "--agents", "hermes", "--availability", "local"]
  });
  const combinedOutput = `${result.stdout}${result.stderr}`;
  assert.equal(result.status, 0, combinedOutput);

  const targetPlanDir = path.join(result.repoDir, ".plan");
  
  // Find all files in targetPlanDir recursively
  function getFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = entries.flatMap((entry) => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? getFiles(res) : res;
    });
    return files;
  }

  const installedFiles = getFiles(targetPlanDir).map(f => {
    return path.relative(result.repoDir, f);
  });

  const frameworkFiles = readJson(path.join(repoRoot, "frameworks", "ralph-loop", "framework-files.json"));
  const declaredFiles = new Set([
    ...frameworkFiles.managedFiles,
    ...frameworkFiles.workflowOwnedFiles,
    ...(frameworkFiles.consumerOwnedStarterFiles ?? [])
  ]);

  // Assert that every installed file in .plan is declared in the framework-files manifest
  for (const installedFile of installedFiles) {
    if (installedFile === ".plan/.framework-install.json") {
      continue;
    }
    assert.ok(
      declaredFiles.has(installedFile),
      `Installed file ${installedFile} is not declared in framework-files.json`
    );
  }
});

test("install and update emit the expected metadata file classification and contents in .framework-install.json", () => {
  const repoDir = createGitRepo();

  // Run 1: fresh install
  const resultInstall = runInstaller({
    args: ["--yes", "--agents", "hermes", "--availability", "local"],
    repoDir
  });
  const outputInstall = `${resultInstall.stdout}${resultInstall.stderr}`;
  assert.equal(resultInstall.status, 0, outputInstall);

  const manifestPath = path.join(repoDir, ".plan", ".framework-install.json");
  assert.equal(fs.existsSync(manifestPath), true, "manifest file should exist after fresh install");

  const manifestDataInstall = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.equal(manifestDataInstall.framework, "ralph-loop");
  assert.equal(manifestDataInstall.mode, "install");
  assert.equal(manifestDataInstall.adopted, false);
  assert.deepEqual(manifestDataInstall.selection.agents, ["hermes"]);
  assert.equal(manifestDataInstall.selection.availabilityMode, "local");

  // Verify .framework-install.json is not classified under managed or workflowOwned
  assert.ok(!manifestDataInstall.managedFiles.includes(".plan/.framework-install.json"));
  assert.ok(!manifestDataInstall.workflowOwnedFiles.includes(".plan/.framework-install.json"));

  // Run 2: update
  const resultUpdate = runInstaller({
    args: ["--yes", "--agents", "hermes,agy", "--availability", "local"],
    repoDir
  });
  const outputUpdate = `${resultUpdate.stdout}${resultUpdate.stderr}`;
  assert.equal(resultUpdate.status, 0, outputUpdate);

  const manifestDataUpdate = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.equal(manifestDataUpdate.framework, "ralph-loop");
  assert.equal(manifestDataUpdate.mode, "update");
  assert.equal(manifestDataUpdate.adopted, false);
  assert.deepEqual(manifestDataUpdate.selection.agents, ["hermes", "agy"]);
  assert.equal(manifestDataUpdate.selection.availabilityMode, "local");
  assert.ok(!manifestDataUpdate.managedFiles.includes(".plan/.framework-install.json"));
  assert.ok(!manifestDataUpdate.workflowOwnedFiles.includes(".plan/.framework-install.json"));
});

test("getTrustworthyRecordedState validates recorded state accurately", () => {
  const tempFile = path.join(os.tmpdir(), `test-recorded-${Date.now()}.json`);

  // 1. Missing file returns null
  assert.equal(getTrustworthyRecordedState(tempFile, skillManifest.selectionContract), null);

  // 2. Invalid JSON returns null
  fs.writeFileSync(tempFile, "{invalid-json}");
  assert.equal(getTrustworthyRecordedState(tempFile, skillManifest.selectionContract), null);

  // 3. Valid JSON but missing selection returns null
  fs.writeFileSync(tempFile, JSON.stringify({ framework: "ralph-loop" }));
  assert.equal(getTrustworthyRecordedState(tempFile, skillManifest.selectionContract), null);

  // 4. Stale or invalid agent in selection returns null
  fs.writeFileSync(
    tempFile,
    JSON.stringify({
      framework: "ralph-loop",
      selection: {
        agents: ["hermes", "alien-agent"],
        availabilityMode: "local"
      }
    })
  );
  assert.equal(getTrustworthyRecordedState(tempFile, skillManifest.selectionContract), null);

  // 5. Invalid availabilityMode returns null
  fs.writeFileSync(
    tempFile,
    JSON.stringify({
      framework: "ralph-loop",
      selection: {
        agents: ["hermes"],
        availabilityMode: "universe"
      }
    })
  );
  assert.equal(getTrustworthyRecordedState(tempFile, skillManifest.selectionContract), null);

  // 6. Valid selection state returns selection object
  const validSelection = {
    agents: ["hermes", "codex"],
    availabilityMode: "global",
    targets: ["hermes-global", "codex-global"]
  };
  fs.writeFileSync(
    tempFile,
    JSON.stringify({
      framework: "ralph-loop",
      selection: validSelection
    })
  );
  assert.deepEqual(getTrustworthyRecordedState(tempFile, skillManifest.selectionContract), validSelection);

  fs.unlinkSync(tempFile);
});

test("resolveSelection updates options with trustworthy recorded state defaults", async () => {
  const tempFile = path.join(os.tmpdir(), `test-recorded-${Date.now()}.json`);
  const validSelection = {
    agents: ["hermes"],
    availabilityMode: "global",
    targets: ["hermes-global"]
  };
  fs.writeFileSync(
    tempFile,
    JSON.stringify({
      framework: "ralph-loop",
      selection: validSelection
    })
  );

  const callOrder = [];
  const prompts = {
    async confirm(config) {
      callOrder.push({ type: "confirm", message: config.message });
      return false; // User selects NO to reuse, triggering manual prompts
    },
    async multiselect(config) {
      callOrder.push({ type: "multiselect", initialValues: config.initialValues });
      return ["hermes"];
    },
    async select(config) {
      callOrder.push({ type: "select", initialValue: config.initialValue });
      return "global";
    },
    isCancel() {
      return false;
    }
  };

  const selection = await resolveSelection(skillManifest, {}, false, prompts, tempFile);
  assert.deepEqual(selection.selectedAgents, ["hermes"]);
  assert.equal(selection.availabilityMode, "global");
  assert.deepEqual(callOrder, [
    { type: "confirm", message: "Reuse these recorded settings?" },
    { type: "multiselect", initialValues: ["hermes"] },
    { type: "select", initialValue: "global" }
  ]);

  fs.unlinkSync(tempFile);
});

test("resolveSelection reuses trustworthy recorded state directly on interactive confirm", async () => {
  const tempFile = path.join(os.tmpdir(), `test-recorded-reuse-${Date.now()}.json`);
  const validSelection = {
    agents: ["hermes", "codex"],
    availabilityMode: "local",
    targets: ["hermes-local", "codex-local"]
  };
  fs.writeFileSync(
    tempFile,
    JSON.stringify({
      framework: "ralph-loop",
      selection: validSelection
    })
  );

  const callOrder = [];
  const prompts = {
    async confirm(config) {
      callOrder.push({ type: "confirm", message: config.message });
      return true; // User selects YES to reuse
    },
    async multiselect() {
      callOrder.push({ type: "multiselect" });
      return [];
    },
    async select() {
      callOrder.push({ type: "select" });
      return "";
    },
    isCancel() {
      return false;
    }
  };

  const selection = await resolveSelection(skillManifest, {}, false, prompts, tempFile);
  assert.deepEqual(selection.selectedAgents, ["hermes", "codex"]);
  assert.equal(selection.availabilityMode, "local");
  assert.deepEqual(callOrder, [
    { type: "confirm", message: "Reuse these recorded settings?" }
  ]);

  fs.unlinkSync(tempFile);
});

test("resolveSelection rejects stale or invalid recorded state and prompts fresh", async () => {
  const tempFile = path.join(os.tmpdir(), `test-recorded-stale-${Date.now()}.json`);
  // Stale/invalid selection because of unknown agent
  fs.writeFileSync(
    tempFile,
    JSON.stringify({
      framework: "ralph-loop",
      selection: {
        agents: ["invalid-agent"],
        availabilityMode: "local"
      }
    })
  );

  const callOrder = [];
  const prompts = {
    async confirm(config) {
      callOrder.push({ type: "confirm", message: config.message });
      return true;
    },
    async multiselect(config) {
      callOrder.push({ type: "multiselect", initialValues: config.initialValues });
      return ["hermes"];
    },
    async select(config) {
      callOrder.push({ type: "select", initialValue: config.initialValue });
      return "local";
    },
    isCancel() {
      return false;
    }
  };

  const selection = await resolveSelection(skillManifest, {}, false, prompts, tempFile);
  assert.deepEqual(selection.selectedAgents, ["hermes"]);
  assert.equal(selection.availabilityMode, "local");
  // confirm should NOT be in the callOrder since invalid state was rejected and not offered for reuse
  assert.deepEqual(callOrder, [
    { type: "multiselect", initialValues: ["hermes", "codex", "agy", "claude"] },
    { type: "select", initialValue: undefined }
  ]);

  fs.unlinkSync(tempFile);
});

test("resolveSelection rejects stale or invalid recorded state and fails in non-interactive mode without args", async () => {
  const tempFile = path.join(os.tmpdir(), `test-recorded-non-interactive-stale-${Date.now()}.json`);
  fs.writeFileSync(
    tempFile,
    JSON.stringify({
      framework: "ralph-loop",
      selection: {
        agents: ["invalid-agent"],
        availabilityMode: "local"
      }
    })
  );

  const originalExit = process.exit;
  let exitCode = null;
  process.exit = (code) => {
    exitCode = code;
  };

  try {
    await resolveSelection(skillManifest, {}, true, undefined, tempFile);
  } catch (err) {
    // resolveSelection might fail or exit
  } finally {
    process.exit = originalExit;
  }

  assert.equal(exitCode, 1);
  fs.unlinkSync(tempFile);
});

test("resolveSelection in non-interactive mode reuses trustworthy recorded state", async () => {
  const tempFile = path.join(os.tmpdir(), `test-recorded-${Date.now()}.json`);
  const validSelection = {
    agents: ["codex", "agy"],
    availabilityMode: "local",
    targets: ["codex-local", "agy-local"]
  };
  fs.writeFileSync(
    tempFile,
    JSON.stringify({
      framework: "ralph-loop",
      selection: validSelection
    })
  );

  const selection = await resolveSelection(skillManifest, {}, true, undefined, tempFile);
  assert.deepEqual(selection.selectedAgents, ["codex", "agy"]);
  assert.equal(selection.availabilityMode, "local");

  fs.unlinkSync(tempFile);
});

test("resolveSelection overrides trustworthy recorded state when process arguments are provided", async () => {
  const tempFile = path.join(os.tmpdir(), `test-recorded-${Date.now()}.json`);
  const validSelection = {
    agents: ["hermes"],
    availabilityMode: "global",
    targets: ["hermes-global"]
  };
  fs.writeFileSync(
    tempFile,
    JSON.stringify({
      framework: "ralph-loop",
      selection: validSelection
    })
  );

  const args = { agents: "agy", availability: "local" };
  const selection = await resolveSelection(skillManifest, args, true, undefined, tempFile);
  assert.deepEqual(selection.selectedAgents, ["agy"]);
  assert.equal(selection.availabilityMode, "local");

  fs.unlinkSync(tempFile);
});

test("installer records metadata with concrete asset timestamps and availability nuances", () => {
  const repoDir = createGitRepo();
  const manifestPath = path.join(repoDir, ".plan", ".framework-install.json");

  // Run 1: fresh install
  const resultInstall = runInstaller({
    args: ["--yes", "--agents", "hermes", "--availability", "local"],
    repoDir
  });
  assert.equal(resultInstall.status, 0, `${resultInstall.stdout}${resultInstall.stderr}`);

  const manifest1 = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.ok(manifest1.firstInstalledAt, "firstInstalledAt should exist");
  assert.ok(manifest1.lastUpdatedAt, "lastUpdatedAt should exist");
  assert.equal(manifest1.firstInstalledAt, manifest1.lastUpdatedAt, "for fresh install, timestamps should be equal");

  // Check shared asset
  const sharedAsset = manifest1.installedAssets.find((a) => a.class === "shared");
  assert.ok(sharedAsset, "shared asset should exist");
  assert.ok(sharedAsset.firstInstalledAt);
  assert.ok(sharedAsset.lastUpdatedAt);
  assert.deepEqual(sharedAsset.availability, {
    behavior: "repo-local-only",
    resolvedMode: "local"
  });

  // Check agent-specific asset
  const agentAsset = manifest1.installedAssets.find((a) => a.class === "agent-specific");
  assert.ok(agentAsset, "agent specific asset should exist");
  assert.ok(agentAsset.firstInstalledAt);
  assert.ok(agentAsset.lastUpdatedAt);
  assert.deepEqual(agentAsset.availability, {
    behavior: "repo-root-for-all-modes",
    resolvedMode: "local"
  });

  // Check skills
  assert.ok(manifest1.installedSkills.length > 0);
  for (const skill of manifest1.installedSkills) {
    assert.ok(skill.firstInstalledAt);
    assert.ok(skill.lastUpdatedAt);
    assert.deepEqual(skill.availability, {
      behavior: "mode-dependent-templates",
      resolvedMode: "local"
    });
  }

  // Sleep slightly to ensure timestamps differ if they change
  const start = Date.now();
  while (Date.now() - start < 100) {}

  // Run 2: update (simulating same agent and availability)
  const resultUpdate = runInstaller({
    args: ["--yes", "--agents", "hermes", "--availability", "local"],
    repoDir
  });
  assert.equal(resultUpdate.status, 0, `${resultUpdate.stdout}${resultUpdate.stderr}`);

  const manifest2 = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.equal(manifest2.firstInstalledAt, manifest1.firstInstalledAt, "firstInstalledAt should be preserved");
  assert.ok(new Date(manifest2.lastUpdatedAt) >= new Date(manifest1.lastUpdatedAt), "lastUpdatedAt should be updated");

  // Verify asset timestamps
  const sharedAsset2 = manifest2.installedAssets.find((a) => a.class === "shared");
  assert.equal(sharedAsset2.firstInstalledAt, sharedAsset.firstInstalledAt, "shared asset firstInstalledAt should be preserved");
  assert.ok(new Date(sharedAsset2.lastUpdatedAt) >= new Date(sharedAsset.lastUpdatedAt), "shared asset lastUpdatedAt should be updated");

  const agentAsset2 = manifest2.installedAssets.find((a) => a.class === "agent-specific");
  assert.equal(agentAsset2.firstInstalledAt, agentAsset.firstInstalledAt, "agent asset firstInstalledAt should be preserved");
  assert.ok(new Date(agentAsset2.lastUpdatedAt) >= new Date(agentAsset.lastUpdatedAt), "agent asset lastUpdatedAt should be updated");

  // Verify skill timestamps
  for (const skill2 of manifest2.installedSkills) {
    const origSkill = manifest1.installedSkills.find(
      (s) => s.publicName === skill2.publicName && s.target === skill2.target
    );
    assert.ok(origSkill, `matching original skill for ${skill2.publicName} not found`);
    assert.equal(skill2.firstInstalledAt, origSkill.firstInstalledAt, "skill firstInstalledAt should be preserved");
    assert.ok(new Date(skill2.lastUpdatedAt) >= new Date(origSkill.lastUpdatedAt), "skill lastUpdatedAt should be updated");
  }
});



