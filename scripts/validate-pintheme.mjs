import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import config from "../pintheme.config.mjs";

const root = resolve(import.meta.dirname, "..");
const theme = resolve(root, config.outputs.wordpressThemeDirectory);
const plugin = resolve(root, config.outputs.wordpressPluginDirectory);
const requiredThemeFiles = [
  "style.css", "functions.php", "theme.json", "header.php", "footer.php", "front-page.php",
  "page.php", "single.php", "archive.php", "404.php", "index.php", "assets/theme.css", "assets/theme.js",
  "assets/source-parity.css", "inc/settings.php", "data/kickgent-pages.json", "data/manifest.json"
];
for (const file of requiredThemeFiles) if (!existsSync(resolve(theme, file))) throw new Error(`Missing PinTheme theme file: ${file}`);
if (!existsSync(resolve(plugin, "pintheme-manager.php"))) throw new Error("Missing PinTheme Manager plugin.");

const manifest = JSON.parse(readFileSync(resolve(root, "pintheme.manifest.json"), "utf8"));
const feedText = readFileSync(resolve(theme, "data/kickgent-pages.json"), "utf8");
const feed = JSON.parse(feedText);
const checksum = createHash("sha256").update(feedText).digest("hex");
if (manifest.schemaVersion !== "1.0" || manifest.generator !== "pintheme") throw new Error("Invalid PinTheme manifest.");
if (feed.pages.length !== config.routes.length || manifest.pageCount !== config.routes.length) throw new Error("PinTheme page count mismatch.");
if (manifest.contentFeedSha256 !== checksum) throw new Error("PinTheme content checksum mismatch.");
const functionsPhp = readFileSync(resolve(theme, "functions.php"), "utf8");
if (!functionsPhp.includes("register_nav_menus") || !functionsPhp.includes("custom-logo")) throw new Error("WordPress native menu/logo support is missing.");
console.log(`PinTheme WordPress package verified: ${feed.pages.length} pages, checksum ${checksum.slice(0, 12)}…`);
