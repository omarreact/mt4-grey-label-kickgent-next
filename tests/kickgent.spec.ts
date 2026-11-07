import { expect, test } from "@playwright/test";

const routes = [
  "/", "/about", "/mt4-grey-label", "/mt5-grey-label", "/turnkey-grey-label",
  "/forex-broker-crm", "/forex-broker-website", "/forex-liquidity-bridge", "/pamm-mam",
  "/how-to-start-forex-brokerage", "/scale-forex-brokerage", "/contact",
];

for (const route of routes) {
  test(`renders ${route}`, async ({ page }, testInfo) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1:visible").first()).toBeVisible();
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

test("navigation submenu uses a blurred glass surface and route entry is smooth", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Navigation glass and route motion run once in Chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.locator(".kg-global-menu").click();
  const solutions = page.locator("#kg-primary-navigation").getByRole("button", { name: "Solutions" });
  await solutions.click();
  const menu = page.locator("#kg-solutions-menu");
  await expect(menu).toBeVisible();

  const [bg, blur] = await Promise.all([
    menu.evaluate((element) => getComputedStyle(element).backgroundColor),
    menu.evaluate((element) => getComputedStyle(element).backdropFilter),
  ]);
  expect(bg).not.toBe("rgb(255, 255, 255)");
  const alphaMatch = bg.match(/rgba?\([^,]+,[^,]+,[^,]+(?:,\s*([\d.]+))?\)/);
  const alpha = alphaMatch?.[1] ? Number(alphaMatch[1]) : 1;
  expect(alpha).toBeGreaterThanOrEqual(0.8);
  expect(blur === "none" || blur === "").toBeFalsy();

  await menu.getByRole("link", { name: "MT4 Grey Label" }).click();
  await expect(page).toHaveURL(/\/mt4-grey-label\/?$/);
  const main = page.locator("#main-content");
  await expect(main).toHaveClass(/route-entered/);
  const transitionDuration = await main.evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(transitionDuration).not.toBe("0s");
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
    await expect(page.locator("h1:visible").first()).toBeVisible();
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

test("site-wide spacing and text leading stay compact", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Compact rhythm audit runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const solutions = page.locator("#solutions");
  const paddingTop = await solutions.evaluate((element) => parseFloat(getComputedStyle(element).paddingTop));
  expect(paddingTop).toBeLessThanOrEqual(64);

  const paragraph = solutions.locator("p").first();
  const lineHeight = await paragraph.evaluate((element) => {
    const style = getComputedStyle(element);
    return parseFloat(style.lineHeight) / parseFloat(style.fontSize);
  });
  expect(lineHeight).toBeLessThanOrEqual(1.65);

  await page.goto("/mt4-grey-label");
  const innerMain = page.locator(".page-main");
  const innerPaddingTop = await innerMain.evaluate((element) => parseFloat(getComputedStyle(element).paddingTop));
  expect(innerPaddingTop).toBeLessThanOrEqual(64);
});

test("homepage branding, portraits, carousel and glass overlays render", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Homepage enhancement checks run once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  await expect(page.locator('[data-site-header] svg[aria-label="MT4 Grey Label"]')).toHaveCount(1);
  await expect(page.locator('footer svg[aria-label="MT4 Grey Label"]')).toHaveCount(1);

  const portraits = page.locator('img[alt*="Portrait of a"]');
  await expect(portraits).toHaveCount(4);
  for (let index = 0; index < 4; index += 1) {
    await expect(portraits.nth(index)).toHaveAttribute("src", /images\.unsplash\.com/);
  }

  const slider = page.getByRole("region", { name: "GreyLabel solution carousel" });
  await expect(slider).toBeVisible();

  const solutionCards = slider.locator("[data-solution-card]");
  await expect(solutionCards).toHaveCount(10);
  const cardHeights = await solutionCards.evaluateAll((cards) =>
    cards.map((card) => card.getBoundingClientRect().height)
  );
  expect(Math.max(...cardHeights) - Math.min(...cardHeights)).toBeLessThanOrEqual(1);

  const ctaBottoms = await solutionCards.evaluateAll((cards) =>
    cards.slice(0, 3).map((card) => {
      const cta = card.querySelector("span:last-child");
      return cta ? cta.getBoundingClientRect().bottom : 0;
    })
  );
  expect(Math.max(...ctaBottoms) - Math.min(...ctaBottoms)).toBeLessThanOrEqual(1);

  const before = await slider.evaluate((element) => element.scrollLeft);
  await page.getByRole("button", { name: "Next solutions" }).click();
  await expect.poll(() => slider.evaluate((element) => element.scrollLeft)).toBeGreaterThan(before);

  const platformCards = page.locator("[data-platform-card]");
  await expect(platformCards).toHaveCount(5);
  await expect(platformCards.first().locator("svg")).toHaveCount(2);
  await expect(platformCards.first()).not.toContainText("01");
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


test("fixed floating header and centered image-backed hero are preserved", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Visual shell check runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const header = page.locator("[data-site-header]");
  await expect(header).toHaveCSS("position", "fixed");

  const hero = page.locator("[data-hero-banner]");
  await expect(hero).toBeVisible();
  await expect(hero).toHaveClass(/h-fit/);
  await expect(hero).not.toHaveClass(/min-h-\[100svh\]/);
  const images = hero.locator("[data-hero-background]");
  await expect(images).toHaveCount(3);
  await expect(images.first()).toHaveAttribute("src", /images\.unsplash\.com\/photo-1556761175-4b46a572b786/);

  await expect(hero.locator("[data-hero-float]")).toHaveCount(0);
  await expect(hero.locator('[data-hero-copy="launch"]')).toHaveCSS("text-align", "center");
  await expect(hero.locator("[data-hero-actions]")).toBeVisible();
});


test("banner slider changes the centered scene and background", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Banner slider check runs once in Chromium");
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");

  const hero = page.locator("[data-hero-banner]");
  const controls = page.getByRole("tablist", { name: "Banner slides" }).getByRole("tab");
  await expect(controls).toHaveCount(3);
  await expect(hero).toHaveAttribute("data-active-slide", "launch");
  await expect(hero.locator('[data-hero-copy="launch"] h1')).toContainText("Launch a brokerage.");
  await expect(hero.locator('[data-hero-copy="launch"] h1')).toContainText("Connect every system.");

  const heroImages = hero.locator("[data-hero-background]");
  await expect(heroImages).toHaveCount(3);
  await expect(heroImages.nth(0)).toHaveCSS("opacity", "1");

  await controls.nth(1).click();
  await expect(hero).toHaveAttribute("data-active-slide", "operations");
  await expect(controls.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(heroImages.nth(1)).toHaveCSS("opacity", "1");
  await expect(hero.locator('[data-hero-copy="operations"] h1')).toContainText("Run every client journey.");
  await expect(hero.locator("[data-hero-left]")).toContainText("Explore broker CRM");

  await controls.nth(2).click();
  await expect(hero).toHaveAttribute("data-active-slide", "scale");
  await expect(heroImages.nth(2)).toHaveCSS("opacity", "1");
  await expect(hero.locator('[data-hero-copy="scale"] h1')).toContainText("Add products and capacity.");
  await expect(hero.locator("[data-hero-left]")).toContainText("Scale your brokerage");

  await expect(hero.locator('[data-hero-copy="scale"] h1')).toHaveCSS("color", "rgb(37, 16, 57)");
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

  const how = page.locator("[data-global-how-it-works]");
  await expect(how.locator("img").first()).toHaveAttribute("src", /images\.unsplash\.com/);
  await expect(how.locator("[data-timeline-card]").first()).toHaveCSS("backdrop-filter", /blur/);
});

test("inner-page hero photos are unique and not reused by homepage/global surfaces", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Image uniqueness audit runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto("/");
  const homepagePhotoIds = await page.locator('img[src*="images.unsplash.com"]').evaluateAll((images) =>
    images
      .map((image) => (image.getAttribute("src") || "").match(/photo-[A-Za-z0-9_-]+/)?.[0] || "")
      .filter(Boolean)
  );
  expect(new Set(homepagePhotoIds).size, "homepage/global image slots must not reuse a photo").toBe(homepagePhotoIds.length);

  const homepageSet = new Set(homepagePhotoIds);
  const heroSet = new Set<string>();
  const innerRoutes = routes.filter((route) => route !== "/");

  for (const route of innerRoutes) {
    await page.goto(route);
    const heroImage = page.locator("[data-pintheme-inner-hero]");
    await expect(heroImage).toBeVisible();
    const src = await heroImage.getAttribute("src");
    const photoId = src?.match(/photo-[A-Za-z0-9_-]+/)?.[0];
    expect(photoId, `${route} must use a verifiable Unsplash photo id`).toBeTruthy();
    expect(homepageSet.has(photoId!), `${route} hero must not reuse a homepage/global photo`).toBeFalsy();
    expect(heroSet.has(photoId!), `${route} hero must be unique across inner pages`).toBeFalsy();
    heroSet.add(photoId!);
  }

  expect(heroSet.size).toBe(innerRoutes.length);
});

test("inner page route pills use the branded site icon", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Breadcrumb brand treatment runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/about");

  const breadcrumbs = page.locator(".breadcrumbs");
  await expect(breadcrumbs).toBeVisible();

  const homeIcon = await breadcrumbs.locator("a").evaluate((element) => ({
    content: getComputedStyle(element, "::before").content,
    backgroundImage: getComputedStyle(element, "::before").backgroundImage,
  }));
  const currentIcon = await breadcrumbs.locator("> span:last-child").evaluate((element) => ({
    content: getComputedStyle(element, "::before").content,
    backgroundImage: getComputedStyle(element, "::before").backgroundImage,
  }));

  expect(homeIcon.content).not.toBe("none");
  expect(homeIcon.backgroundImage).toContain("data:image/svg+xml");
  expect(currentIcon.content === "none" || currentIcon.content === "normal").toBeTruthy();
  expect(currentIcon.backgroundImage).toBe("none");
});

