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


test("desktop navigation submenu stays open and can be clicked", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Desktop hover behavior runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const navigation = page.locator("#kg-primary-navigation");
  const solutions = navigation.getByRole("button", { name: "Solutions", exact: true });
  await solutions.hover();
  await expect(solutions).toHaveAttribute("aria-expanded", "true");

  const menu = page.locator("#kg-solutions-menu");
  await expect(menu).toBeVisible();

  const mt4 = menu.getByRole("link", { name: "MT4 Grey Label", exact: true });
  await mt4.hover();
  await expect(menu).toBeVisible();
  await mt4.click();
  await expect(page).toHaveURL(/\/mt4-grey-label\/?$/);
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

test("inner-page supporting surfaces receive the global glass treatment", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Global overlay check runs once in Chromium");
  await page.goto("/scale-forex-brokerage");

  const sidebar = page.locator(".sidebar-help");
  await expect(sidebar).toBeVisible();
  await expect(sidebar).toHaveCSS("backdrop-filter", /blur/);

  const related = page.locator(".related-card").first();
  await expect(related).toBeVisible();
  await expect(related).toHaveCSS("backdrop-filter", /blur/);
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


test("banner slider changes the entire scene, not only the background", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Banner slider check runs once in Chromium");
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");

  const hero = page.locator("[data-hero-banner]");
  const controls = page.getByRole("tablist", { name: "Banner slides" }).getByRole("tab");
  await expect(controls).toHaveCount(3);
  await expect(hero).toHaveAttribute("data-active-slide", "launch");
  await expect(hero.locator("h1")).toContainText("Launch a brokerage.");
  await expect(hero.locator("[data-hero-right]")).toContainText("Ready to launch.");

  const heroImages = hero.locator("img");
  await expect(heroImages).toHaveCount(3);

  await controls.nth(1).click();
  await expect(hero).toHaveAttribute("data-active-slide", "operations");
  await expect(controls.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(heroImages.nth(1)).toHaveCSS("opacity", "1");
  await expect(hero.locator("h1")).toContainText("Run every client journey.");
  await expect(hero.locator("[data-hero-left]")).toContainText("Explore broker CRM");
  await expect(hero.locator("[data-hero-right]")).toContainText("Operations synchronized.");
  await expect(hero.locator("[data-hero-right]")).toContainText("82%");
  await expect(hero.locator("[data-hero-right]")).toContainText("KYC & payments");

  await controls.nth(2).click();
  await expect(hero).toHaveAttribute("data-active-slide", "scale");
  await expect(hero.locator("h1")).toContainText("Add products and capacity.");
  await expect(hero.locator("[data-hero-left]")).toContainText("Scale your brokerage");
  await expect(hero.locator("[data-hero-right]")).toContainText("Ready to scale.");
  await expect(hero.locator("[data-hero-right]")).toContainText("91%");
  await expect(hero.locator("[data-hero-right]")).toContainText("Managed accounts");

  await expect(hero.locator("h1")).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("requested homepage section backgrounds and glass overlays are applied", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Homepage section styling check runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const platform = page.locator("#solutions");
  await expect(platform).toHaveCSS("background-color", "rgb(247, 243, 251)");

  const journey = page.locator("[data-active-journey]");
  await expect(journey.locator("img").first()).toHaveAttribute("src", /images\.unsplash\.com/);
  await expect(journey.locator("article").first()).toHaveCSS("backdrop-filter", /blur/);

  const how = page.locator("[data-how-it-works]");
  await expect(how.locator("img").first()).toHaveAttribute("src", /images\.unsplash\.com/);
  await expect(how.locator("article").first()).toHaveCSS("backdrop-filter", /blur/);
});

test("inner pages keep layout and receive image-backed glass visual system", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Inner-page visual treatment runs once in Chromium");
  await page.goto("/mt4-grey-label");

  const hero = page.locator(".page-hero");
  await expect(hero).toBeVisible();
  await expect(hero.locator(".hero-grid")).toBeVisible();
  await expect(hero.locator('[data-pintheme-inner-hero="mt4-grey-label"]')).toBeVisible();
  await expect(hero.locator(".hero-art")).toBeHidden();

  const related = page.locator(".related-card").first();
  await expect(related).toHaveCSS("backdrop-filter", /blur/);
});


test("header CTA uses the revised light palette", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Header palette check runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const cta = page.locator("[data-get-started]");
  await expect(cta).toHaveCSS("background-color", "rgb(240, 231, 251)");
  await expect(cta).toHaveCSS("color", "rgb(74, 31, 95)");
});

test("inner page banner is compact and only shows route title and subtitle", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Inner-page hero structure check runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/mt4-grey-label");

  const hero = page.locator(".page-hero");
  const box = await hero.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeLessThan(520);

  await expect(hero.locator(".breadcrumbs")).toBeVisible();
  await expect(hero.locator("h1")).toBeVisible();
  await expect(hero.locator(".lead-paragraph")).toBeVisible();
  await expect(hero.locator(".overline")).toBeHidden();
  await expect(hero.locator(".hero-actions")).toBeHidden();
  await expect(hero.locator(".hero-art")).toBeHidden();

  const crumbSpans = hero.locator(".breadcrumbs span");
  await expect(crumbSpans.nth(0)).toHaveText("→");
});

