# PARNIAN — Phase 03 Report (content architecture)

**Task:** `PHASE-FINAL-PROMPT.md` Part 2 — audit the content layer at template
scope. No CMS, no new dependency.
**Status:** complete. Checkpointing before Part 3.
**Commit:** `200ce7b` — **local only, not pushed.**

---

## 1. What the audit was actually testing

The deliverable §51 defines is a claim, not an integration: *the architecture
visibly could take a CMS without a rewrite.* So the audit asked one question of
every piece of content on the site — **could a CMS supply this?** — and that has
two halves. The copy has to live outside the components, and the shape it
arrives in has to be declared somewhere a response could be checked against.

Tasks 5–6 passed the first half cleanly, which was the specific thing you asked
me to confirm. `galleryPage`, `about` and `contact` are all in `sections.ts`,
and `GalleryPlates`, the about page and `ContactSection` read every string from
them. Nothing those two tasks introduced drifted.

The second half is where it did not hold, and the finding is larger than the
two tasks in scope.

## 2. The finding: twelve of sixteen content exports had no type

`products.ts`, `gallery.ts`, `site.ts` and `values` were annotated —
`Product[]`, `GalleryItem[]`, `SiteContent`, `ValueItem[]`. Every other export
in `sections.ts` was a bare object literal:

```ts
export const hero = { … };          // type: whatever was written here
export const about = { … };         // including everything Tasks 3–6 added
```

TypeScript infers a type for those, so the file compiles and the components
typecheck. But an inferred type describes *the literal that happens to be
present*, not what a source has to provide — so it is not a contract, and the
CMS-readiness claim was resting on it. Concretely, before this pass you could
delete `hero.scrollHint` and the build stayed green; the hero simply rendered
nothing there. A CMS response missing that field would have done the same.

`src/types/content.ts` now declares an interface for each one — `HeroContent`,
`AboutContent`, `CollectionContent` and so on, with a shared `SectionIntro` for
the eyebrow/heading/lead every band opens with — and every export in
`sections.ts` is annotated. **Verified the annotations actually bite**: removing
`hero.scrollHint` now fails typecheck with `Property 'scrollHint' is missing in
type … but required in type 'HeroContent'`, then restored.

This is type-only. No runtime behaviour changed, and `satisfies MediaAsset` came
out of five places where the declared interface now does that job.

## 3. Strings that were still living in components

A sweep for Persian text outside `src/content` found fifteen, in three classes.

**Business copy.** The whole **404 page** — eyebrow, heading, lead and button —
was written into `not-found.tsx`. It is the only page on the site whose words a
CMS could not have reached. Now `sections.notFound`. The footer's two column
headings («مجموعه», «تماس») are now `site.footer`. The site title was hardcoded
**twice** in `layout.tsx` — as `title.default` and again as `openGraph.title` —
with the brand name restated a third time in the title template; all three now
come from `site.seo`.

**A dead field with a live duplicate.** `gallery.viewLabel` was defined in the
copy deck and read by nothing, while `GalleryTile` hardcoded the same word.
Editing the field changed nothing on the page. The tile reads the field now.

**Accessible names.** Eleven aria-labels and sr-only strings across the header,
mobile menu, footer, lightbox and collection grid. These are now
`src/content/ui.ts`.

### 3.1 — Why the accessible names moved, since it is a judgement call

The honest reason is consistency rather than principle-from-scratch. The project
had *already* decided this class of string belongs in content —
`collection.indexLabel`, `productPage.breadcrumbLabel` and `inquiry.newWindow`
are all accessible names and all sat in the copy deck. So the rule was not
absent, it was applied to some of them and not others, which is the drift.

Drawing it the other way — pulling those three back into their components —
would have been the smaller diff but the worse answer: §28 has no exception for
text only a screen reader hears, and a hardcoded label is one no editor and no
translator can reach. `ui.ts` is separate from `sections.ts` because the two get
edited by different people for different reasons: one is the brand's copy deck,
the other is what the interface is called.

**Flagging it because it is a judgement I made, not one the handoff resolves.**
If you would rather interface strings stay in the components as part of each
component's accessibility contract, that is one file deleted and eleven literals
put back.

