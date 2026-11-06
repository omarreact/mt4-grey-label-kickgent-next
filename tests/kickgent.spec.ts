import { expect, test } from "@playwright/test";

const routes = [
  "/", "/about", "/mt4-grey-label", "/mt5-grey-label", "/turnkey-grey-label",
  "/forex-broker-crm", "/forex-broker-website", "/forex-liquidity-bridge", "/pamm-mam",
  "/how-to-start-forex-brokerage", "/scale-forex-brokerage",
];

for (const route of routes) {
  test(`renders ${route}`, async ({ page }, testInfo) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
    const image = await page.screenshot({ fullPage: true });
    await testInfo.attach(`${route === "/" ? "home" : route.slice(1)}.png`, { body: image, contentType: "image/png" });
  });
}

test("homepage tabs and FAQ work", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab").nth(1);
  await expect(tab).toBeVisible();
  await tab.click();
  await expect(tab).toHaveAttribute("aria-selected", "true");
  const faq = page.locator(".faq-list details").nth(1);
  await faq.locator("summary").click();
  await expect(faq).toHaveAttribute("open", "");
});

test("mobile navigation has a usable menu control", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only touch-target check");
  await page.goto("/");
  const toggle = page.locator("#nav-toggle");
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveCSS("min-height", "44px");
  await toggle.click();
  await expect(page.locator("#mobile-menu")).toHaveClass(/open/);
});
