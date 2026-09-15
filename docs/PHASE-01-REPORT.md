# PARNIAN — Phase 01 Handoff Report

**For:** project architect review
**Project:** RTL-first Persian premium cosmetics site
**Status:** Phase 01 complete. Production build passes, `tsc --noEmit` clean, 0 console errors.

---

## 1. Scope delivered

Homepage prototype with the full design system, component set and content model
underneath it. Section sequence as specified: Header → Hero → Product Showcase →
Brand/Values → Gallery → CTA → Footer, plus a Statement band between Hero and
Showcase to break the rhythm.

**One addition beyond the brief, flagged for your ruling:** a stub route at
`/products/[slug]`. The showcase links to it, and a client review landing on a
404 is worse than a thin page. It is assembled *entirely* from homepage
primitives — that is its only purpose, to prove the component set already
carries a second page type without new design work. It is **not** the designed
Page 03. Tell us if you want it removed and the links neutered instead.

## 2. Stack

Next.js 16.3.5 (App Router) · React 19.3 · TypeScript strict · Tailwind CSS v4.

**Runtime dependencies: 3.** `next`, `react`, `react-dom`. No Framer Motion,
no GSAP, no icon library, no utility library, no CSS-in-JS.

39 source files under `src/`.

## 3. Creative direction and why

The brief left palette and typeface open. We deliberately avoided the current
default for this category (cream `#F4F1EA` + high-contrast Latin serif +
terracotta accent). The system is instead named from the subject's own world:

| Token | Hex | Origin |
|---|---|---|
| بُن / bone | `#EAE9E3` | unglazed porcelain — the ground the brand speaks on |
| سُرمه / sormeh | `#141A2B` | Persian kohl, the oldest cosmetic in the region; *سرمه‌ای* is literally a Persian colour word |
| فیروزه / firouzeh | `#5F8A85` | Persian turquoise, desaturated to a mineral sage |

**One accent only.** No pink, no rose gold, no metallic gradient, no florals.

**Signature element — the ambient shade.** Every product carries a `tone` field
in the content model. As a product scrolls into view it claims the section's
ambient colour, which bleeds into two soft gradients behind the showcase. The
page quietly takes the colour of whatever the reader is looking at. Shade is the
organising idea of the cosmetics category, so the effect is tied to the subject
rather than decorative. Implementation is one `@property`-registered custom
property plus one IntersectionObserver — no library, no scroll listener, no
per-frame work. Verified: all five product tones claim the field in sequence.

**Structural device deliberately cut:** numbered `۰۱ / ۰۲ / ۰۳` section markers.
The products are not a sequence, so numbering them would encode nothing.

## 4. Typography

- **Markazi Text** — Persian Naskh with calligraphic contrast. Display only.
- **Vazirmatn** — neutral Persian sans. Body, UI, all small sizes.

A Persian-native display face, not a Latin serif with Persian attached. Both are
fetched at build time and served from our own origin via `next/font` — **no
runtime request to Google**, which matters directly for Iranian users: nothing
third-party to be slow or blocked, and no layout shift.

**Hard rule encoded across the system: Persian never carries letter-spacing.**
It is a connected script and tracking severs the joins. Exactly one class
(`.t-label`) applies tracking, and it only ever holds Latin text. Persian also
gets more line-height than Latin needs (1.95 body, 1.16 display).

## 5. RTL approach

Not `direction: rtl` on an LTR layout. Concretely:

- `<html lang="fa" dir="rtl">`; grid lines are flow-relative, so column 1 is the
  **right** edge natively.
- Layout uses logical properties throughout (`ms-`, `me-`, `start-`, `end-`).
- Physical transforms do **not** flip with `dir`, so motion direction is driven
  by a `--flow-start` multiplier. Content enters from the right. Adding an
  English locale later is one declaration, not a motion rewrite.
- The "next" arrow is drawn along the reading direction and flipped by the same
  axis — it points **left** in Persian.
- Lightbox arrow keys follow reading direction: **ArrowLeft advances.**
- Mobile menu slides in from the right — the side the thumb and eye are on.
- Persian digits throughout (`۱ از ۶`), via a single helper.

## 6. Motion

CSS transitions plus one shared `useInView` hook. Three effects only — a reveal,
an image settle, a hover lift — so the whole site moves with one accent.

Reveals are guarded on `[data-js="on"]`, stamped before first paint. If the
bundle fails or is blocked, nothing is hidden: the page is fully readable rather
than blank.

`prefers-reduced-motion` verified empirically, not assumed: all 58 reveals and
14 image settles render fully visible, transitions ~0, smooth scroll off.

## 7. Responsive

Verified at 1440 / 1280 / 1024 / 768 / 390 / 375. Recomposed, not compressed:

