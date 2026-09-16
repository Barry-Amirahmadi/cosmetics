# PARNIAN — Phase 02, Task 1 Report

**Task:** static export + GitHub Pages deploy pipeline (PHASE-02-PROMPT task 1)
**Status:** complete. Stopping here for the checkpoint the prompt requested.
**Commit:** `2ae935c` (local only — not pushed, per the operating constraints)

---

## 1. What was changed

| File | Change |
|---|---|
| `next.config.ts` | `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`, env-driven `basePath` |
| `.github/workflows/deploy.yml` | **new** — build + publish via `upload-pages-artifact` / `deploy-pages` |
| `public/.nojekyll` | **new** — committed, plus a belt-and-braces `touch out/.nojekyll` in the workflow |
| `package.json` | dropped `start`, added `preview` / `preview:pages` / `media` scripts |
| `scripts/serve-static.mjs` | **new** — zero-dependency static server that emulates a dumb host |
| `src/lib/basePath.ts` | **new** — `withBasePath()` helper (see defect 1) |
| `src/components/ui/EditorialImage.tsx`, `CtaSection.tsx`, `GalleryLightbox.tsx` | image `src` routed through `withBasePath()` |
| `src/app/products/[slug]/page.tsx` | breadcrumb raw anchors → `next/link` |
| `src/components/products/ProductRow.tsx` | `prefetch={false}` on product links |
| `src/app/layout.tsx` | `metadataBase` from `NEXT_PUBLIC_SITE_URL` |

**No new dependencies.** Still exactly 3: `next`, `react`, `react-dom`.

## 2. Decisions taken, with reasoning

**2.1 — Base path is detected, not hardcoded.** This repo has no git remote, so
there is nothing to inspect to determine whether it will be a project site
(`user.github.io/repo-name`) or a user/custom-domain site (root). Rather than
guess, `basePath` reads `NEXT_PUBLIC_BASE_PATH`, and the workflow supplies it
from `actions/configure-pages`, which reports `base_path` correctly for either
case. Locally it defaults to root, and the deployed layout can be reproduced
exactly with `NEXT_PUBLIC_BASE_PATH=/parnian-cosmetics npm run build`.
**No action needed from you — this works for either hosting shape.**

**2.2 — `images.unoptimized: true`, not a build-time pipeline** (the tradeoff the
prompt asked to be flagged). Every image today is a hand-authored SVG, which an
optimizer passes through untouched — a raster pipeline would currently optimise
*nothing* while adding a dependency the project deliberately doesn't have (§26,
§35). The decision only starts to matter when the first real photograph lands,
which per §48.3 is deferred. **Recommend revisiting at that exact trigger, not
before.** Until then `unoptimized` costs nothing real.

**2.3 — `trailingSlash: true`.** Produces `products/shab/index.html` rather than
`products/shab.html`. Directory-index resolution works on any static host
regardless of whether the request carries a trailing slash; the flat form
depends on host-specific extensionless resolution. Worth knowing for Phase 04:
canonical URLs will carry trailing slashes.

**2.4 — `next start` removed.** It cannot run under `output: 'export'`. Replaced
with `npm run preview` (root) and `npm run preview:pages` (subpath), which serve
the actual exported directory.

## 3. Defects found — all three only visible in the real export

None of these are reproducible in `next dev`. This is the concrete argument for
§41's insistence on verifying the export.

**3.1 — Every image would have 404'd on a project site.** `next/image` does not
apply `basePath` to `src` when `images.unoptimized` is set, because that bypasses
the loader that would normally do it. Measured: **26 of 26** image references
emitted as `/media/...` instead of `/parnian-cosmetics/media/...`. Fixed via
`withBasePath()`, applied at the three places an image reaches the DOM. Re-measured
after the fix: **0 unprefixed, 26 prefixed.**

