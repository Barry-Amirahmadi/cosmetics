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

  nav: [
    { label: "محصولات", href: "#products" },
    { label: "گالری", href: "#gallery" },
    { label: "دربارهٔ ما", href: "#brand" },
    { label: "تماس با ما", href: "#contact" },
  ],

  headerCta: { label: "دریافت مشاوره", href: "#contact" },

  contact: {
    city: "تهران",
    phone: "۰۲۱ — ۰۰۰۰ ۰۰۰۰",
    phoneHref: "+982100000000",
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
