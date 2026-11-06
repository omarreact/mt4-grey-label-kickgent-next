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

test("mobile global navigation and submenu are usable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only touch-target check");
  await page.goto("/");
  const toggle = page.locator(".kg-global-menu");
  const navigation = page.locator("#kg-primary-navigation");
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveCSS("min-height", "44px");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(navigation).toHaveClass(/is-open/);
  const solutions = navigation.getByRole("button", { name: "Solutions" });
  await solutions.click();
  await expect(solutions).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#kg-solutions-menu")).toBeVisible();
});


const responsiveWidths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];

for (const width of responsiveWidths) {
  test(`responsive home layout at ${width}px`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Viewport matrix runs once in desktop Chromium project");
    await page.setViewportSize({ width, height: Math.max(800, Math.round(width * 0.75)) });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `unexpected horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);

    const toggle = page.locator(".kg-global-menu");
    const navigation = page.locator("#kg-primary-navigation");
    if (width <= 880) {
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveCSS("min-height", "44px");
      await toggle.click();
      await expect(navigation).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    } else {
      await expect(toggle).toBeHidden();
      await expect(navigation).toBeVisible();
    }

    const image = await page.screenshot({ fullPage: true });
    await testInfo.attach(`responsive-${width}.png`, { body: image, contentType: "image/png" });
  });
}