- **Hero:** desktop is type right / photograph bleeding off the left edge. Mobile
  splits into three placeable blocks so the photograph sits *between* headline
  and body copy. Stacking the desktop order would bury the only image below a
  screen and a half of text.
- **Showcase:** four arrangements (`tall · wide · compact · feature`) alternating
  sides R-L-R-L-full, with different spans, crops and vertical offsets.
- **Gallery:** three asymmetric desktop bands with an uneven top edge; on mobile
  a single column with alternating widths and alignments.

## 8. CMS readiness

All copy and imagery live in typed files under `src/content/`. Components read
**only** from the shapes in `src/types/content.ts` — `Product`, `GalleryItem`,
`MediaAsset`, `ValueItem`, `SiteContent`. Swapping the source for CMS fetches is
a per-collection change, not a component change.

Two modelling decisions worth your review:

1. **`layout` is a content field, not code.** Which of the four arrangements a
   product gets travels with the product. An editor reordering the collection
   keeps the designed rhythm instead of producing five identical rows. This does
   put a layout decision in an editor's hands — confirm you want that.
2. **`phone` and `phoneHref` are separate fields.** Display string in Persian
   digits, dial string in Latin. They cannot be derived from one another.

## 9. Defects found and fixed during review

All of these were caught in a real browser, not predicted:

| Defect | Resolution |
|---|---|
| Component CSS outranked Tailwind utilities — `lg:hidden` silently dead, mobile toggle visible at 1440px | Restructured into `@layer base / components / unlayered`; cascade order documented at top of `globals.css` |
| `aspect-ratio` + `max-height` transfers back into width, collapsing the hero's full-bleed frame | Made frame width definite so max-height crops instead of narrowing |
| `--color-ink-3` failed WCAG AA on the deeper sand ground (4.39:1) | Darkened to `#565C6C`; now 5.4:1 on bone, 4.8:1 on bone-deep |
| Footer and menu links were 21px tall | 44px hit areas via a shared class; list gap absorbed so block height barely moved |
| `\D` does not match Persian digits — `tel:` href resolved to empty | Separate `phoneHref` field |
| Persian placeholder forced LTR by `dir="ltr"` on the email input | `dir="auto"` — placeholder RTL, typed address LTR |
| Sticky header covered in-page anchor and keyboard-focus targets | `scroll-padding-block-start` |
| Three of five product images landed on the right — sequence read as a repeated row | Arrangements now alternate sides |
| Section headings left ~800px of dead space at 1440 | Split into a two-part editorial header: heading right, standfirst left, hairline across |
| CTA background photograph invisible (dark image on dark band) | Regenerated at a readable tone; gradient retuned to fall off away from the type |
| Lightbox backdrop translucent over the light gallery; page scrolled behind the dialog | Opaque backdrop; scroll lock |

**Final audit result: 0 contrast failures, 0 undersized touch targets, no
horizontal overflow, correct heading outline, single `h1`.**

## 10. Accessibility

Semantic HTML, logical heading order, skip link, visible focus on every stop
(verified by walking the tab order — ring colour switches automatically on dark
grounds), native `<dialog>` for the lightbox, focus trap and restore on the
mobile menu, `aria-current` on active nav, alt text describing content rather
than filenames, reduced-motion honoured.

## 11. Placeholder content — needs client sign-off

No medical claim, ingredient, certification, award, statistic or result appears
anywhere. Products are named with abstract Persian words plus generic format
labels; descriptions state *when you use it*, which asserts nothing.

**The one item needing a decision:** the four brand-value lines in
`src/content/sections.ts` ("فهرست کامل روی بسته", "بسته‌بندی ماندگار", etc.) are
brand *positions*. They assert nothing verifiable, but they read as commitments
and must be confirmed by the client before launch.

Photography is 15 generated "material studies" — defocused tonal fields in the
brand palette with film grain and one light source from the top-right (the RTL
reading origin). They share one treatment so unrelated slots read as a single
art-directed shoot, and each maps 1:1 onto a real photograph at the same path
and ratio.

## 12. Questions for the architect

1. Keep or remove the `/products/[slug]` stub route?
2. Is `layout` as an editor-controlled content field the right call, or should
   arrangement be derived from position instead?
3. Phase 02 ordering — CMS first, or remaining pages first? Our recommendation
   is **real photography first**, since it is the highest-leverage change and
   will influence crops and section heights before more pages are committed.
4. Target CMS? The content layer is deliberately source-agnostic, but the
   choice affects the image pipeline (`remotePatterns` in `next.config.ts`).
5. Is a consultation-led CTA correct long term, or is commerce coming? Nothing
   in the current brief establishes a store, so no cart or checkout exists.

## 13. How to run

```bash
cd parnian-cosmetics
npm install
npm run dev        # http://localhost:3210
npm run build
npm run typecheck
```
