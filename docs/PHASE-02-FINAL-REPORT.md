# PARNIAN — Final report

**Task:** `PHASE-FINAL-PROMPT.md` Part 4 — the full-site readiness pass, and the
summary of the whole arc.
**Status:** complete. **One open decision**, in §7.
**Local only, not pushed.** Whether and when to push is yours.

---

## 1. What this pass was for, and what it found

Every task before this one verified itself. That is the right unit of work and
it has a blind spot exactly the shape of this pass: **a thing that is on every
page belongs to no page, so no page-scoped check ever owns it.** Both defects
found here live in that gap, and both had survived ten checkpoints.

### Finding A — the mobile menu stranded the visitor on the primary CTA. **Fixed.**

The panel has six internal controls. Four of them — the nav links — carried
`onClick={onClose}`. The brand lockup and the «دریافت مشاوره» button did not.

Tapping either navigated the route underneath while the full-screen panel stayed
over the whole viewport, with `document.body.style.overflow = "hidden"` still
set — so the page behind could not be scrolled either. The only way out was to
find the ✕. On a phone, «دریافت مشاوره» is the site's **primary call to
action**, and §42 makes the inquiry moment this site's only conversion point.

Underneath it was a second, quieter bug: `Button` declared an `onClick` prop and
applied it only in its `<button>` branch. For a link it accepted the prop and
dropped it — so even passing `onClose` explicitly would not have worked, and
nothing would have said so.

Why nothing caught it: the menu was verified in Task 1 by opening it and closing
it with the ✕ and with Escape. Leaving it by *navigating* is what a visitor does
and what no test did.

Fixed in three places — `Button` honours `onClick` on links, `Wordmark` accepts
one, `MobileMenu` passes `onClose` to both. All six controls now close the panel
and release the scroll lock.

**Guarded**, per §52's instruction to extend the suite rather than re-derive it:
a new smoke test walks *every* internal control in the panel, not the two that
were broken — the defect is one control forgetting, so the check has to be the
whole set. Proved it fails on the defect before trusting it passing: reverting
one line produces `/cosmetics/about/#contact left the panel open`, naming the
control.

### Finding B — the footer newsletter form submits into the URL bar. **Not fixed — §7.**

The footer carries a newsletter field on every page. It is a real `<form>` with
`action="#"` and no `method`, so submitting does a native GET to the current
page. Measured, not inferred:

```
before  http://localhost:4321/cosmetics/
after   http://localhost:4321/cosmetics/?email=barry%40example.com
scrollY 0          (the visitor was at the footer)
field   ""         (cleared)
message none       (no success, no error, no aria-live)
```

Four things go wrong at once: the page reloads, scroll position is lost, **the
typed email address lands in the URL** — and therefore in browser history and in
any outgoing referrer — and the visitor gets no indication whether anything
happened. It is on every route, including the 404.

The code comment says the endpoint is "a Phase 02 decision." Phase 02 is
finished and the decision was never made.

**Why this one is not fixed and Finding A is.** Finding A had a correct
behaviour already established inside the same component — four controls closing
the panel — so the fix was to make the outliers match, which decides nothing.
Finding B has no established behaviour to match: every available fix invents
something (remove the block, fake a success state, or wire a real endpoint), and
each changes the footer's composition or the interaction language. That is
precisely the case §44.10 and this prompt's escalation rule reserve for you.
Recommendation and options in §7.

### Not a defect, checked and cleared

- **`alt=""` on `cta-field.svg`.** Flagged by a first pass of my own sweep; it
  is correct. The CTA backdrop is decorative and carries `aria-hidden="true"`
  alongside the empty alt, which is exactly how a decorative image should be
  hidden from a screen reader. The check was miscalibrated, not the markup.
- **The 404 route "failing" `check-viewports`.** The harness counts any response
  ≥ 400 as a defect, and a 404 page is supposed to return 404. The page itself
  is clean at all six viewports; the smoke suite asserts the status separately.
- **`wa.me` reachability.** Attempted and **not verifiable from this machine** —
  DNS here resolves `wa.me` to an unroutable address. Recorded as unrun rather
  than reported as a pass. Everything about the link that *can* be checked
  locally is checked: digits-only number, the documented placeholder value, the
  product name filled into the message, no unsubstituted `{product}` token.

