import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import config from "../pintheme.config.mjs";

const root = resolve(import.meta.dirname, "..");
const required = [
  "app/layout.tsx", "app/page.tsx", "app/[slug]/page.tsx", "content/site.ts", "content/kickgent-pages.ts",
  "pintheme.config.mjs", "pintheme/design-tokens.json", "pintheme/compatibility-registry.json",
  "wordpress/kickgent-pintheme/style.css", "wordpress/kickgent-pintheme/functions.php", "wordpress/kickgent-pintheme/header.php",
  "wordpress/kickgent-pintheme/footer.php", "wordpress/pintheme-manager/pintheme-manager.php"
];
const missing = required.filter((file) => !existsSync(resolve(root, file)));
if (missing.length) throw new Error(`Missing PinTheme source files: ${missing.join(", ")}`);
const content = readFileSync(resolve(root, "content/site.ts"), "utf8");
for (const route of config.routes.filter((route) => route !== "/")) {
  const slug = route.slice(1);
  if (!content.includes(`slug: "${slug}"`)) throw new Error(`Missing page definition: ${slug}`);
}
const nextConfig = readFileSync(resolve(root, "next.config.ts"), "utf8");
if (!nextConfig.includes('output: "export"')) throw new Error("Next.js static export is not enabled.");
console.log(`PinTheme source validation passed: ${config.routes.length} routes, classic WordPress theme, manager plugin.`);