**3.2 — The product breadcrumb navigated off the site.** `/products/[slug]` used
raw `<a href="/">` and `<a href="/#products">`. Raw anchors skip `basePath`
entirely, so on a project site they would have landed on the domain root — i.e.
Barry's portfolio, not this site. Now `next/link`. Verified by clicking it in the
served export: lands on `/parnian-cosmetics/`.

**3.3 — Every product-link prefetch 404'd.** Next 16 writes a dynamic route's RSC
payload to a **nested directory** (`products/shab/__next.products/$d$slug/__PAGE__.txt`)
while the client requests it as a **flat dot-separated file**
(`products/shab/__next.products.$d$slug.__PAGE__.txt`). 32 failed requests per
homepage view, and they were the *only* console errors in the build.

I isolated the cause before acting: it reproduces with `trailingSlash` off and
with no `basePath`, so it is inherent to Next 16's export of dynamic routes, not
caused by any config choice made here. Static routes are unaffected — those get
the flat filename the client expects.

**Resolution: `prefetch={false}` on the two product links.** I took this without
escalating because it is not a tradeoff under current conditions — the prefetch
fails 100% of the time, so disabling it removes 32 wasted round-trips and loses
no working functionality. Navigation itself was never broken. Flagging it here
because it is a workaround for a framework bug: if a future Next release fixes
the path mismatch, reverting is a one-word change, and the reasoning is in a
comment at the call site.

## 4. Verification — against the served export, not `next dev`

Built with `NEXT_PUBLIC_BASE_PATH=/parnian-cosmetics`, served from `out/` by
`scripts/serve-static.mjs`, driven in a real browser.

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run build` (static export) | pass — 9 routes, 5 product pages prerendered |
| Homepage, all 5 product routes, `icon.svg`, media | 200 |
| Every `_next` asset referenced by the homepage | 200, none missing |
| Unknown path → `404.html` | renders the styled Persian page, **HTTP 404** |
| Deep-link hard load on `/products/aram/` | renders correctly |
| Client-side nav + browser Back | both correct, base path preserved |
| Console errors | **0** |
| Failed responses | **0** |
| Broken images at 1440/1280/1024/768/390/375 | **0** |
| Horizontal overflow at those widths | **none** |
| `direction: rtl` resolved | yes at every width |
| `prefers-reduced-motion` | honoured — 0 reveals left hidden |
| `out/.nojekyll` | present |

## 5. Open items for your ruling

**5.1 — Pages source setting.** The workflow uses the GitHub Actions publishing
method, which requires Settings → Pages → **Source: GitHub Actions** to be set
once by hand. It cannot be set from code. Nothing deploys until that is done.

**5.2 — No remote exists yet.** I have not created one and have not pushed —
the operating constraint says never push without being asked. The workflow will
not run until the repo has a remote and a push to `main`.

**5.3 — §44.4's automated verification suggestion.** Everything in §4 above was
verified by a throwaway script. If you want that as a standing Playwright smoke
pass, it is cheap to formalise now that the static-preview server exists — but
it would add a devDependency, so I have not done it. Your call.

**5.4 — Not addressed in this task, still open from the addendum:** analytics
(§44.2), i18n scaffolding (§44.3), performance budget numbers (§44.6), iOS
Safari `<dialog>` testing (§44.7). None block Task 2.

## 6. Next

Task 2 (`layout` and `tone` fallbacks) per the prompt's order, on your go-ahead.

## 7. How to reproduce the verification

```bash
npm run build                 # root-path build
NEXT_PUBLIC_BASE_PATH=/parnian-cosmetics npm run build   # project-site build
npm run preview:pages         # serves out/ at http://localhost:4321/parnian-cosmetics/
```

On Git Bash for Windows, prefix the env-var build with `MSYS_NO_PATHCONV=1` —
the shell otherwise rewrites `/parnian-cosmetics` into a Windows path. The build
fails loudly if that happens, and `serve-static.mjs` now detects and explains it.