---

## 2. What exists

Nine content routes plus three generated files, all statically exported.

| Route | Page |
|---|---|
| `/` | Home — hero, statement, showcase, brand/values, gallery, CTA |
| `/products/` | Collection — category index, editorial grid, all five products |
| `/products/shab/` | Product detail — سرم شب |
| `/products/rooz/` | Product detail — کرم روز |
| `/products/narm/` | Product detail — روغن صورت نرم |
| `/products/aghaz/` | Product detail — پاک‌کنندهٔ آغاز |
| `/products/aram/` | Product detail — تونیک آرام |
| `/gallery/` | Gallery — plate composition, `<dialog>` lightbox |
| `/about/` | About + contact, owning the `#contact` anchor |
| `/404` | Styled 404, served as `404.html` |
| `/sitemap.xml` · `/robots.txt` · `/icon.svg` | Generated |

**Content layer** — `src/content/*.ts` behind explicit interfaces in
`src/types/content.ts`; `sections.ts` is the brand's copy deck, `ui.ts` the
interface strings, `products.ts` the catalogue with draft filtering. Every
export is annotated, never inferred (§52), so deleting a field fails
`typecheck` rather than silently building.

**Runtime dependencies: three** — `next`, `react`, `react-dom`. Unchanged since
Phase 01. Every image is a hand-authored SVG except the one generated share
card; there is no animation library, no state library, no image pipeline.

**Export:** 2.24 MB · 12 HTML · 15 JS · 17 SVG · 7 woff2 on disk.

## 3. What was deliberately left out

| Left out | Why |
|---|---|
| **A real CMS** | §51. The deliverable is that the architecture *visibly could* take one — typed, source-agnostic content behind an interface — not an integration proving it. Sanity, Strapi and WordPress were all considered and none is wired. |
| **A real WhatsApp number** | Confirmed by you as a **permanent** placeholder. `989000000000` demonstrates the inquiry pattern; `wa.me` answers an unassigned number with its own invalid-link page rather than opening a chat with a stranger. |
| **Real contact details** | `hello@parnian.example`, `۰۲۱ — ۰۰۰۰ ۰۰۰۰`, `@parnian.example`. Deliberately non-resolving, same reasoning. |
| **Commerce** | §40. No cart, no checkout, no payment, no price anywhere — including in the structured data, where `offers` is the field that would have earned a Google rich result. |
| **`offers`, `aggregateRating`, `review`, `sameAs`, `logo`** | §44.1 applied to structured data. None of it exists, and a machine-readable claim nobody sees is the easiest place on a site to lie. |
| **Phase 05 production hardening** | §51 puts it out of scope until this stops being a template and becomes a launch. No analytics (§44.2, decided: none), no error monitoring, no uptime checks, no CWV tracking. |
| **Per-route share cards** | Ruled on after Phase 04: five near-identical abstract cards differing only in hue would be manufactured variety. Revisit when real photography exists. |
| **English / i18n routing** | §44.3. Persian-only, RTL-native. |
| **Dark mode** | §44.11, explicitly out of scope. |

## 4. Verification — this pass, on the real static export

Everything below ran against `out/` served off disk by `scripts/serve-static.mjs`
under the deployed base path `/cosmetics`, never against `next dev`.

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | pass, 0 problems |
| `npm run build:pages` | pass — 14 pages, 12 routes |
| `postbuild` RSC flatten (§49) | 9 flat payloads written |
| Smoke suite, desktop + mobile | **21 passed, 1 skipped** (20 before) |
| Nine routes × six viewports | clean — overflow, broken images, sub-44px targets, unrevealed elements, console errors, failed requests |
| Same nine routes, `prefers-reduced-motion` | clean — 0 unresolved reveals, 0 transitions over 100ms |
| Link graph — 308 anchors across 9 routes | every internal target 200; every `#anchor` exists on its destination; no link escapes the base path |
| Every off-site link | `target="_blank"` + `rel="noopener noreferrer"` |
| Journey: hero → showcase → detail → related → back → breadcrumb → collection | each step lands where it says |
| Category index, all five entries | each clears the sticky header (§36.7) |
| Lightbox | opens on the tile clicked, next advances, **ArrowLeft advances** (§44.8), Escape closes, scroll restored |
| Mobile menu, all six internal controls | navigates **and** closes **and** releases the scroll lock — *this is Finding A* |
| Keyboard, all nine routes | skip link first, targets `#main`; 228 controls total, every one named and every one showing a focus ring |
| Headings | exactly one `h1` per route, no skipped levels |
| Duplicate element ids | none on any route |
| `lang="fa" dir="rtl"` | every route including 404 |
| `alt` attribute on every `img` | present everywhere; the one empty alt is the decorative CTA backdrop |
| `tel:` / `mailto:` | Latin digits, valid addresses (§36.5) |
| Console errors | **0**, every route |
| Runtime dependencies | **3** |

