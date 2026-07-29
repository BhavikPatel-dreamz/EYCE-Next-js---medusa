"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, LayoutGrid, List, X } from "lucide-react";
import { ShopSidebar } from "@/components/shop/shop-sidebar";
import { cn } from "@/lib/utils";
import type { Category, Collection } from "@/types/product";

export function ShopToolbar({
  cats,
  collections,
  sp,
  priceMin,
  priceMax,
  totalProducts,
  currentView = "grid",
}: {
  cats: Category[];
  collections: Collection[];
  sp: Record<string, string | undefined>;
  priceMin: number;
  priceMax: number;
  totalProducts: number;
  currentView?: "grid" | "list";
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeFilters: { label: string; value: string; param: string }[] = [];
  if (sp.category) {
    const name = cats.find((c) => c.slug === sp.category)?.name ?? sp.category;
    activeFilters.push({ label: name, value: sp.category, param: "category" });
  }
  if (sp.collection) {
    const name = collections.find((c) => c.slug === sp.collection)?.name ?? sp.collection;
    activeFilters.push({ label: name, value: sp.collection, param: "collection" });
  }
  if (sp.inStock === "1") activeFilters.push({ label: "In stock", value: "1", param: "inStock" });
  if (sp.onSale === "1") activeFilters.push({ label: "On sale", value: "1", param: "onSale" });
  if (sp.minPrice) activeFilters.push({ label: `Min $${sp.minPrice}`, value: sp.minPrice, param: "minPrice" });
  if (sp.maxPrice) activeFilters.push({ label: `Max $${sp.maxPrice}`, value: sp.maxPrice, param: "maxPrice" });
  if (sp.q) activeFilters.push({ label: `"${sp.q}"`, value: sp.q, param: "q" });

  const removeFilter = useCallback((param: string) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(param);
    const qs = params.toString();
    router.push(`/shop${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [router]);

  const toggleView = (view: "grid" | "list") => {
    const params = new URLSearchParams(window.location.search);
    if (view === "list") params.set("view", "list");
    else params.delete("view");
    const qs = params.toString();
    router.push(`/shop${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="size-3.5" />
            Filters
            {activeFilters.length > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Grid/List Toggle */}
          <div className="hidden sm:flex items-center rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => toggleView("grid")}
              className={cn("p-2 transition-colors", currentView === "grid" ? "bg-surface text-foreground" : "text-muted-foreground hover:text-foreground")}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => toggleView("list")}
              className={cn("p-2 transition-colors border-l border-border", currentView === "list" ? "bg-surface text-foreground" : "text-muted-foreground hover:text-foreground")}
              aria-label="List view"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {totalProducts} product{totalProducts !== 1 && "s"}
          </span>

          {/* Sort */}
          <select
            value={sp.sort || "featured"}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              const val = e.target.value;
              if (val === "featured") params.delete("sort");
              else params.set("sort", val);
              params.delete("page");
              const qs = params.toString();
              router.push(`/shop${qs ? `?${qs}` : ""}`, { scroll: false });
            }}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Active:</span>
          {activeFilters.map((f) => (
            <span
              key={f.param}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary"
            >
              {f.label}
              <button onClick={() => removeFilter(f.param)} className="hover:text-primary/70 transition-colors">
                <X className="size-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => router.push("/shop")}
            className="text-[10px] text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Sidebar */}
      <ShopSidebar
        cats={cats}
        collections={collections}
        sp={sp}
        priceMin={priceMin}
        priceMax={priceMax}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
}