test("bottom CTA button has visible contrast", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "CTA contrast check runs once in Chromium");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const button = page.locator("[data-bottom-cta-button]");
  await button.scrollIntoViewIfNeeded();
  await expect(button).toBeVisible();
  await expect(button).toHaveCSS("background-color", "rgb(240, 231, 251)");
  await expect(button).toHaveCSS("color", "rgb(74, 31, 95)");
  await expect(button).toContainText("Talk to our team");
});

test("desktop banner fits the viewport envelope", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Desktop hero-height check runs once in Chromium");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const hero = page.locator("[data-hero-banner]");
  const box = await hero.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeLessThanOrEqual(830);
  expect(box!.height).toBeLessThanOrEqual(900);
});

test("site-wide section motion is attached", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Motion-system check runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const sections = page.locator("#main-content section");
  await expect(sections.first()).toBeVisible();
  const transition = await sections.nth(1).evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(transition).not.toBe("0s");
});

const bannerViewports = [
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1648, height: 870 },
  { width: 1920, height: 1080 },
];

for (const viewport of bannerViewports) {
  test(`banner composition stays contained at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Desktop banner geometry runs once in Chromium");
    await page.setViewportSize(viewport);
    await page.goto("/");

    const hero = page.locator("[data-hero-banner]");
    const left = page.locator("[data-hero-left]");
    const right = page.locator("[data-hero-right]");

    const [heroBox, leftBox, rightBox] = await Promise.all([
      hero.boundingBox(),
      left.boundingBox(),
      right.boundingBox(),
    ]);

    expect(heroBox).not.toBeNull();
    expect(leftBox).not.toBeNull();
    expect(rightBox).not.toBeNull();

    expect(leftBox!.x).toBeGreaterThanOrEqual(heroBox!.x);
    expect(rightBox!.x + rightBox!.width).toBeLessThanOrEqual(heroBox!.x + heroBox!.width + 1);
    expect(leftBox!.y).toBeGreaterThanOrEqual(heroBox!.y);
    expect(rightBox!.y).toBeGreaterThanOrEqual(heroBox!.y);
    expect(leftBox!.y + leftBox!.height).toBeLessThanOrEqual(heroBox!.y + heroBox!.height + 1);
    expect(rightBox!.y + rightBox!.height).toBeLessThanOrEqual(heroBox!.y + heroBox!.height + 1);

    if (viewport.width >= 768) {
      const horizontalOverlap = Math.min(leftBox!.x + leftBox!.width, rightBox!.x + rightBox!.width) - Math.max(leftBox!.x, rightBox!.x);
      expect(horizontalOverlap).toBeLessThanOrEqual(0);
    } else {
      expect(leftBox!.y + leftBox!.height).toBeLessThanOrEqual(rightBox!.y + 1);
    }

    const visualBox = rightBox!;
    const floats = page.locator("[data-hero-right] [data-hero-float]");
    const count = await floats.count();
    expect(count).toBe(3);
    for (let index = 0; index < count; index += 1) {
      const box = await floats.nth(index).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(visualBox.x - 1);
      expect(box!.y).toBeGreaterThanOrEqual(visualBox.y - 1);
      expect(box!.x + box!.width).toBeLessThanOrEqual(visualBox.x + visualBox.width + 1);
      expect(box!.y + box!.height).toBeLessThanOrEqual(visualBox.y + visualBox.height + 1);
    }
  });
}

const fullSiteResponsiveViewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

for (const viewport of fullSiteResponsiveViewports) {
  test(`all routes stay responsive at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Full-site viewport audit runs once in Chromium");

    await page.setViewportSize(viewport);
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();

      const metrics = await page.evaluate(() => ({
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        bodyOverflow: document.body.scrollWidth - document.documentElement.clientWidth,
      }));

      expect(metrics.documentOverflow, `${route} document overflow at ${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(1);
      expect(metrics.bodyOverflow, `${route} body overflow at ${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(1);

      const wideMedia = await page.locator("img, video, canvas, svg").evaluateAll((elements) =>
        elements.filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > window.innerWidth + 1;
        }).length
      );
      expect(wideMedia, `${route} oversized media at ${viewport.width}x${viewport.height}`).toBe(0);
    }
  });
}

