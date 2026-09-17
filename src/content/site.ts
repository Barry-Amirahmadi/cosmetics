import type { SiteContent } from "@/types/content";

/**
 * PLACEHOLDER CONTENT — Phase 01.
 *
 * The brand name, contact details and social handles below are stand-ins so the
 * layout can be reviewed with realistic Persian text. Phone and email are
 * deliberately non-functional. Nothing here asserts a fact about a real
 * business; replace the whole object when the client supplies their details.
 */
export const site: SiteContent = {
  brand: {
    name: "پرنیان",
    latin: "PARNIAN",
    line: "مجموعه‌ای کوچک از محصولات مراقبت روزمره از پوست.",
  },

  /**
   * Navigation, mid-migration by design.
   *
   * «محصولات» and «گالری» are real routes; دربارهٔ ما and تماس با ما are still
   * homepage sections and stay as root-relative in-page targets until Phase 02
   * task 6 gives them a page. Writing those as `/#brand` rather than `#brand`
   * is what makes them work from `/products/` as well as from `/` — a bare hash
   * resolves against whatever page the header happens to be rendered on.
   */
  nav: [
    { label: "محصولات", href: "/products/" },
    { label: "گالری", href: "/gallery/" },
    { label: "دربارهٔ ما", href: "/#brand" },
    { label: "تماس با ما", href: "/#contact" },
  ],

  headerCta: { label: "دریافت مشاوره", href: "/#contact" },

  contact: {
    city: "تهران",
    phone: "۰۲۱ — ۰۰۰۰ ۰۰۰۰",
    phoneHref: "+982100000000",
    /**
     * WhatsApp number for click-to-chat, in Latin digits with no punctuation —
     * `wa.me` accepts nothing else, and Persian digits are not matched by `\d`
     * (§36.5, the bug that produced empty `tel:` links in Phase 01).
     *
     * Deliberately not a real number, like the phone and email above. `wa.me`
     * answers an unassigned number with "this link is invalid" rather than
     * opening a chat with a stranger, which is the correct behaviour for a
     * placeholder.
     */
    whatsapp: "989000000000",
    email: "hello@parnian.example",
  },

  social: [
    { label: "اینستاگرام", href: "#" },
    { label: "تلگرام", href: "#" },
    { label: "پینترست", href: "#" },
  ],

  legal: [
    { label: "حریم خصوصی", href: "#" },
    { label: "شرایط استفاده", href: "#" },
  ],

  newsletter: {
    heading: "خبرنامه",
    body: "هر چند هفته یک بار، وقتی محصول تازه‌ای به مجموعه اضافه می‌شود.",
    placeholder: "نشانی ایمیل",
    action: "عضویت",
  },

  copyright: "© ۱۴۰۵ پرنیان — تمام حقوق محفوظ است.",
};
