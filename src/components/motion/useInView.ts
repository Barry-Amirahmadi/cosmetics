"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  /** Fraction of the element that must be visible before it counts. */
  threshold?: number;
  /** Shrinks or grows the trigger band. Accepts the IO margin syntax. */
  rootMargin?: string;
  /** Stop observing after the first entry. True for reveals, false for the
   *  ambient shade, which has to track the element leaving again. */
  once?: boolean;
}

/**
 * The single scroll primitive in this project. Everything that responds to
 * scroll — reveals, image settles, the ambient shade — goes through here, so
 * there is exactly one observer implementation to reason about.
 */
export function useInView<T extends HTMLElement>({
  threshold = 0.18,
  rootMargin = "0px 0px -12% 0px",
  once = true,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Anyone who asked for less motion, or whose browser cannot observe, gets
    // the finished state immediately rather than an empty page.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
