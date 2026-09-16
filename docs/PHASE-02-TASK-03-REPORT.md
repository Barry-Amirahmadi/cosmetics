# PARNIAN — Phase 02, Task 3 Report

**Task:** Products / Collection page (`PHASE-02-PROMPT.md` task 3).
**Status:** complete. Checkpointing before Task 4, as instructed.
**Commit:** `66ce2e8` — **local only, not pushed.**
**Also closed:** ruling item 3 — the smoke pass is now a deploy gate.

---

## 1. What the page is, and why it is not the homepage again

The homepage showcase and this page render the same five products. That is the
central design problem of the task, not an incidental overlap, so it is worth
stating what separates them:

* **The homepage showcase is the narrative cut.** Five full spreads, read in
  sequence, arguing that the products make a routine. Its heading is «پنج
  محصول، برای یک روتین کامل».
* **The collection page is the register.** The whole catalogue surveyable at
  once, enterable at any point, with an index at the top. Its heading is «همهٔ
  محصولات، کنار هم».

Same content, same rhythm vocabulary, different density and a different job. A
collection page that simply re-ran the five spreads would be the homepage with a
new title, which §20's "each section must have a reason to exist" rules out.

### 1.1 — Extending the rhythm rather than repeating it

The four `layout` values drive this page too, read at collection density. On the
homepage a layout describes a *spread* — one product filling the screen, image
on one side, copy across the gutter. Here it describes how much of the row the
product takes:

| layout | lg span | offset | effect |
|---|---|---|---|
| `tall` | 5 | — | starts the row at the right edge |
| `wide` | 7 | `mt-20` | completes the row, dropped |
| `feature` | 12 | — | full-bleed breakout |
| `compact` | 4 | `mt-28` | deliberately leaves the row short |

5 + 7 tiles a row exactly; 12 is the breakout; 4 leaves three columns of
intentional space. Items are **auto-placed** rather than given explicit column
starts, which matters for two reasons: the composition survives an editor
reordering the collection, and in an RTL document auto-placement begins at the
right edge on its own — there is no mirroring anywhere in the file.

Measured at 1440 on the seed catalogue: `RIGHT, LEFT, RIGHT, LEFT, FULL` — the
same alternation as the approved homepage, no two adjacent products on the same
side. §36 defect #8 stays fixed.

Below `lg` the grid recomposes rather than shrinking (§31): at `md` the row is
half-and-half, and on a phone items take alternating widths and edges — the same
treatment the gallery uses to stop a single column flattening into equal
rectangles. Verified visually at 768 and 390.

### 1.2 — Category as light structure, not a filter

The catalogue is five products in five distinct categories. Every filtering
interface I could have built would return exactly one product per click, and
grouping the page into category blocks would produce five headed groups of one —
the repeated-row template the design exists to avoid.

What the category field actually earns at this size is an **index**: a hairline
contents line under the masthead listing each category and jumping to where it
begins. It is a `<nav>`, because that is what it is.

Three decisions inside that are worth knowing:

* **No `categorySlug` field was invented.** The index anchors to the first
  product of each category's run, and product slugs already exist. Adding a
  parallel slug field, a category registry and `/products/category/<slug>`
  routes would be building a taxonomy system for five products (§35, §40).
  `collectCategories()` returns the same shape a real one would expose, so
  growing into it later is work behind that function, not a page redesign. **If
  you want category landing pages in a later phase, that is the point at which
  the content model needs the extra field — flagging it rather than pre-building
  it.**
* **The collection is not re-sorted into category blocks.** Sequencing is an
  editorial decision here (§28, §48.2), and re-grouping would mean a product
  with no `layout` set got a different arrangement on the collection page than
  on the homepage. The index reports the collection as it is actually ordered.
* **Counts render only when they carry information.** With one product per
  category, printing «۱» five times reads as a rendering fault rather than as
  data. The count appears at two or more; the total is printed once, from the
  data, so it cannot go stale.

## 2. Extending the Ambient Shade Wash — please rule on this

The collection page sits in a `ShadeField` and keeps taking the colour of the
product being looked at. That is the signature extended to a second page, using
the same context, the same registered property and the same two gradients —
nothing in the implementation was touched.

**One thing is genuinely new, so I am flagging it under §44.10.** The homepage
claims the shade on *scroll*, which works because one product occupies the
viewport at a time. A collection grid puts two or three products on screen at
once, and the same rule leaves them fighting over the field and flickering as
the page moves. So on this page:

* where a real pointer exists, the shade follows **hover and keyboard focus**;
* where it does not, the grid is a single column and the homepage's scroll rule
  is correct again — so that is what runs.

`(hover: hover)` decides, once, on mount. This makes the wash an interactive
affordance rather than a passive effect, which is the direction §45 proposes,
but §45 lists it as a creative addition rather than a resolved decision — so it
is yours to confirm. Reverting to scroll-only is a small deletion in
`CollectionItem.tsx`; you would get flicker on desktop back with it.

Verified on both paths (§5.2).

## 3. Navigation — the change that made the page reachable

Building a second page exposed a defect class that could not exist while the
site was one page: **hrefs written as bare hashes.** `#contact` resolves against
whatever page the header happens to be rendered on, so every nav item, the
header CTA and the closing CTA silently pointed at nothing on `/products/`.

Every content href is now written from the site root — `/products/` for a route,
`/#contact` for an in-page target. `next/link` applies the deployment base path
to a root-relative href, so this is also the only form that survives a GitHub
Pages project subpath. Confirmed the homepage's own in-page links still scroll
rather than reload, and still land clear of the sticky header (§36.7): the
target settles 96px down, against an 81px header.

