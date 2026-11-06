import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const required = ["app/layout.tsx", "app/page.tsx", "app/[slug]/page.tsx", "content/site.ts", "wordpress/kickgent-fse/theme.json", "wordpress/kickgent-fse/functions.php", "wordpress/kickgent-fse/style.css", "wordpress/kickgent-fse/templates/front-page.html"];
const missing = required.filter((file) => !existsSync(resolve(root, file)));
if (missing.length) throw new Error(`Missing generator files: ${missing.join(", ")}`);
const content = readFileSync(resolve(root, "content/site.ts"), "utf8");
for (const slug of ["mt4-grey-label", "mt5-grey-label", "turnkey-grey-label", "forex-broker-crm", "forex-broker-website", "forex-liquidity-bridge", "pamm-mam", "how-to-start-forex-brokerage", "scale-forex-brokerage", "about"]) if (!content.includes(`slug: \"${slug}\"`)) throw new Error(`Missing page: ${slug}`);
console.log("Kickgent content, Next routes and WordPress FSE files are present.");
