import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import config from "../pintheme.config.mjs";

const root = resolve(import.meta.dirname, "..");
const required = [
  "app/layout.tsx", "app/page.tsx", "app/[slug]/page.tsx", "app/globals.css",
  "components/SharedSiteChrome.tsx", "content/site.ts", "content/kickgent-pages.ts",
  "pintheme.config.mjs", "pintheme.config.ts", "pintheme/design-tokens.json", "pintheme/compatibility-registry.json",
  "postcss.config.mjs", "styles/pintheme-tailwind.css",
  `wordpress/${config.site.slug}/style.css`, `wordpress/${config.site.slug}/functions.php`,
  `wordpress/${config.site.slug}/header.php`, `wordpress/${config.site.slug}/footer.php`,
  "wordpress/pintheme-manager/pintheme-manager.php"
];
const missing = required.filter((file) => !existsSync(resolve(root, file)));
if (missing.length) throw new Error(`Missing PinTheme source files: ${missing.join(", ")}`);

const content = readFileSync(resolve(root, "content/site.ts"), "utf8");
for (const route of config.routes.filter((route) => route !== "/")) {
  const slug = route.slice(1);
  if (!content.includes(`slug: "${slug}"`)) throw new Error(`Missing page definition: ${slug}`);
}

const nextConfig = readFileSync(resolve(root, "next.config.ts"), "utf8");
if (!nextConfig.includes('output: "export"') || !nextConfig.includes("PINTHEME_BASE_PATH")) throw new Error("Next.js static export/base-path support is incomplete.");

const globals = readFileSync(resolve(root, "app/globals.css"), "utf8");
if (!globals.includes('@import "tailwindcss"')) throw new Error("Next.js Tailwind entrypoint is missing.");

const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
if (!packageJson.devDependencies?.tailwindcss || !packageJson.devDependencies?.["@tailwindcss/cli"]) throw new Error("Tailwind build dependencies are missing.");

const chrome = readFileSync(resolve(root, "components/SharedSiteChrome.tsx"), "utf8");
if (chrome.includes("<style>")) throw new Error("Shared header/footer must use the Tailwind design system, not component-local style tags.");

console.log(`PinTheme source validation passed: ${config.routes.length} routes, Tailwind enabled, GreyLabel native WordPress theme configured.`);
