import type { Metadata, Viewport } from "next";
import { Markazi_Text, Vazirmatn } from "next/font/google";
import { site } from "@/content/site";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

/**
 * Both faces are fetched at build time and served from this origin — next/font
 * self-hosts rather than linking to Google. That matters for a site aimed at
 * Iranian users: no third-party font request to be slow or blocked, and no
 * layout shift while a webfont negotiates.
 *
 * Markazi Text — Persian Naskh with calligraphic contrast. Display only.
 * Vazirmatn    — neutral Persian sans. Everything else.
 */
const markazi = Markazi_Text({
  subsets: ["arabic", "latin"],
  variable: "--font-markazi",
  display: "swap",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

/**
 * Absolute origin for Open Graph and canonical URLs. Supplied by the deploy
 * workflow from `actions/configure-pages`, which knows where the site actually
 * lives; the local default is a placeholder and is never published.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://parnian.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "پرنیان — مراقبت روزمره از پوست",
    template: "%s — پرنیان",
  },
  description: site.brand.line,
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: site.brand.name,
    title: "پرنیان — مراقبت روزمره از پوست",
    description: site.brand.line,
  },
  // Canonical URLs, structured data, sitemap and robots are Phase 02, once the
  // real domain and page set exist. The markup below is already shaped for them.
};

export const viewport: Viewport = {
  themeColor: "#eae9e3",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${markazi.variable}`}
      /* The inline script below stamps data-js before React hydrates; that is
         the point of it, so the resulting attribute difference is expected. */
      suppressHydrationWarning
    >
      <body>
        {/* Marks the document as scripted before first paint. Scroll reveals
            are hidden only under [data-js="on"], so a failed or blocked bundle
            leaves a fully readable page instead of a blank one. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute("data-js","on")`,
          }}
        />

        <a href="#main" className="skip-link">
          پرش به محتوای اصلی
        </a>

        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
