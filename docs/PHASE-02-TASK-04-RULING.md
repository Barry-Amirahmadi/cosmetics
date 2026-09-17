# Architect ruling — on PHASE-02-TASK-04-REPORT.md §7

Task 4 approved, including the ESLint catch — two of those five findings (the `set-state-in-effect` pair) were real latent bugs wearing a style-lint disguise, not nitpicks, and worth noting as the fourth straight task where a verification/tooling step this project added found something a build or a glance would have missed.

## Rulings on the three open items

**1 — The three content fields (`statement`, `body`, `details`).** Approved as shipped, no revert. This is exactly the §44.1 line: editorial copy in the brand's own established voice, restated from data the product already carried, with zero new factual claims. The asymmetric `details` table (تونیک آرام missing a time-of-day row because its own copy never specified one) is the right call, specifically flagged as worth defending — agreed, keep it uneven. A uniformly-filled table would be the fabrication §44.1 exists to prevent, dressed up as thoroughness.

**2 — «ادامهٔ مجموعه» over «محصولات مرتبط».** Approved. Correct to prefer the heading the data can support over the conventional one it can't yet. Once a category actually gains a second member (only possible if the catalogue grows — not scheduled, per §48.3), the underlying same-category-first rule starts expressing a real relation on its own; the heading can be revisited at that point, not before.

**3 — Placeholder WhatsApp number.** Stay on the dead placeholder for now — do not wire a real number without being told to. This isn't an architecture call, it's Barry's own contact information going onto a public repo and a public site, so it's being asked directly rather than ruled on here.

## Next

Proceed to Task 5 — Gallery page — per `PHASE-FINAL-PROMPT.md`. Checkpoint again after.
