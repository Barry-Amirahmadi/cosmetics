# Architect ruling — on PHASE-03-REPORT.md §8

Approved. **Phase 03 is complete.** Verified against the real repo before ruling,
not read-and-trust: all 14 exports in `src/content/sections.ts` are now
explicitly typed (`hero: HeroContent`, `about: AboutContent`, `notFound:
NotFoundContent`, and so on — grepped for `^export const` and confirmed every
line carries an annotation). `src/content/ui.ts` exists. `not-found.tsx` reads
`notFound.eyebrow`/`.heading`/`.lead`/`.action` from `sections.ts` rather than
carrying its own strings. `gallery.viewLabel` is read by `GalleryTile.tsx` now,
not shadowed by a hardcoded duplicate. The README's "Content architecture"
section exists and states the claim exactly as described. And the
`check-viewports.mjs` correction is real — the script reads `args[0] ??
"/cosmetics/products/"` and nothing past it, so the report's "six separate
runs" caveat about its own verification table is accurate, not hedging.

This is the strongest finding of the project so far, not because anything was
broken — nothing was — but because it caught the CMS-readiness claim itself
resting on an inferred type instead of a declared one. That claim is the entire
deliverable of §51's scope pivot. An inferred type is invisible in every normal
workflow: the build stays green, the page renders, a reviewer reading the code
sees a plausible object literal. Only asking "could a CMS supply this and would
anything notice if it couldn't" surfaces it. Good audit.

Logged as durable in `MASTER-HANDOFF.md` §52 — the typed-export rule and the
`sections.ts`/`ui.ts` split are both project-wide conventions now, not just
this checkpoint's cleanup, so any future content addition (Part 3's SEO fields
included) follows them from the start rather than needing another sweep later.

## Rulings on the two open items

**1 — Accessible names in `ui.ts` (§3.1).** Approved, keep them there. The
report's own framing is the right one: this was never a choice between two
valid conventions, it was an inconsistency — three accessible-name fields were
already in the copy deck before this pass, so the alternative isn't "keep
accessible names in components," it's "leave the project applying its own rule
to some strings and not others." §28 draws no line at what a sighted reviewer
happens to see rendered; a string only a screen reader hears is exactly the
kind of thing this project has been correctly paranoid about missing (§36's
history, the `set-state-in-effect` catches in Task 4) — not the kind to leave
out of the content layer.

**2 — `sections.ts` at ~260 lines, split per route or not.** Leave it as one
file for now. A single copy deck is the simpler structure, and §19's
"don't force more pieces than the content needs" cuts the same way here as it
does for page count: one file that is easy to scan beats several thin ones
split for a size that hasn't caused a problem yet. Part 3 will grow it further,
which is a real reason to watch it, not yet a reason to act — if it crosses
roughly 400–450 lines, or if Part 3 or Part 4 catches you scrolling past
unrelated sections to find the one you're editing, split it then, by route.
Noting the threshold here so it isn't a judgment call made fresh under time
pressure later.

## Next

Part 3 — the Phase 04 SEO and performance baseline, per `PHASE-FINAL-PROMPT.md`.
The `og:title`-identical-on-every-route finding from this pass belongs there
directly — fix it as part of the per-route meta pass rather than as a separate
follow-up. Then Part 4, the final full-site sweep and
`docs/PHASE-02-FINAL-REPORT.md`.
