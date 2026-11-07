import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import config from "../pintheme.config.mjs";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, config.outputs.htmlDirectory);
const target = resolve(root, "template/website.html");
const routes = config.routes;
const base = (config.deployments?.htmlBasePath || "").replace(/\/$/, "");

function files(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(resolve(dir, e.name)) : [resolve(dir, e.name)]
  );
}

function routeFile(route) {
  const path = route === "/" ? resolve(output, "index.html") : resolve(output, route.slice(1), "index.html");
  if (!existsSync(path)) throw new Error("Missing Next export: " + relative(root, path));
  return readFileSync(path, "utf8");
}

function mainRange(html) {
  const start = /<div\b[^>]*\bid="main-content"[^>]*>/i.exec(html);
  if (!start) throw new Error("Missing Next.js #main-content");
  const token = /<\/?div\b[^>]*>/gi;
  token.lastIndex = start.index + start[0].length;
  let count = 1, match;
  while ((match = token.exec(html))) {
    count += /^<\/div/i.test(match[0]) ? -1 : 1;
    if (count === 0) {
      return { before: start.index, begin: start.index + start[0].length, finish: match.index, after: token.lastIndex };
    }
  }
  throw new Error("Unbalanced Next.js #main-content markup");
}

function removeReactRuntime(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<link\b[^>]*\brel="(?:preload|modulepreload|stylesheet)"[^>]*>/gi, "");
}

function localData(url) {
  if (!url.startsWith("/") || url.startsWith("//")) return "";
  let path = url.split(/[?#]/)[0];
  if (base && (path === base || path.startsWith(base + "/"))) path = path.slice(base.length) || "/";
  if (path.includes("..")) return "";
  const filename = resolve(output, "." + path);
  if (!existsSync(filename) || !statSync(filename).isFile()) return "";
  const type = { svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
    webp: "image/webp", gif: "image/gif", ico: "image/x-icon", json: "application/json" }[filename.split(".").pop()];
  return type ? "data:" + type + ";base64," + readFileSync(filename).toString("base64") : "";
}

function rewriteHref(href, route) {
  if (/^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(href)) return href;
  if (href.startsWith("#/")) return href;
  if (href.startsWith("#")) return "#" + route + "?section=" + encodeURIComponent(href.slice(1));
  let path = href;
  if (base && (path === base || path.startsWith(base + "/"))) path = path.slice(base.length) || "/";
  if (!path.startsWith("/")) return href;
  const [left, section] = path.split("#");
  const pathname = left.replace(/\/+$/, "") || "/";
  return routes.includes(pathname) ? "#" + pathname + (section ? "?section=" + encodeURIComponent(section) : "") : href;
}

function rewrite(html, route) {
  return html.replace(/\b(href|src|poster)=(["'])(.*?)\2/gi, (all, attr, quote, url) => {
    const result = localData(url) || (attr.toLowerCase() === "href" ? rewriteHref(url, route) : url);
    return attr + "=" + quote + result + quote;
  });
}

const cssFiles = files(resolve(output, "_next")).filter((path) => path.endsWith(".css")).sort();
if (!cssFiles.length) throw new Error("Next CSS bundle not found.");
const css = cssFiles.map((file) => readFileSync(file, "utf8")).join("\n").replaceAll("</style", "<\\/style");
const pageFile = readFileSync(resolve(root, config.source.pagesFile), "utf8");
const pagePrefix = "export const kickgentPages: Record<string, KickgentPage> = ";
const from = pageFile.indexOf(pagePrefix) + pagePrefix.length;
if (from < pagePrefix.length) throw new Error("Page data source format changed.");
const to = pageFile.indexOf(";\n", from);
if (to < 0) throw new Error("Cannot find end of page data.");
const pages = JSON.parse(pageFile.slice(from, to));

const content = {};
const meta = {};
const scripts = {};
const homeDoc = routeFile("/");
const homeRange = mainRange(homeDoc);
for (const route of routes) {
  const document = routeFile(route);
  const span = mainRange(document);
  const html = rewrite(removeReactRuntime(document.slice(span.begin, span.finish)), route);
  if (!/<h1\b/i.test(html)) throw new Error("H1 not found for route " + route);
  content[route] = html;
  meta[route] = {
    title: document.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || config.site.name,
    description: document.match(/<meta\b[^>]*\bname="description"[^>]*>/i)?.[0]?.match(/\bcontent="([^"]*)"/)?.[1] || ""
  };
  scripts[route] = route === "/" ? [] : pages[route.slice(1)]?.scripts || [];
}
const backgroundsSource = readFileSync(resolve(root, "components/KickgentExperience.tsx"), "utf8");
const backgroundsBody = backgroundsSource.match(/const innerPageBackgrounds:[^{]*\{([\s\S]*?)\n\};/)?.[1] || "";
const backgrounds = {};
for (const match of backgroundsBody.matchAll(/(?:"([^"]+)"|([a-z-]+)):\s*"([^"]+)"/g)) {
  backgrounds[match[1] || match[2]] = match[3];
}

const json = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
const bodyStart = homeDoc.indexOf("<body");
const bodyOpenEnd = homeDoc.indexOf(">", bodyStart) + 1;
const bodyEnd = homeDoc.lastIndexOf("</body>");
if (bodyStart < 0 || bodyOpenEnd < 1 || bodyEnd < 0) throw new Error("Invalid Next HTML body.");
const bodyOpen = homeDoc.slice(bodyStart, bodyOpenEnd);
const bodyPrefix = rewrite(removeReactRuntime(homeDoc.slice(bodyOpenEnd, homeRange.before)), "/");
const bodySuffix = rewrite(removeReactRuntime(homeDoc.slice(homeRange.after, bodyEnd)), "/");
const templates = routes.map((route) => '<template data-site-route="' + route + '">' + content[route] + "</template>").join("\n");
const runtime = readFileSync(resolve(root, "scripts/single-html-runtime.js"), "utf8");
const icon = localData(base + "/brand/mt4-grey-label-icon.svg");

const html = [
  "<!doctype html>",
  '<html lang="en">',
  "<head>",
  '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
  '<meta name="generator" content="PinTheme single HTML export">',
  '<meta name="description" content="' + meta["/"].description.replace(/"/g, "&quot;") + '">',
  "<title>" + meta["/"].title + "</title>",
  icon ? '<link rel="icon" href="' + icon + '">' : "",
  '<style>' + css + "\n[hidden]{display:none!important}</style>",
  "</head>",
  "<!-- AUTO-GENERATED FROM NEXT.JS. DO NOT EDIT THIS FILE DIRECTLY. -->",
  bodyOpen,
  bodyPrefix,
  '<div id="main-content">' + content["/"] + "</div>",
  bodySuffix,
  '<div hidden id="single-html-page-templates">' + templates + "</div>",
  '<script type="application/json" id="single-html-config">' +
    json({ routes, meta, scripts, backgrounds }) + "</script>",
  "<script>" + runtime.replaceAll("</script", "<\\/script") + "</script>",
  "</body></html>"
].join("\n");

if (routes.some((route) => !html.includes('data-site-route="' + route + '"'))) throw new Error("Incomplete page templates.");
if (!html.includes("kg-primary-navigation") || !html.includes("data-hero-banner")) throw new Error("Missing site chrome or homepage banner.");

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, html, "utf8");
console.log("Generated " + relative(root, target) + ": " + routes.length + " pages, " + Buffer.byteLength(html) + " bytes");
