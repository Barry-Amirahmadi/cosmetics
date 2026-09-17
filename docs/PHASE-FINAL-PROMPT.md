# PARNIAN — Finish the project, end to end, ready to present

You are continuing PARNIAN. This prompt is meant to take the project from where it stands now all the way to "ready to send" — every remaining task, then Phase 03 and Phase 04 at template scope, then a final readiness pass. Nothing after this prompt is expected; when it's done, the project is done.

**Current state:** Phase 01, Phase 02, and Phase 03 shipped and approved. **Phase 04 (SEO + performance baseline) is also complete and ruled on.** Parts 1–3 below are finished. **Part 4 — the final sweep — is the only thing left in this prompt.**

**Before writing any code, read in full:**

1. `docs/MASTER-HANDOFF.md` — all of it, including §47–§53. **§51 is the scope pivot, §52 and §53 are the content-typing and URL-composition rules Phase 03 and Phase 04 just established — read all three if you read nothing else.**
2. `docs/PHASE-04-REPORT.md` and `docs/PHASE-04-RULING.md` — the most recent completed work. If anything about the shade-wash rule, the content-honesty line, or the inquiry CTA pattern is unclear, the Phase 02 task report/ruling pairs have the reasoning behind each.

Do not restart or redesign anything already shipped. §13 (accessibility), §41 (static-export correctness), and the §36 defect list are full-strength regardless of everything below — that discipline is what makes the demo credible, not overhead to cut.

## Resolved since the last prompt

**The WhatsApp number stays a placeholder, permanently, not just for now.** Confirmed directly by the project owner — do not wire a real number at any point in this prompt, including in Part 4. It is meant to demonstrate the inquiry pattern, not receive real messages.

## The scope decision that governs everything below (MASTER-HANDOFF §51)

This site is a **template shown as a portfolio piece** — not a specific business going into production with a real editor. Concretely:

* **No real CMS gets integrated in Phase 03.** No Sanity, no Strapi, no WordPress, no webhook, no hosted account of any kind. The content layer already being typed and source-agnostic (`src/content/*.ts` behind `src/types/content.ts`) *is* the CMS-readiness story — the deliverable is that the architecture visibly could take a CMS without a rewrite, not a working integration proving it.
* **Match effort to "a reviewer opens this and is convinced," not "a client's staff uses this daily."** Every remaining page needs to look complete and professional, but don't accumulate business-specific depth, content volume, or edge-case handling that only a real operating business would need.
* **Phase 04 is a baseline pass, not an audit.** Cover the essentials that make a template look technically credible. Don't build Core Web Vitals tracking infrastructure or chase diminishing-return performance work.
* **Phase 05 (full production QA) doesn't exist as its own phase.** Part 4 below is the template-scope equivalent — a final sweep, not a launch checklist for a site that isn't launching.

## Part 1 — Finish Phase 02 ✅ done

All six tasks complete and ruled on. Nothing left here.

## Part 2 — Phase 03, template scope (per §51) ✅ done

Content audit complete, ruled on. Every export in `src/content/*.ts` is now typed against `src/types/content.ts` (MASTER-HANDOFF §52), accessible names moved into `src/content/ui.ts`, the README carries the content-architecture note. Nothing left here.

## Part 3 — Phase 04, baseline SEO + performance (per §51) ✅ done

Per-route metadata, canonicals (fixed the origin/base-path composition bug, MASTER-HANDOFF §53), sitemap + robots, structured data (deliberately no `offers`/`aggregateRating`/`sameAs` — no commerce, no reviews, §44.1), and a generated OG share card, all complete and ruled on. Nothing left here.

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
