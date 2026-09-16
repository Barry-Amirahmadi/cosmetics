# PARNIAN — Finish Phase 02, then Phase 03 and Phase 04 (template scope)

You are continuing PARNIAN. Phase 01 is shipped and approved. Phase 02 is partway done: Task 1 (static export + deploy), Task 2 (content fallbacks), and Task 3 (collection page) are complete and ruled on. This prompt covers the rest of Phase 02, then moves into Phase 03 and Phase 04 — reframed by a scope decision made after Task 3, below.

**Before writing any code, read in full:**

1. `docs/MASTER-HANDOFF.md` — read all of it, including §47–§51. **§51 is the one that changes what you're about to build — read it first if you read nothing else.**
2. `docs/PHASE-02-TASK-03-REPORT.md` and `docs/PHASE-02-TASK-03-RULING.md` — the most recent completed work and the rulings on it (hover/focus shade rule, hero CTA, ESLint). If anything about the collection page or the shade-wash rule is unclear, also check the Task 1 and Task 2 report/ruling pairs.

Do not restart or redesign anything already shipped. §13 (accessibility), §41 (static-export correctness), and the §36 defect list are full-strength regardless of everything below — that discipline is what makes the demo credible, not overhead to cut.

## The scope decision that changes this prompt (MASTER-HANDOFF §51)

This site is a **template shown as a portfolio piece** — not a specific business going into production with a real editor. Concretely:

* **No real CMS gets integrated in Phase 03.** No Sanity, no Strapi, no WordPress, no webhook, no hosted account of any kind. The content layer already being typed and source-agnostic (`src/content/*.ts` behind `src/types/content.ts`) *is* the CMS-readiness story — the deliverable is that the architecture visibly could take a CMS without a rewrite, not a working integration proving it.
* **Match effort to "a reviewer opens this and is convinced," not "a client's staff uses this daily."** Every remaining page needs to look complete and professional, but don't accumulate business-specific depth, content volume, or edge-case handling that only a real operating business would need.
* **Phase 04 is a baseline pass, not an audit.** Cover the essentials that make a template look technically credible. Don't build Core Web Vitals tracking infrastructure or chase diminishing-return performance work.
* **Phase 05 (final production QA) is not part of this prompt.** Don't build a launch checklist for a site that isn't launching.

## Part 1 — Finish Phase 02

Same checkpoint discipline as before: one task at a time, verify against the real static export (not `next dev`), write a `docs/PHASE-02-TASK-0N-REPORT.md`, stop, wait for a ruling before the next task.

### Task 4 — Product Detail page (replaces the `/products/[slug]` stub)

Product hero, name, short statement, photography, description, key information, related products, an inquiry CTA (§42 — WhatsApp click-to-chat pre-filled with the product name). **Apply §50's hover/keyboard-focus Ambient Shade Wash rule to the related-products block from the start** — it shows multiple products at once, so scroll-driven shade would flicker there exactly as it would have on the collection page. Keep the breadcrumb pattern already fixed in Task 3 (44px hit targets, `next/link`, not raw anchors). Don't invent product attributes or claims that don't already exist in the content model (§44.1).

### Task 5 — Gallery page

Extend the homepage gallery's asymmetric band treatment (§12) rather than inventing a new visual language. Template-scope note: this needs to look like a real gallery experience, not a placeholder grid — but doesn't need more than the images already in `/public/media`.

### Task 6 — About / Contact

Scope against what a template actually needs to demonstrate: a brand story block and the same inquiry architecture as the product pages (§42 — WhatsApp/Instagram primary; a form only with a static-compatible backend, never a custom API route). Don't invent a large amount of brand history — a short, well-written editorial paragraph is more convincing than a padded one for this purpose.

## Part 2 — Phase 03, template scope (per §51)

This is a light pass, not a multi-task phase. In one checkpoint:

1. **Audit, don't build.** Confirm every content type introduced across Tasks 4–6 stayed inside the `src/content/*.ts` / `src/types/content.ts` pattern — no component ended up with hardcoded business copy that should have been a content field (§28). Fix anything that drifted.
2. **Optional, if it's cheap: a short "content architecture" note** (a section in `README.md` is enough, a new doc is not needed) stating plainly that content is modelled through typed, source-agnostic interfaces and swapping in a real CMS is a per-collection data-fetching change, not a component rewrite. This is a presentation asset — it's the kind of thing a reviewer of a template reads to trust the architecture. Skip it if it doesn't fit naturally; don't force it.

No Sanity, no CMS account, no webhook, no new runtime dependency. Report briefly and checkpoint.

## Part 3 — Phase 04, baseline SEO + performance (per §51)

One checkpoint, covering:

* Unique `<title>` and meta description per route (home, collection, each product, gallery, about/contact).
* Open Graph tags, including an OG image (reuse existing art direction/assets — don't commission new ones).
* Canonical URLs, respecting the deployed base path (§41).
* `sitemap.xml` and `robots.txt`, generated at build time (Next's built-in `sitemap.ts`/`robots.ts` conventions work fine under static export).
* Structured data (Schema.org) for `Organization` and `Product` where it's a direct, cheap mapping from data already in the content model — skip it anywhere it would require inventing fields to fill it.
* A basic performance sanity check: no unoptimized asset obviously bloating a page, fonts and images loading as designed (§07, §47), no console errors. Don't build a Lighthouse-tracking pipeline — spot-check and fix anything that's actually wrong.

Report briefly and checkpoint. This is the last checkpoint this prompt asks for — Phase 05 is out of scope, per §51.

## Operating constraints (unchanged from Phase 02)

* Commit locally after each task/part above. **Do not push.** Pushing only happens when you're explicitly told a specific push is the final version to publish — that instruction comes from Barry directly, not from reaching the end of a task list.
* Ask before adding a new runtime dependency (still exactly 3: `next`, `react`, `react-dom`). `@playwright/test` and a linter (§ Task 3 ruling item 4) are the only approved devDependency additions so far.
* Ask before any decision that changes visual identity, taxonomy, or the interaction language in a way nothing in `MASTER-HANDOFF.md` or this prompt already resolves.
* Verify against the real exported static output for every task, the same way Tasks 1–3 did — that discipline has found a real, invisible-in-`next dev` defect in every single task so far.
