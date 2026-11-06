import { existsSync, readFileSync } from "node:fs";

const required = ["DESIGN.md", "CLAUDE.md", "components/KickgentExperience.tsx", "content/kickgent-pages.ts"];
const failures = [];
for (const file of required) if (!existsSync(file)) failures.push(`Missing required design artifact: ${file}`);

const pageData = readFileSync("content/kickgent-pages.ts", "utf8");
const runtime = readFileSync("components/KickgentExperience.tsx", "utf8");
if (/user-scalable\\s*=\\s*no|max(?:imum)?-scale\\s*=\\s*1/i.test(pageData)) failures.push("Browser zoom must not be disabled.");
if (existsSync("public/source")) failures.push("Public HTML source fallback must not be restored.");
if (!runtime.includes("prefers-reduced-motion")) failures.push("Reduced-motion guardrail is required.");
if (!runtime.includes("pointer: coarse")) failures.push("Coarse-pointer touch target guardrail is required.");

if (failures.length) {
  console.error("Design gate failed:\\n" + failures.map((item) => `- ${item}`).join("\\n"));
  process.exit(1);
}
console.log("Design gate passed: system docs, Next-only routes and accessibility guardrails are present.");
