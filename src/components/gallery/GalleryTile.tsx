"use client";

import type { GalleryItem } from "@/types/content";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { cn } from "@/lib/cn";

interface GalleryTileProps {
  item: GalleryItem;
  sizes: string;
  onOpen: () => void;
  className?: string;
}

/**
 * One gallery image.
 *
 * A real <button>, because it does something rather than going somewhere —
 * which also means it is reachable by keyboard and announces itself correctly
 * without any ARIA patching.
 */
export function GalleryTile({ item, sizes, onOpen, className }: GalleryTileProps) {
  return (
    <figure className={cn("group-media", className)}>
      <button type="button" onClick={onOpen} className="gallery-tile">
        <EditorialImage media={item.image} sizes={sizes} />
        <span className="sr-only">بزرگ‌نمایی {item.title}</span>
      </button>
      <figcaption className="gallery-tile__meta">
        <span className="t-meta text-[var(--color-ink)]">{item.title}</span>
        <span className="t-meta">{item.caption ?? item.category}</span>
      </figcaption>
    </figure>
  );
}
