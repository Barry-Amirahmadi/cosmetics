/**
 * Content model.
 *
 * These types are the contract between the UI and whatever supplies content.
 * In Phase 01 the supplier is a set of TypeScript files under `src/content`.
 * In Phase 02 it becomes a CMS. The components never change: they already read
 * only from these shapes, and every field below maps to a CMS field.
 */

/** Fixed aspect ratios. Crops are part of the art direction, not per-image
 *  guesswork — an editor picks one, never a raw pixel size. */
export type Ratio = "1/1" | "4/5" | "3/4" | "4/3" | "8/5" | "16/9";

export interface MediaAsset {
  /** Path today, CMS asset URL later. */
  src: string;
  /** Describes the picture for someone who cannot see it. Never the filename. */
  alt: string;
  ratio: Ratio;
  /** Optional editorial caption shown under or over the image. */
  caption?: string;
}

/**
 * How a product occupies the showcase grid. The layout is content, not code:
 * an editor sequencing the page decides the rhythm, so the spread stays
 * designed rather than becoming a repeating row component.
 */
export type ProductLayout = "tall" | "wide" | "compact" | "feature";

export interface Product {
  id: string;
  /** URL segment — /products/[slug] in Phase 02. */
  slug: string;
  /** Persian product name. */
  name: string;
  /** Latin transliteration, used only for micro-labels. */
  latin: string;
  /** Persian category label, e.g. سرم. Drives filtering later. */
  category: string;
  /** Short Persian description. */
  description: string;
  /** The product's own shade. Drives the ambient wash behind the showcase. */
  tone: string;
  image: MediaAsset;
  layout: ProductLayout;
  status: "published" | "draft";
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  /** Persian category label — the axis a future gallery filter uses. */
  category: string;
  caption?: string;
  image: MediaAsset;
  /** Manual sort position, as an editor would set it. */
  order: number;
}

export interface ValueItem {
  id: string;
  title: string;
  body: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteContent {
  brand: {
    name: string;
    latin: string;
    /** One line, used in the footer and as the meta description base. */
    line: string;
  };
  nav: NavItem[];
  headerCta: NavItem;
  contact: {
    city: string;
    /** Display string, in Persian digits. */
    phone: string;
    /** Dial string, in Latin digits. Kept separate: Persian digits are not
     *  matched by \d, so a tel: href cannot be derived from `phone`. */
    phoneHref: string;
    email: string;
  };
  social: NavItem[];
  legal: NavItem[];
  newsletter: {
    heading: string;
    body: string;
    placeholder: string;
    action: string;
  };
  copyright: string;
}