test("On this page sidebar follows the active section and scrolls internally", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "TOC scroll behavior runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 760 });
  await page.goto("/about");

  const sidebar = page.locator(".page-sidebar");
  await expect(sidebar).toBeVisible();
  const overflowY = await sidebar.evaluate((element) => getComputedStyle(element).overflowY);
  expect(overflowY).toBe("auto");

  const links = sidebar.locator(".toc-links a");
  const lastLink = links.last();
  const href = await lastLink.getAttribute("href");
  expect(href).toBeTruthy();

  await page.locator(href!).scrollIntoViewIfNeeded();
  await expect(lastLink).toHaveClass(/active/);
  await expect(lastLink).toHaveAttribute("aria-current", "location");

  const [sidebarScrollTop, lastBox, sidebarBox] = await Promise.all([
    sidebar.evaluate((element) => element.scrollTop),
    lastLink.boundingBox(),
    sidebar.boundingBox(),
  ]);
  expect(sidebarScrollTop).toBeGreaterThan(0);
  expect(lastBox).not.toBeNull();
  expect(sidebarBox).not.toBeNull();
  expect(lastBox!.y).toBeGreaterThanOrEqual(sidebarBox!.y);
  expect(lastBox!.y + lastBox!.height).toBeLessThanOrEqual(sidebarBox!.y + sidebarBox!.height + 2);
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
  await expect(hero).toHaveClass(/!h-fit/);
  await expect(hero).not.toHaveClass(/!min-h-\[(?:400|460)px\]/);

  await expect(hero.locator(".breadcrumbs")).toBeVisible();
  await expect(hero.locator("h1")).toBeVisible();
  await expect(hero.locator(".lead-paragraph")).toBeVisible();
  await expect(hero.locator(".overline")).toBeHidden();
  await expect(hero.locator(".hero-actions")).toBeHidden();
  await expect(hero.locator(".hero-art")).toBeHidden();

  const [titleSize, titleLineHeight, subtitleSize, subtitleLineHeight, heroPaddingTop, heroPaddingBottom] = await Promise.all([
    hero.locator("h1").evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
    hero.locator("h1").evaluate((element) => parseFloat(getComputedStyle(element).lineHeight)),
    hero.locator(".lead-paragraph").evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
    hero.locator(".lead-paragraph").evaluate((element) => parseFloat(getComputedStyle(element).lineHeight)),
    hero.evaluate((element) => parseFloat(getComputedStyle(element).paddingTop)),
    hero.evaluate((element) => parseFloat(getComputedStyle(element).paddingBottom)),
  ]);
  expect(titleSize).toBeLessThanOrEqual(57);
  expect(titleLineHeight / titleSize).toBeLessThanOrEqual(1.02);
  expect(subtitleSize).toBeLessThanOrEqual(16);
  expect(subtitleLineHeight / subtitleSize).toBeLessThanOrEqual(1.5);
  expect(heroPaddingTop).toBeLessThanOrEqual(116);
  expect(heroPaddingBottom).toBeLessThanOrEqual(32);

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
  await expect(button).toHaveCSS("background-color", "rgb(74, 31, 95)");
  await expect(button).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(button).toContainText("Talk to our team");
});

