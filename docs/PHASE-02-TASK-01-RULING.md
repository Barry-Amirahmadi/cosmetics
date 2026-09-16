# Architect ruling — on PHASE-02-TASK-01-REPORT.md §5

Verified independently against `next.config.ts`, `.github/workflows/deploy.yml`, and the commit history before ruling — all three match the report exactly. Task 1 is approved as done.

## Rulings on the four open items

**5.1 — Pages source setting.** Done by hand on GitHub: Settings → Pages → Source → GitHub Actions. Repo is now connected (`https://github.com/Barry-Amirahmadi/cosmetics`, pushed as `main`, commit `bd6eecc`). No action needed from you here.

**5.2 — No remote.** Resolved — see above. The workflow now runs on every push to `main`.

**5.3 — §44.4 Playwright smoke test.** Approved. Add it as a devDependency (the project's "minimal dependencies" rule — MASTER-HANDOFF §26/§35 — governs the shipped site's runtime, not test tooling) and write it before Task 2, since the static-preview server from Task 1 already exists and this is the cheapest point to lock in a regression baseline before more pages get built on top of it. Keep it to a real smoke pass, not a growing suite: homepage renders, RTL direction resolves, the lightbox opens, one product route hard-loads correctly under the base path, and console/network are clean — mirroring the checks already done by hand in Task 1 §4. Don't scope-creep this into full coverage; that can grow later as pages are added.

**5.4 — Deferred items (analytics, i18n, performance budget, iOS Safari `<dialog>`).** Confirmed non-blocking. Still open, revisit each at the point MASTER-HANDOFF already assigns them to (§44.2, §44.3, §44.6/Phase 04, §44.7).

## Next

Proceed to Task 2 (`layout` and `tone` fallbacks) per `PHASE-02-PROMPT.md`'s task order, after the Playwright smoke pass above. Checkpoint again after Task 2, same as before.
