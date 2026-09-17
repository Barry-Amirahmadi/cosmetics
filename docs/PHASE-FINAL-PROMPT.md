# PARNIAN — Finish the project, ready to present

You are finishing PARNIAN. **One task remains: Part 4 below, the final full-site readiness sweep.** When it's reported and ruled on, the project is at "ready to send" and nothing further is expected.

**Current state:** Phase 01 (build), Phase 02 (six tasks — pages, gallery, about/contact), Phase 03 (content-architecture audit), and Phase 04 (SEO + performance baseline) are all shipped, verified against the real repo, and approved. Every open question from every one of those checkpoints has been ruled on. Nothing is deferred or pending except Part 4.

**Before writing anything, read in full:**

1. `docs/MASTER-HANDOFF.md` — all of it, including §47–§53. §51 is the scope pivot governing everything (this is a presented template, not a live client site — no real CMS, no real contact info). §52 and §53 are technical rules Phase 03/04 established (every content export is typed; full URLs are always composed through `src/lib/seo.ts`, never assembled ad hoc).
2. `docs/PHASE-04-REPORT.md` and `docs/PHASE-04-RULING.md` — the most recently completed work, so the verification standard this project has held throughout is fresh before the final pass.

Do not restart or redesign anything already shipped. §13 (accessibility), §41 (static-export correctness), and the §36 defect list are full-strength regardless of everything below — that discipline is what makes the demo credible, not overhead to cut.

## Resolved since the last prompt

**The WhatsApp number stays a placeholder, permanently, not just for now.** Confirmed directly by the project owner — do not wire a real number at any point in this prompt, including in Part 4. It is meant to demonstrate the inquiry pattern, not receive real messages.

## The scope decision behind everything already shipped (MASTER-HANDOFF §51)

This site is a **template shown as a portfolio piece** — not a specific business going into production with a real editor. No real CMS was integrated (the typed, source-agnostic content layer *is* the CMS-readiness story). No page carries business-specific depth beyond what convinces a reviewer. Phase 04 was a baseline SEO/performance pass, not an exhaustive audit. This context matters for Part 4 only in that nothing in it should try to add scope back in — the sweep below checks what exists, it doesn't expand it.

## Part 4 — Final readiness pass (the only step left)

This is not a new feature phase — it's the one full-site check that everything built across every task still holds together as a whole, since each task so far has only verified itself. Do not skip it, and do not add anything new here beyond fixing what it finds.

1. **Full smoke suite + `check-viewports` across every route** — home, collection, every product detail page, gallery, about/contact — at all six viewports, against the deployed base path, on the actual static export.
2. **`npm run typecheck`, `npm run lint`, `npm run build:pages`** — all clean.
3. **Click through the whole site once, start to finish, as a visitor would** — nav, every internal link, the lightbox, both inquiry CTAs (product and about/contact), the collection-page category index, hero → showcase → collection → detail → related products → back. Confirm the WhatsApp placeholder behaves as intended (see "Resolved since the last prompt" above) rather than looking broken.
4. **`prefers-reduced-motion` and keyboard-only navigation**, once, across the whole site rather than page by page.
5. Write `docs/PHASE-02-FINAL-REPORT.md` summarizing the whole arc briefly — what exists now (page list, route list), what was deliberately left out and why (real CMS, real WhatsApp number, Phase 05-style production hardening), and the full verification table from this pass.

**Do not push, even here.** "Ready to send" means: everything above is done, committed locally, and reported — not that it goes live automatically. Whether and when to push to `origin/main` is Barry's call to make after reading the final report, same as every push before it.

## Operating constraints (unchanged)

* Commit locally after each task/part above. **Do not push**, at any point in this prompt, including Part 4.
* Ask before adding a new runtime dependency (still exactly 3: `next`, `react`, `react-dom`). `@playwright/test` and ESLint are the only approved devDependency additions so far.
* Ask before any decision that changes visual identity, taxonomy, or the interaction language in a way nothing in `MASTER-HANDOFF.md` or this prompt already resolves.
* Verify against the real exported static output for every task — that discipline has found a real, invisible-in-`next dev` defect in every single task so far.
