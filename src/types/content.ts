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
  /** Short Persian description — one line, used wherever the product is listed. */
  description: string;
  /**
   * Detail-page copy. All optional: a product can be published with nothing but
   * the fields above, and the detail page degrades to the listing copy.
   *
   * These are *editorial copy*, the same class of field as `description` — not
   * product attributes. There is deliberately no `ingredients`, `volume`,
   * `price` or `skinType` here: no such information has been supplied, and
   * inventing it is exactly what §44.1 forbids.
   */
  statement?: string;
  /** Body paragraphs. An array so the editor controls the breaks, not a regex. */
  body?: string[];
  /**
   * Key information, as label/value pairs rather than a fixed schema.
   *
   * Every value on the five seed products is restated from that product's own
   * `description` — nothing here asserts anything the brand had not already
   * said. The list is intentionally uneven between products: where the copy
   * never stated a time of day, that row is simply absent rather than filled in
   * to make the table look complete.
   */
  details?: { label: string; value: string }[];
  /**
   * The product's own shade, driving the ambient wash behind the showcase.
   * Optional because a CMS editor can save a product without picking one —
   * see resolveProducts() for what happens then.
   */
  tone?: string;
  image: MediaAsset;
  /** Optional for the same reason as `tone`. */
  layout?: ProductLayout;
  status: "published" | "draft";
  seo?: {
    title?: string;
    description?: string;
  };
}

/**
 * A product with every presentation field guaranteed to be present.
 *
 * This is what components consume. `Product` is the *authoring* shape, where
 * presentation fields may be absent; `ResolvedProduct` is the *rendering*
 * shape, where they never are. Keeping the two separate means no component
 * ever carries a `?? fallback` for a missing field, and the defaulting rules
 * live in exactly one place.
 */
export interface ResolvedProduct extends Product {
  tone: string;
  layout: ProductLayout;
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
    /** WhatsApp click-to-chat number, Latin digits only, no punctuation. */
    whatsapp: string;
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
