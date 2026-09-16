# PARNIAN — Phase 02, Task 2 Report

**Task:** content-model fallbacks for `layout` and `tone` (PHASE-02-PROMPT task 2),
plus the Playwright smoke pass approved in `PHASE-02-TASK-01-RULING.md` §5.3.
**Status:** complete. Checkpointing before Task 3, as instructed.
**Commits:** `48e5a40`, `f63a5a8` — **local only, not pushed.** `main` is 2 ahead of `origin/main`.

---

## 0. One ordering note first

Your ruling asked for the smoke pass **before** Task 2. That file landed in the
repo while Task 2 was already in progress, so I did Task 2 first and the smoke
pass immediately after. Nothing was lost — the baseline it locks in now covers
the post-Task-2 state, and I verified the suite can actually fail (§4.3) rather
than assuming a green run meant anything. Flagging it so the sequence in the
history is not mistaken for me ignoring the instruction.

## 1. Content-model fallbacks

`tone` and `layout` are now **optional** on `Product`, and a new `ResolvedProduct`
type guarantees both are present. Components consume `ResolvedProduct` only, so
no component carries a `?? fallback` and the defaulting rules live in exactly
one place — `src/content/resolveProducts.ts`.

Splitting the authoring shape from the rendering shape matters more than it
looks: it means a CMS adapter in Phase 03 can hand raw records straight to
`resolveProducts()` and everything downstream is already guaranteed.

**Ordering constraint worth knowing:** drafts are filtered **before** resolving,
never after. The `layout` fallback is positional, so resolving a list that still
contained drafts would shift the arrangement of every product following a hidden
one. This is enforced in `publishedProducts` and documented at the call site.

### 1.1 — Unset `tone`

Resolves to `#2A3550`, a near-neutral deepening of the dark ground rather than
an invented colour. Rationale: a product whose shade nobody chose should read as
having *no particular atmosphere*, not the wrong one. It is also darker than the
ground it washes over, so it cannot reduce text contrast — the fallback can
never become an accessibility problem. Kept in sync with the `@property --shade`
initial value in `tokens.css`.

### 1.2 — Unset `layout` — I deviated from §48.2, deliberately

**§48.2 prescribes `tall → wide → compact → feature`. I did not use that order.**

`wide` and `compact` both sit on the **left** of the grid. Placing them
adjacently produces two consecutive left-hand images — which is exactly
§36.8, *"incorrect product image-side alternation"*, the defect found and fixed
in Phase 01 and listed as one that must not be reintroduced.

So the two instructions conflict, and I took §36.8 as the tiebreak since it
states an outcome to preserve while §48.2 states a mechanism to reach it.

**Shipped cycle: `tall → wide → feature → compact`.** Moving `feature` between
them keeps all four arrangements, keeps the cycle length at four, and guarantees
no two neighbours share a side — including across the wrap back to the start:

```
tall(right) → wide(left) → feature(full) → compact(left) → tall(right) → …
```

Verified empirically over 11 products (the 5 real ones plus 6 temporary ones
with no `layout` set): **zero adjacency violations.** If you want the literal
§48.2 order instead, it is a one-line change to `LAYOUT_CYCLE` — but it will
reintroduce §36.8, so I would want that instruction confirmed explicitly.

**Observation, not a change:** a four-cycle containing `feature` means a
full-bleed breakout every fourth product — 3 of them in a 12-product catalog.
`feature` reads as a breakout precisely because it is rare, so at catalog scale
that may dilute it. Not acted on, since §48.2 specified a four-cycle. Worth a
decision before the catalog grows past the current 5.

## 2. A Task 1 defect that Task 1's verification missed

Task 1 reported the dynamic-route RSC payload mismatch as resolved by
`prefetch={false}`. **That was incomplete, and my verification had a hole in it.**

I checked hover → click → back, which passes with prefetch disabled. I did not
check a **direct** load of a product page — and that still produced one 404 per
page view, because the router fetches the segment payload on hard load too, not
only on prefetch. Measured after the fact:

| Route type | RSC requests | Result |
|---|---|---|
| Static (homepage) | 3 | all 200 |
| Dynamic (product) | 5 | 4× 200, **1× 404** |

**Root cause, restated precisely:** Next 16 writes a dynamic route's payload to a
nested directory —
`out/products/shab/__next.products/$d$slug/__PAGE__.txt` — while the client
requests it as a flat, dot-separated filename —
`out/products/shab/__next.products.$d$slug.__PAGE__.txt`. Static routes already
get the flat name. A Node server bridges the gap; a static host cannot.

