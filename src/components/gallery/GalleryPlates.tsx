"use client";

import { useState } from "react";
import type { GalleryItem } from "@/types/content";
import { toFa } from "@/lib/digits";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { GalleryTile } from "./GalleryTile";
import { GalleryLightbox } from "./GalleryLightbox";

/**
 * The gallery at page scale.
 *
 * The homepage band and this page show the same six images, and the difference
 * is deliberately one of *scale* rather than content: there, they are a wall of
 * tiles you glance across; here, they are plates you look at one at a time. The
 * band structure, the uneven top edge and the tile itself are all the homepage's
 * — this is the same visual language read larger, which is what §12 asks for.
 *
 * Where it does differ from the homepage is that the composition is generated
 * rather than tabulated. The homepage holds a fixed table of six placements,
 * which is correct for a fixed band but silently breaks on a seventh image.
 * Here the bands cycle — one plate, then a pair, then one, then a pair — so any
 * number of images composes, and the last band takes whatever is left.
 */

/**
 * Solo bands alternate which edge they hug, so the page does not list — and a
 * tall crop takes fewer columns than a wide one.
 *
 * That second part is not decoration. A 4/5 crop across nine columns is 1220px
 * tall on a 1440 screen: taller than the window, so the plate can never be seen
 * whole, which is the one thing a gallery plate has to do. Sizing by crop keeps
 * every plate roughly the same height on screen instead of the same width.
 */
const SOLO = {
  tall: [
    { cls: "md:col-span-8 lg:col-span-6", sizes: "(max-width: 1024px) 100vw, 48vw" },
    { cls: "md:col-span-8 lg:col-start-7 lg:col-span-6", sizes: "(max-width: 1024px) 100vw, 48vw" },
  ],
  wide: [
    { cls: "md:col-span-8 lg:col-span-9", sizes: "(max-width: 1024px) 100vw, 70vw" },
    { cls: "md:col-span-8 lg:col-start-4 lg:col-span-9", sizes: "(max-width: 1024px) 100vw, 70vw" },
  ],
} as const;

/** Pairs alternate their proportions for the same reason. Six columns is the
 *  widest either half goes, for the height reason above. */
const PAIRS = [
  [
    { cls: "md:col-span-4 lg:col-span-5", sizes: "(max-width: 1024px) 50vw, 40vw" },
    {
      cls: "md:col-span-4 lg:col-start-7 lg:col-span-6 lg:mt-28",
      sizes: "(max-width: 1024px) 50vw, 48vw",
    },
  ],
  [
    { cls: "md:col-span-4 lg:col-span-6 lg:mt-20", sizes: "(max-width: 1024px) 50vw, 48vw" },
    { cls: "md:col-span-4 lg:col-start-8 lg:col-span-5", sizes: "(max-width: 1024px) 50vw, 40vw" },
  ],
];

/**
 * Whether a crop needs the narrower treatment. Square counts as tall: at nine
 * columns a 1/1 is 976px, over the fold on a laptop just as a portrait is.
 */
function isTall(ratio: string): boolean {
  const [w, h] = ratio.split("/").map(Number);
  return w / h < 1.2;
}

interface Plate {
  item: GalleryItem;
  /** Position in the whole gallery — drives the plate number and the stagger. */
  index: number;
  cls: string;
  sizes: string;
}

/**
 * On a phone the bands collapse, so the rhythm has to come from somewhere else:
 * the plates take alternating widths and edges instead, the treatment the
 * homepage gallery already uses to stop a single column reading as a stack of
 * equal rectangles (§12).
 */
function mobileShape(index: number): string {
  switch (index % 3) {
    case 0:
      return "";
    case 1:
      return "max-md:w-[78%] max-md:ms-auto";
    default:
      return "max-md:w-[78%] max-md:me-auto";
  }
}

function composeBands(items: readonly GalleryItem[]): Plate[][] {
  const bands: Plate[][] = [];
  let cursor = 0;
  let solos = 0;
  let pairs = 0;
  let wantSolo = true;

  while (cursor < items.length) {
    // A pair needs two images; with one left the band is a solo whatever the
    // cycle wanted, so the sequence never ends on a half-empty row.
    if (wantSolo || items.length - cursor === 1) {
      const shapes = SOLO[isTall(items[cursor].image.ratio) ? "tall" : "wide"];
      const placement = shapes[solos++ % shapes.length];
      bands.push([{ item: items[cursor], index: cursor, ...placement }]);
      cursor += 1;
    } else {
      const [first, second] = PAIRS[pairs++ % PAIRS.length];
      bands.push([
        { item: items[cursor], index: cursor, ...first },
        { item: items[cursor + 1], index: cursor + 1, ...second },
      ]);
      cursor += 2;
    }
    wantSolo = !wantSolo;
  }

  return bands;
}

export function GalleryPlates({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const bands = composeBands(items);

  return (
    <>
      {bands.map((band, bandIndex) => (
        <div
          key={band[0].item.id}
          className="grid-editorial items-start"
          style={{ marginBlockStart: bandIndex === 0 ? undefined : "var(--section-y-tight)" }}
        >
          {band.map((plate) => (
            <Reveal
              key={plate.item.id}
              delay={(plate.index % 2) * 110}
              // The md span lives in the placement, not here: two `md:col-span-*`
              // classes on one element are resolved by stylesheet order rather
              // than by the order they are written, so the winner is not the one
              // you meant.
              className={cn("col-span-4", plate.cls, mobileShape(plate.index))}
            >
              {/* Plate number, the way a catalogue numbers its images. Decorative
                  — the figure below carries the title and the caption — so it is
                  kept out of the accessibility tree rather than read aloud as a
                  stray number before every picture. */}
              <p className="t-meta mb-3" aria-hidden="true">
                {toFa(String(plate.index + 1).padStart(2, "0"))}
              </p>
              <GalleryTile
                item={plate.item}
                sizes={plate.sizes}
                onOpen={() => setOpenIndex(plate.index)}
              />
            </Reveal>
          ))}
        </div>
      ))}

      <GalleryLightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  );
}
