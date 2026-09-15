"use client";

import { useState } from "react";
import { sortedGallery } from "@/content/gallery";
import { gallery } from "@/content/sections";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { GalleryTile } from "./GalleryTile";
import { GalleryLightbox } from "./GalleryLightbox";

/**
 * Editorial gallery.
 *
 * Three bands rather than one uniform grid. Within a band the tiles carry
 * different spans, different crops and different vertical offsets, so the wall
 * has a top edge that moves — the thing a masonry layout is actually for.
 *
 * On small screens the bands collapse and the tiles take alternating widths
 * and alignments instead, which keeps the vertical rhythm from flattening into
 * a single column of equal rectangles.
 *
 * Placement lives here, in one table, so re-sequencing the gallery in a CMS
 * cannot break the composition.
 */
const placement = [
  { lg: "lg:col-span-5", mobile: "", sizes: "(max-width: 1024px) 100vw, 38vw" },
  { lg: "lg:col-span-3 lg:mt-24", mobile: "max-md:w-[74%] max-md:ms-auto", sizes: "(max-width: 1024px) 74vw, 24vw" },
  { lg: "lg:col-span-4 lg:mt-10", mobile: "max-md:w-[88%]", sizes: "(max-width: 1024px) 88vw, 30vw" },
  { lg: "lg:col-span-7 lg:mt-16", mobile: "", sizes: "(max-width: 1024px) 100vw, 52vw" },
  { lg: "lg:col-span-5", mobile: "max-md:w-[74%] max-md:me-auto", sizes: "(max-width: 1024px) 74vw, 38vw" },
  { lg: "lg:col-span-9", mobile: "", sizes: "(max-width: 1024px) 100vw, 68vw" },
];

const bands = [
  [0, 1, 2],
  [3, 4],
  [5],
];

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="ground-light-deep">
      <div className="container py-[var(--section-y)]">
        <SectionHeading
          id="gallery-heading"
          eyebrow={gallery.eyebrow}
          heading={gallery.heading}
          lead={gallery.lead}
          className="mb-[var(--section-y-tight)]"
        />

        {bands.map((band, bandIndex) => (
          <div
            key={bandIndex}
            className="grid-editorial items-start"
            style={{ marginBlockStart: bandIndex === 0 ? undefined : "var(--grid-gap)" }}
          >
            {band.map((i) => {
              const item = sortedGallery[i];
              if (!item) return null;
              return (
                <Reveal
                  key={item.id}
                  delay={(i % 3) * 90}
                  className={`col-span-4 md:col-span-8 ${placement[i].lg} ${placement[i].mobile}`}
                >
                  <GalleryTile
                    item={item}
                    sizes={placement[i].sizes}
                    onOpen={() => setOpenIndex(i)}
                  />
                </Reveal>
              );
            })}
          </div>
        ))}
      </div>

      <GalleryLightbox
        items={sortedGallery}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
