# پرنیان / PARNIAN — Phase 01

RTL-first Persian cosmetics site. Homepage prototype plus the design system,
component set and content model the later pages and the CMS will build on.

```bash
npm install
npm run dev      # http://localhost:3210
npm run build
npm run typecheck
```

## Where things are

| Path | What it holds |
|---|---|
| `src/app/tokens.css` | **Every** colour, size, duration and easing. Nothing is hardcoded elsewhere. |
| `src/app/globals.css` | Cascade layers, typography, grid, motion, the ambient-shade signature. |
| `src/app/components.css` | Buttons, nav, gallery, lightbox, form surfaces. |
| `src/content/*.ts` | All copy and imagery. This is what the CMS replaces. |
| `src/types/content.ts` | The content contract. Components read only these shapes. |
| `src/components/` | `layout · navigation · hero · products · gallery · sections · ui · motion` |
| `scripts/generate-media.mjs` | Regenerates the placeholder "material studies" in `public/media`. |

## Three rules for anyone editing this

**1 — Never letter-space Persian.** It is a connected script; tracking severs
the joins. Only `.t-label` carries tracking, and only ever holds Latin text.

**2 — Put new classes in `@layer components`.** Unlayered classes outrank
Tailwind utilities, which is how `lg:hidden` silently stops working. The
cascade order is documented at the top of `globals.css`.

**3 — Direction is a variable, not a hardcoded side.** Use logical properties
(`ms-`, `me-`, `start-`, `end-`) for layout, and `--flow-start` for physical
transforms, which do not flip with `dir`. An English locale should be a change
to one declaration, not a rewrite.

## Replacing the placeholders

- **Copy** — every string is in `src/content`. Files marked `PLACEHOLDER
  CONTENT` contain no factual claim about a real business; all of it is meant
  to be overwritten.
- **Photography** — drop real files at the same paths in `public/media` with
  the same aspect ratios. `EditorialImage` switches from pass-through to Next's
  optimizer automatically once the files are no longer SVG.
- **Contact details** — `src/content/site.ts`. `phone` is the display string in
  Persian digits; `phoneHref` is the dial string. They are separate fields on
  purpose.
