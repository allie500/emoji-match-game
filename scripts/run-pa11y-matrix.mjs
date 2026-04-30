import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const targetUrl = process.env.PA11Y_URL ?? "http://localhost:5173";

const runs = [
  { scenario: "base", mode: "light", configPath: "pa11y.ci.json" },
  { scenario: "base", mode: "dark", configPath: "pa11y.ci.json" },
  { scenario: "faceup", mode: "light", configPath: "pa11y.faceup.json" },
  { scenario: "faceup", mode: "dark", configPath: "pa11y.faceup.json" },
];

const modeFlag = {
  light: "--force-light-mode",
  dark: "--force-dark-mode",
};

for (const run of runs) {
  const raw = readFileSync(run.configPath, "utf8");
  const config = JSON.parse(raw);
  const args = new Set(config.chromeLaunchConfig?.args ?? []);
  args.add("--no-sandbox");
  args.add(modeFlag[run.mode]);

  const merged = {
    ...config,
    chromeLaunchConfig: {
      ...config.chromeLaunchConfig,
      args: [...args],
    },
  };

  const tempDir = mkdtempSync(join(tmpdir(), "pa11y-matrix-"));
  const tempConfigPath = join(tempDir, `${run.scenario}-${run.mode}.json`);
  writeFileSync(tempConfigPath, JSON.stringify(merged, null, 2));

  try {
    process.stdout.write(`\nRunning Pa11y: ${run.scenario} + ${run.mode}\n`);
    execFileSync("npx", ["pa11y", targetUrl, "--config", tempConfigPath], { stdio: "inherit" });
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}
