import type { MediaAsset, ValueItem } from "@/types/content";

/**
 * PLACEHOLDER CONTENT — Phase 01.
 *
 * Every line below is a *brand position* an editor can rewrite, not a factual
 * claim. Nothing states an ingredient, a test result, a certification or a
 * number, because none was supplied. Read this file as the copy deck.
 *
 * LINK RULE (Phase 02): every `href` here is written from the site root — a
 * route as `/products/`, an in-page target as `/#contact`. Bare `#contact`
 * worked while the site was a single page and silently resolves to nothing the
 * moment the same component renders on `/products/`. `next/link` applies the
 * deployment base path to a root-relative href, so this form is also the only
 * one that survives being served from a GitHub Pages project subpath.
 */

export const hero = {
  eyebrow: "مجموعهٔ مراقبت از پوست",
  heading: "زیبایی، آهسته اتفاق می‌افتد",
  lead: "پرنیان مجموعه‌ای کوچک از محصولات مراقبت روزمره است. هر فرمول کوتاه نوشته می‌شود و تا زمانی که در استفادهٔ هر روز جای خودش را پیدا نکند، منتشر نمی‌شود.",
  primary: { label: "مشاهدهٔ مجموعه", href: "/#products" },
  secondary: { label: "دربارهٔ پرنیان", href: "/#brand" },
  scrollHint: "پیمایش کنید",
  image: {
    src: "/media/hero-main.svg",
    alt: "نمای اصلی مجموعهٔ پرنیان در نور طبیعی",
    ratio: "4/5",
  } satisfies MediaAsset,
  inset: {
    src: "/media/hero-inset.svg",
    alt: "نمای نزدیک از بافت یکی از محصولات",
    ratio: "1/1",
  } satisfies MediaAsset,
  insetCaption: "بافت کرم روز",
};

export const statement = {
  text: "ما کم می‌سازیم. محصول تازه وقتی به مجموعه اضافه می‌شود که جای خالی واقعی باشد.",
  attribution: "پرنیان",
};

export const showcase = {
  eyebrow: "مجموعه",
  heading: "پنج محصول، برای یک روتین کامل",
  lead: "هر محصول یک نقش مشخص در روتین دارد. ترتیب استفاده روی هر بسته نوشته شده است.",
  linkLabel: "مشاهدهٔ محصول",
  /** The homepage showcase is the narrative cut of the collection; this is the
   *  way out of it into the full collection page. */
  allLabel: "صفحهٔ مجموعه",
  allHref: "/products/",
};

/**
 * Collection page — the full catalogue.
 *
 * Deliberately a different voice from `showcase` above. The homepage sequences
 * the products as a routine and tells a story about it; this page is the
 * register of everything that exists, so it opens by describing the collection
 * rather than by arguing for it. Nothing here counts the products in prose —
 * the count is rendered from the data, so it cannot go stale.
 */
export const collection = {
  eyebrow: "مجموعه",
  heading: "همهٔ محصولات، کنار هم",
  lead: "هر محصول برای یک مرحله از روتین ساخته شده است. برای دیدن جزئیات هر کدام، وارد صفحهٔ آن شوید.",
  /** Accessible name of the category index; it is a navigation landmark. */
  indexLabel: "دسته‌بندی محصولات",
  /** Follows the product count, e.g. «۵ محصول». */
  countLabel: "محصول",
  seo: {
    title: "مجموعه",
    description: "فهرست کامل محصولات پرنیان، همراه با دستهٔ هر محصول.",
  },
};

/**
 * Product detail page — labels and the inquiry message.
 *
 * The section headings are deliberately modest. «ادامهٔ مجموعه» rather than
 * «محصولات مرتبط», because with five products in five categories nothing
 * establishes a relation yet, and a heading that claims one is the kind of
 * small dishonesty a reader notices.
 */
export const productPage = {
  detailsHeading: "اطلاعات",
  relatedEyebrow: "ادامه",
  relatedHeading: "ادامهٔ مجموعه",
  backLabel: "بازگشت به مجموعه",
  breadcrumbHome: "صفحهٔ اصلی",
  breadcrumbCollection: "محصولات",
  breadcrumbLabel: "مسیر صفحه",
};

export const inquiry = {
  label: "پرسش دربارهٔ این محصول",
  /** `{product}` is replaced with the product name at render time. */
  message: "سلام. دربارهٔ «{product}» سؤال داشتم.",
  /** The same channel without a product in hand — used on the about page. */
  generalLabel: "نوشتن در واتساپ",
  generalMessage: "سلام. سؤالی دربارهٔ محصول‌های پرنیان داشتم.",
  /** Appended for screen readers to any link that leaves the site. */
  newWindow: "در پنجرهٔ تازه باز می‌شود",
};

export const brand = {
  eyebrow: "دربارهٔ پرنیان",
  heading: "روش کار ما",
  lead: "چهار اصلی که در هر تصمیم، از فرمول تا بسته‌بندی، به آن برمی‌گردیم.",
  image: {
    src: "/media/values-texture.svg",
    alt: "نمای نزدیک از بافت یکی از محصولات پرنیان",
    ratio: "3/4",
  } satisfies MediaAsset,
};

