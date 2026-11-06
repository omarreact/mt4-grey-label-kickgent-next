import { existsSync, readFileSync } from "node:fs";

const required = [
  "DESIGN.md",
  "CLAUDE.md",
  "components/KickgentExperience.tsx",
  "components/SharedSiteChrome.tsx",
  "content/kickgent-pages.ts",
  "app/globals.css",
  "styles/pintheme-tailwind.css",
  "pintheme.config.mjs",
];
const failures = [];
for (const file of required) if (!existsSync(file)) failures.push(`Missing required design artifact: ${file}`);

const pageData = readFileSync("content/kickgent-pages.ts", "utf8");
const runtime = readFileSync("components/KickgentExperience.tsx", "utf8");
const chrome = readFileSync("components/SharedSiteChrome.tsx", "utf8");
const globals = readFileSync("app/globals.css", "utf8");
const tailwind = readFileSync("styles/pintheme-tailwind.css", "utf8");
const packageJson = readFileSync("package.json", "utf8");

if (/user-scalable\s*=\s*no|max(?:imum)?-scale\s*=\s*1/i.test(pageData)) failures.push("Browser zoom must not be disabled.");
if (existsSync("public/source")) failures.push("Public HTML source fallback must not be restored.");
if (!runtime.includes("prefers-reduced-motion")) failures.push("Reduced-motion guardrail is required.");
if (!runtime.includes("pointer: coarse")) failures.push("Coarse-pointer touch target guardrail is required.");
if (!globals.includes('@import "tailwindcss"')) failures.push("Next.js must load the Tailwind design system.");
if (!tailwind.includes('@import "tailwindcss"') || !tailwind.includes("@source")) failures.push("WordPress Tailwind compiler entry must scan generated sources.");
if (!packageJson.includes('"tailwindcss"') || !packageJson.includes('"@tailwindcss/cli"')) failures.push("Tailwind build dependencies are required.");
if (chrome.includes("<style>")) failures.push("Global header/footer may not maintain a separate component-local CSS system.");
if (!chrome.includes("max-[880px]")) failures.push("Shared responsive navigation must retain the approved breakpoint behavior.");
if (/cdn\.tailwindcss\.com/i.test(globals + tailwind + chrome)) failures.push("Tailwind CDN is forbidden in production outputs.");

if (failures.length) {
  console.error("Design gate failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Design gate passed: Tailwind source, shared chrome, accessibility and production guardrails are present.");
