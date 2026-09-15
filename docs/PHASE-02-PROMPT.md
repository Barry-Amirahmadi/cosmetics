# PARNIAN — Phase 02 Kickoff Prompt

You are continuing development of PARNIAN, an RTL-first Persian premium cosmetics website. Phase 01 (creative direction, homepage, design system) is complete and approved.

**Before writing any code, read in full:**

1. `docs/MASTER-HANDOFF.md` — the complete project spec: creative direction, constraints, architecture rules, and an addendum (§40–48) that resolves scope questions and verifies specific claims against this repository. Where the addendum and the earlier sections disagree, the addendum wins (§46 explains exactly where).
2. `docs/PHASE-01-REPORT.md` — what was actually built in Phase 01, why, and what defects were already found and fixed. Do not reintroduce anything in its defect table.

Do not restart the project. Do not redesign the homepage. Do not introduce a different visual identity, palette, or typeface. You are extending an approved foundation, not replacing it.

## Non-negotiable scope facts (see MASTER-HANDOFF §40 for full reasoning)

* This is a **portfolio/demo project — there is no real client.** Brand copy is fictional but must never read as a real clinical/regulatory/statistical claim (MASTER-HANDOFF §44.1).
* **No commerce.** No cart, no checkout, no payment gateway, ever, unless explicitly instructed otherwise later. CTAs are contact/inquiry intent (WhatsApp + Instagram), not "buy" (§42).
* **Deployment target is GitHub Pages** → Next.js must run in `output: 'export'` mode. No API routes, no Server Actions, no Middleware, no ISR anywhere in this codebase, now or later (§41).

## Task order for this phase

Work through these in order. Do not skip ahead to CMS integration (Phase 03) or SEO/performance passes (Phase 04) in this pass — they come after this list.

### 1. Fix static export + stand up the deploy pipeline (do this first, before any new page)

This is currently broken and unaddressed (MASTER-HANDOFF §47): `next.config.ts` has no `output: 'export'`, `package.json` assumes a running Node server (`next start`), and no `.github/workflows` exists.

* Set `output: 'export'` in `next.config.ts`.
* Set `images.unoptimized: true` (or a build-time image pipeline if you have a strong reason to prefer one — flag the tradeoff before choosing).
* Configure `basePath`/`assetPrefix` correctly for however this repo will actually be served on GitHub Pages (project subpath vs. custom domain vs. user/org root repo — check which applies here before guessing).
* Add a GitHub Actions workflow that builds and publishes the static output.
* **Verify against the real exported static output**, not just `next dev` — confirm internal links, images, and the `/products/[slug]` route resolve correctly once actually served statically, including a working 404 page.

### 2. Small content-model fallbacks (cheap now, do while you're already in these files)

* Add a deterministic `layout` fallback (cycle `tall → wide → compact → feature` by position) for a product where an editor hasn't set one (MASTER-HANDOFF §48.2).
* Add a neutral fallback `tone` for the same reason (§44.9). Neither case exists in the current 5 seed products, but a future CMS editor will hit both.

### 3. Products / Collection page

A premium product discovery experience. Not a standard equal-card ecommerce grid (§10) — extend the existing editorial rhythm (`tall/wide/compact/feature`) to a full collection view. Support the category field already on each product (`سرم`, `مرطوب‌کننده`, `روغن`, etc.) as light structure, not a heavy filter UI, given the current catalog is 5 products (§40 — architect the taxonomy so it *can* grow, don't over-build filtering for a catalog this size today).

### 4. Real Product Detail page (replace the `/products/[slug]` stub)

The stub is deliberately thin (MASTER-HANDOFF §15, §48.1) — assembled from homepage primitives, existing only to avoid a 404. Build the real version: product hero, name, short statement, photography, description, key information, gallery if warranted, related products, and an inquiry CTA per §42 (WhatsApp click-to-chat pre-filled with the product name, not "add to cart"). Only use information that actually exists — do not invent product attributes.

### 5. Gallery page

An immersive editorial image experience, extending the homepage gallery's asymmetric band treatment rather than introducing a new visual language.

### 6. About / Contact

Scope this against what the brand actually needs (§19) — do not force a page that has nothing real to say. The contact mechanism is the inquiry architecture from §42 (WhatsApp/Instagram primary; a form only if you have a static-compatible backend for it, e.g. Formspree/Web3Forms — never a custom API route, it will not run on GitHub Pages).

## Verification loop (every task above, not just at the end)

Run, in order, before calling any task done: `npm run typecheck` → `npm run build` (confirm it's actually the static-export build, per Task 1) → check the browser at each of 1440/1280/1024/768/390/375 → check RTL (this is native, not `dir="rtl"` bolted on — verify grid, motion direction, and icon/arrow direction, not just text alignment) → check `prefers-reduced-motion` → check console for errors → check keyboard focus order and the lightbox focus trap if touched.

If the answer to any of MASTER-HANDOFF §34's self-review questions is no, fix it before moving to the next task.

## Operating constraints

* **Ask before adding a new runtime dependency.** The project has exactly 3 (`next`, `react`, `react-dom`) by design (§26, §35) — that is a deliberate constraint, not an oversight.
* **Ask before any decision that changes visual identity, taxonomy, or the interaction language** in a way neither MASTER-HANDOFF nor this prompt already resolves (§44.10) — this prompt is deliberately not exhaustive on every micro-decision.
* **Never push to a git remote without being asked.** Commit locally as you complete each numbered task, with a message describing what changed and why, in the same style as this repo's existing history if any exists.
* **Do not touch the Ambient Shade Wash implementation, the color tokens, or the typography system** except where a task above explicitly requires extending them to a new page — these are the approved Phase 01 signature and are out of scope for redesign.

Report back after Task 1 specifically, before continuing to Task 2 — the static-export fix is foundational and worth a checkpoint before more code is built on top of it.
