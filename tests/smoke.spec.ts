import { test, expect, type Page } from "@playwright/test";

/**
 * Smoke pass — deliberately small.
 *
 * Scope is the regression baseline the architect approved: the site renders,
 * it is genuinely RTL, the lightbox opens, a product route survives a hard load
 * under the base path, and nothing 404s. It is not coverage, and it should not
 * grow into coverage — add cases when a page is added, not speculatively.
 *
 * Every assertion here corresponds to a defect that actually happened, which is
 * the only reason each one is worth a test.
 */

/**
 * The deployment base path. Spelled out rather than folded into `baseURL`:
 * these tests exist largely to catch base-path regressions, so it should be
 * visible at every call site.
 */
const rawBase = process.env.SMOKE_BASE_PATH ?? "/cosmetics";
const BASE = rawBase === "/" ? "" : rawBase.replace(/\/+$/, "");

/** Persian digits back to a number, so a rendered count can be compared. */
function fromFa(text: string): number {
  return Number(text.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/\D/g, ""));
}

/** Collects console errors and failed responses for the lifetime of a page. */
function watch(page: Page) {
  const consoleErrors: string[] = [];
  const failed: string[] = [];

  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });

  return { consoleErrors, failed };
}

test("homepage renders, is RTL, and loads every asset", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  await page.goto(`${BASE}/`);

  await expect(page.locator("h1")).toHaveText("زیبایی، آهسته اتفاق می‌افتد");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");

  // Native RTL, not just an attribute — the grid must resolve right-to-left.
  const direction = await page.evaluate(() => getComputedStyle(document.body).direction);
  expect(direction).toBe("rtl");

  // Walk the page so lazy images and scroll reveals all fire.
  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += 400) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 50));
    }
  });

  // Regression: next/image does not apply basePath when images are unoptimized,
  // which silently broke all 26 images on the project site.
  const broken = await page.evaluate(
    () =>
      [...document.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth === 0)
        .length,
  );
  expect(broken, "images failing to load").toBe(0);

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(overflows, "horizontal overflow").toBe(false);

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("gallery lightbox opens and closes", async ({ page }) => {
  await page.goto(`${BASE}/`);

  const firstTile = page.locator("#gallery .gallery-tile").first();
  await firstTile.scrollIntoViewIfNeeded();
  await firstTile.click();

  const dialog = page.locator("dialog.lightbox");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty("open", true);

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveJSProperty("open", false);
});

test("a product route survives a hard load under the base path", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  // Hard load, not a client-side navigation: this is the case that 404'd on the
  // dynamic route's RSC payload, and the case a static host has to get right.
  const response = await page.goto(`${BASE}/products/shab/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("سرم شب");

  // Regression: a raw <a href="/"> skips basePath and leaves the site entirely.
  const homeLink = page.locator('nav[aria-label="مسیر صفحه"] a').first();
  await expect(homeLink).toHaveAttribute("href", `${BASE}/`);

  // The site's only conversion point (§42). A malformed number or an unencoded
  // message produces a link that looks fine and opens an empty chat.
  const inquiry = page.locator('a[href^="https://wa.me/"]');
  const inquiryHref = await inquiry.getAttribute("href");
  expect(inquiryHref, "WhatsApp inquiry link").toBeTruthy();
  expect(decodeURIComponent(inquiryHref!), "product name prefilled").toContain("سرم شب");
  expect(inquiryHref!, "digits only in the wa.me path").toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  await expect(inquiry).toHaveAttribute("rel", /noopener/);

  // Related products must lead somewhere else — a page linking to itself here
  // is the failure mode of every naive "related" implementation.
  const relatedLinks = await page
    .locator('section[aria-labelledby="related-heading"] article a[href]')
    .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
  expect(relatedLinks.length).toBeGreaterThan(0);
  expect(relatedLinks.some((href) => href.includes("/products/shab"))).toBe(false);

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("the collection page lists the catalogue and its index resolves", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  const response = await page.goto(`${BASE}/products/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("همهٔ محصولات، کنار هم");

  // Regression: nav hrefs written as bare hashes pointed at homepage sections
  // and resolved to nothing once the header rendered on a second page.
  await expect(
    page.locator('header nav[aria-label="پیمایش اصلی"] a[aria-current="page"]'),
  ).toHaveText("محصولات");

  // The index is only structure if its targets exist. A category anchor that
  // points at a removed product fails silently — the page just does not move.
  const items = page.locator("article[id^='product-']");
  const count = await items.count();
  expect(count).toBeGreaterThan(0);

  const anchors = await page
    .locator(".collection-index__link")
    .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
  expect(anchors.length).toBeGreaterThan(0);
  for (const anchor of anchors) {
    await expect(page.locator(anchor), `index anchor ${anchor}`).toHaveCount(1);
  }

  // The printed count is derived, so it must never disagree with what is shown.
  const printed = await page.locator(".collection-index p.t-meta").innerText();
  expect(fromFa(printed)).toBe(count);

  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += 400) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 50));
    }
  });

  const broken = await page.evaluate(
    () =>
      [...document.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth === 0)
        .length,
  );
  expect(broken, "images failing to load").toBe(0);

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(overflows, "horizontal overflow").toBe(false);

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("an unknown path serves the styled 404", async ({ page }) => {
  const response = await page.goto(`${BASE}/definitely-not-a-page/`);

  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("این نشانی وجود ندارد");
});
