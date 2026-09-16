"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import type { GalleryItem } from "@/types/content";
import { toFa } from "@/lib/digits";
import { withBasePath } from "@/lib/basePath";

interface GalleryLightboxProps {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}

/**
 * Enlarged view.
 *
 * Built on <dialog>, which supplies the modal semantics, the focus trap, the
 * inert background and Escape for free — roughly a hundred lines of hand-rolled
 * accessibility code that would otherwise need writing and testing.
 *
 * Arrow keys follow the reading direction: in Persian, Left advances.
 */
export function GalleryLightbox({ items, index, onClose, onNavigate }: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const item = open ? items[index] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // showModal() makes the page inert but does not stop it scrolling behind the
  // dialog, which reads as the lightbox drifting over a moving background.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + items.length) % items.length);
    },
    [index, items.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(1); // left is forward in RTL
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(-1);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, step]);

  return (
    <dialog
      ref={dialogRef}
      className="lightbox on-dark"
      aria-label="نمای بزرگ تصویر"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      {item ? (
        <div className="flex h-full flex-col">
          <div className="container flex items-center justify-between gap-4 py-4">
            <p className="t-meta">
              {toFa(index! + 1)} از {toFa(items.length)}
            </p>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="menu-toggle"
              aria-label="بستن نمای بزرگ"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          </div>

          <div className="relative min-h-0 flex-1">
            <Image
              key={item.id}
              src={withBasePath(item.image.src)}
              alt={item.image.alt}
              fill
              sizes="100vw"
              unoptimized={item.image.src.endsWith(".svg")}
              className="object-contain p-4"
            />
          </div>

          <div className="container flex items-center justify-between gap-4 py-5">
            <div>
              <p className="t-h3">{item.title}</p>
              <p className="t-meta pt-1">{item.caption ?? item.category}</p>
            </div>

            <div className="flex items-center gap-1">
              {/* Previous sits on the right, next on the left — the order a
                  Persian reader expects from a pair of stepper controls. */}
              <button
                type="button"
                onClick={() => step(-1)}
                className="menu-toggle"
                aria-label="تصویر قبلی"
              >
                <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" fill="none">
                  <path d="M2 8h12M14 8l-5-5M14 8l-5 5" stroke="currentColor" strokeWidth="1.25" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="menu-toggle"
                aria-label="تصویر بعدی"
              >
                <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" fill="none">
                  <path d="M14 8H2M2 8l5-5M2 8l5 5" stroke="currentColor" strokeWidth="1.25" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
