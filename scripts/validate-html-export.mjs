import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import config from "../pintheme.config.mjs";

const root = resolve(import.meta.dirname, "..");
const basePath = process.env.PINTHEME_BASE_PATH || "";

for (const route of config.routes) {
  const file = route === "/"
    ? resolve(root, config.outputs.htmlDirectory, "index.html")
    : resolve(root, config.outputs.htmlDirectory, route.slice(1), "index.html");
  if (!existsSync(file)) throw new Error(`Missing static HTML route: ${route} (${file})`);
  const html = readFileSync(file, "utf8");
  if (!/<html[\s>]/i.test(html) || !/<main[\s>]/i.test(html) || !/<h1[\s>]/i.test(html)) {
    throw new Error(`Invalid semantic HTML export for ${route}.`);
  }
  if (basePath) {
    if (/\b(?:src|href)="\/_next\//.test(html)) throw new Error(`Unprefixed Next asset path in GitHub Pages export: ${route}`);
    for (const internalRoute of config.routes.filter((candidate) => candidate !== "/")) {
      const escaped = internalRoute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`href="${escaped}(?:/|")`).test(html)) {
        throw new Error(`Unprefixed internal route in GitHub Pages export: ${route} → ${internalRoute}`);
      }
    }
  }
}
console.log(`Static HTML export verified: ${config.routes.length} routes${basePath ? ` with basePath ${basePath}` : ""}.`);