test("desktop banner uses content-driven height", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Desktop hero-height check runs once in Chromium");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const hero = page.locator("[data-hero-banner]");
  const frame = page.locator("[data-hero-frame]");
  const content = page.locator("[data-hero-left]");
  await expect(hero).toHaveClass(/h-fit/);
  await expect(frame).toHaveClass(/h-fit/);
  await expect(content).toHaveClass(/h-fit/);
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
      await expect(page.locator("h1:visible").first()).toBeVisible();

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

test("right hero parent has no extra overlay", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Right hero parent overlay check runs once in Chromium");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const right = page.locator("[data-hero-right]");
  await expect(right).toBeVisible();
  await expect(right).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(right).toHaveCSS("backdrop-filter", "none");
  await expect(right).toHaveCSS("box-shadow", "none");
});

test("right hero contains only independent floating elements", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Premium floating-element structure runs once in Chromium");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const right = page.locator("[data-hero-right]");
  await expect(right).toBeVisible();
  await expect(right).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(right).toHaveCSS("box-shadow", "none");
  await expect(right).toHaveCSS("border-top-width", "0px");

  const floats = right.locator("[data-hero-float]");
  await expect(floats).toHaveCount(3);

  for (let index = 0; index < 3; index += 1) {
    const box = await floats.nth(index).boundingBox();
    const parent = await right.boundingBox();
    expect(box).not.toBeNull();
    expect(parent).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(parent!.x - 1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(parent!.x + parent!.width + 1);
    expect(box!.y).toBeGreaterThanOrEqual(parent!.y - 1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(parent!.y + parent!.height + 1);
  }
});

test("premium platform cards use flex layout with three cards on the first desktop row", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Platform-card geometry runs once in Chromium");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const cards = page.locator("[data-platform-card]");
  await expect(cards).toHaveCount(5);

  const boxes = await Promise.all([0,1,2,3,4].map((index) => cards.nth(index).boundingBox()));
  boxes.forEach((box) => expect(box).not.toBeNull());

  expect(Math.abs(boxes[0]!.y - boxes[1]!.y)).toBeLessThanOrEqual(2);
  expect(Math.abs(boxes[1]!.y - boxes[2]!.y)).toBeLessThanOrEqual(2);
  expect(boxes[3]!.y).toBeGreaterThan(boxes[0]!.y + 20);
  expect(Math.abs(boxes[3]!.y - boxes[4]!.y)).toBeLessThanOrEqual(2);
  expect(boxes[3]!.width).toBeGreaterThan(boxes[0]!.width);
});

test("solution carousel uses icons instead of numeric indicators", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Solution-card icon audit runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const cards = page.locator("[data-solution-card]");
  await expect(cards).toHaveCount(10);
  await expect(cards.first().locator("svg")).toHaveCount(3);
  for (const marker of ["01","02","03","04","05","06","07","08","09","10"]) {
    await expect(page.locator("[data-solution-card]", { hasText: marker })).toHaveCount(0);
  }
});

