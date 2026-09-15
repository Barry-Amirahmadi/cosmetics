import Link from "next/link";
import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLead } from "@/components/ui/ArrowLead";

/**
 * Footer, and the site's contact block — the nav's "تماس با ما" and the closing
 * call to action both land here, so this is where the details have to be real.
 *
 * The oversized wordmark at the bottom is the one purely graphic element on the
 * page: it closes the document the way a colophon closes a book.
 */
export function Footer() {
  return (
    <footer id="contact" className="ground-dark on-dark">
      <div className="container py-[var(--section-y-tight)]">
        <div className="grid-editorial">
          {/* Brand line */}
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <Reveal>
              <p className="t-h3">{site.brand.name}</p>
              <p className="t-body mt-3 max-w-[26ch]">{site.brand.line}</p>
            </Reveal>
          </div>

          {/* Navigation */}
          <nav className="col-span-2 md:col-span-4 lg:col-start-6 lg:col-span-2" aria-label="پیمایش پانوشت">
            <Reveal delay={60}>
              <h2 className="t-label mb-5">مجموعه</h2>
              <ul className="flex flex-col">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="t-meta footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </nav>

          {/* Contact */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Reveal delay={120}>
              <h2 className="t-label mb-5">تماس</h2>
              <ul className="flex flex-col">
                <li className="t-meta flex min-h-11 items-center">{site.contact.city}</li>
                <li>
                  <a
                    href={`tel:${site.contact.phoneHref}`}
                    className="t-meta footer-link"
                  >
                    {site.contact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="t-meta footer-link"
                    dir="ltr"
                  >
                    {site.contact.email}
                  </a>
                </li>
              </ul>
            </Reveal>
          </div>

          {/* Newsletter */}
          <div className="col-span-4 md:col-span-8 lg:col-start-10 lg:col-span-3">
            <Reveal delay={180}>
              <h2 className="t-label mb-5">{site.newsletter.heading}</h2>
              <p className="t-meta mb-4 max-w-[30ch]">{site.newsletter.body}</p>
              <form
                className="field"
                action="#"
                /* Wired to nothing in Phase 01 — the subscribe endpoint is a
                   Phase 02 decision, so the markup is here and the submit is not. */
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  {site.newsletter.placeholder}
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={site.newsletter.placeholder}
                  className="field__input"
                  /* auto, not ltr: the Persian placeholder reads right-to-left
                     while a typed Latin address flips to left-to-right. */
                  dir="auto"
                />
                <button type="submit" className="field__submit">
                  <span className="inline-flex items-center gap-2">
                    {site.newsletter.action}
                    <ArrowLead size={14} />
                  </span>
                </button>
              </form>
            </Reveal>
          </div>
        </div>

        {/* Social + legal */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--color-line-dark)] pt-6">
          <ul className="flex flex-wrap items-center gap-x-6">
            {site.social.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="t-meta footer-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap items-center gap-x-6">
            {site.legal.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="t-meta footer-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Colophon */}
        <div className="mt-14 flex flex-wrap items-end justify-between gap-6">
          <p
            className="t-display leading-none text-[var(--color-chalk)] opacity-15"
            aria-hidden="true"
          >
            {site.brand.name}
          </p>
          <p className="t-meta">{site.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
