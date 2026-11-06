import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import config from "../pintheme.config.mjs";

const root = resolve(import.meta.dirname, "..");
const theme = resolve(root, config.outputs.wordpressThemeDirectory);
const plugin = resolve(root, config.outputs.wordpressPluginDirectory);
const feedFile = `${config.site.slug}-content.json`;
const requiredThemeFiles = [
  "style.css", "functions.php", "theme.json", "header.php", "footer.php", "front-page.php",
  "page.php", "single.php", "archive.php", "404.php", "index.php",
  "assets/css/theme.css", "assets/css/source-parity.css", "assets/js/theme.js",
  "inc/settings.php", `data/${feedFile}`, "data/manifest.json"
];

for (const file of requiredThemeFiles) {
  if (!existsSync(resolve(theme, file))) throw new Error(`Missing PinTheme theme file: ${file}`);
}
if (!existsSync(resolve(plugin, "pintheme-manager.php"))) throw new Error("Missing PinTheme Manager plugin.");

const manifest = JSON.parse(readFileSync(resolve(root, "pintheme.manifest.json"), "utf8"));
const feedText = readFileSync(resolve(theme, "data", feedFile), "utf8");
const feed = JSON.parse(feedText);
const checksum = createHash("sha256").update(feedText).digest("hex");

if (manifest.schemaVersion !== "1.0" || manifest.generator !== "pintheme") throw new Error("Invalid PinTheme manifest.");
if (manifest.site?.name !== config.site.name || manifest.site?.slug !== config.site.slug) throw new Error("PinTheme site identity mismatch.");
if (!manifest.framework?.tailwind) throw new Error("Manifest must declare Tailwind support.");
if (!manifest.wordpress?.compatible || manifest.wordpress?.themeSlug !== config.site.slug) throw new Error("WordPress compatibility metadata is invalid.");
if (feed.pages.length !== config.routes.length || manifest.pageCount !== config.routes.length) throw new Error("PinTheme page count mismatch.");
if (manifest.contentFeedSha256 !== checksum) throw new Error("PinTheme content checksum mismatch.");

const style = readFileSync(resolve(theme, "style.css"), "utf8");
if (!style.includes(`Theme Name: ${config.site.name}`) || !style.includes(`Text Domain: ${config.site.slug}`)) {
  throw new Error("WordPress theme metadata does not match project identity.");
}
const functionsPhp = readFileSync(resolve(theme, "functions.php"), "utf8");
if (!functionsPhp.includes("register_nav_menus") || !functionsPhp.includes("custom-logo")) throw new Error("WordPress native menu/logo support is missing.");

const tailwindCss = readFileSync(resolve(theme, "assets/css/theme.css"), "utf8");
if (!tailwindCss.trim()) throw new Error("Compiled Tailwind CSS is empty.");

console.log(`PinTheme package verified: ${feed.pages.length} pages, ${config.site.name}, checksum ${checksum.slice(0, 12)}…`);