test("desktop right-side hero elements stay inside the right hero container", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Right hero geometry runs once in Chromium");
  await page.setViewportSize({ width: 1648, height: 870 });
  await page.goto("/");

  const stage = page.locator("[data-hero-right]");
  const floats = stage.locator("[data-hero-float]");
  await expect(floats).toHaveCount(3);

  const stageBox = await stage.boundingBox();
  expect(stageBox).not.toBeNull();

  const boxes = await Promise.all([0, 1, 2].map((index) => floats.nth(index).boundingBox()));
  boxes.forEach((box) => {
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(stageBox!.x);
    expect(box!.y).toBeGreaterThanOrEqual(stageBox!.y);
    expect(box!.x + box!.width).toBeLessThanOrEqual(stageBox!.x + stageBox!.width + 1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(stageBox!.y + stageBox!.height + 1);
  });

  expect(boxes[0]!.y + boxes[0]!.height).toBeLessThanOrEqual(Math.min(boxes[1]!.y, boxes[2]!.y) + 1);
});

test("desktop hero visual module occupies only the marked right-side area", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Desktop red-area geometry runs once in Chromium");
  await page.setViewportSize({ width: 1648, height: 870 });
  await page.goto("/");

  const frame = page.locator("[data-hero-frame]");
  const left = page.locator("[data-hero-left]");
  const right = page.locator("[data-hero-right]");

  const [frameBox, leftBox, rightBox] = await Promise.all([
    frame.boundingBox(),
    left.boundingBox(),
    right.boundingBox(),
  ]);

  expect(frameBox).not.toBeNull();
  expect(leftBox).not.toBeNull();
  expect(rightBox).not.toBeNull();

  const frameRight = frameBox!.x + frameBox!.width;
  const frameBottom = frameBox!.y + frameBox!.height;
  const rightRatio = rightBox!.width / frameBox!.width;

  expect(rightBox!.x).toBeGreaterThanOrEqual(frameBox!.x + frameBox!.width * 0.53);
  expect(rightRatio).toBeLessThanOrEqual(0.45);
  expect(rightRatio).toBeGreaterThanOrEqual(0.40);
  expect(rightBox!.x + rightBox!.width).toBeLessThanOrEqual(frameRight - 20);
  expect(rightBox!.y).toBeGreaterThanOrEqual(frameBox!.y + 20);
  expect(rightBox!.y + rightBox!.height).toBeLessThanOrEqual(frameBottom - 20);

  expect(leftBox!.x + leftBox!.width).toBeLessThanOrEqual(rightBox!.x - 8);
});

for (const viewport of [
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
]) {
  test(`tablet and desktop hero stays side-by-side at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Side-by-side hero geometry runs once in Chromium");
    await page.setViewportSize(viewport);
    await page.goto("/");

    const left = page.locator("[data-hero-left]");
    const right = page.locator("[data-hero-right]");
    const [leftBox, rightBox] = await Promise.all([left.boundingBox(), right.boundingBox()]);

    expect(leftBox).not.toBeNull();
    expect(rightBox).not.toBeNull();
    expect(leftBox!.x + leftBox!.width).toBeLessThanOrEqual(rightBox!.x - 4);
    expect(Math.abs(leftBox!.y - rightBox!.y)).toBeLessThanOrEqual(40);
  });
}

test("right hero is flattened and borderless", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Right hero structure check runs once in Chromium");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const right = page.locator("[data-hero-right]");
  await expect(right).toBeVisible();
  await expect(page.locator("[data-hero-right-stage]")).toHaveCount(0);
  await expect(right).toHaveCSS("border-top-width", "0px");

  const floats = right.locator("[data-hero-float]");
  await expect(floats).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    await expect(floats.nth(index)).toHaveCSS("border-top-width", "0px");
  }
});