# PARNIAN — Phase 04 Report (SEO + performance baseline)

**Task:** `PHASE-FINAL-PROMPT.md` Part 3 — baseline SEO and a performance sanity
check, at template scope (§51).
**Status:** complete. Checkpointing before Part 4, the final sweep.
**Commit:** `78d3ef3` — **local only, not pushed.**

---

## 1. The finding underneath the `og:title` one

The brief flagged `og:title` as identical on all six routes. It was, and fixing
it surfaced the reason — and a worse bug sitting next to it.

`actions/configure-pages` reports **two** outputs, and the deploy workflow passes
them in as two variables: `origin` (`https://barry-amirahmadi.github.io`) and
`base_path` (`/cosmetics`). The site lives at the two joined together. The root
layout was building `metadataBase` from the origin alone.

Nothing had gone wrong yet only because no route declared a canonical. The
moment one did, every canonical, `og:url` and sitemap entry would have pointed
at `https://barry-amirahmadi.github.io/products/` — a URL belonging to whatever
else that account publishes. **A canonical pointing at the wrong site is worse
than no canonical**, because it is an instruction to a search engine to index
that page instead of this one.

`src/lib/seo.ts` now joins the two once, and every absolute URL on the site —
canonicals, Open Graph, the sitemap, structured data — is composed from it.

## 2. Per-route metadata

Every route goes through one `pageMetadata()` builder rather than assembling its
own object. Two Next behaviours made that necessary rather than tidy:

- **The title template applies to `<title>` only.** `og:title` does not inherit
  it, which is precisely how the two drifted apart. The builder composes the
  string once and uses it for both.
- **`openGraph` merges shallowly.** A route that declares `openGraph` at all
  stops inheriting the parent's `openGraph.images` — so a per-route OG block
  silently drops the share card unless it repeats it. The builder repeats it.

| Route | `<title>` | canonical |
|---|---|---|
| `/` | پرنیان — مراقبت روزمره از پوست | `…/cosmetics/` |
| `/products/` | مجموعه — پرنیان | `…/cosmetics/products/` |
| `/gallery/` | گالری — پرنیان | `…/cosmetics/gallery/` |
| `/about/` | دربارهٔ ما — پرنیان | `…/cosmetics/about/` |
| `/products/<slug>/` | «نام محصول» — پرنیان | `…/cosmetics/products/<slug>/` |

Product descriptions are `statement` + `description` joined, because either
alone is about fifty characters against a snippet limit near a hundred and
sixty. Both sentences already exist in the copy deck — nothing was written to
fill the field. The homepage got a real `site.seo.description`; it had been
reusing `brand.line`, which is a display string and too short to be a snippet.

The 404 page carries **no canonical** and Next already marks it `noindex`,
which is correct — checked rather than assumed.

## 3. The share card, and why it is the one raster in the project

Every image here is a hand-authored SVG, and **no social crawler renders an SVG
`og:image`** — Facebook, X, LinkedIn and Telegram all ignore it and show no
preview at all. So the card had to be a raster.

`scripts/generate-og.mjs` writes it directly: a PNG encoder on Node's own
`zlib`, about sixty lines. Adding `sharp` or `resvg` to draw one 1200×630
rectangle would have meant a new dependency for a single asset, and the runtime
count stays at three. It is the same art direction as the other studies —
sormeh ground, a defocused tonal mass, light from the top-right — with the brand
mark from `icon.svg` over it. Deterministic: two runs are byte-identical.

It carries no type. Rendering Persian into a generated raster needs a font
pipeline this project does not have, and a Latin-only card for a Persian brand
reads worse than a clean mark.

**Two things measurement changed:**

- The first card had a visible arc across the top right. It was a soft falloff
  that happened to reach exactly zero *inside* the frame — at 8 bits a channel,
  that last contour is an edge. Every mass is a gaussian now, which only ever
  approaches zero, so there is no radius for the eye to find.
- Film grain, like the SVG studies use, costs **401 KB at the faintest visible
  amplitude and 541 KB at theirs, against 95 KB smooth** — per-pixel noise is
  what deflate cannot compress. A 4×4 ordered dither breaks the banding for
  43 KB because it repeats. Final card: **138 KB**.

One card, shared by every route. Per-product cards would be five more abstract
fields differing only in hue; that waits for real photography, which is also
when product images stop being SVGs.

## 4. Sitemap, robots, structured data

**Sitemap** — nine URLs, built from `publishedProducts`, the same list that
drives `generateStaticParams`, so it cannot list an unexported page or miss an
exported one. Drafts are filtered from that list and correctly absent. No
`lastModified` (the only date available is the build's own, which would claim
every page changed on every redeploy), no `changeFrequency` or `priority`
(Google has said publicly it ignores both). An absent field beats a wrong one.

**robots.txt** — generated, with one caveat that should be known rather than
discovered: **a crawler only ever reads `/robots.txt` from the origin root.**
On a GitHub Pages project site this deployment owns `user.github.io/cosmetics/`,
not `user.github.io/`, so this file is served where nothing will look for it.
It is correct for the two deployments that matter for a template — a custom
domain and a user/org site — and needs no change when that happens.