test("mobile navigation drawer isolates page content and keeps expanded submenu contained", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Mobile drawer visual containment runs once in Chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open navigation" }).click();
  const nav = page.locator("#kg-primary-navigation");
  await expect(nav).toBeVisible();

  const navStyle = await nav.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      maxHeight: parseFloat(style.maxHeight),
      overflowY: style.overflowY,
    };
  });
  const alpha = Number(navStyle.backgroundColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/)?.[1] ?? "1");
  expect(alpha).toBeGreaterThanOrEqual(0.9);
  expect(navStyle.overflowY).toBe("auto");
  expect(navStyle.maxHeight).toBeLessThanOrEqual(720);

  await nav.getByRole("button", { name: "Solutions" }).click();
  const submenu = page.locator("#kg-solutions-menu");
  await expect(submenu).toBeVisible();

  const submenuStyle = await submenu.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      position: style.position,
      backgroundColor: style.backgroundColor,
    };
  });
  expect(submenuStyle.position).toBe("static");
  const submenuAlpha = Number(submenuStyle.backgroundColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/)?.[1] ?? "1");
  expect(submenuAlpha).toBeGreaterThanOrEqual(0.9);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("navigation and submenu typography are uniform", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Navigation typography audit runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const nav = page.locator("#kg-primary-navigation");
  const home = nav.getByRole("link", { name: "Home" });
  const solutions = nav.getByRole("button", { name: "Solutions" });
  const guides = nav.getByRole("button", { name: "Guides" });
  const about = nav.getByRole("link", { name: "About" });
  const contact = nav.getByRole("link", { name: "Contact" });

  const topLevel = [home, solutions, guides, about, contact];
  const baseline = await home.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
    };
  });

  for (const item of topLevel.slice(1)) {
    const current = await item.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
      };
    });
    expect(current).toEqual(baseline);
  }

  await solutions.hover();
  const firstSubmenu = page.locator("#kg-solutions-menu a").first();
  await expect(firstSubmenu).toBeVisible();
  const submenuStyle = await firstSubmenu.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
    };
  });
  expect(submenuStyle).toEqual(baseline);
});

test("primary contact channels and social controls use the approved details", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Contact channel audit runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const header = page.locator("[data-site-header]");
  await expect(header.getByRole("link", { name: "WhatsApp +44 7988 028424" })).toHaveAttribute("href", "https://wa.me/447988028424");
  await expect(header.getByRole("link", { name: "Telegram @forexbrokertech" })).toHaveAttribute("href", "https://t.me/forexbrokertech");

  const footer = page.locator("footer");
  await expect(footer.getByRole("link", { name: "+44 7988 028424", exact: true })).toHaveAttribute("href", "tel:+447988028424");
  await expect(footer.getByRole("link", { name: "WhatsApp +44 7988 028424" })).toHaveAttribute("href", "https://wa.me/447988028424");
  await expect(footer.getByRole("link", { name: "Telegram @forexbrokertech" })).toHaveAttribute("href", "https://t.me/forexbrokertech");

  const scrollTop = page.locator("[data-scroll-top]");
  await expect(scrollTop).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(scrollTop).toBeVisible();
  await scrollTop.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(100);
});

test("contact page is complete and uses phone WhatsApp and Telegram only", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Contact route check runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/contact");

  const header = page.locator("[data-site-header]");
  await expect(header.getByRole("link", { name: "Contact" })).toHaveAttribute("aria-current", "page");

  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator("[data-contact-email]")).toHaveCount(0);
  await expect(page.locator("[data-contact-phone]")).toHaveAttribute("href", "tel:+447988028424");
  await expect(page.locator("[data-contact-channels]")).toBeVisible();

  await expect(page.getByRole("link", { name: /WhatsApp/ }).first()).toHaveAttribute("href", "https://wa.me/447988028424");
  await expect(page.getByRole("link", { name: /Telegram/ }).first()).toHaveAttribute("href", "https://t.me/forexbrokertech");
});

test("contact page remains responsive and Contact is available in the mobile menu", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Mobile contact check runs once in Chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact");

  await page.getByRole("button", { name: "Open navigation" }).click();
  const contactLink = page.locator("[data-site-header]").getByRole("link", { name: "Contact" });
  await expect(contactLink).toBeVisible();
  await expect(contactLink).toHaveAttribute("aria-current", "page");

  await expect(page.locator("[data-contact-form]")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("global How It Works CTA and footer render once on homepage and inner pages", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Global closing-system check runs once in Chromium");

  for (const route of ["/", "/mt4-grey-label", "/about"]) {
    await page.goto(route);
    await expect(page.locator("[data-global-how-it-works]")).toHaveCount(1);
    await expect(page.locator("[data-global-cta]")).toHaveCount(1);
    await expect(page.locator("body > footer")).toHaveCount(1);
    await expect(page.locator(".kg-page-content .site-footer")).toBeHidden();
    await expect(page.locator(".kg-page-content .bottom-cta")).toBeHidden();
  }
});

test("global How It Works is a compact alternating timeline with icons and no numbered step badges", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Global timeline check runs once in Chromium");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const how = page.locator("[data-global-how-it-works]");
  await expect(how.locator("article")).toHaveCount(5);
  await expect(how.locator("article svg")).toHaveCount(5);

  const timelineGap = await how.locator("[data-timeline-list]").evaluate((element) =>
    parseFloat(getComputedStyle(element).rowGap)
  );
  expect(timelineGap).toBeLessThanOrEqual(16);
  expect(timelineGap).toBeGreaterThanOrEqual(8);

  const cards = how.locator("[data-timeline-card]");
  const firstBox = await cards.nth(0).boundingBox();
  const secondBox = await cards.nth(1).boundingBox();
  const thirdBox = await cards.nth(2).boundingBox();
  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  expect(thirdBox).not.toBeNull();

  // Desktop rows intentionally overlap vertically so the alternating sides do not
  // leave a full card-height of empty space between cards on the same side.
  expect(secondBox!.y).toBeLessThan(firstBox!.y + firstBox!.height);
  const firstToThirdSameSideGap = thirdBox!.y - (firstBox!.y + firstBox!.height);
  expect(firstToThirdSameSideGap).toBeLessThan(220);

  for (const marker of ["01","02","03","04","05"]) {
    await expect(how).not.toContainText(marker);
  }
});

