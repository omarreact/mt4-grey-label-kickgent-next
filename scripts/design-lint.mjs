import { existsSync, readFileSync } from "node:fs";

const required = [
  "DESIGN.md",
  "CLAUDE.md",
  "components/KickgentExperience.tsx",
  "components/SharedSiteChrome.tsx",
  "components/SharedClosingSections.tsx",
  "components/HomePageTailwind.tsx",
  "components/BrandLogo.tsx",
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
const closing = readFileSync("components/SharedClosingSections.tsx", "utf8");
const home = readFileSync("components/HomePageTailwind.tsx", "utf8");
const logo = readFileSync("components/BrandLogo.tsx", "utf8");
const homeEntry = readFileSync("app/page.tsx", "utf8");
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
if (!chrome.includes("backdrop-blur-2xl") || !chrome.includes("onMouseEnter")) failures.push("Header must retain glassmorphism and desktop hover navigation.");
if (!chrome.includes("max-[880px]")) failures.push("Shared responsive navigation must retain the approved breakpoint behavior.");
if (home.includes("<style>") || home.includes("style={{")) failures.push("Homepage upgrades must use Tailwind utilities rather than embedded or inline CSS.");
if (!home.includes("backdrop-blur-2xl")) failures.push("Homepage glass overlay treatment is required.");
if (!home.includes("GreyLabel solution carousel") || !home.includes("data-hero-float")) failures.push("Homepage carousel and banner overflow guardrails are required.");
if (!closing.includes("data-global-how-it-works") || !closing.includes("data-global-cta")) failures.push("Shared How It Works and CTA sections are required.");
if (!chrome.includes("MT4 Grey Label") || chrome.includes("Built by PINCODE IT")) failures.push("Footer must use MT4 Grey Label branding without agency credit.");
if (/(?:md|lg|xl|2xl):h-\[[^\]]+\]/.test(home)) failures.push("Responsive homepage layout must not use fixed Tailwind height values.");
if (!logo.includes("<svg") || !logo.includes("GreyLabel Technology")) failures.push("Professional SVG brand mark is required.");
if (!homeEntry.includes("HomePageTailwind")) failures.push("Homepage must render the Tailwind-native implementation.");
if (/cdn\.tailwindcss\.com/i.test(globals + tailwind + chrome + home)) failures.push("Tailwind CDN is forbidden in production outputs.");

if (failures.length) {
  console.error("Design gate failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Design gate passed: Tailwind homepage, glass navigation, SVG branding, accessibility and production guardrails are present.");
