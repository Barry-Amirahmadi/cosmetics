import type { Product } from "@/types/content";
import { resolveProducts } from "./resolveProducts";

/**
 * PLACEHOLDER CONTENT — Phase 01.
 *
 * Products are named with abstract Persian words and generic format labels
 * (سرم، کرم، روغن) on purpose: no ingredient, benefit, certification or
 * result is asserted anywhere, because none has been supplied. Descriptions
 * describe *when you use it*, which is neutral and safe to show a client.
 *
 * `tone` is the one field doing design work — it is the product's own shade,
 * and it drives the ambient wash behind the showcase section. All five seed
 * products set it, and `layout`, explicitly; both are optional in the type so
 * a CMS editor can omit them, and resolveProducts() fills the gap.
 */
export const products: Product[] = [
  {
    id: "p-shab",
    slug: "shab",
    name: "سرم شب",
    latin: "SHAB",
    category: "سرم",
    description: "در پایان روز، روی پوست تمیز. آخرین مرحلهٔ روتین شب.",
    tone: "#3E4C6B",
    image: {
      src: "/media/product-shab.svg",
      alt: "سرم شب پرنیان، در نور کم روی سطحی تیره",
      ratio: "4/5",
    },
    layout: "tall",
    status: "published",
  },
  {
    id: "p-rooz",
    slug: "rooz",
    name: "کرم روز",
    latin: "ROOZ",
    category: "مرطوب‌کننده",
    description: "صبح، پیش از ضدآفتاب. بافت سبک برای استفادهٔ هر روز.",
    tone: "#B9C4BD",
    image: {
      src: "/media/product-rooz.svg",
      alt: "کرم روز پرنیان در قاب افقی، نور طبیعی از سمت راست",
      ratio: "4/3",
    },
    layout: "wide",
    status: "published",
  },
  {
    id: "p-narm",
    slug: "narm",
    name: "روغن صورت نرم",
    latin: "NARM",
    category: "روغن",
    description: "چند قطره، صبح یا شب. می‌توان با کرم ترکیب کرد.",
    tone: "#C99A5B",
    image: {
      src: "/media/product-narm.svg",
      alt: "شیشهٔ روغن صورت نرم، بازتاب نور روی جدارهٔ شیشه",
      ratio: "4/5",
    },
    layout: "tall",
    status: "published",
  },
  {
    id: "p-aghaz",
    slug: "aghaz",
    name: "پاک‌کنندهٔ آغاز",
    latin: "AGHAZ",
    category: "پاک‌کننده",
    description: "مرحلهٔ اول روتین. صبح و شب، روی پوست مرطوب.",
    tone: "#7FA3A0",
    image: {
      src: "/media/product-aghaz.svg",
      alt: "پاک‌کنندهٔ آغاز در قاب مربع، پس‌زمینهٔ تیره",
      ratio: "1/1",
    },
    layout: "compact",
    status: "published",
  },
  {
    id: "p-aram",
    slug: "aram",
    name: "تونیک آرام",
    latin: "ARAM",
    category: "تونیک",
    description: "پس از پاک‌کننده و پیش از سرم. با پنبه یا کف دست.",
    tone: "#9D8FA8",
    image: {
      src: "/media/product-aram.svg",
      alt: "تونیک آرام در قاب عریض، نور نرم و سایهٔ بلند",
      ratio: "8/5",
    },
    layout: "feature",
    status: "published",
  },
];

/**
 * What the showcase renders: drafts filtered out, exactly as a CMS would, then
 * resolved so every product has a `tone` and a `layout`.
 *
 * Filter before resolve, never after — the `layout` fallback is positional, so
 * resolving a list that still contains drafts would shift the arrangements of
 * everything after the first hidden product.
 */
export const publishedProducts = resolveProducts(
  products.filter((p) => p.status === "published"),
);
