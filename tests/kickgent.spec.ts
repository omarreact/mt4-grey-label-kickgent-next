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
  await expect(navigation).toBeVisible();
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
    await expect(page.getByRole("contentinfo")).toBeVisible();

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

    const heroFloats = page.locator("[data-hero-float]");
    const floatCount = await heroFloats.count();
    for (let index = 0; index < floatCount; index += 1) {
      const overflow = await heroFloats.nth(index).evaluate((element) => element.scrollWidth - element.clientWidth);
      expect(overflow, `hero floating card overflow at ${width}px`).toBeLessThanOrEqual(1);
    }

    const image = await page.screenshot({ fullPage: true });
    await testInfo.attach(`responsive-${width}.png`, { body: image, contentType: "image/png" });
  });
}


test("desktop navigation dropdown opens on hover", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Desktop hover behavior runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const navigation = page.locator("#kg-primary-navigation");
  const solutions = navigation.getByRole("button", { name: "Solutions", exact: true });
  await solutions.hover();
  await expect(solutions).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#kg-solutions-menu")).toBeVisible();
});

test("homepage branding, portraits, carousel and glass overlays render", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Homepage enhancement checks run once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  await expect(page.locator('svg[aria-label="GreyLabel Technology"]')).toHaveCount(2);

  const portraits = page.locator('img[alt*="Portrait of a"]');
  await expect(portraits).toHaveCount(4);
  for (let index = 0; index < 4; index += 1) {
    await expect(portraits.nth(index)).toHaveAttribute("src", /images\.unsplash\.com/);
  }

  const slider = page.getByRole("region", { name: "GreyLabel solution carousel" });
  await expect(slider).toBeVisible();
  const before = await slider.evaluate((element) => element.scrollLeft);
  await page.getByRole("button", { name: "Next solutions" }).click();
  await expect.poll(() => slider.evaluate((element) => element.scrollLeft)).toBeGreaterThan(before);

  const platformOverlay = page.locator("#solutions article").first().locator("div").last();
  await expect(platformOverlay).toHaveCSS("backdrop-filter", /blur/);
});

test("legacy inner-page image overlays receive the global glass treatment", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Global overlay check runs once in Chromium");
  await page.goto("/scale-forex-brokerage");
  const overlay = page.locator(".art-bubble").first();
  await expect(overlay).toBeVisible();
  await expect(overlay).toHaveCSS("backdrop-filter", /blur/);
});


test("fixed floating header and image-backed hero are preserved", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Visual shell check runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const header = page.locator("[data-site-header]");
  await expect(header).toHaveCSS("position", "fixed");

  const hero = page.locator("[data-hero-banner]");
  await expect(hero).toBeVisible();
  const image = hero.locator("img").first();
  await expect(image).toHaveAttribute("src", /images\.unsplash\.com\/photo-1556761175-4b46a572b786/);

  const floats = hero.locator("[data-hero-float]");
  await expect(floats).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    await expect(floats.nth(index)).toHaveCSS("backdrop-filter", /blur/);
  }
});
