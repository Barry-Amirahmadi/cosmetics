"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { ProductLayout, ResolvedProduct } from "@/types/content";
import { productAnchor } from "@/content/categories";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { ToneSwatch } from "@/components/ui/ToneSwatch";
import { ArrowLead } from "@/components/ui/ArrowLead";
import { Reveal } from "@/components/motion/Reveal";
import { useShade } from "@/components/motion/ShadeField";
import { useInView } from "@/components/motion/useInView";
import { cn } from "@/lib/cn";

/**
 * Collection-scale arrangements.
 *
 * The same four `layout` values as the homepage showcase, read at a different
 * density. On the homepage a layout describes a *spread* — one product filling
 * the screen, image on one side and copy across the gutter. Here it describes
 * how much of the row that product takes, so the whole collection can be
 * surveyed rather than scrolled through one product at a time. Extending the
 * rhythm to a collection view is the task; repeating the spreads verbatim would
 * only be the homepage again with a different heading.
 *
 * The spans are chosen so the cycle tiles: 5 + 7 fills a row, 12 is the
 * breakout, and 4 deliberately leaves the row short. Items are auto-placed
 * rather than given explicit column starts, so the composition survives an
 * editor reordering the collection — and in an RTL document auto-placement
 * starts at the right edge on its own, with no mirroring anywhere.
 *
 * Below `lg` the grid recomposes instead of shrinking (§31): at `md` the row is
 * half-and-half, and on a phone the items take alternating widths and edges —
 * the same treatment the gallery uses to keep a single column from flattening
 * into a stack of equal rectangles.
 */
const arrangements: Record<
  ProductLayout,
  { cell: string; offset: string; sizes: string }
> = {
  tall: {
    cell: "col-span-3 md:col-span-4 md:col-start-auto lg:col-span-5",
    offset: "",
    sizes: "(max-width: 768px) 75vw, (max-width: 1024px) 50vw, 40vw",
  },
  wide: {
    cell: "col-span-4 md:col-span-8 lg:col-span-7",
    offset: "lg:mt-20",
    sizes: "(max-width: 1024px) 100vw, 56vw",
  },
  feature: {
    cell: "col-span-4 md:col-span-8 lg:col-span-12",
    offset: "",
    sizes: "100vw",
  },
  compact: {
    // Inset from the start edge on a phone, so two narrow items in sequence
    // are not mistaken for a column.
    cell: "col-span-3 col-start-2 md:col-span-4 md:col-start-auto lg:col-span-4",
    offset: "lg:mt-28",
    sizes: "(max-width: 768px) 75vw, (max-width: 1024px) 50vw, 32vw",
  },
};

export function CollectionItem({ product, index }: { product: ResolvedProduct; index: number }) {
  const claimShade = useShade();
  const arrangement = arrangements[product.layout];
  const claim = useCallback(() => claimShade(product.tone), [claimShade, product.tone]);

  /**
   * Which input drives the ambient shade.
   *
   * The homepage claims on scroll, because one product occupies the viewport at
   * a time and "what you are looking at" is unambiguous. A collection grid puts
   * two or three products on screen at once, so the same rule would leave them
   * fighting over the field and flickering as the page moves. Where a real
   * pointer exists the answer is simply what it is hovering; where there is not
   * one, the grid is a single column and the homepage's rule is correct again.
   */
  const [pointerDriven, setPointerDriven] = useState(false);
  useEffect(() => {
    setPointerDriven(window.matchMedia("(hover: hover)").matches);
  }, []);

  const { ref, inView } = useInView<HTMLElement>({
    threshold: 0.3,
    rootMargin: "-30% 0px -30% 0px",
    once: false,
  });

  useEffect(() => {
    if (!pointerDriven && inView) claim();
  }, [pointerDriven, inView, claim]);

  const anchor = productAnchor(product.slug);
  const nameId = `${anchor}-name`;
  const href = `/products/${product.slug}`;

  return (
    <article
      ref={ref}
      id={anchor}
      aria-labelledby={nameId}
      onPointerEnter={pointerDriven ? claim : undefined}
      onFocus={pointerDriven ? claim : undefined}
      className={cn("group-media", arrangement.cell, arrangement.offset)}
    >
      <Reveal delay={(index % 3) * 90}>
        {/* Hidden from the tab order and the accessibility tree: the product
            name below goes to the same place, and one destination deserves one
            stop. Same rule as the homepage showcase. */}
        <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
          <EditorialImage media={product.image} sizes={arrangement.sizes} />
        </Link>
      </Reveal>

      <Reveal delay={(index % 3) * 90 + 90}>
        <div className="collection-item__meta">
          <p className="t-meta flex items-center gap-3">
            <ToneSwatch tone={product.tone} />
            {product.category}
          </p>
          <p className="t-label">{product.latin}</p>
        </div>

        <h2 id={nameId} className="t-h3 mt-4">
          <Link href={href} className="name-link group-link">
            <span className="name-link__text">{product.name}</span>
            <ArrowLead size={18} />
          </Link>
        </h2>

        <p className="t-body mt-3 max-w-[34ch]">{product.description}</p>
      </Reveal>
    </article>
  );
}