test("mobile inner pages hide On this page and chapter number indicators", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Mobile inner-page content check runs once in Chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mt4-grey-label");

  await expect(page.locator(".page-sidebar")).toBeHidden();
  await expect(page.locator(".content-article")).toBeVisible();
  await expect(page.locator(".chapter-tag").first()).toBeHidden();

  const title = page.locator(".page-hero h1");
  const fontSize = await title.evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  expect(fontSize).toBeLessThanOrEqual(38);
});

test("inner-page connected-solution card keeps readable contrast", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Sidebar CTA contrast check runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/mt4-grey-label");

  const help = page.locator(".sidebar-help");
  await expect(help).toBeVisible();
  await expect(help).toHaveCSS("background-color", "rgb(50, 21, 67)");
  await expect(help.locator("b")).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(help.locator("a")).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("footer uses MT4 Grey Label branding and removes agency credit", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Footer branding check runs once in Chromium");
  await page.goto("/");

  const footer = page.locator("footer");
  await expect(footer).toContainText("MT4 Grey Label");
  await expect(footer).not.toContainText("Built by PINCODE IT");
  await expect(footer).not.toContainText("© 2026 GreyLabel Technology");
});

test("mobile footer splits Solutions and Explore into two columns", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Mobile footer geometry check runs once in Chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const grid = page.locator("[data-site-footer-grid]");
  const solutionsMenu = page.locator('[data-footer-menu="solutions"]');
  const exploreMenu = page.locator('[data-footer-menu="explore"]');

  await expect(solutionsMenu).toBeVisible();
  await expect(exploreMenu).toBeVisible();

  const templateColumns = await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns);
  expect(templateColumns.trim().split(/\s+/)).toHaveLength(2);

  const [solutionsBox, exploreBox] = await Promise.all([
    solutionsMenu.boundingBox(),
    exploreMenu.boundingBox(),
  ]);
  expect(solutionsBox).not.toBeNull();
  expect(exploreBox).not.toBeNull();
  expect(Math.abs(solutionsBox!.y - exploreBox!.y)).toBeLessThanOrEqual(2);
  expect(exploreBox!.x).toBeGreaterThan(solutionsBox!.x + solutionsBox!.width - 2);
});

test("homepage does not render duplicate local How It Works or CTA sections", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Closing-section duplication check runs once in Chromium");
  await page.goto("/");

  await expect(page.locator("#main-content [data-global-how-it-works]")).toHaveCount(0);
  await expect(page.locator("#main-content [data-bottom-cta-button]")).toHaveCount(0);
  await expect(page.locator("[data-global-how-it-works]")).toHaveCount(1);
  await expect(page.locator("[data-global-cta] [data-bottom-cta-button]")).toHaveCount(1);
});


test("site icon replaces decorative star markers across homepage and inner pages", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Brand marker audit runs once in Chromium");

  await page.goto("/");
  const markers = page.locator("[data-site-icon-marker]");
  await expect(markers).toHaveCount(4);
  for (let index = 0; index < 4; index += 1) {
    await expect(markers.nth(index).locator('svg[aria-label="MT4 Grey Label"]')).toHaveCount(1);
    await expect(markers.nth(index)).not.toContainText("✦");
  }

  await page.goto("/about");
  const overlineIcon = await page.locator(".overline").first().evaluate((element) => ({
    content: getComputedStyle(element, "::before").content,
    backgroundImage: getComputedStyle(element, "::before").backgroundImage,
  }));
  expect(overlineIcon.content).not.toContain("✦");
  expect(overlineIcon.backgroundImage).toContain("data:image/svg+xml");

  await page.goto("/contact");
  const contactIcon = await page.locator(".contact-kicker").first().evaluate((element) => ({
    content: getComputedStyle(element, "::before").content,
    backgroundImage: getComputedStyle(element, "::before").backgroundImage,
  }));
  expect(contactIcon.content).not.toContain("✦");
  expect(contactIcon.backgroundImage).toContain("data:image/svg+xml");
});

test("MT4 Grey Label branding is applied to navigation footer and site icon", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Branding asset check runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  await expect(page.locator('[data-site-header] svg[aria-label="MT4 Grey Label"]')).toHaveCount(1);
  await expect(page.locator('footer svg[aria-label="MT4 Grey Label"]')).toHaveCount(1);
  await expect(page.locator('[data-site-icon-marker] svg[aria-label="MT4 Grey Label"]')).toHaveCount(4);

  const icon = page.locator('link[rel="icon"]').first();
  await expect(icon).toHaveAttribute("href", /mt4-grey-label-icon|icon/);
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", /site\.webmanifest/);
  await expect(page).toHaveTitle(/MT4 Grey Label/);
});


