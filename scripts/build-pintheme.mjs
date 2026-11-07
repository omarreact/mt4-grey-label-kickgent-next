import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import config from "../pintheme.config.mjs";

const root = resolve(import.meta.dirname, "..");
const themeName = config.site.themeName || config.site.name;
const theme = resolve(root, config.outputs.wordpressThemeDirectory);
const dataDir = resolve(theme, "data");
const cssDir = resolve(theme, "assets/css");
const raw = readFileSync(resolve(root, config.source.pagesFile), "utf8");
const marker = "export const kickgentPages";
const start = raw.indexOf(marker);
const open = raw.indexOf("{", start);
const end = raw.indexOf(";\n\nexport const pageSlugs", open);
if (start < 0 || open < 0 || end < 0) throw new Error("Cannot read canonical GreyLabel page data.");

const source = JSON.parse(raw.slice(open, end));
const extractMain = (markup) => {
  const match = markup.match(/<main\b([^>]*)>([\s\S]*?)<\/main>/i);
  return match ? `<div class="kg-imported-page"${match[1]}>${match[2]}</div>` : markup;
};

const cleanExportFragment = (html) => html
  .replace(/<script\b[\s\S]*?<\/script>/gi, "")
  .replace(/<!--(?:.|\n|\r)*?-->/g, "")
  .trim();

const exportedContentForRoute = (route) => {
  const slug = route === "/" ? "home" : route.replace(/^\/+|\/+$/g, "");
  const file = resolve(
    root,
    config.outputs.htmlDirectory,
    route === "/" ? "index.html" : slug,
    route === "/" ? "" : "index.html"
  );
  if (!existsSync(file)) return null;

  const html = readFileSync(file, "utf8");
  const start = html.indexOf('<div id="main-content">');
  const end = html.indexOf("<footer", start);
  if (start < 0 || end < 0) return null;

  return cleanExportFragment(html.slice(start, end));
};

const pages = config.routes.map((route) => {
  const slug = route === "/" ? "home" : route.replace(/^\/+|\/+$/g, "");
  const page = source[slug];
  if (!page) throw new Error(`Missing canonical page data for route ${route}.`);

  const exported = exportedContentForRoute(route);
  return {
    slug: page.slug,
    title: page.title,
    description: page.description,
    content: exported || extractMain(page.markup),
  };
});

if (pages.length !== config.routes.length) {
  throw new Error(`Route/page mismatch: ${pages.length} canonical pages for ${config.routes.length} configured routes.`);
}

const sourceCommit = process.env.GITHUB_SHA || "local";
const feedFile = `${config.site.slug}-content.json`;
const feed = {
  schemaVersion: "1.0",
  generator: "pintheme",
  site: config.site,
  source: {
    repository: config.source.repository,
    branch: config.source.branch,
    commit: sourceCommit,
  },
  pages,
};
const feedText = `${JSON.stringify(feed, null, 2)}\n`;
const feedSha256 = createHash("sha256").update(feedText).digest("hex");

const manifest = {
  schemaVersion: "1.0",
  generator: "pintheme",
  site: config.site,
  framework: {
    nextjs: true,
    react: true,
    typescript: true,
    tailwind: true,
  },
  urls: config.urls,
  status: config.status,
  wordpress: {
    compatible: true,
    themeName,
    themeSlug: config.site.slug,
    textDomain: config.site.slug,
    requiresWordPress: config.requirements.wordpress,
    requiresPHP: config.requirements.php,
    productionRuntime: "php-wordpress",
    requiresNodeInProduction: false,
  },
  source: {
    repository: config.source.repository,
    branch: config.source.branch,
    commit: sourceCommit,
  },
  build: {
    generatedAt: new Date().toISOString(),
    pageCount: pages.length,
    htmlBasePath: config.deployments.htmlBasePath,
  },
  capabilities: {
    contentImport: true,
    navigationImport: true,
    localEditProtection: true,
    contentRollback: true,
    mediaImport: false,
    privateGitHubAuth: false,
    themeReleaseInstaller: false,
  },
  artifacts: {
    theme: `${config.site.slug}-${config.project.themeVersion}.zip`,
    html: `${config.site.slug}-html-${config.project.themeVersion}.zip`,
    content: feedFile,
    manager: `pintheme-manager-${config.project.managerVersion}.zip`,
  },

  /* Backward-compatible keys consumed by PinTheme Manager 1.0. */
  themeName,
  themeSlug: config.site.slug,
  themeVersion: config.project.themeVersion,
  wordpressCompatible: true,
  htmlExport: true,
  repository: config.source.repository,
  branch: config.source.branch,
  sourceCommit,
  generatedAt: new Date().toISOString(),
  pageCount: pages.length,
  contentFeed: `wordpress/${config.site.slug}/data/${feedFile}`,
  contentFeedSha256: feedSha256,
  releaseAssets: {
    theme: `${config.site.slug}-${config.project.themeVersion}.zip`,
    plugin: `pintheme-manager-${config.project.managerVersion}.zip`,
    html: `${config.site.slug}-html-${config.project.themeVersion}.zip`,
    content: feedFile,
  },
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

const wxr = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:wp="http://wordpress.org/export/1.2/"><channel><title>${esc(config.site.name)}</title><link>${esc(config.urls.nextjs || "")}</link><wp:wxr_version>1.2</wp:wxr_version>\n${items}\n</channel></rss>\n`;

mkdirSync(dataDir, { recursive: true });
mkdirSync(cssDir, { recursive: true });
writeFileSync(resolve(theme, "style.css"), `/*
Theme Name: ${themeName}
Theme URI: https://github.com/${config.source.repository}
Author: ${config.author.name}
Description: Native WordPress theme for ${themeName}.
Version: ${config.project.themeVersion}
Requires at least: ${config.requirements.wordpress}
Requires PHP: ${config.requirements.php}
Text Domain: ${config.site.slug}
*/
`);
writeFileSync(resolve(dataDir, feedFile), feedText);
writeFileSync(resolve(dataDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(resolve(root, "pintheme.manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(resolve(root, "website.xml"), wxr);

const sharedCss = readFileSync(resolve(root, "app/site-pages.css"), "utf8");
const homeStyles = source.home?.styles || "";
writeFileSync(resolve(cssDir, "source-parity.css"), `/* Transitional compatibility CSS generated from the approved Next.js source. */\n${sharedCss}\n${homeStyles}\n`);

console.log(`Generated ${pages.length} GreyLabel pages and WordPress metadata for ${themeName}.`);
