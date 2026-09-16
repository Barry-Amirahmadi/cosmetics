# PARNIAN — Phase 02, Task 4 Report

**Task:** real Product Detail page, replacing the `/products/[slug]` stub.
**Status:** complete. Checkpointing before Task 5, as instructed.
**Commits:** `9bd5846` (ESLint), `5e20d78` (the page) — **local only, not pushed.**
**Also closed:** Task 3 ruling item 4 — ESLint is in, and it found five real defects.

---

## 1. The page

Three movements, on alternating grounds, in the rhythm the homepage established:

| | Ground | Contents |
|---|---|---|
| Hero | dark, under the product's own shade | breadcrumb, category, name, statement, tone + transliteration, inquiry CTA, photography |
| Reading | light | body copy on the right, key information as a hairline ledger on the left |
| Onward | dark | related products, then the closing consultation band |

**The hero is the one place on the site where the ambient shade has nothing to
arbitrate.** §50's hover-or-scroll rule exists because several products compete
for one field; with a single product there is no competition, so the field
simply holds that product's tone for the whole section and the wash becomes what
it always wanted to be here — the page's own colour. The related-products block
below it is a separate field, and the two never touch (verified, §4.2).

## 2. The content question, answered explicitly

The prompt says *don't invent product attributes or claims that don't already
exist in the content model.* Taken literally that leaves a detail page with a
name, a category, one sentence and a picture — thinner than the collection page
that links to it. So this is where I drew the line, and it is the thing most
worth your attention in this report.

**What I added — editorial copy fields, the same class of field as
`description` already is:**

* `statement` — one line under the name.
* `body` — paragraphs, as an array so an editor controls the breaks.
* `details` — key information as free label/value pairs.

**What I did not add:** `ingredients`, `volume`, `price`, `skinType`, `pH`,
`certifications`, ratings, stock state, variants. None of that has been
supplied, and a portfolio piece that fabricates product data to look complete is
making precisely the mistake §44.1 is about.

**Every `details` value is restated from that product's own existing
`description`.** Nothing there asserts something the brand had not already said:

| Product | Rows | Source |
|---|---|---|
| سرم شب | زمان استفاده · جایگاه در روتین · روش استفاده | «در پایان روز، روی پوست تمیز. آخرین مرحلهٔ روتین شب.» |
| تونیک آرام | جایگاه در روتین · روش استفاده — **no time-of-day row** | its copy never stated one |

That unevenness is deliberate and I would defend it: a spec table where every
product has exactly the same rows filled in is a table with invented rows in it.
An absent row is more credible than a guessed one.

The `body` and `statement` copy is brand positioning in the established voice —
about *when* and *how* a product is used and why it was written that way. No
result, no benefit, no number, no ingredient anywhere.

**If you want this stripped back**, deleting the three fields and their content
returns the page to name/category/description/photo. Say so and it is a small
revert — but the page will then have less to say than its own listing entry.

## 3. Inquiry — the site's actual conversion point

`https://wa.me/<digits>?text=<encoded>`, prefilled with the product name, so an
inquiry arrives already knowing what it is about rather than making the visitor
retype what the page knew.

Three details worth recording:

* **The number is a separate field in Latin digits** (`site.contact.whatsapp`),
  not derived from `phone`. Persian digits are not matched by `\d` — that is
  §36 defect #5, the one that produced empty `tel:` links in Phase 01.
* **It is deliberately not a real number.** `wa.me` answers an unassigned number
  with "this link is invalid" rather than opening a chat with a stranger, which
  is the correct behaviour for a placeholder.
* **The message is a template with a `{product}` token,** not string
  concatenation — an editor rewriting the greeting never has to think about
  argument order.

The link opens in a new tab with `rel="noopener noreferrer"` and a
visually-hidden «در پنجرهٔ تازه باز می‌شود», because a link that silently
reopens the browser elsewhere is disorienting when you cannot see it happen.

## 4. §50 applied from the start, as instructed

The related-products block is a multi-product view, so it took the hover-or-scroll
rule from the first commit rather than shipping scroll-driven and being fixed
after. It gets it by reusing `CollectionItem` — which is the point of extracting
the rule into `useShadeClaim` rather than leaving it inside the collection page.

**Two decisions inside it:**

* **A fixed even pair, not the products' own `layout`.** The two shown are drawn
  from wherever the reader happens to be in the catalogue, so a layout-driven
  pairing could come out as a full-bleed breakout beside a thumbnail.