test("How It Works icons live inside their timeline cards", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Timeline icon placement runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const cards = page.locator("[data-global-how-it-works] [data-timeline-card]");
  await expect(cards).toHaveCount(5);

  for (let index = 0; index < 5; index += 1) {
    const card = cards.nth(index);
    const icon = card.locator("[data-timeline-icon]");
    await expect(icon).toHaveCount(1);

    const [cardBox, iconBox] = await Promise.all([card.boundingBox(), icon.boundingBox()]);
    expect(cardBox).not.toBeNull();
    expect(iconBox).not.toBeNull();
    expect(iconBox!.x).toBeGreaterThanOrEqual(cardBox!.x);
    expect(iconBox!.y).toBeGreaterThanOrEqual(cardBox!.y);
    expect(iconBox!.x + iconBox!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width + 1);
    expect(iconBox!.y + iconBox!.height).toBeLessThanOrEqual(cardBox!.y + cardBox!.height + 1);
  }
});

test("How It Works timeline alternates cards left and right", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Alternating timeline geometry runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto("/");

  const section = page.locator("[data-global-how-it-works]");
  const rows = section.locator("[data-timeline-side]");
  await expect(rows).toHaveCount(5);

  const expectedSides = ["left", "right", "left", "right", "left"];
  const sectionBox = await section.boundingBox();
  expect(sectionBox).not.toBeNull();
  const centerX = sectionBox!.x + sectionBox!.width / 2;

  for (let index = 0; index < expectedSides.length; index += 1) {
    const row = rows.nth(index);
    await expect(row).toHaveAttribute("data-timeline-side", expectedSides[index]);

    const card = row.locator("[data-timeline-card]");
    const cardBox = await card.boundingBox();
    expect(cardBox).not.toBeNull();

    if (expectedSides[index] === "left") {
      expect(cardBox!.x + cardBox!.width).toBeLessThan(centerX);
    } else {
      expect(cardBox!.x).toBeGreaterThan(centerX);
    }

    await expect(card.locator("[data-timeline-icon]")).toHaveCount(1);
  }
});

test("timeline card alignment follows its desktop side and stays unchanged on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Timeline alignment check runs once in Chromium");

  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto("/");

  const rows = page.locator("[data-global-how-it-works] [data-timeline-side]");
  await expect(rows).toHaveCount(5);

  for (let index = 0; index < 5; index += 1) {
    const row = rows.nth(index);
    const side = index % 2 === 0 ? "left" : "right";
    const card = row.locator("[data-timeline-card]");
    const icon = card.locator("[data-timeline-icon]");

    await expect(card).toHaveCSS("text-align", side === "left" ? "right" : "left");

    const [cardBox, iconBox] = await Promise.all([card.boundingBox(), icon.boundingBox()]);
    expect(cardBox).not.toBeNull();
    expect(iconBox).not.toBeNull();

    if (side === "left") {
      expect(Math.abs((iconBox!.x + iconBox!.width) - (cardBox!.x + cardBox!.width - 24))).toBeLessThanOrEqual(3);
    } else {
      expect(Math.abs(iconBox!.x - (cardBox!.x + 24))).toBeLessThanOrEqual(3);
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const mobileCards = page.locator("[data-global-how-it-works] [data-timeline-card]");
  await expect(mobileCards.first()).toHaveCSS("text-align", "left");

  const [mobileCardBox, mobileIconBox] = await Promise.all([
    mobileCards.first().boundingBox(),
    mobileCards.first().locator("[data-timeline-icon]").boundingBox(),
  ]);
  expect(mobileCardBox).not.toBeNull();
  expect(mobileIconBox).not.toBeNull();
  expect(Math.abs(mobileIconBox!.x - (mobileCardBox!.x + 20))).toBeLessThanOrEqual(3);
});

test("global CTA uses the approved light premium palette", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "CTA palette check runs once in Chromium");
  await page.goto("/");

  const section = page.locator("[data-global-cta]");
  await expect(section).toHaveCSS("background-color", "rgb(247, 243, 251)");
  await expect(section.locator("h2")).toHaveCSS("color", "rgb(36, 16, 54)");
  await expect(section.locator("p")).toHaveClass(/text-slate-600/);
});

test("banner uses the approved legacy Kickgent hero background only", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Hero background check runs once in Chromium");
  await page.goto("/");

  const background = page.locator("[data-hero-background]");
  await expect(background).toHaveCount(1);
  await expect(background).toHaveAttribute("src", /photo-1556761175-4b46a572b786/);

  const objectPosition = await background.evaluate((element) => getComputedStyle(element).objectPosition);
  expect(objectPosition).toBe("50% 46%");

  const initialSrc = await background.getAttribute("src");
  const tabs = page.locator("[data-hero-indicators] button");
  await tabs.nth(1).click();
  await expect(page.locator("[data-hero-banner]")).toHaveAttribute("data-active-slide", "operations");
  await expect(background).toHaveAttribute("src", initialSrc!);
  await tabs.nth(2).click();
  await expect(page.locator("[data-hero-banner]")).toHaveAttribute("data-active-slide", "scale");
  await expect(background).toHaveAttribute("src", initialSrc!);
});

