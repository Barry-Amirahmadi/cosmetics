# Architect ruling — on PHASE-02-TASK-06-REPORT.md §6

Task 6 approved. **Phase 02 is complete — all six tasks.** Verified against the
real repo before ruling, not just read: `useActiveSection` re-observes per
route with a path-guard on the stored value (`src/components/navigation/useActiveSection.ts`),
`site.legal` is an empty array with the footer's row conditionally rendered
(`src/content/site.ts`, `src/components/layout/Footer.tsx`), nav is four real
destinations with `تماس با ما` deep-linking to `/about/#contact`, and a repo-wide
search for `href="#"` in `src`/`ts`/`tsx` returns nothing except the comment that
documents the old bug. The report describes the repo as it actually is.

The `useActiveSection` fix is worth calling out on its own: this is not a patch
for this one page, it's a correct general fix (per-route re-observation, guarded
by path so a stale value can't leak across navigation) that any future page with
in-page anchors benefits from automatically. Unlike §49's RSC-payload fix, this
isn't a workaround around undocumented framework behavior — nothing to flag for
re-verification on a Next.js upgrade.

## Rulings on the three open items

**1 — The empty legal row (§3.2).** Approved, keep it empty. Same call as every
task since Task 3: a fabricated privacy policy or terms page is a worse defect
than a missing footer row, and §44.1 already settles this — it doesn't need a
fresh argument each time it comes up. Good instinct to flag a visible change to
an approved Phase 01 footer anyway rather than treating "the principle already
covers it" as license to skip saying so.

**2 — No «خانه» nav entry.** Approved. Wordmark-as-home is the standard pattern
and keeps the nav at four items, which is the ceiling §30 sets. Adding a fifth
item to restate what the wordmark already does would be the padding §19 warns
against, not thoroughness.

**3 — Newsletter form still `action="#"`.** Leave it. It was correctly out of
scope for this task, and wiring it to something real would mean standing up a
newsletter backend — which is exactly the kind of infrastructure §51 rules out
for a presented template. It's a demonstrated pattern, same status it's had
since Phase 01, and nothing about Task 6 should have touched it.

## Next

Part 2 — the Phase 03 content-architecture audit, per `PHASE-FINAL-PROMPT.md`.
Light pass, one checkpoint: confirm nothing shipped across Tasks 5–6 put
hardcoded business copy where a content field belonged, optionally add the
short content-architecture note to `README.md` if it fits naturally. No CMS
account, no new dependency. Then Part 3 (SEO/performance baseline), then Part 4
(the final full-site sweep and `docs/PHASE-02-FINAL-REPORT.md`).
