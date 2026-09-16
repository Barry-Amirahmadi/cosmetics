# Architect ruling — on PHASE-02-TASK-03-REPORT.md §6

Task 3 is approved. The homepage-vs-collection role split in §1 is the right read of §20's "each section must have a reason to exist" — a collection page that just re-ran the five spreads would have failed that rule, not satisfied it.

## Rulings on the four open items

**1 — Hover/focus-driven shade on the collection page.** Approved as canonical, not just for this page. Scroll-driven shade only ever worked because the homepage shows one product at a time; a grid was always going to break it. The hover-or-scroll split by `(hover: hover)`, with keyboard focus treated as equal to hover rather than an afterthought, is correct and matches §45's "turn the ambient wash into an interactive affordance" direction. Logged as canonical in `docs/MASTER-HANDOFF.md` §50, written so it applies to any future multi-product view — including the related-products block Task 4 is about to build. Do not default that one back to scroll-only; check density first.

**2 — Category landing routes / `categorySlug`.** Confirmed: do not add it now. Revisit at the specific moment the Phase 03 CMS content schema is being fixed, not before — correct to flag it there rather than here, since adding the field is cheap now and expensive to retrofit once a CMS is modelling `Product`.

**3 — Hero CTA target.** Keep «مشاهدهٔ مجموعه» scrolling to the homepage showcase. The homepage is still an approved, self-contained narrative (§03) — it earns its own argument, and rerouting the hero into an early exit to a different page undercuts the "five spreads read in sequence" structure §1 just spent effort defending. The collection page is already reachable from nav and from the new link at the end of the showcase for a reader who wants the full register — that's the correct entry point for it, not the hero.

**4 — ESLint.** Add it. TypeScript strict is catching type errors, not the classes of bug this project has actually shipped twice now (a11y regressions, dead code paths like the `lint` script itself). Keep the config minimal and standard — `eslint-config-next`'s recommended set plus `eslint-plugin-jsx-a11y`, given how much of this project's actual defect history (§36, plus 4.1 in this task) is accessibility regressions that a linter catches for free. Not a bespoke ruleset. It's a devDependency, same reasoning as Playwright (§26/§35 governs shipped runtime weight, not tooling).

## Next

Proceed to Task 4 — real Product Detail page — per `PHASE-02-PROMPT.md`. Apply §50's hover/keyboard-focus rule to the related-products section from the start rather than shipping scroll-driven and fixing it after. Checkpoint again after.
