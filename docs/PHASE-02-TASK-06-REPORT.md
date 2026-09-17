# PARNIAN — Phase 02, Task 6 Report

**Task:** About / Contact (`PHASE-FINAL-PROMPT.md` Part 1, Task 6).
**Status:** complete. **Phase 02 is finished.** Checkpointing before Part 2.
**Commit:** `35c454c` — **local only, not pushed.**

---

## 1. One page, not two

The brand has one short account of itself and one set of contact details. Split
across two routes, each would be half a page of content with a heading doing the
work the content should — which is what §19's "do not force five pages if the
requirement needs fewer" is about.

So `/about/` carries both, and «تماس با ما» in the nav deep-links to
`/about/#contact`. **The nav is now four real destinations with nothing left
pointing at a homepage fragment**, which is what closing it meant.

There is no closing `CtaSection` on this page, unlike every other. That band's
entire job is to send a reader to the contact block, and this *is* the contact
block.

## 2. Brand copy — what I wrote and what I refused to

The prompt asked for "a short, well-written editorial paragraph" rather than
padded history. Three paragraphs, on **why the collection stays small** — which
is a position the brand can assert about itself.

**There is no founding year, no founder, no laboratory, no "since".** None of it
has been supplied. A portfolio piece that invents a company history to fill an
about page is making the §44.1 mistake in prose instead of in data, and it is
the easiest one for a reviewer to spot.

It is also deliberately *not* a restatement of the four homepage values. Those
say what the brand holds to; this says why the collection is the size it is.

## 3. Contact — §42 in full, and the form question

WhatsApp first, Instagram second, then the direct details as a hairline ledger.
Same WhatsApp number as the product pages, per your standing instruction, with a
general message rather than a product-specific one.

**No form.** One needs a third-party backend to post to, and a custom API route
cannot run on a static host (§41). Wiring a real hosted endpoint is outside what
a presented template needs (§51), and a form that silently posts nowhere is
worse than no form. The mechanism offered is the one that genuinely works.

### 3.1 — Social links were dead, and now are not

Every social link on the site was `href="#"` — a link that focuses like a link
and jumps the reader to the top of the page. They now carry real profile URLs
on the handle `parnian.example`.

`.example` is the IANA-reserved placeholder name, chosen for the same reason the
phone and WhatsApp numbers are unassigned: these must read unmistakably as
stand-ins and **must not resolve to some real account that would then be
associated with a fictional brand.** They are structurally valid links that
demonstrate the pattern and lead nowhere.

### 3.2 — The legal links, and a fabrication I refused

The smoke test caught two more `href="#"` links I had missed: «حریم خصوصی» and
«شرایط استفاده» in the footer.

**I did not write those pages.** A privacy policy and terms of use are the one
category where inventing plausible text is actively harmful — §44.1 rules out
far less consequential fabrications than a made-up legal document. `site.legal`
is now an empty array and the footer hides the row while it is empty; real
entries bring the row back with no change to any component.

**This is a visible change to an approved Phase 01 footer, so flagging it
plainly.** If you would rather keep the links visible, that is a one-line revert
— but they will be dead links again.

## 4. A real bug the move exposed

Taking `id="contact"` off the footer broke the header's active-section marking,
and the failure was instructive.

`useActiveSection` attached its IntersectionObserver **once on mount**. The
header lives in the layout and survives navigation, so the observer was set up
on whatever page loaded first. With `#contact` gone from the footer, that page
no longer contained any of the sections it was looking for, so it returned early
— **and never ran again for the rest of the session.** Navigating to `/about/`
gave you a contact section that the header could not see.

It now re-observes per route, and the measured value is stored with the path it
was measured on so a leftover from the previous page is ignored rather than
cleared from inside an effect.

| | Before | After |
|---|---|---|
| Click «تماس با ما» from the homepage | nothing marked | `دربارهٔ ما=page`, `تماس با ما=location` |
| Scroll back up on `/about/` | — | `تماس با ما` clears correctly |

Worth noting this was only reachable through a client-side navigation. A hard
load of `/about/` worked fine, which is exactly the kind of defect a page-by-page
check misses and Part 4's click-through is for.

## 5. Verification

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | pass, 0 problems |
| `npm run build:pages` | pass — `/about` in the route list, 9 flat payloads |
| Smoke suite, desktop + mobile | **14 passed** |
| `/`, `/products/`, `/gallery/`, `/about/`, 2 product pages × 6 viewports | clean |
| `prefers-reduced-motion` on `/about/` | clean |
| `#contact` count on the about page | exactly 1 |
| Cross-page anchor | lands 96px down against an 81px header — clears it (§36.7) |
| Links pointing at `#` anywhere on the page | 0 |
| Runtime dependencies | still exactly 3 |

The new smoke test asserts both inquiry paths exist and open safely, that
`#contact` is unique, and that no link on the page is a bare `#` — the last of
which is what caught §3.2.

**One measurement note for the record:** mid-verification the about page showed
12 of 18 reveals unfired after a scroll walk. That was my ad-hoc harness driving
the browser faster than IntersectionObserver delivers callbacks on a short page,
not a page defect — `check-viewports`, which waits for network idle and settles
after the walk, reports the page clean at every viewport, and a slower walk
reveals all 18.

## 6. For your ruling

1. **The empty legal row (§3.2).** Confirm, or restore the two links knowing
   they point at `#`.
2. **No «خانه» nav entry.** With every nav item now a real route, nothing in the
   nav points at the homepage — the wordmark does, which is the conventional
   pattern and keeps the nav at four items per §30. Confirm, or add a fifth.
3. **The footer newsletter form still posts to `action="#"`.** Pre-existing from
   Phase 01 and out of this task's scope, so I have not touched it — but it is
   the same class of thing as §3.1. Leave it as a demonstrated pattern, or
   remove it?

## 7. Next

Phase 02 is complete — all six tasks. Part 2, the Phase 03 content-architecture
audit, on your go-ahead.

```bash
npm run lint
npm run build:pages
npm run test:smoke
npm run check:viewports /cosmetics/about/
```
