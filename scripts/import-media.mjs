/**
 * Bring the ChatGPT photographs in over the placeholders — PARNIAN.
 *
 *   node scripts/import-media.mjs "C:/Users/Admin/Desktop/for gpt work/06-PARNIAN" [max-KB]
 *
 * The photographs arrive as PNGs from ChatGPT Work, which only makes three
 * shapes: 1254×1254, 1536×1024 and 1024×1536. The site needs JPEGs at exact
 * pixel sizes and at exact ratios, small enough that a route carrying a dozen
 * of them stays inside its 2.5 MB image budget. This script does that and
 * nothing else. It never renames: `gallery-01.png` becomes `gallery-01.jpg`.
 *
 * ── WHY IT LOOKS LIKE THIS ─────────────────────────────────────────────────
 *
 * Node has no image codec and this project has exactly three runtime
 * dependencies, so the work happens on a canvas inside the Chromium that
 * Playwright already installs for the smoke suite — the same route as
 * `generate-og.mjs`. Quality is walked down from 0.9 until each file fits the
 * byte ceiling, and the quality it settled on is printed.
 *
 * ── THE CROP IS CHOSEN BY CONTENT, AND PRINTED ─────────────────────────────
 *
 * Where a source's ratio differs from its slot's by more than 0.01, the crop
 * axis comes from the real dimensions, not from what the image was asked to
 * be — ChatGPT sometimes returns a different shape. The prompts kept the
 * subject inside the central 80–90 %, but a blind centre cut still sliced
 * objects on a third of the frames measured, so the keep window slides.
 *
 * At 256px across, every line along the crop axis gets the spread of its
 * luminance: a strip of plain backdrop is flat, a strip crossing an object is
 * not. With the background at the 20th-percentile line and the peak at the
 * busiest, `level = (v − bg) / (peak − bg)`. An offset scores the busiest
 * line it removes. The centre is kept unless it scores over 0.35 **and**
 * another offset is at least 0.10 better — on a texture every offset scores
 * alike and the centre wins, which is the right answer there.
 *
 * A source smaller than its crop is refused, never upscaled.
 */
import { mkdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "media");

const srcDir = process.argv[2];
if (!srcDir) {
  console.error('usage: node scripts/import-media.mjs "C:/path/to/folder" [max-KB]');
  process.exit(2);
}

/** The byte ceiling per file, in KB. The number that matters is per route;
 *  this is the knob that keeps the heaviest route under 2.5 MB. */
const MAX_BYTES = Number(process.argv[3] ?? 220) * 1024;

/** Exact output size per ratio — the box the CSS draws and the file agree. */
const SIZE = {
  "1:1": { w: 1024, h: 1024 },
  "4:5": { w: 1024, h: 1280 },
  "3:4": { w: 1020, h: 1360 },
  "4:3": { w: 1360, h: 1020 },
  "16:9": { w: 1536, h: 864 },
  "8:5": { w: 1536, h: 960 },
};

