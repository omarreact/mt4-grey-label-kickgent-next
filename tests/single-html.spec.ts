import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const html = pathToFileURL(resolve(process.cwd(), "template/website.html")).href;
const routes = [
  "/", "/mt4-grey-label", "/mt5-grey-label", "/turnkey-grey-label",
  "/forex-broker-crm", "/forex-broker-website", "/forex-liquidity-bridge",
  "/pamm-mam", "/how-to-start-forex-brokerage", "/scale-forex-brokerage",
  "/about", "/contact",
];

test("standalone website.html provides all twelve pages", async ({ page }) => {
  await page.goto(html, { waitUntil: "domcontentloaded" });
  for (const route of routes) {
    await page.evaluate((path) => { location.hash = path; }, route);
    await expect(page.locator("#main-content h1:visible").first()).toBeVisible();
    await expect(page.locator("#main-content")).toContainText(route === "/" ? "brokerage" : "", { ignoreCase: true });
  }
  await expect(page.locator("#single-html-page-templates template")).toHaveCount(routes.length);
});

test("standalone homepage supports slider and working navigation", async ({ page }) => {
  await page.goto(html + "#/", { waitUntil: "domcontentloaded" });
  const slides = page.locator("[data-hero-indicators] button");
  await expect(slides).toHaveCount(3);
  await slides.nth(1).click();
  await expect(slides.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.locator('a[href="#/about"]').first().click();
  await expect(page).toHaveURL(/#\/about$/);
  await expect(page.locator("#main-content h1:visible").first()).toBeVisible();
});

test("standalone mobile navigation and dropdown work", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile interaction smoke test");
  await page.goto(html + "#/", { waitUntil: "domcontentloaded" });
  const toggle = page.locator(".kg-global-menu");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const nav = page.locator("#kg-primary-navigation");
  await expect(nav).toBeVisible();
  const solutions = nav.getByRole("button", { name: "Solutions" });
  await solutions.click();
  await expect(solutions).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#kg-solutions-menu")).toBeVisible();
  await page.locator("#kg-solutions-menu").getByRole("link", { name: "MT5 Grey Label" }).click();
  await expect(page).toHaveURL(/#\/mt5-grey-label$/);
  await expect(page.locator("#main-content h1:visible").first()).toBeVisible();
});