test("banner indicators sit centered at the bottom inside the hero frame", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Banner indicator geometry runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const frame = page.locator("[data-hero-frame]");
  const indicators = page.locator("[data-hero-indicators]");
  await expect(indicators).toBeVisible();

  const [frameBox, indicatorBox] = await Promise.all([frame.boundingBox(), indicators.boundingBox()]);
  expect(frameBox).not.toBeNull();
  expect(indicatorBox).not.toBeNull();

  const frameCenter = frameBox!.x + frameBox!.width / 2;
  const indicatorCenter = indicatorBox!.x + indicatorBox!.width / 2;
  expect(Math.abs(frameCenter - indicatorCenter)).toBeLessThanOrEqual(2);
  expect(indicatorBox!.y + indicatorBox!.height).toBeLessThan(frameBox!.y + frameBox!.height);
  expect(frameBox!.y + frameBox!.height - (indicatorBox!.y + indicatorBox!.height)).toBeLessThanOrEqual(28);
});

test("mobile hero content is vertically centered and CTA buttons share one row", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Mobile hero geometry runs once in Chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const left = page.locator("[data-hero-left]");
  const activeCopy = page.locator("[data-hero-copy]:visible").first();
  const actions = page.locator("[data-hero-actions]");
  const [leftBox, copyBox, leftMinHeight] = await Promise.all([
    left.boundingBox(),
    activeCopy.boundingBox(),
    left.evaluate((element) => getComputedStyle(element).minHeight),
  ]);
  expect(leftBox).not.toBeNull();
  expect(copyBox).not.toBeNull();
  expect(leftMinHeight).toBe("0px");

  const leftCenter = leftBox!.y + leftBox!.height / 2;
  const copyCenter = copyBox!.y + copyBox!.height / 2;
  expect(Math.abs(leftCenter - copyCenter)).toBeLessThanOrEqual(8);

  const actionButtons = actions.getByRole("link");
  await expect(actionButtons).toHaveCount(2);
  const [firstBox, secondBox] = await Promise.all([actionButtons.nth(0).boundingBox(), actionButtons.nth(1).boundingBox()]);
  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  expect(Math.abs(firstBox!.y - secondBox!.y)).toBeLessThanOrEqual(2);
  expect(secondBox!.x).toBeGreaterThan(firstBox!.x);
});

test("banner keeps a light backdrop so the background image stays visible", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Hero backdrop audit runs once in Chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const frame = page.locator("[data-hero-frame]");
  const overlay = page.locator("[data-hero-overlay]");

  const frameStyle = await frame.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      backdropFilter: style.backdropFilter,
    };
  });
  const overlayStyle = await overlay.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      backdropFilter: style.backdropFilter,
    };
  });

  expect(frameStyle.backdropFilter).toContain("blur(4px)");
  expect(overlayStyle.backdropFilter).toContain("blur(0.5px)");

  const frameAlpha = Number(frameStyle.backgroundColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/)?.[1] ?? "1");
  const overlayAlpha = Number(overlayStyle.backgroundColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/)?.[1] ?? "1");
  expect(frameAlpha).toBeLessThanOrEqual(0.23);
  expect(overlayAlpha).toBeLessThanOrEqual(0.35);
});

test("mobile banner shows only left content without an inner border and keeps compact bottom spacing", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Mobile hero visibility check runs once in Chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.locator("[data-hero-left]")).toBeVisible();
  await expect(page.locator("[data-hero-right]")).toBeHidden();
  await expect(page.locator("[data-hero-indicators]")).toBeVisible();

  const innerBorderWidth = await page.locator("[data-hero-left]").evaluate((element) =>
    parseFloat(getComputedStyle(element).borderTopWidth)
  );
  expect(innerBorderWidth).toBe(0);

  const [frameBackground, frameBackdropFilter, leftBackground] = await Promise.all([
    page.locator("[data-hero-frame]").evaluate((element) => getComputedStyle(element).backgroundColor),
    page.locator("[data-hero-frame]").evaluate((element) => getComputedStyle(element).backdropFilter),
    page.locator("[data-hero-left]").evaluate((element) => getComputedStyle(element).backgroundColor),
  ]);
  expect(frameBackground).not.toBe("rgba(0, 0, 0, 0)");
  expect(frameBackdropFilter === "none" || frameBackdropFilter === "").toBeFalsy();
  expect(leftBackground).toBe("rgba(0, 0, 0, 0)");

  const bottomPadding = await page.locator("[data-hero-banner]").evaluate((element) =>
    parseFloat(getComputedStyle(element).paddingBottom)
  );
  expect(bottomPadding).toBeGreaterThanOrEqual(16);
  expect(bottomPadding).toBeLessThanOrEqual(20);

  const banner = page.locator("[data-hero-banner]");
  const initialHeight = await banner.evaluate((element) => element.getBoundingClientRect().height);

  const tabs = page.locator("[data-hero-indicators] button");
  await tabs.nth(1).click();
  await expect(banner).toHaveAttribute("data-active-slide", "operations");
  const operationsHeight = await banner.evaluate((element) => element.getBoundingClientRect().height);

  await tabs.nth(2).click();
  await expect(banner).toHaveAttribute("data-active-slide", "scale");
  const scaleHeight = await banner.evaluate((element) => element.getBoundingClientRect().height);

  expect(Math.abs(operationsHeight - initialHeight)).toBeLessThanOrEqual(1);
  expect(Math.abs(scaleHeight - initialHeight)).toBeLessThanOrEqual(1);
});

