import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}

/**
 * Renders an anchor when it navigates and a button when it acts. Getting this
 * wrong is the most common accessibility defect on a marketing site, so the
 * decision is made here once rather than at every call site.
 */
export function Button({
  children,
  href,
  variant = "primary",
  type = "button",
  onClick,
  className,
}: ButtonProps) {
  const classes = cn("btn", `btn--${variant}`, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
