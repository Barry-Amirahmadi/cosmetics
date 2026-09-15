import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * The brand lockup: Persian name set in the display face, with the Latin
 * transliteration as a tracked micro-label beside it. Tracking is applied to
 * the Latin only — the Persian never carries letter-spacing.
 */
export function Wordmark({ size = "sm", className }: { size?: "sm" | "lg"; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex min-h-11 items-center gap-3", className)}
      aria-label={`${site.brand.name} — صفحهٔ اصلی`}
    >
      <span
        className="t-h2"
        style={{
          fontSize: size === "lg" ? "clamp(2rem, 5vw, 3rem)" : "1.6rem",
          lineHeight: 1,
        }}
      >
        {site.brand.name}
      </span>
      <span
        className="t-label hidden sm:inline"
        style={{ borderInlineStart: "1px solid var(--color-line)", paddingInlineStart: "0.6rem" }}
      >
        {site.brand.latin}
      </span>
    </Link>
  );
}