**Structured data** — `Organization` on every page, `Product` on product pages.
What it deliberately does **not** claim is the substance of §44.1 here, because
structured data is the easiest place on a site to assert something false: no
reader ever sees it, and the vocabulary invites filling in a shape.

- **No `offers`.** No price, currency, availability or seller exists, and there
  is no commerce (§40). Google will not render a product rich result without
  one — a fabricated price to earn that snippet is a lie told to a search engine
  about a business.
- **No `aggregateRating` or `review`.** There are none.
- **No `sameAs`.** The social handles are `.example` placeholders; `sameAs`
  asserts the brand *is* those accounts.
- **No `logo`.** No logo asset exists. `image` carries the share card, which is
  what it actually is.

## 5. A performance hypothesis that measurement overturned

Worth writing up because I had it wrong and nearly shipped it.

Four font files are preloaded on every page, 144 KB. Markazi Text is display-only
and every display string on this site is Persian — the Latin wordmark and every
micro-label are `.t-label`, which is Vazirmatn. Walking all six routes for an
element computing to Markazi with Latin text in it finds **none**. So its `latin`
subset looked like 25 KB of dead weight and a render-blocking request for a
glyph that never renders.

Dropping it took preloads to three files and 119 KB — and the browser still
fetched the fourth, now as a late discovery. Dumping the `@font-face` rules
explains why: Markazi's `arabic` subset covers `U+0600-06FF` and friends and
**does not contain `U+0020`**. The space, the em-dash and the rest of general
punctuation are in the `latin` subset. Every Persian heading has spaces in it.

So the "optimisation" removed the *preload* for a file that is always needed,
turning an early parallel fetch into one discovered after layout — the same
bytes, arriving late enough to swap the largest type on the page. **Reverted**,
with the finding written into `layout.tsx` so it is not re-attempted. Verified
after reverting: four fonts fetched, four preloaded, none discovered late.

## 6. The rest of the performance check

| | |
|---|---|
| Total export | 2.5 MB |
| Homepage JS | 597 KB raw → **185 KB gzipped** |
| CSS | 35 KB → 8 KB gzipped |
| HTML, homepage | 60 KB → 12 KB gzipped |
| Fonts | 144 KB, all four preloaded, self-hosted (§07) |
| Console errors, all routes | 0 |
| Share card fetched by the page itself | no — meta tag only |

The JS is Next 16 and React 19's own runtime; there is no application code of
any size here, and nothing to trim without removing the framework. GitHub Pages
serves compressed, so 185 KB is the figure that matters. Images are SVG in the
low single-digit KB. No unoptimized asset is bloating anything.

## 7. New tests, and proving they fail

Three added, all guarding regressions this part makes possible:

1. **Every route's metadata** — title, description, canonical, `og:*` present,
   unique across routes, absolute, and carrying the base path.
2. **Sitemap and robots** — exported, nine entries, no relative `<loc>`.
3. **Structured data** — parses, and asserts the *absence* of `offers`,
   `aggregateRating`, `review`, `sku`, `gtin` and `sameAs`. It is the honesty
   rule in §4 written as a test rather than a comment.

Proved the first can fail: rebuilding with the base path dropped from `siteRoot`
produces `/ canonical carries the base path … Received: https://barry-amirahmadi.github.io/`
— the exact defect of §1.

## 8. Verification

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | pass, 0 problems |
| `npm run build:pages` | pass — 12 routes incl. `/sitemap.xml`, `/robots.txt` |
| Smoke suite, desktop + mobile | **20 passed** (14 before) |
| Six routes × six viewports | clean |
| `prefers-reduced-motion`, `/`, `/gallery/`, `/about/` | clean |
| Titles, descriptions, canonicals | unique per route, base path correct |
| JSON-LD | parses on every route; Organization ×1, Product only on details |
| Runtime dependencies | still exactly 3 |

**One export-only failure found, as in every task so far:** `sitemap.ts` and
`robots.ts` fail the build under `output: "export"` without
`export const dynamic = "force-static"`. Next treats a metadata route as dynamic
by default and refuses to export it. Invisible in `next dev`, which serves both
happily.

## 9. For your ruling

1. **One share card for the whole site (§3)**, rather than per-route cards.
2. **`robots.txt` is inert on a project subpath (§4).** Generated anyway as
   correct-for-the-real-destination. Confirm, or drop the file.
3. **`Product` without `offers` will not produce a Google rich result.** That is
   the honest consequence of having no commerce; flagging it because a reviewer
   who tests the URL in the Rich Results tool will see "not eligible" rather
   than an error, and should know it is deliberate.

## 10. Next

Part 4 — the final full-site sweep and `docs/PHASE-02-FINAL-REPORT.md`, on your
go-ahead. Nothing after that.

```bash
npm run og && npm run typecheck && npm run lint && npm run build:pages
npm run test:smoke
for p in / /products/ /gallery/ /about/ /products/shab/; do node scripts/check-viewports.mjs "/cosmetics$p"; done
```