### Weight, measured over the network per route

| | raw | over the wire |
|---|---|---|
| Homepage, everything | 860 KB | **353 KB** |
| — scripts (10) | 667 KB | 167 KB |
| — fonts (4, all preloaded) | 144 KB | 144 KB, cached site-wide after the first page |
| — stylesheet | 35 KB | 8 KB |
| — document | 67 KB | 12 KB |
| — images (SVG) | 3 KB | 3 KB |
| Other routes | — | 346–360 KB |

**One handoff target is not met, and it is worth saying so plainly.** §44.6 sets
total JS under ~150 KB gzipped on the homepage; the measured figure is **167 KB**.
Of that, application code is at most ~25 KB — the three largest chunks (152 KB
of the 167) contain React 19's reconciler and Next 16's client router, and carry
no PARNIAN code at all. It is the framework's floor, not accumulated weight, and
the only way under the number is a different framework. Flagged rather than
optimised, since §44.6 itself says to have *a* number and adjust it on real
measurements.

## 5. Where the discipline paid, across the whole project

Every task found at least one defect that was invisible in `next dev`. Kept as a
list because the pattern is the point:

| Task | Invisible until the export was served off disk |
|---|---|
| 02·1 | unprefixed image paths, breadcrumbs escaping the site, 404ing RSC payloads |
| 02·2 | dynamic-route RSC payloads written to a nested name the client never requests (§49) |
| 02·3 | scroll-driven shade flickering once several products share a viewport (§50) |
| 03 | 12 of 16 content exports typed only by inference — deleting a field left the build green (§52) |
| 04 | `origin` without `base_path` in every absolute URL (§53); metadata routes refusing to export without `force-static` |
| 04 | a font "optimisation" that measurement reversed — Markazi's `arabic` subset has no `U+0020` |
| **Part 4** | **two controls leaving the mobile menu open with the page scroll-locked** |

## 6. Repo state

Committed locally. **Not pushed** — 23 commits ahead of `origin/main`, same as
every checkpoint before this one. Nothing about this pass changes that; pushing
is your call after reading this.

## 7. The one open decision

**The footer newsletter form (Finding B).** It is visitor-facing and it is on
every page, so it wants a ruling rather than a note. Three options:

1. **Remove the block.** The reading §42 supports most directly — "a contact
   form … must post to a third-party static-compatible form backend", and none
   may be wired here, so by elimination it should not exist. §51 agrees
   separately: a mailing list is machinery only a currently-operating business
   needs. Costs a column of the four-column footer grid, which is why this is
   your call and not mine.
2. **Client-side success state.** Prevent the submit, clear the field, show the
   confirmation the real form would. Keeps the composition and demonstrates the
   pattern the way the WhatsApp placeholder does — but unlike `wa.me`, which
   fails honestly on an unassigned number, this tells a real visitor they
   subscribed when nothing recorded it.
3. **Wire a real endpoint** (Formspree, Web3Forms). Needs an account and starts
   collecting real addresses for a brand that does not exist.

**Recommendation: 1.** It is the only option that neither invents a claim nor
collects anything, and it is a deletion — trivially reversible if a real brand
ever wants the list back. But the footer composition is visual identity, so it
is yours to decide.

Whichever you pick, the fix is minutes of work. Everything else in this report
is done.

```bash
npm run og && npm run typecheck && npm run lint && npm run build:pages
npm run test:smoke
node scripts/check-viewports.mjs /cosmetics/
```