export const values: ValueItem[] = [
  {
    id: "v-1",
    title: "کم، اما تمام",
    body: "مجموعه کوچک می‌ماند. به‌جای افزودن محصول تازه، فرمول‌های موجود را بازبینی می‌کنیم.",
  },
  {
    id: "v-2",
    title: "فهرست کامل روی بسته",
    body: "هر چه در فرمول هست، روی بسته نوشته می‌شود. بدون استثنا و بدون عبارت‌های مبهم.",
  },
  {
    id: "v-3",
    title: "ساخته برای تکرار",
    body: "محصولی که قرار است هر روز استفاده شود، باید ساده، سریع و بی‌دردسر باشد.",
  },
  {
    id: "v-4",
    title: "بسته‌بندی ماندگار",
    body: "ظرف‌ها برای استفادهٔ دوباره طراحی شده‌اند؛ یدک هر محصول جداگانه عرضه می‌شود.",
  },
];

export const gallery = {
  eyebrow: "گالری",
  heading: "نگاهی از نزدیک",
  lead: "بافت‌ها، بسته‌بندی و فضای کار — بدون اصلاح رنگ.",
  viewLabel: "بزرگ‌نمایی",
  /** The way out of the homepage band and into the full gallery. */
  allLabel: "صفحهٔ گالری",
  allHref: "/gallery/",
};

/**
 * Gallery page.
 *
 * Same six images as the homepage band, and the difference is scale rather than
 * content: the homepage shows them as a wall of tiles, this shows them as
 * plates. The copy says so plainly instead of pretending there is more here.
 */
export const galleryPage = {
  eyebrow: "گالری",
  heading: "تصویرها، بی‌عجله",
  lead: "همان تصویرها، بزرگ‌تر از آنچه در صفحهٔ اصلی جا می‌شود. برای تمام‌صفحه، روی هر کدام بزنید.",
  seo: {
    title: "گالری",
    description: "تصویرهای مجموعهٔ پرنیان — بافت‌ها، بسته‌بندی و فضای کار.",
  },
};

/**
 * About page.
 *
 * Short on purpose. There is no founding year, no founder, no laboratory, no
 * "since" — none of that has been supplied, and a portfolio piece that invents
 * a company history to fill an about page is making the §44.1 mistake in prose
 * instead of in data. What is written here is *position*: how the brand decides
 * what to make, which is something a brand can assert about itself.
 *
 * It is also not a restatement of the four values on the homepage. Those say
 * what the brand holds to; this says why the collection stays the size it is.
 */
export const about = {
  eyebrow: "دربارهٔ ما",
  heading: "چرا مجموعه کوچک است",
  lead: "مجموعهٔ پرنیان کوچک است و قرار نیست هر فصل بزرگ‌تر شود. دلیلش را اینجا نوشته‌ایم.",
  body: [
    "بیشتر برندهای مراقبت از پوست با افزودن محصول رشد می‌کنند. ما تصمیم گرفتیم با بازبینی رشد کنیم: هر فرمولی که در مجموعه می‌ماند دوباره خوانده می‌شود، و اگر جای بهتری برایش پیدا نکنیم، همان‌طور می‌ماند.",
    "این یعنی گاهی ماه‌ها چیز تازه‌ای منتشر نمی‌شود. برای ما این نشانهٔ کندی نیست؛ نشانهٔ این است که جای خالی واقعی پیدا نکرده‌ایم.",
    "مجموعه‌ای که کوچک می‌ماند یعنی می‌توانیم هر محصول را بشناسیم — و یعنی شما هم می‌توانید. چند نام را می‌شود به خاطر سپرد؛ پنجاه‌تا را نه.",
  ],
  image: {
    src: "/media/gallery-04.svg",
    alt: "گوشه‌ای از میز کار پرنیان در نور صبح",
    ratio: "4/3",
  } satisfies MediaAsset,
  seo: {
    title: "دربارهٔ ما",
    description: "چرا مجموعهٔ پرنیان کوچک است، و چطور می‌توانید با ما تماس بگیرید.",
  },
};

/**
 * Contact block — the inquiry architecture of §42, in full.
 *
 * WhatsApp first, Instagram second, then the direct details. No form: a form
 * needs a third-party backend to post to, and wiring a real hosted endpoint is
 * outside what a presented template needs (§51). The mechanism that exists is
 * the one the product pages already use.
 */
export const contact = {
  eyebrow: "تماس",
  heading: "ساده‌ترین راه، پیام مستقیم است",
  lead: "برای پرسش دربارهٔ محصول‌ها یا انتخاب روتین، در واتساپ بنویسید.",
  instagramLabel: "اینستاگرام",
  labels: {
    city: "شهر",
    phone: "تلفن",
    email: "ایمیل",
  },
};

export const cta = {
  eyebrow: "شروع کنید",
  heading: "نمی‌دانید از کجا شروع کنید؟",
  body: "چند پرسش کوتاه دربارهٔ پوست و روتین فعلی‌تان کافی است تا مشخص شود کدام محصول‌ها به کارتان می‌آیند.",
  primary: { label: "دریافت مشاوره", href: "/about/#contact" },
  secondary: { label: "مشاهدهٔ محصولات", href: "/products/" },
  image: {
    src: "/media/cta-field.svg",
    alt: "",
    ratio: "16/9",
  } satisfies MediaAsset,
};
