# PARNIAN — Finish the project, end to end, ready to present

You are continuing PARNIAN. This prompt is meant to take the project from where it stands now all the way to "ready to send" — every remaining task, then Phase 03 and Phase 04 at template scope, then a final readiness pass. Nothing after this prompt is expected; when it's done, the project is done.

**Current state:** Phase 01 shipped and approved. Phase 02: Tasks 1–5 complete and ruled on (static export + deploy, content fallbacks, collection page, product detail page, gallery page). Only Task 6 remains before Phase 03 and Phase 04.

**Before writing any code, read in full:**

1. `docs/MASTER-HANDOFF.md` — all of it, including §47–§51. **§51 is the one that changes what you're about to build — read it first if you read nothing else.**
2. `docs/PHASE-02-TASK-05-REPORT.md` and `docs/PHASE-02-TASK-05-RULING.md` — the most recent completed work. If anything about the shade-wash rule, the content-honesty line, or the inquiry CTA pattern is unclear, the Task 1–4 report/ruling pairs have the reasoning behind each.

Do not restart or redesign anything already shipped. §13 (accessibility), §41 (static-export correctness), and the §36 defect list are full-strength regardless of everything below — that discipline is what makes the demo credible, not overhead to cut.

## Resolved since the last prompt

**The WhatsApp number stays a placeholder, permanently, not just for now.** Confirmed directly by the project owner — do not wire a real number at any point in this prompt, including in Part 4. It is meant to demonstrate the inquiry pattern, not receive real messages.

## The scope decision that governs everything below (MASTER-HANDOFF §51)

This site is a **template shown as a portfolio piece** — not a specific business going into production with a real editor. Concretely:

* **No real CMS gets integrated in Phase 03.** No Sanity, no Strapi, no WordPress, no webhook, no hosted account of any kind. The content layer already being typed and source-agnostic (`src/content/*.ts` behind `src/types/content.ts`) *is* the CMS-readiness story — the deliverable is that the architecture visibly could take a CMS without a rewrite, not a working integration proving it.
* **Match effort to "a reviewer opens this and is convinced," not "a client's staff uses this daily."** Every remaining page needs to look complete and professional, but don't accumulate business-specific depth, content volume, or edge-case handling that only a real operating business would need.
* **Phase 04 is a baseline pass, not an audit.** Cover the essentials that make a template look technically credible. Don't build Core Web Vitals tracking infrastructure or chase diminishing-return performance work.
* **Phase 05 (full production QA) doesn't exist as its own phase.** Part 4 below is the template-scope equivalent — a final sweep, not a launch checklist for a site that isn't launching.

## Part 1 — Finish Phase 02

Same checkpoint discipline as before: verify against the real static export (not `next dev`), write a `docs/PHASE-02-TASK-06-REPORT.md`, stop, wait for a ruling before moving into Part 2.

### Task 6 — About / Contact

Scope against what a template actually needs to demonstrate: a brand story block and the same inquiry architecture as the product pages (§42 — WhatsApp/Instagram primary; a form only with a static-compatible backend, never a custom API route). Don't invent a large amount of brand history — a short, well-written editorial paragraph is more convincing than a padded one for this purpose. Remember the WhatsApp number is a permanent placeholder (above) — same one used on the product pages, not a different number.

## Part 2 — Phase 03, template scope (per §51)

This is a light pass, not a multi-task phase. In one checkpoint:

1. **Audit, don't build.** Confirm every content type introduced across Tasks 5–6 stayed inside the `src/content/*.ts` / `src/types/content.ts` pattern — no component ended up with hardcoded business copy that should have been a content field (§28). Fix anything that drifted.
2. **Optional, if it's cheap: a short "content architecture" note** (a section in `README.md` is enough, a new doc is not needed) stating plainly that content is modelled through typed, source-agnostic interfaces and swapping in a real CMS is a per-collection data-fetching change, not a component rewrite. Skip it if it doesn't fit naturally; don't force it.

No Sanity, no CMS account, no webhook, no new runtime dependency. Report briefly and checkpoint.

## Part 3 — Phase 04, baseline SEO + performance (per §51)

One checkpoint, covering:

* Unique `<title>` and meta description per route (home, collection, each product, gallery, about/contact).
* Open Graph tags, including an OG image (reuse existing art direction/assets — don't commission new ones).
* Canonical URLs, respecting the deployed base path (§41).
* `sitemap.xml` and `robots.txt`, generated at build time (Next's built-in `sitemap.ts`/`robots.ts` conventions work fine under static export).
* Structured data (Schema.org) for `Organization` and `Product` where it's a direct, cheap mapping from data already in the content model — skip it anywhere it would require inventing fields to fill it.
* A basic performance sanity check: no unoptimized asset obviously bloating a page, fonts and images loading as designed (§07, §47), no console errors. Don't build a Lighthouse-tracking pipeline — spot-check and fix anything that's actually wrong.

Report briefly and checkpoint.

## Part 4 — Final readiness pass (the last step)

This is not a new feature phase — it's the one full-site check that everything built across every task still holds together as a whole, since each task so far has only verified itself. Do not skip it, and do not add anything new here beyond fixing what it finds.

1. **Full smoke suite + `check-viewports` across every route** — home, collection, every product detail page, gallery, about/contact — at all six viewports, against the deployed base path, on the actual static export.
2. **`npm run typecheck`, `npm run lint`, `npm run build:pages`** — all clean.
3. **Click through the whole site once, start to finish, as a visitor would** — nav, every internal link, the lightbox, both inquiry CTAs (product and about/contact), the collection-page category index, hero → showcase → collection → detail → related products → back. Confirm the WhatsApp placeholder behaves as intended (§ above) rather than looking broken.
4. **`prefers-reduced-motion` and keyboard-only navigation**, once, across the whole site rather than page by page.
5. Write `docs/PHASE-02-FINAL-REPORT.md` summarizing the whole arc briefly — what exists now (page list, route list), what was deliberately left out and why (real CMS, real WhatsApp number, Phase 05-style production hardening), and the full verification table from this pass.

**Do not push, even here.** "Ready to send" means: everything above is done, committed locally, and reported — not that it goes live automatically. Whether and when to push to `origin/main` is Barry's call to make after reading the final report, same as every push before it.

## Operating constraints (unchanged)

* Commit locally after each task/part above. **Do not push**, at any point in this prompt, including Part 4.
* Ask before adding a new runtime dependency (still exactly 3: `next`, `react`, `react-dom`). `@playwright/test` and ESLint are the only approved devDependency additions so far.
* Ask before any decision that changes visual identity, taxonomy, or the interaction language in a way nothing in `MASTER-HANDOFF.md` or this prompt already resolves.
* Verify against the real exported static output for every task — that discipline has found a real, invisible-in-`next dev` defect in every single task so far.