test("mobile active client journey uses icon tabs and keeps a stable section height", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Mobile journey geometry check runs once in Chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const section = page.locator("[data-active-journey]");
  const tabs = page.locator("[data-journey-tabs] [role='tab']");
  await section.scrollIntoViewIfNeeded();

  await expect(tabs).toHaveCount(4);
  const tabBox = await tabs.first().boundingBox();
  expect(tabBox).not.toBeNull();
  expect(tabBox!.width).toBeLessThan(100);
  expect(Math.abs(tabBox!.width - tabBox!.height)).toBeLessThanOrEqual(4);

  const initialHeight = await section.evaluate((element) => element.getBoundingClientRect().height);

  for (let index = 1; index < 4; index += 1) {
    await tabs.nth(index).click();
    await expect(tabs.nth(index)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("[data-journey-panel]").nth(index)).toBeVisible();

    const currentHeight = await section.evaluate((element) => element.getBoundingClientRect().height);
    expect(Math.abs(currentHeight - initialHeight)).toBeLessThanOrEqual(1);
  }
});

test("desktop banner keeps zero outside bottom spacing", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Desktop hero spacing check runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const bottomPadding = await page.locator("[data-hero-banner]").evaluate((element) =>
    parseFloat(getComputedStyle(element).paddingBottom)
  );
  expect(bottomPadding).toBe(0);

  const desktopFrameBackground = await page.locator("[data-hero-frame]").evaluate(
    (element) => getComputedStyle(element).backgroundColor
  );
  expect(desktopFrameBackground).not.toBe("rgba(0, 0, 0, 0)");
});

test("semantic tone contract keeps typography readable on dark and light surfaces", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Tone contract audit runs once in Chromium");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const darkHeading = page.locator('section[data-tone="dark"] h2').first();
  const lightHeading = page.locator('section[data-tone="light"] h2').first();
  await expect(darkHeading).toBeVisible();
  await expect(lightHeading).toBeVisible();
  await expect(darkHeading).toHaveCSS("color", "rgb(252, 248, 255)");
  await expect(lightHeading).toHaveCSS("color", "rgb(36, 16, 54)");

  await page.goto("/about");
  const innerHero = page.locator(".page-hero");
  const innerMain = page.locator(".page-main");
  await expect(innerHero).toHaveAttribute("data-tone", "dark");
  await expect(innerMain).toHaveAttribute("data-tone", "light");
  await expect(innerHero.locator("h1")).toHaveCSS("color", "rgb(255, 255, 255)");
});


for (const mobileWidth of [320, 390]) {
  test(`banner CTA buttons stay on one row at ${mobileWidth}px`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Mobile banner CTA geometry runs once in Chromium");
    await page.setViewportSize({ width: mobileWidth, height: 844 });
    await page.goto("/");

    const tabs = page.getByRole("tablist", { name: "Banner slides" }).getByRole("tab");
    for (let index = 0; index < 3; index += 1) {
      if (index > 0) await tabs.nth(index).click();
      const activeId = await page.locator("[data-hero-banner]").getAttribute("data-active-slide");
      const actions = page.locator(`[data-hero-copy="${activeId}"] [data-hero-actions]`);
      const buttons = actions.locator("a");
      await expect(buttons).toHaveCount(2);

      const [first, second, parent] = await Promise.all([
        buttons.nth(0).boundingBox(),
        buttons.nth(1).boundingBox(),
        actions.boundingBox(),
      ]);
      expect(first).not.toBeNull();
      expect(second).not.toBeNull();
      expect(parent).not.toBeNull();
      expect(Math.abs(first!.y - second!.y)).toBeLessThanOrEqual(1);
      expect(first!.x + first!.width).toBeLessThanOrEqual(second!.x + 1);
      expect(first!.x).toBeGreaterThanOrEqual(parent!.x - 1);
      expect(second!.x + second!.width).toBeLessThanOrEqual(parent!.x + parent!.width + 1);
    }
  });
}


test("inner page hero typography stays compact on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Mobile inner hero typography runs once in Chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mt4-grey-label");

  const hero = page.locator(".page-hero");
  const titleSize = await hero.locator("h1").evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  const subtitleSize = await hero.locator(".lead-paragraph").evaluate((element) => parseFloat(getComputedStyle(element).fontSize));

  const [titleLineHeight, subtitleLineHeight, subtitleMarginTop, heroPaddingTop, heroPaddingBottom] = await Promise.all([
    hero.locator("h1").evaluate((element) => parseFloat(getComputedStyle(element).lineHeight)),
    hero.locator(".lead-paragraph").evaluate((element) => parseFloat(getComputedStyle(element).lineHeight)),
    hero.locator(".lead-paragraph").evaluate((element) => parseFloat(getComputedStyle(element).marginTop)),
    hero.evaluate((element) => parseFloat(getComputedStyle(element).paddingTop)),
    hero.evaluate((element) => parseFloat(getComputedStyle(element).paddingBottom)),
  ]);

  expect(titleSize).toBeLessThanOrEqual(32);
  expect(titleLineHeight / titleSize).toBeLessThanOrEqual(1.03);
  expect(subtitleSize).toBeLessThanOrEqual(14);
  expect(subtitleLineHeight / subtitleSize).toBeLessThanOrEqual(1.45);
  expect(subtitleMarginTop).toBeLessThanOrEqual(8);
  expect(heroPaddingTop).toBeLessThanOrEqual(104);
  expect(heroPaddingBottom).toBeLessThanOrEqual(28);
});
