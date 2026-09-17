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

/**
 * Every control on the page must have a non-empty accessible name.
 *
 * This exists because the interface strings moved out of the components and
 * into `src/content/ui.ts`. A mistyped path there does not throw and does not
 * render visibly wrong — the button still draws, still works, and simply stops
 * announcing itself, or announces the word "undefined". That is invisible to
 * every other check in this file and to anyone looking at the screen.
 */
async function namelessControls(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll("button, a[href]")]
      .filter((el) => (el as HTMLElement).checkVisibility({ visibilityProperty: true }))
      // An aria-hidden subtree is not in the accessibility tree, so nothing in
      // it needs a name. The product cards put a second, deliberately hidden
      // link on the image behind the named one — skipping these is the
      // difference between a check and a false alarm.
      .filter((el) => el.closest('[aria-hidden="true"]') === null)
      .filter((el) => {
        const label = el.getAttribute("aria-label");
        const name = label === null ? (el.textContent ?? "") : label;
        return name.trim() === "" || name.includes("undefined");
      })
      .map((el) => `${el.tagName.toLowerCase()}.${el.className || "(no class)"}`),
  );
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

  // Nothing else in this suite sees the header, footer and tile controls at
  // rest, and they are where most of `ui.ts` is consumed.
  expect(await namelessControls(page), "controls with no accessible name").toEqual([]);

  const firstTile = page.locator("#gallery .gallery-tile").first();
  await firstTile.scrollIntoViewIfNeeded();
  await firstTile.click();

  const dialog = page.locator("dialog.lightbox");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(dialog).toHaveAttribute("aria-label", /\S/);

  // The lightbox's own controls exist only while it is open, so they are absent
  // from the exported HTML and can only be checked here.
  expect(await namelessControls(page), "lightbox controls with no name").toEqual([]);

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

test("the gallery page composes every plate and opens the right one", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  const response = await page.goto(`${BASE}/gallery/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("تصویرها، بی‌عجله");
  await expect(
    page.locator('header nav[aria-label="پیمایش اصلی"] a[aria-current="page"]'),
  ).toHaveText("گالری");

  // Every image must survive the banding. A composition that drops the last
  // item when the count is odd loses it silently.
  const tiles = page.locator(".ground-light-deep .gallery-tile");
  const count = await tiles.count();
  expect(count).toBeGreaterThan(0);

  // The plates are laid out in bands, so each tile has a position within its
  // band *and* a position in the gallery. The lightbox needs the second one —
  // passing the band-local index opens the wrong picture, which looks like a
  // working lightbox rather than like a bug.
  const third = tiles.nth(2);
  await third.scrollIntoViewIfNeeded();
  await third.click();
  const dialog = page.locator("dialog.lightbox");
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(dialog.locator(".t-h3")).toHaveText("سرم شب");

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveJSProperty("open", false);

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

test("the about page owns the contact anchor and both inquiry paths", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  const response = await page.goto(`${BASE}/about/`);
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText("چرا مجموعه کوچک است");

  // Exactly one #contact. The footer carried this id through Phase 01 and the
  // footer renders on this page too — two of them is a silent duplicate-id
  // defect that makes the nav anchor land on whichever comes first.
  await expect(page.locator("#contact")).toHaveCount(1);

  // Both inquiry paths of §42, and neither may be a dead "#".
  const chat = page.locator('#contact a[href^="https://wa.me/"]');
  await expect(chat).toHaveCount(1);
  await expect(chat).toHaveAttribute("rel", /noopener/);

  const instagram = page.locator('#contact a[href*="instagram.com"]');
  await expect(instagram).toHaveCount(1);
  await expect(instagram).toHaveAttribute("rel", /noopener/);

  // No link anywhere on the page may be a bare "#": it looks like a link,
  // focuses like a link, and jumps the reader to the top of the page.
  const deadLinks = await page
    .locator('a[href="#"]')
    .evaluateAll((els) => els.map((el) => (el.textContent ?? "").trim()));
  expect(deadLinks, "links pointing at #").toEqual([]);

  const broken = await page.evaluate(
    () =>
      [...document.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth === 0)
        .length,
  );
  expect(broken, "images failing to load").toBe(0);

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("an unknown path serves the styled 404", async ({ page }) => {
  const response = await page.goto(`${BASE}/definitely-not-a-page/`);

  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("این نشانی وجود ندارد");
});
