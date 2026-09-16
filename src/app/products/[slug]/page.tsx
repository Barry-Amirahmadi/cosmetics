import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publishedProducts, products } from "@/content/products";
import { Section } from "@/components/layout/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { ToneSwatch } from "@/components/ui/ToneSwatch";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Product detail — a STUB, not the designed Page 03.
 *
 * It exists for one reason: the showcase links here, and a client review should
 * never land on a 404. It is assembled entirely from the same primitives as the
 * homepage, which is the point — it demonstrates that the component set already
 * carries a second page type without new design work.
 *
 * Phase 02 replaces it with the real detail page: gallery, variants, spec
 * table, related products, structured data.
 */
export function generateStaticParams() {
  return publishedProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};

  return {
    title: product.seo?.title ?? product.name,
    description: product.seo?.description ?? product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = publishedProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <Section rhythm="tight">
      <nav aria-label="مسیر صفحه" className="mb-10">
        <ol className="t-meta flex flex-wrap items-center gap-2">
          <li>
            {/* next/link, not a raw anchor: only Link applies the deployment
                base path, so a bare href="/" would leave the site entirely
                when this is served from a GitHub Pages project subpath. */}
            <Link href="/" className="crumb">
              صفحهٔ اصلی
            </Link>
          </li>
          <li aria-hidden="true">·</li>
          <li>
            <Link href="/products/" className="crumb">
              محصولات
            </Link>
          </li>
          <li aria-hidden="true">·</li>
          <li aria-current="page" className="text-[var(--color-ink)]">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid-editorial items-start">
        <div className="col-span-4 md:col-span-8 lg:col-span-6">
          <EditorialImage media={product.image} sizes="(max-width: 1024px) 100vw, 48vw" priority />
        </div>

        <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-start-8 lg:col-span-5">
          <Reveal>
            <Eyebrow>{product.category}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="t-h1">{product.name}</h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="t-lead">{product.description}</p>
          </Reveal>
          <Reveal delay={200}>
            <p className="t-meta flex items-center gap-3">
              <ToneSwatch tone={product.tone} />
              {product.latin}
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="flex flex-wrap gap-3">
              <Button href="/#contact">دریافت مشاوره</Button>
              <Button href="/products/" variant="secondary">
                بازگشت به مجموعه
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
