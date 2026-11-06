import { spawnSync } from "node:child_process";
import config from "../pintheme.config.mjs";

const basePath = config.deployments?.htmlBasePath || "";
const command = process.platform === "win32" ? "npx.cmd" : "npx";
const env = { ...process.env, PINTHEME_BASE_PATH: basePath };

const build = spawnSync(command, ["next", "build"], { stdio: "inherit", env });
if (build.status !== 0) process.exit(build.status ?? 1);

const validate = spawnSync(process.execPath, ["scripts/validate-html-export.mjs"], {
  stdio: "inherit",
  env,
});
process.exit(validate.status ?? 0);