* **The heading is «ادامهٔ مجموعه», not «محصولات مرتبط».** With five products in
  five distinct categories, nothing establishes a relation yet. The *rule* is
  built to express one — same category first, then sequence — and it is inert
  today and starts working the moment a category gains a second member. The
  heading does not claim what the data cannot support.

Selection rotates from the product after the current one and wraps, so each page
shows a different pair rather than four of five pages recommending the same two:

```
shab → rooz, narm      rooz → narm, aghaz     narm → aghaz, aram
aghaz → aram, shab     aram → shab, rooz
```

## 5. ESLint, and the five defects it found (ruling item 4)

Added `eslint` + `eslint-config-next` + `eslint-plugin-jsx-a11y`, flat config,
minimal and standard. `next lint` was removed in Next 16, so ESLint is invoked
directly and `npm run lint` works again.

**It paid for itself on the first run.** Five errors, all real, none cosmetic:

| Finding | What it actually was | Fix |
|---|---|---|
| `click-events-have-key-events` ×2, on the lightbox | backdrop-dismiss written as a React `onClick` on the `<dialog>` | moved to a native listener on the element that receives backdrop clicks; Escape was always the keyboard equivalent |
| `no-autofocus` | `autoFocus` on the lightbox close button | removed — `showModal()` already focuses it, so the prop was redundant *and* was teaching the habit |
| `set-state-in-effect` ×2 | reduced-motion and `(hover: hover)` read via `setState` inside an effect | moved to `useSyncExternalStore` |

That last one was a latent bug, not a style complaint. Both capability reads
rendered once with the wrong answer and then never noticed it changing — so a
reader turning on "reduce motion" with the page open, or attaching a keyboard
case to a tablet, kept the stale behaviour. They are now live subscriptions, and
under reduced motion `useInView` creates no observer at all rather than creating
one and immediately overriding it.

Two warnings also fixed: a dead destructured variable in `generate-media.mjs`,
and an anonymous default export in the config itself.

## 6. Verification

**6.1 — Nothing measured by eye.** The WhatsApp link, the heading outline and
the shade behaviour were all read out of the live page:

| Check | Result |
|---|---|
| `wa.me` href | correct number, correctly encoded Persian message containing «سرم شب» |
| `target` / `rel` | `_blank` / `noopener noreferrer` |
| Heading outline | one `h1`, `h2` per section, related products as `h3` |
| Hero shade field | holds the product tone, never disturbed by the block below |
| Related block, hover | claims correctly |
| Related block, keyboard focus | claims correctly |
| Related pairs across all 5 pages | five distinct pairs, no page linking to itself |

**6.2 — Lightbox still correct after the ESLint fixes.** These touched working
Phase 01 code, so I checked the behaviour rather than assuming the refactor was
neutral: opens, focus lands on the close button with `autoFocus` gone, backdrop
click still closes it, body scroll restored on close.

**6.3 — One layout defect found and fixed.** At 1024 the two hero actions
wrapped into a ragged stack — the copy column was ~390px against ~407px of
buttons. The column is now six columns at `lg` and five from `xl`. Measured
after the fix at 1024 / 1152 / 1280 / 1440: on one line at all four.

**6.4 — Full pass:**

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | **pass, 0 problems** |
| `npm run build:pages` | pass — 7 flat RSC payloads |
| Smoke suite, desktop + mobile | **10 passed** |
| All 7 pages × 6 viewports | clean — no overflow, no broken image, no sub-44px target, no console error, no failed request |
| `prefers-reduced-motion` | clean |
| Runtime dependencies | still exactly 3 |

The smoke suite's product test now also asserts the inquiry link is well-formed
and that related products never link back to the page they are on — both fail
silently in a browser, which is the only reason they are worth a test.

## 7. For your ruling

1. **The three content fields (§2).** Confirm, or instruct the strip-back.
2. **«ادامهٔ مجموعه» vs «محصولات مرتبط» (§4).** I chose the honest heading over
   the conventional one. Say if you would rather have the conventional label.
3. **The placeholder WhatsApp number (§3).** Fine as a dead placeholder for a
   template, or should it point at a real account for the portfolio version?

## 8. Next

Task 5 — Gallery page — on your go-ahead.

```bash
npm run lint
npm run build:pages
npm run test:smoke
npm run check:viewports /cosmetics/products/aram/
```