/** [source PNG, file it becomes, ratio] — from the job's _CLAUDE-IMPORT-MAP.json. */
const SLOTS = [
  ["product-shab.png", "product-shab.jpg", "4:5"],
  ["product-rooz.png", "product-rooz.jpg", "4:5"],
  ["product-narm.png", "product-narm.jpg", "4:5"],
  ["product-aghaz.png", "product-aghaz.jpg", "4:5"],
  ["product-aram.png", "product-aram.jpg", "16:9"],
  ["hero-main.png", "hero-main.jpg", "4:5"],
  ["gallery-06.png", "gallery-06.jpg", "4:5"],
  ["gallery-03.png", "gallery-03.jpg", "4:5"],
  ["hero-inset.png", "hero-inset.jpg", "1:1"],
  ["values-texture.png", "values-texture.jpg", "3:4"],
  ["gallery-01.png", "gallery-01.jpg", "4:5"],
  ["gallery-02.png", "gallery-02.jpg", "4:5"],
  ["gallery-04.png", "gallery-04.jpg", "4:5"],
  ["gallery-05.png", "gallery-05.jpg", "4:5"],
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("about:blank");

async function convert(dataUrl, want) {
  return page.evaluate(
    async ({ dataUrl, want, MAX_BYTES }) => {
      const bitmap = await createImageBitmap(await (await fetch(dataUrl)).blob());
      const W = bitmap.width;
      const H = bitmap.height;
      const rIn = W / H;
      const rOut = want.w / want.h;

      let sx = 0, sy = 0, sw = W, sh = H, crop = null;
      if (Math.abs(rIn - rOut) > 0.01) {
        const axis = rIn < rOut ? "y" : "x";
        const along = axis === "y" ? H : W;
        const cross = axis === "y" ? W : H;
        const keep = axis === "y" ? W / rOut : H * rOut;

        // The luminance spread of every line along the crop axis, at 256 across.
        const L = Math.round((256 * along) / cross);
        const c = document.createElement("canvas");
        c.width = axis === "y" ? 256 : L;
        c.height = axis === "y" ? L : 256;
        const cx = c.getContext("2d");
        cx.imageSmoothingQuality = "high";
        cx.drawImage(bitmap, 0, 0, c.width, c.height);
        const d = cx.getImageData(0, 0, c.width, c.height).data;
        const lines = [];
        for (let a = 0; a < L; a++) {
          let s = 0, s2 = 0;
          for (let b = 4; b < 252; b++) {
            const i = (axis === "y" ? a * 256 + b : b * L + a) * 4;
            const v = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            s += v;
            s2 += v * v;
          }
          const m = s / 248;
          lines.push(Math.sqrt(Math.max(0, s2 / 248 - m * m)));
        }
        const sorted = [...lines].sort((p, q) => p - q);
        const bg = sorted[Math.floor(L / 5)];
        const peak = sorted[L - 1];
        const level = (v) => (peak > bg ? Math.max(0, (v - bg) / (peak - bg)) : 0);
        const k = Math.round((keep * L) / along);
        const score = (o) => {
          let worst = 0;
          for (let a = 0; a < L; a++) if (a < o || a >= o + k) worst = Math.max(worst, level(lines[a]));
          return worst;
        };
        const centre = Math.round((L - k) / 2);
        const centreScore = score(centre);
        let best = centre, bestScore = centreScore;
        for (let o = 0; o <= L - k; o++) {
          const s = score(o);
          if (s < bestScore - 1e-9 || (Math.abs(s - bestScore) < 1e-9 && Math.abs(o - centre) < Math.abs(best - centre))) {
            best = o;
            bestScore = s;
          }
        }
        const moved = centreScore > 0.35 && bestScore <= centreScore - 0.1;
        const chosen = moved ? best : centre;
        const off = L - k > 0 ? (chosen * (along - keep)) / (L - k) : 0;
        if (axis === "y") { sy = off; sh = keep; } else { sx = off; sw = keep; }
        crop = {
          axis,
          before: Math.round(off),
          after: Math.round(along - keep - off),
          rule: moved ? "content" : "centre",
          centreScore: Number(centreScore.toFixed(2)),
          chosenScore: Number((moved ? bestScore : centreScore).toFixed(2)),
          cutPct: Math.round((100 * (along - keep)) / along),
        };
      }
      if (sw + 0.5 < want.w || sh + 0.5 < want.h) {
        return { error: `source crop ${Math.round(sw)}x${Math.round(sh)} is smaller than ${want.w}x${want.h}; refusing to upscale`, w: W, h: H };
      }

      const canvas = document.createElement("canvas");
      canvas.width = want.w;
      canvas.height = want.h;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, want.w, want.h);

      for (let q = 0.9; q >= 0.55; q -= 0.04) {
        const url = canvas.toDataURL("image/jpeg", q);
        const bytes = Math.floor((url.length - url.indexOf(",") - 1) * 0.75);
        if (bytes <= MAX_BYTES || q < 0.59) return { url, q: Number(q.toFixed(2)), inW: W, inH: H, crop };
      }
      return { error: "could not reach the byte budget above quality 0.55" };
    },
    { dataUrl, want, MAX_BYTES },
  );
}

/** Width and height straight out of a JPEG's SOF marker. */
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return { w: 0, h: 0 };
}

const problems = [];
const rows = [];
let total = 0;

for (const [png, file, ratio] of SLOTS) {
  const path = join(srcDir, png);
  if (!existsSync(path)) {
    problems.push(`${png} — not in the source folder`);
    continue;
  }
  const want = SIZE[ratio];
  const src = readFileSync(path);
  const result = await convert(`data:image/png;base64,${src.toString("base64")}`, want);
  if (result.error) {
    problems.push(`${png} — ${result.error}${result.w ? ` (source ${result.w}x${result.h})` : ""}`);
    rows.push(`  FAIL   ${png} — ${result.error}`);
    continue;
  }

  const bytes = Buffer.from(result.url.split(",")[1], "base64");
  writeFileSync(join(outDir, file), bytes);
  total += bytes.length;

  const onDisk = jpegSize(bytes);
  const sizeOk = onDisk.w === want.w && onDisk.h === want.h;
  const budgetOk = bytes.length <= MAX_BYTES;
  if (!sizeOk) problems.push(`${file} — written at ${onDisk.w}x${onDisk.h}, expected ${want.w}x${want.h}`);
  if (!budgetOk) problems.push(`${file} — ${(bytes.length / 1024).toFixed(0)} KB, over the ${MAX_BYTES / 1024} KB ceiling`);

  const c = result.crop;
  const cropNote = c
    ? `crop ${c.axis} ${c.before}/${c.after} (${c.cutPct}%) ${c.rule} ${c.centreScore}→${c.chosenScore}`
    : "no crop";
  rows.push(
    `  ${sizeOk && budgetOk ? "ok  " : "FAIL"}   ${file.padEnd(24)} ${result.inW}x${result.inH} → ${onDisk.w}x${onDisk.h}  ` +
      `${String(bytes.length).padStart(6)} B  q${result.q}  ${cropNote}`,
  );
}

await browser.close();

console.log(rows.join("\n"));
console.log(
  `\n${rows.filter((r) => r.startsWith("  ok")).length} of ${SLOTS.length} imported → public/media/  ` +
    `(${(total / 1024 / 1024).toFixed(2)} MB total)`,
);

console.log("\n" + "─".repeat(78));
if (problems.length) {
  console.log(`${problems.length} PROBLEM(S)`);
  for (const p of problems) console.log(`  - ${p}`);
  console.log("─".repeat(78));
  process.exit(1);
}
console.log(`CLEAN — ${SLOTS.length} photographs in place at the right size and weight`);
console.log("─".repeat(78));
console.log(
  "\nNOTE: generate-media.mjs writes placeholders to these same names and would\n" +
    "overwrite every one of them. Do not run it again unless that is what you want.",
);