After this pass, **every Persian string outside `src/content` is a code
comment** — verified by re-running the sweep — and a search for a literal
`aria-label=`, `alt=`, `title=` or `placeholder=` in any component returns
nothing.

## 4. A new test, and the false positive it started with

Moving strings into content creates one new failure mode, and it is a quiet one:
a label that resolves to `undefined` or `""` still renders a working button that
looks completely normal and simply stops announcing itself. Nothing else in the
suite would catch that.

So the lightbox test now asserts that **no visible control on the page is
missing an accessible name**, at rest and again with the lightbox open — the
lightbox's own controls exist only while it is open, so they are absent from the
exported HTML and reachable no other way.

**Its first run failed, and it was wrong.** It flagged seven links on the
homepage. Those are the `aria-hidden="true" tabIndex={-1}` image links on the
product cards — deliberately outside the accessibility tree, sitting behind the
named text link. The check now skips `aria-hidden` subtrees. Recording this
plainly for the same reason as the `check-viewports` settle bug in Task 3: a
check that cries wolf is worse than no check.

Then proved it can fail for the right reason — blanking `ui.gallery.close`,
rebuilding, and confirming it reports `lightbox controls with no name` naming
`button.menu-toggle`. Restored and rebuilt.

## 5. Two things the audit checked and found already correct

**Duplicate navigation landmarks.** The header's `<nav>` and the mobile panel's
`<nav>` carry the same accessible name, which would normally be a defect — two
identically-named landmarks make a screen reader's landmark list useless. It is
not one here: the panel is `visibility: hidden` while closed, so exactly one of
the two is ever in the accessibility tree. Left as is, with a comment saying why
so the next reader does not have to re-derive it.

**`Product` vs `ResolvedProduct`.** The split holds. No component carries a
`?? fallback` for a missing content field; `resolveProducts()` is still the only
place a default lives.

## 6. README

Added a **Content architecture** section stating the claim plainly — typed
source-agnostic interfaces, a CMS swap is a per-collection data-fetching change
rather than a component rewrite — plus the authoring-shape/rendering-shape split
and the note that accessible names are content too. Also dropped the stale
"Phase 01 / homepage prototype" framing from the title, and fixed a comment in
`CtaSection` still describing the contact block as living in the footer.

## 7. Verification

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | pass, 0 problems |
| `npm run build:pages` | pass — 12 routes, 9 flat payloads |
| Smoke suite, desktop + mobile | **14 passed** |
| New accessible-name assertion | proved it fails when a label is blanked |
| New interfaces | proved a missing field fails typecheck |
| `/`, `/products/`, `/gallery/`, `/about/`, `/products/shab/`, `/products/aram/` × 6 viewports | clean |
| Persian strings outside `src/content` | comments only |
| Literal `aria-label` / `alt` / `title` / `placeholder` in components | 0 |
| `<title>` per route, before vs after | identical |
| `undefined` in exported markup | 0 |
| Runtime dependencies | still exactly 3 |

**One correction to a command in my own earlier reports:**
`scripts/check-viewports.mjs` reads **only its first path argument** — passing
six routes checks the first one six times and prints "all viewports clean". I
hit that this session. The table above is six separate runs. Part 4 wants this
looped, or the script taught to take a list; I have not changed it here because
it is tooling rather than this checkpoint's subject.

## 8. For your ruling

1. **Accessible names in `ui.ts` (§3.1).** The judgement call above — confirm,
   or send them back into the components.
2. **`sections.ts` is now ~260 lines and holds the copy for every page.** It
   reads fine as a copy deck, but if you would rather it split per route
   (`content/pages/about.ts` and so on) that is a mechanical change and cheaper
   now than after Part 3 adds SEO fields to it.

## 9. Next

Part 3 — the Phase 04 SEO and performance baseline, on your go-ahead. One thing
this pass surfaced that belongs there: `og:title` is currently identical on all
six routes, since only the root layout sets it.

```bash
npm run typecheck && npm run lint && npm run build:pages
npm run test:smoke
for p in / /products/ /gallery/ /about/ /products/shab/; do node scripts/check-viewports.mjs "/cosmetics$p"; done
```