Consequences worth your attention:

* **«محصولات» is now a route; گالری, دربارهٔ ما and تماس با ما are still
  homepage anchors** until tasks 5 and 6 give them pages. The nav is mixed on
  purpose and converges as those land.
* **Active state now distinguishes `aria-current="page"` from `"location"`** —
  the route being viewed versus the section being read. Using `page` for a
  scroll position tells a screen-reader user they navigated somewhere they did
  not.
* **Two small homepage changes**, both wiring rather than redesign: one
  `صفحهٔ مجموعه` link at the end of the showcase, because a reader who has just
  finished it should not have to go back up to the nav; and the closing CTA's
  secondary link now points at the collection. The hero's CTAs are untouched —
  «مشاهدهٔ مجموعه» still scrolls to the showcase, so the homepage's own
  narrative is unchanged. **Say if you would rather the hero went to the
  collection page instead.**
* `CtaSection` takes an optional `secondary` — passing `null` drops it. On the
  collection page that link would point at the page you are already on.

## 4. Two defects found while verifying, both fixed

**4.1 — Breadcrumb hit targets were 20px** on the product detail page, against a
44px minimum. This is §36 defect #4 ("small navigation/footer hit targets")
reappearing on a page Phase 01 shipped as a stub. Fixed with a `.crumb` class on
the same reasoning as the existing `.footer-link` — the height comes from the
link, not from padding on the row. Found by the viewport sweep, not by eye; at
1440 the trail looks perfectly normal.

**4.2 — `npm run lint` has never run.** `next lint` was removed in Next 16, so
the script was being interpreted as a directory argument and failing instantly.
**I removed the dead script rather than leave something that would let a future
session report a lint pass that never happened.** The project has no linter at
all — TypeScript strict is doing all of the static checking. Whether to add
ESLint is a real decision with a devDependency attached, so it is yours; I have
not made it.

## 5. Verification

**5.1 — Responsive sweep.** Added `scripts/check-viewports.mjs` (dev tool, not
part of the smoke suite) — it walks a page at 1440/1280/1024/768/390/375 and
reports horizontal overflow, failed images, interactive targets under 44px,
unrevealed content, console errors and failed requests.

| Page | Result |
|---|---|
| `/` | clean at all six widths |
| `/products/` | clean at all six widths |
| `/products/[slug]` | clean at all six widths *(after 4.1)* |
| `/products/` with `prefers-reduced-motion: reduce` | clean |

One correction on the record: the sweep first reported 12–20 unrevealed elements
on the homepage. That was the harness measuring opacity mid-transition, not a
defect — reveals take 780ms to settle and the walk was ending before they did.
Confirmed zero unrevealed with a settle delay, then fixed the harness. Worth
saying plainly because a tool that cries wolf is worse than no tool.

**5.2 — The signature works on both input paths.** Not assumed — measured, by
reading the computed `--shade` after each interaction:

| Path | Result |
|---|---|
| Hover, desktop | all five tones claim correctly |
| Keyboard focus | claims correctly |
| Scroll, emulated Pixel 7 (`hover: hover` = false) | all five tones claim correctly |

An earlier run of this looked off-by-one. The cause was my test harness: real
Playwright `hover()` had parked the mouse, and scrolling each product into view
fired a real `pointerover` from the stationary pointer a moment after my
synthetic one. The component was correct throughout.

**5.3 — Smoke suite extended and wired into CI** (your ruling, item 3). One new
test covering the collection page, on both projects: it loads, the nav marks the
route current, **every category index anchor resolves to exactly one element**,
and the printed count matches the number of products rendered. Both of those
last two fail silently in a browser — a drifted anchor just means the page does
not move.

**Proved it can fail** before trusting it: broke a category anchor, the test went
red on the anchor assertion; restored it, green. A test that cannot go red is not
a test.

The suite is now a gate in `deploy.yml`, before `upload-pages-artifact`, so a
build that fails it never reaches the site. It runs against the same `out/` that
is about to be uploaded, under the base path `actions/configure-pages` reports,
and uploads its HTML report as an artifact on failure. Also hardened the base
path handling for `"/"`, which is what that action returns for a user/org site
or a custom domain.

**5.4 — Full pass on the final state:**

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run build:pages` | pass — 10 routes, 7 flat payloads |
| Smoke suite, desktop + mobile | **10 passed** |
| Console errors / failed requests | 0 / 0 |
| RSC payloads on `/products/` hard load | all 200 |
| Product side rhythm at 1440 | `RIGHT, LEFT, RIGHT, LEFT, FULL` |
| Heading outline | one `h1`, five product `h2`s |
| Tab order | one stop per product, image link correctly excluded |
| Runtime dependencies | still exactly 3 |

## 6. For your ruling

1. **Hover/focus-driven shade on the collection page (§2).** Confirm, or revert
   to scroll-only and accept the flicker.
2. **Category landing routes.** No `categorySlug` was invented (§1.2). If they
   are wanted in a later phase, the content model needs that field — worth
   deciding before the CMS schema is fixed in Phase 03.
3. **Hero CTA (§3).** «مشاهدهٔ مجموعه» still scrolls to the showcase. Should it
   navigate to the collection page instead?
4. **ESLint (§4.2).** The project has no linter. Add one, or stay on TypeScript
   strict alone?

## 7. Next

Task 4 — the real Product Detail page — on your go-ahead.

```bash
npm run build:pages          # export with the deployed base path
npm run preview:pages        # http://localhost:4321/cosmetics/
npm run test:smoke
npm run check:viewports /cosmetics/products/
```
