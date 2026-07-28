import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getCollections, getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/product-card";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Browse our full collection of bongs, dab rigs, hand pipes and accessories.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; collection?: string; sort?: string; q?: string; page?: string; minPrice?: string; maxPrice?: string; inStock?: string; onSale?: string }>;
}) {
  const sp = await searchParams;
  const [cats, collections] = await Promise.all([getCategories(), getCollections()]);
  const page = Math.max(1, Number(sp.page) || 1);
  const perPage = 12;
  const { products: allProducts } = await getProducts({
    category: sp.category,
    collection: sp.collection,
    sort: (sp.sort as "price-asc" | "price-desc" | "newest" | "rating" | undefined),
    search: sp.q,
    limit: 100,
  });

  const prices = allProducts.map((p) => p.price);
  const priceMin = Math.min(...prices);
  const priceMax = Math.max(...prices);

  let filtered = allProducts;
  const minP = Number(sp.minPrice) || 0;
  const maxP = Number(sp.maxPrice) || Infinity;
  if (minP > 0) filtered = filtered.filter((p) => p.price >= minP);
  if (maxP < Infinity) filtered = filtered.filter((p) => p.price <= maxP);
  if (sp.inStock === "1") filtered = filtered.filter((p) => p.variants.some((v) => v.inStock));
  if (sp.onSale === "1") filtered = filtered.filter((p) => p.compareAtPrice != null);

  const totalPages = Math.ceil(filtered.length / perPage);
  const products = filtered.slice((page - 1) * perPage, page * perPage);
  const active = sp.category;
  const activeCatName = active ? cats.find((c) => c.slug === active)?.name : null;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-background">
        <div className="container-x py-3">
          <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">
              {activeCatName ?? "Shop"}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-surface via-background to-surface">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,transparent_50%)] opacity-[0.07]" />
        <div className="container-x relative py-12 md:py-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-3">
            {activeCatName ? "Category" : "Collection"}
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {activeCatName ?? "Shop all"}
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground leading-relaxed">
            {activeCatName
              ? `Browse our ${activeCatName.toLowerCase()} collection. Silicone-first, built to last.`
              : "Silicone-first gear built to survive anything. Bongs, rigs, pipes, and accessories with a lifetime warranty."
            }
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{filtered.length}</span>
            <span>product{filtered.length !== 1 && "s"}</span>
          </div>
        </div>
      </div>

      {/* Category Quick Links */}
      {!active && (
        <div className="border-b border-border/60 bg-background/50">
          <div className="container-x py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <Link
                href="/shop"
                className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors"
              >
                All
              </Link>
              {cats.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop?category=${c.slug}`}
                  className="shrink-0 rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container-x py-8">
        <ShopToolbar
          cats={cats}
          collections={collections}
          sp={sp as Record<string, string | undefined>}
          priceMin={priceMin}
          priceMax={priceMax}
          totalProducts={filtered.length}
        />

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-surface">
              <svg className="size-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="font-display text-xl font-bold">No products found</p>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              View all products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-14 flex items-center justify-center gap-1.5">
                {page > 1 && (
                  <Link
                    href={buildHref({ ...sp, page: page - 1 })}
                    className="flex h-10 items-center rounded-lg border border-border px-4 text-xs font-medium text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
                  >
                    ← Prev
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={buildHref({ ...sp, page: p })}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                      p === page
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                        : "border border-border text-muted-foreground hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={buildHref({ ...sp, page: page + 1 })}
                    className="flex h-10 items-center rounded-lg border border-border px-4 text-xs font-medium text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function buildHref(sp: Record<string, string | number | undefined>, overrides: Record<string, string | number | undefined> = {}) {
  const merged = { ...sp, ...overrides };
  const params = new URLSearchParams();
  if (merged.category) params.set("category", String(merged.category));
  if (merged.collection) params.set("collection", String(merged.collection));
  if (merged.sort) params.set("sort", String(merged.sort));
  if (merged.q) params.set("q", String(merged.q));
  if (merged.minPrice) params.set("minPrice", String(merged.minPrice));
  if (merged.maxPrice) params.set("maxPrice", String(merged.maxPrice));
  if (merged.inStock === "1") params.set("inStock", "1");
  if (merged.onSale === "1") params.set("onSale", "1");
  const p = Number(merged.page) || 1;
  if (p > 1) params.set("page", String(p));
  const qs = params.toString();
  return `/shop${qs ? `?${qs}` : ""}`;
}
