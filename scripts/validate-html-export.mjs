import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import config from "../pintheme.config.mjs";

const root = resolve(import.meta.dirname, "..");
for (const route of config.routes) {
  const file = route === "/"
    ? resolve(root, config.outputs.htmlDirectory, "index.html")
    : resolve(root, config.outputs.htmlDirectory, route.slice(1), "index.html");
  if (!existsSync(file)) throw new Error(`Missing static HTML route: ${route} (${file})`);
  const html = readFileSync(file, "utf8");
  if (!/<html[\s>]/i.test(html) || !/<main[\s>]/i.test(html)) throw new Error(`Invalid HTML export for ${route}.`);
}
console.log(`Static HTML export verified: ${config.routes.length} routes.`);