**Now fixed at the cause.** `scripts/flatten-rsc-payloads.mjs` runs as a
`postbuild` step and copies each nested payload to the flat name beside it. The
originals are left untouched, so nothing that already worked can break. With the
cause fixed, `prefetch={false}` was reverted — prefetch now works properly
rather than being switched off.

This is reverse-engineered from an internal convention, so the failure mode
matters: if a future Next release changes it, the script finds nothing, writes
nothing, and behaviour reverts to today's 404. **It cannot make the output
worse.** Flagging it as something to re-check on a Next upgrade.

| | Before | After |
|---|---|---|
| Hard load of a product page | 1× 404 | **0** |
| Hover prefetch | disabled | **25 requests, all 200** |

## 3. Smoke pass (ruling §5.3)

Four tests, run on desktop and mobile, against the **served export** — not
`next dev`, since that is the only place these defects were ever visible.

| Test | Guards against |
|---|---|
| Homepage renders, RTL resolves, every image loads, no overflow | unprefixed image paths; RTL regressions |
| Lightbox opens, closes on Escape | interaction regressions |
| Product route hard-loads under the base path, breadcrumb points inside the site | the RSC 404; raw anchors escaping the site |
| Unknown path returns a real 404 | static-host 404 handling |

Every assertion maps to a defect that actually happened. Kept deliberately small
per your "don't scope-creep this into full coverage" — it should grow when pages
are added, not speculatively.

**Not wired into CI.** The workflow currently builds and deploys without running
it. Adding it is straightforward but was outside what §5.3 asked for — say the
word and it becomes a gate before deploy.

## 4. Verification

**4.1 — Behaviour preserved.** The refactor must not change the approved Phase 01
rendering, so I measured it rather than eyeballing:

- Product side rhythm: `RIGHT, LEFT, RIGHT, LEFT, FULL` — **identical** to Phase 01.
- All five product tones unchanged (`#3E4C6B`, `#B9C4BD`, `#C99A5B`, `#7FA3A0`, `#9D8FA8`).

**4.2 — Fallback path actually exercised.** The case doesn't exist in the seed
data, so I temporarily added products with neither field, verified, and removed
them. A 6th product resolved to `wide` and `#2A3550` exactly as designed; its
detail page returned 200 with the fallback swatch and no broken images.

**4.3 — The suite can fail.** Reverted `withBasePath()` to a no-op: the homepage
test failed with "images failing to load — Received: 15". Restored: passes. A
green suite that cannot go red proves nothing, so this was worth confirming.

**4.4 — Full pass on the final state:**

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run build:pages` | pass — 9 routes, 6 flat payloads written |
| Smoke suite (8 tests, desktop + mobile) | **8 passed** |
| Console errors | 0 |
| Failed requests | 0 |
| Broken images / overflow at 1440/1280/1024/768/390/375 | 0 / none |
| `prefers-reduced-motion` | honoured |
| 404 page | HTTP 404, styled |

## 5. Also changed

- **`preview:pages` pointed at the wrong base path.** It said
  `parnian-cosmetics`; the repo is `Barry-Amirahmadi/cosmetics`, so Pages will
  serve the site under `/cosmetics`. Corrected. **The deployed build was never
  affected** — CI takes the base path from `actions/configure-pages`, so it was
  always going to be right; only local verification was pointed at the wrong
  subpath.
- **`scripts/build-pages.mjs`** — reproduces the deployment build locally.
  Neither `cmd.exe` nor Git Bash can set `NEXT_PUBLIC_BASE_PATH` inline
  correctly, and Git Bash silently rewrites `/cosmetics` into a Windows path.
- **`@playwright/test` added as a devDependency.** Runtime dependencies are
  still exactly three: `next`, `react`, `react-dom`.

## 6. For your ruling

1. **The `LAYOUT_CYCLE` deviation (§1.2).** Confirm the reordered cycle, or
   instruct the literal §48.2 order knowing it reintroduces §36.8.
2. **`feature` density at catalog scale (§1.2).** A full-bleed breakout every
   4th product — accept, or change the cycle length once the catalog grows?
3. **Smoke pass in CI (§3)?** Currently local-only.
4. **Two unpushed commits.** I have not pushed, per the operating constraint.
   Say the word and they go up; the workflow will then deploy them.

## 7. Next

Task 3 — Products / Collection page — on your go-ahead.

```bash
npm run build:pages     # export with the deployed base path
npm run preview:pages   # http://localhost:4321/cosmetics/
npm run test:smoke
```
