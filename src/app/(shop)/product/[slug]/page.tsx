import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getProducts } from "@/lib/api";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetails } from "@/components/product/product-details";
import { ProductCard } from "@/components/product/product-card";

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
  const related = await getRelatedProducts(slug);

  return (
    <>
      <section className="container-x py-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} alt={product.name} />
          <ProductDetails product={product} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-16">
          <div className="mb-8">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">You may also like</div>
            <h2 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">More from {product.category.replace(/-/g, " ")}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </>
  );
}
