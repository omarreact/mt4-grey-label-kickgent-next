import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import config from "../pintheme.config.mjs";

const root = resolve(import.meta.dirname, "..");
const theme = resolve(root, config.outputs.wordpressThemeDirectory);
const dataDir = resolve(theme, "data");
const raw = readFileSync(resolve(root, config.source.pagesFile), "utf8");
const marker = "export const kickgentPages";
const start = raw.indexOf(marker);
const open = raw.indexOf("{", start);
const end = raw.indexOf(";\n\nexport const pageSlugs", open);
if (start < 0 || open < 0 || end < 0) throw new Error("Cannot read canonical Kickgent page data.");

const source = JSON.parse(raw.slice(open, end));
const extractMain = (markup) => {
  const match = markup.match(/<main\b([^>]*)>([\s\S]*?)<\/main>/i);
  return match ? `<div class="kg-imported-page"${match[1]}>${match[2]}</div>` : markup;
};
const pages = Object.values(source).map((page) => ({
  slug: page.slug,
  title: page.title,
  description: page.description,
  content: extractMain(page.markup),
}));

if (pages.length !== config.routes.length) {
  throw new Error(`Route/page mismatch: ${pages.length} canonical pages for ${config.routes.length} configured routes.`);
}

const sourceCommit = process.env.GITHUB_SHA || "local";
const feed = {
  schemaVersion: "1.0",
  generator: "pintheme",
  projectId: config.project.id,
  repository: config.source.repository,
  branch: config.source.branch,
  sourceCommit,
  pages,
};
const feedText = `${JSON.stringify(feed, null, 2)}\n`;
const feedSha256 = createHash("sha256").update(feedText).digest("hex");

const manifest = {
  schemaVersion: "1.0",
  generator: "pintheme",
  themeName: config.project.name,
  themeSlug: config.project.themeSlug,
  themeVersion: config.project.themeVersion,
  wordpressCompatible: true,
  htmlExport: true,
  repository: config.source.repository,
  branch: config.source.branch,
  sourceCommit,
  generatedAt: new Date().toISOString(),
  pageCount: pages.length,
  contentFeed: `wordpress/${config.project.themeSlug}/data/kickgent-pages.json`,
  contentFeedSha256: feedSha256,
  releaseAssets: {
    theme: `${config.project.themeSlug}-theme.zip`,
    plugin: "pintheme-manager-plugin.zip",
    html: `${config.project.themeSlug}-html.zip`,
    content: "kickgent-pages.json"
  }
};

const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");
const items = pages.map((page, index) =>
  `<item><title>${esc(page.title)}</title><dc:creator>admin</dc:creator><wp:post_id>${100 + index}</wp:post_id><wp:post_name>${esc(page.slug)}</wp:post_name><wp:post_type>page</wp:post_type><wp:status>publish</wp:status><content:encoded><![CDATA[<!-- wp:html -->\n${page.content.replaceAll("]]>", "]]]]><![CDATA[>")}\n<!-- /wp:html -->]]></content:encoded></item>`
).join("\n");
const wxr = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:wp="http://wordpress.org/export/1.2/"><channel><title>Kickgent GreyLabel</title><link>https://mt4-grey-label-kickgent-next.vercel.app/</link><wp:wxr_version>1.2</wp:wxr_version>\n${items}\n</channel></rss>\n`;

mkdirSync(dataDir, { recursive: true });
writeFileSync(resolve(dataDir, "kickgent-pages.json"), feedText);
writeFileSync(resolve(dataDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(resolve(root, "pintheme.manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(resolve(root, "website.xml"), wxr);

const sharedCss = readFileSync(resolve(root, "app/site-pages.css"), "utf8");
const homeStyles = source.home?.styles || "";
mkdirSync(resolve(theme, "assets"), { recursive: true });
writeFileSync(resolve(theme, "assets/source-parity.css"), `/* Generated from the canonical Next.js design source. */\n${sharedCss}\n${homeStyles}\n`);

console.log(`PinTheme generated ${pages.length} pages from ${config.source.pagesFile}.`);
