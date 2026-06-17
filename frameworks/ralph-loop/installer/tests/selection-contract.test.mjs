import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  assertTargetCoverage,
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
        "Legacy installer flags are no longer supported: --all. Use --agents <hermes,codex,agy> and --availability <local|global> instead."
    },
    {
      name: "invalid agent is rejected",
      args: ["--yes", "--agents", "hermes,ghost", "--availability", "local"],
      expectedText: "Unsupported agent: ghost. Valid agent values: hermes, codex, agy"
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
        "Non-interactive runs must pass --agents. Valid agents: hermes, codex, agy"
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
