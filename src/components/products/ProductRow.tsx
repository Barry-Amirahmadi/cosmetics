"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Product } from "@/types/content";
import { showcase } from "@/content/sections";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { ToneSwatch } from "@/components/ui/ToneSwatch";
import { ArrowLead } from "@/components/ui/ArrowLead";
import { Reveal } from "@/components/motion/Reveal";
import { useShade } from "@/components/motion/ShadeField";
import { useInView } from "@/components/motion/useInView";
import { cn } from "@/lib/cn";

/**
 * Grid placement per layout. Column 1 is the RIGHT edge of the page, because
 * the document is RTL and grid lines are flow-relative.
 *
 * The four arrangements exist so the showcase reads as a designed spread
 * rather than one row component repeated five times. Which one a product gets
 * is a content decision — see `layout` in the Product type.
 *
 * They also alternate sides: `tall` holds the right, `wide` and `compact` the
 * left, `feature` runs full width. Two adjacent products on the same side make
 * the sequence read as a repeated row no matter how the crops differ.
 */
const arrangements = {
  tall: {
    media: "lg:col-start-1 lg:col-span-5",
    copy: "lg:col-start-7 lg:col-span-5 lg:self-end lg:pb-10",
    sizes: "(max-width: 1024px) 100vw, 40vw",
  },
  wide: {
    media: "lg:col-start-6 lg:col-span-7 lg:mt-20",
    copy: "lg:col-start-1 lg:col-span-4 lg:self-center",
    sizes: "(max-width: 1024px) 100vw, 55vw",
  },
  compact: {
    // Inset one column from the far edge rather than sitting flush, so it
    // reads as a smaller object on the page, not a shrunken `wide`.
    media: "lg:col-start-8 lg:col-span-4 lg:mt-16",
    copy: "lg:col-start-1 lg:col-span-5 lg:self-center",
    sizes: "(max-width: 1024px) 100vw, 32vw",
  },
  feature: {
    media: "lg:col-start-1 lg:col-span-12",
    copy: "lg:col-start-1 lg:col-span-6 lg:mt-8",
    sizes: "100vw",
  },
} as const;

export function ProductRow({ product, index }: { product: Product; index: number }) {
  const claimShade = useShade();
  const arrangement = arrangements[product.layout];

  // Tracks the row across its whole pass through the viewport — `once: false`
  // — so the ambient shade follows the reader in both directions.
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.45,
    rootMargin: "-18% 0px -18% 0px",
    once: false,
  });

  useEffect(() => {
    if (inView) claimShade(product.tone);
  }, [inView, claimShade, product.tone]);

  const headingId = `product-${product.slug}`;
  const href = `/products/${product.slug}`;

  return (
    <article
      ref={ref}
      aria-labelledby={headingId}
      className={cn(
        "grid-editorial items-start",
        index > 0 && "mt-[var(--section-y-tight)]",
      )}
    >
      <Reveal className={cn("group-media col-span-4 md:col-span-8", arrangement.media)}>
        {/* Hidden from the tab order and the accessibility tree: the text link
            below goes to the same place, and one destination deserves one stop. */}
        <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
          <EditorialImage media={product.image} sizes={arrangement.sizes} />
        </Link>
      </Reveal>

      <div
        className={cn(
          "col-span-4 flex flex-col gap-5 md:col-span-8",
          arrangement.copy,
        )}
      >
        <Reveal delay={80}>
          <p className="t-meta flex items-center gap-3">
            <ToneSwatch tone={product.tone} />
            {product.category}
          </p>
        </Reveal>

        <Reveal delay={140}>
          <h3 id={headingId} className="t-h2">
            {product.name}
          </h3>
        </Reveal>

        <Reveal delay={200}>
          <p className="t-body max-w-[30ch]">{product.description}</p>
        </Reveal>

        <Reveal delay={260}>
          <Link href={href} className="link-lead group-link">
            <span className="link-lead__text">{showcase.linkLabel}</span>
            <ArrowLead />
            <span className="sr-only">— {product.name}</span>
          </Link>
        </Reveal>
      </div>
    </article>
  );
}
