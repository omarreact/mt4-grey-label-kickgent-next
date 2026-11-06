import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import config from "../pintheme.config.mjs";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, config.outputs.releaseDirectory);
const theme = resolve(root, config.outputs.wordpressThemeDirectory);
const plugin = resolve(root, config.outputs.wordpressPluginDirectory);
if (!existsSync(theme) || !existsSync(plugin)) throw new Error("PinTheme WordPress packages are missing.");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(theme, resolve(dist, config.project.themeSlug), { recursive: true });
cpSync(plugin, resolve(dist, "pintheme-manager"), { recursive: true });
writeFileSync(resolve(dist, "BUILD.txt"), "Install kickgent-pintheme as the theme and pintheme-manager as the companion plugin. WordPress production does not require Next.js or Node.js.\n");
console.log("Generated native WordPress PinTheme distribution.");
