import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Zap } from "lucide-react";
import { getProductBySlug, getRelatedProducts, getProducts, getCategories } from "@/lib/api";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetails } from "@/components/product/product-details";
import { ProductCard } from "@/components/product/product-card";
import { TrustBar } from "@/components/product/trust-bar";
import { RecentlyPurchasedPopup } from "@/components/ui/recently-purchased";

export async function generateStaticParams() {
  try {
    const { products: list } = await getProducts({ limit: 100 });
    return list.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Not found" };
  return {
    title: p.name,
    description: p.description,
    openGraph: { title: `${p.name} · EYCE`, description: p.description, images: [{ url: p.images[0] }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, allProducts] = await Promise.all([
    getRelatedProducts(slug),
    getProducts({ limit: 50 }),
  ]);
  const cats = await getCategories();

  const catName = cats.find((c) => c.slug === product.category)?.name ?? product.category.replace(/-/g, " ");

  // Pick "frequently bought together" (random other products from same category)
  const frequentlyBought = allProducts.products
    .filter((p) => p.slug !== slug && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Recently Purchased Popup */}
      <RecentlyPurchasedPopup
        products={related.length > 0 ? related.map((p) => ({
          name: p.name, image: p.images[0], price: p.price, slug: p.slug,
        })) : []}
      />

      {/* Sticky Mobile Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-lg p-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold">{product.name}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {product.variants[0]?.price ? `From ${new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency, maximumFractionDigits: 0 }).format(product.variants[0].price)}` : ""}
            </p>
          </div>
          <Link
            href={`#add-to-cart`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            <ShoppingBagIcon className="size-4" />
            Add to cart
          </Link>
        </div>
      </div>

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
          <div id="add-to-cart">
            <ProductDetails product={product} />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Frequently Bought Together */}
      {frequentlyBought.length > 0 && (
        <section className="border-y border-border/60 bg-surface/30">
          <div className="container-x py-12">
            <div className="flex items-end justify-between gap-6 mb-8">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-2">
                  Complete the setup
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                  Frequently bought together
                </h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {frequentlyBought.map((p) => (
                <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                    {p.images[0] && (
                      <img src={p.images[0]} alt={p.name} className="object-cover w-full h-full" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${p.slug}`} className="text-sm font-medium hover:text-primary transition-colors line-clamp-2">
                      {p.name}
                    </Link>
                    <p className="mt-1 font-mono text-sm font-bold">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency, maximumFractionDigits: 0 }).format(p.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specifications Full Width */}
      {product.specs.length > 0 && (
        <section className="bg-surface/30">
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

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}
