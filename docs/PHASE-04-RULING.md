# Architect ruling — on PHASE-04-REPORT.md §9

Approved. **Phase 04 is complete.** Verified against the real repo before
ruling: `src/lib/seo.ts` composes `siteRoot` from `origin` + `basePath` exactly
as described, and `.github/workflows/deploy.yml` passes
`NEXT_PUBLIC_SITE_URL: ${{ steps.pages.outputs.origin }}` alongside the
existing `NEXT_PUBLIC_BASE_PATH` — so the fix is wired into the real deploy
path, not just the local build. `sitemap.ts` and `robots.ts` both carry
`export const dynamic = "force-static"`. `src/content/schema.ts` declares no
`offers`, `aggregateRating`, `review`, or `sameAs`, with the reasoning written
inline. `public/media/og-card.png` exists at 138 KB, matching the report
exactly. `package.json` still lists exactly three runtime dependencies. The
font-preload revert is in `layout.tsx` with the finding written in as a
comment, matching §5's account. Report and repo agree throughout.

**The `origin`/`base_path` finding (§1) is the second-best catch of the
project, right behind Phase 03's inferred-type finding**, for the same
underlying reason: both were defects that cost nothing to have and would have
cost nothing to *keep* having, because nothing in normal use would ever
surface them. A canonical URL is never visually checked by anyone building the
site — it only matters to a crawler, on a page no human reads. Logged as
`MASTER-HANDOFF` §53, extending §41 rather than duplicating it, since it's the
same origin/base-path split in a different context (full URLs instead of
routes and assets).

The font hypothesis writeup (§5) is worth acknowledging on its own: reporting
a wrong guess that was caught and reverted, with the reasoning for *why* it was
wrong, is exactly the discipline that's made every checkpoint in this project
trustworthy. That's more useful documentation than if the optimization had
simply never been attempted.

## Rulings on the three open items

**1 — One share card for the whole site, not per-route (§3).** Approved. Five
near-identical abstract cards differing only in hue would be manufactured
variety, not real content — the same instinct that kept the product detail
page from inventing `ingredients`/`price`/`certifications` in Task 4. Revisit
this specific call when real photography exists, exactly as the report already
flags; nothing to decide before then.

**2 — `robots.txt` generated despite being inert on the current project
subpath (§4).** Approved, keep generating it. It's free, it's correct for the
two deployment shapes that actually matter for a template being handed around
(a custom domain, a user/org site), and removing it would mean re-adding it
the moment either of those is used — worse than a file that does nothing on
the one deployment shape where it's inert today.

**3 — `Product` without `offers` won't earn a rich result (§4, structured
data).** Confirmed as the correct, honest state, not a gap to close. This is
§44.1 applied to structured data instead of visible copy, and a fabricated
price to unlock a Google rich-result snippet would be a materially worse
fabrication than anything ruled out so far — it's a false commercial claim
made to a machine specifically so no human reviewer would ever see it. Good
call flagging it explicitly rather than leaving a future session to wonder why
the Rich Results tool comes back "not eligible."

## Next

Part 4 — the final full-site sweep and `docs/PHASE-02-FINAL-REPORT.md`, per
`PHASE-FINAL-PROMPT.md`. This is the last checkpoint in the prompt. After it's
reported and ruled on, the project is at "ready to send" — whether and when to
push is Barry's call, not part of this checkpoint.
