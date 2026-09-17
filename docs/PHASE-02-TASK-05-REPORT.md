# PARNIAN — Phase 02, Task 5 Report

**Task:** Gallery page (`PHASE-FINAL-PROMPT.md` Part 1, Task 5).
**Status:** complete. Checkpointing before Task 6, as instructed.
**Commit:** `068a4db` — **local only, not pushed.**

---

## 1. What makes it a second page rather than the same band again

Six images exist and all six are already on the homepage, so this page had the
same problem the collection page had: it has to earn its existence (§20).

**The difference is scale, not content, and the copy says so plainly** rather
than implying there is more here — the lead reads «همان تصویرها، بزرگ‌تر از آنچه
در صفحهٔ اصلی جا می‌شود». On the homepage they are a wall of tiles you glance
across; here they are plates you look at one at a time, the largest 844px tall.

Everything else is the homepage's own language, per §12: the band structure, the
uneven top edge, the hairline caption, the tile itself, the lightbox. Nothing new
was invented. The one addition is a plate number set as marginalia — «۰۱» — the
way a catalogue numbers its images. It is `aria-hidden`, since the figure below
already carries the title and the caption, and a stray number read aloud before
every picture is noise.

## 2. The composition is generated, not tabulated

The homepage holds a fixed table of six placements. That is correct for a fixed
band and silently wrong on a seventh image — it would render nothing for it.

This page cycles instead: **one plate, then a pair, then one, then a pair**, with
solo bands alternating which edge they hug and pairs alternating their
proportions and which half is dropped. Any number of images composes, and a band
that would be left with a single image becomes a solo rather than a half-empty
row.

**Verified rather than asserted**, since "it scales" is the kind of claim that is
usually only true for the number you tested:

| Images | Result |
|---|---|
| 6 (real) | 6 tiles, 4 bands |
| 8 | 8 tiles, 6 bands — exercises the leftover-single branch |
| 9 | 9 tiles, plate numbers ۰۱–۰۹ continuous |

Nothing dropped at any count.

## 3. Plate width follows the crop — the one real design problem here

The first version sized solo plates at nine columns regardless of the image. On
a 1440 screen that makes a 4/5 crop **1220px tall — taller than the window**, so
the plate can never be seen whole, which is the one thing a gallery plate has to
do. The page also came out at 6583px.

Sizing by crop instead — tall crops take six columns, wide ones take nine — keeps
every plate roughly the same *height* on screen rather than the same width:

| | Before | After |
|---|---|---|
| Tallest plate | 1220px | **844px** |
| Page height | 6583px | 5987px |

Square counts as tall for this purpose: a 1/1 at nine columns is 976px, over the
fold on a laptop exactly as a portrait is.

**Also fixed while measuring:** two `md:col-span-*` classes were landing on the
same element — one from the shared base, one from the placement. Which one wins
is decided by stylesheet order, not by the order they are written, so the
tablet layout was relying on luck. The `md` span now lives only in the
placement.

## 4. One thing that looked like a bug and was not

Mid-verification the plates measured 24px past the container's content edge,
which reads as a horizontal overflow. It was the un-revealed `.reveal` transform
— `translate3d(calc(var(--flow-start) * 1.5rem), …)`, and 1.5rem is exactly 24px
— caught before the reveal had fired. Re-measured after the reveals settle: every
plate flush to one edge, alternating, no overflow. Recording it because the next
person to measure this page will see the same number.

Similarly, a synthetic `KeyboardEvent` for Escape did not close the lightbox on
this page. `<dialog>` answers Escape only on trusted events; a real key press
closes it, which is what the smoke suite uses.

## 5. Navigation

«گالری» is a real route now. The nav is `محصولات` and `گالری` as routes,
`دربارهٔ ما` and `تماس با ما` still as homepage anchors until Task 6 — mixed on
purpose, converging next task.

The homepage gallery band gains one link out to the page, the same role as the
link that closes the product showcase. The closing CTA keeps **both** actions
here, unlike the collection and product pages: from the gallery,
«مشاهدهٔ محصولات» is a real onward step rather than a link back to where the
reader already is.

## 6. Verification

**6.1 — The new smoke test catches a bug that looks like working software.**
Plates are laid out in bands, so each tile has a position within its band *and*
a position in the gallery. The lightbox needs the second; passing the first
opens the wrong picture — and a lightbox that opens *something* looks fine.

Proved it goes red: swapped the global index for the band-local one, and the
test failed with «Expected "سرم شب", Received "درپوش شیشه"». Restored, green.

**6.2 — Full pass:**

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | pass, 0 problems |
| `npm run build:pages` | pass — `/gallery` in the route list, 8 flat payloads |
| Smoke suite, desktop + mobile | **12 passed** |
| `/`, `/products/`, `/gallery/`, 2 product pages × 6 viewports | clean |
| `prefers-reduced-motion` on `/gallery/` | clean |
| Lightbox from the gallery page | opens the right plate, «۳ از ۶», ArrowLeft advances, Escape closes |
| Console errors / failed requests | 0 / 0 |
| Runtime dependencies | still exactly 3 |

## 7. For your ruling

1. **Scale-not-content as the page's reason to exist (§1).** The lead says so
   outright. Confirm, or would you rather it did not draw attention to showing
   the same six images?
2. **The plate number (§1).** A small editorial addition that is not in the
   homepage band. Keep or drop?

## 8. Next

Task 6 — About / Contact — on your go-ahead. That one closes the nav.

```bash
npm run build:pages
npm run test:smoke
npm run check:viewports /cosmetics/gallery/
```
