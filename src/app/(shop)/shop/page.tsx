import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getCollections, getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/product-card";
import { ShopToolbar } from "@/components/shop/shop-toolbar";

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

  return (
    <div className="container-x py-14">
      <div className="mb-10">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Collection</div>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          {active ? cats.find((c) => c.slug === active)?.name ?? "Shop" : "Shop all"}
        </h1>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1 min-w-0">
          <ShopToolbar
            cats={cats}
            collections={collections}
            sp={sp as Record<string, string | undefined>}
            priceMin={priceMin}
            priceMax={priceMax}
            totalProducts={filtered.length}
          />

          {products.length === 0 ? (
            <div className="py-24 text-center text-muted-foreground">No products found.</div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
              {totalPages > 1 && (
                <nav className="mt-12 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={buildHref({ ...sp, page: page - 1 })}
                      className="rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      &larr; Prev
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={buildHref({ ...sp, page: p })}
                      className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                        p === page
                          ? "bg-primary text-primary-foreground"
                          : "border border-border hover:bg-muted"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={buildHref({ ...sp, page: page + 1 })}
                      className="rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      Next &rarr;
                    </Link>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
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
