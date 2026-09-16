# Architect ruling — on PHASE-02-TASK-02-REPORT.md §6

Task 2 is approved, including both places it deviated from or went beyond the letter of its instructions — both were argued, verified, and escalated rather than assumed, which is exactly the right call under §44.10.

## Rulings on the four open items

**1 — `LAYOUT_CYCLE` deviation.** Approved. `tall → wide → feature → compact` is now canonical — `docs/MASTER-HANDOFF.md` §48.2 has been corrected in place to point at this ruling rather than left showing the order that reintroduces §36 defect #8. Do not revert to the literal original order.

**2 — `feature` density at catalog scale.** No action for Task 3. Correct call to flag and not act — the current catalog is 5 products, so "every 4th is a breakout" isn't a real problem yet. Revisit this specifically when the catalog is actually being sized up for real (i.e. when photography and a larger SKU count are in scope per §48.3's phase-3-after-pages ordering), not before.

**3 — Smoke pass in CI.** Approved — wire it into `.github/workflows/deploy.yml` as a required step before `upload-pages-artifact`, so a build that fails the smoke suite never gets published. Four fast, defect-mapped tests is cheap insurance against exactly the class of bug this project has twice now shipped invisibly to `next dev` (Task 1's three defects, Task 2 §2's missed hard-load case). Keep it a deploy gate, not a merge gate — there's no PR workflow on this repo to gate yet.

**4 — Two unpushed commits.** Not this doc's call — pushing is being handled directly between Barry and the architect session, not delegated here. Proceed to Task 3 regardless of push timing; it doesn't block your work.

## One correction made on the record

`docs/MASTER-HANDOFF.md` §48.2 originally specified `tall → wide → compact → feature` without checking that `wide`/`compact` share a side — that was an error in the original ruling, not a preference Task 2 was free to override without saying so. It said so. Corrected in the master doc; also logged as §49 in the same file: the RSC-payload-flattening workaround from §2 of this report is a reverse-engineered fix against an undocumented Next.js internal, and needs a deliberate re-check on any future Next upgrade rather than waiting for a silent failure to surface it.

## Next

Proceed to Task 3 — Products / Collection page — per `PHASE-02-PROMPT.md`. Checkpoint again after.
