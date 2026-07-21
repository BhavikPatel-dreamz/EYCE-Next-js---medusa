import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/product-card";
import { SearchInput } from "@/components/search/search-input";

export const metadata: Metadata = {
  title: "Search",
  description: "Search our collection of products.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const query = sp.q?.trim() || "";

  const { products } = query
    ? await getProducts({ search: query, limit: 50 })
    : { products: [] };

  return (
    <div className="container-x py-14">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Search
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Find products
        </h1>
        <p className="mt-3 text-muted-foreground">
          Search by name, category, or keyword.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <SearchInput defaultValue={query} />
      </div>

      {query && (
        <div className="mt-10">
          <p className="mb-6 text-sm text-muted-foreground">
            {products.length} result{products.length !== 1 && "s"} for &ldquo;{query}&rdquo;
          </p>
          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <SearchIcon className="mx-auto mb-4 size-10 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                No products found. Try a different search term.
              </p>
              <Link
                href="/shop"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                Browse all products
              </Link>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="py-24 text-center">
          <SearchIcon className="mx-auto mb-4 size-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            Start typing to search our collection.
          </p>
        </div>
      )}
    </div>
  );
}
