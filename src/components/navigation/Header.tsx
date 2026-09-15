"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { site } from "@/content/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { useActiveSection } from "./useActiveSection";

/**
 * RTL navigation.
 *
 * Reading order is wordmark → sections → action, which in an RTL document
 * places the wordmark at the right edge and the call to action at the left.
 * That is the natural arrangement here, not a mirrored LTR header: the brand
 * sits where a Persian reader starts.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const sectionIds = useMemo(
    () => site.nav.map((item) => item.href.replace("#", "")).filter(Boolean),
    [],
  );
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled}>
        <div className="container flex items-center justify-between gap-6 py-4">
          <Wordmark />

          <nav aria-label="پیمایش اصلی" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {site.nav.map((item) => {
                const id = item.href.replace("#", "");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="nav-link"
                      aria-current={active === id ? "location" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button href={site.headerCta.href} variant="secondary" className="hidden md:inline-flex">
              {site.headerCta.label}
            </Button>

            <button
              type="button"
              className="menu-toggle lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="گشودن فهرست"
              aria-expanded={menuOpen}
            >
              <span className="flex w-6 flex-col gap-[6px]">
                <span className="menu-toggle__bar w-full" />
                <span className="menu-toggle__bar w-2/3 self-start" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
