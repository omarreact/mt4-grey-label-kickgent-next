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
cpSync(theme, resolve(dist, config.site.slug), { recursive: true });
cpSync(plugin, resolve(dist, "pintheme-manager"), { recursive: true });

writeFileSync(
  resolve(dist, "BUILD.txt"),
  `Install ${config.site.slug}-${config.project.themeVersion}.zip through WordPress Appearance → Themes, then install pintheme-manager-${config.project.managerVersion}.zip as a plugin. Production WordPress does not require Next.js, Node.js, npm, Vercel, or a Tailwind compiler.\n`
);
console.log(`Generated native WordPress distribution for ${config.site.name}.`);
