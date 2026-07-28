import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts, getProducts, getCategories } from "@/lib/api";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetails } from "@/components/product/product-details";
import { ProductCard } from "@/components/product/product-card";
import { TrustBar } from "@/components/product/trust-bar";

export async function generateStaticParams() {
  try {
    const { products: list } = await getProducts({ limit: 100 });
    return list.map((p) => ({ slug: p.slug }));
  } catch (e) {
    console.error("generateStaticParams failed, returning empty:", e);
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Not found" };
  return {
    title: p.name,
    description: p.description,
    openGraph: {
      title: `${p.name} · EYCE`,
      description: p.description,
      images: [{ url: p.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const [related, cats] = await Promise.all([
    getRelatedProducts(slug),
    getCategories(),
  ]);

  const catName = cats.find((c) => c.slug === product.category)?.name ?? product.category.replace(/-/g, " ");

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-background">
        <div className="container-x py-3">
          <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3 shrink-0" />
            <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="size-3 shrink-0" />
            <Link href={`/shop?category=${product.category}`} className="hover:text-foreground transition-colors">{catName}</Link>
            <ChevronRight className="size-3 shrink-0" />
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="container-x py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} alt={product.name} />
          <ProductDetails product={product} />
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Specifications Full Width */}
      {product.specs.length > 0 && (
        <section className="border-y border-border/60 bg-surface/30">
          <div className="container-x py-12">
            <div className="mx-auto max-w-2xl">
              <h2 className="font-display text-xl font-bold tracking-tight mb-6 text-center">Specifications</h2>
              <dl className="grid grid-cols-1 gap-0 sm:grid-cols-2">
                {product.specs.map((s, i) => (
                  <div
                    key={s.label}
                    className={`flex items-center justify-between border-b border-border/60 py-3.5 text-sm ${
                      i % 2 === 0 ? "sm:pr-8" : "sm:pl-8 sm:border-l sm:border-border/60"
                    }`}
                  >
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="container-x py-16">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-2">
                You may also like
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                More from {catName}
              </h2>
            </div>
            <Link
              href={`/shop?category=${product.category}`}
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
              <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
