"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList } from "lucide-react";
import type { Category, Collection } from "@/types/product";
import { ShopSidebar } from "./shop-sidebar";

type Params = Record<string, string | undefined>;

function buildHref(sp: Params, overrides: Params = {}) {
  const merged = { ...sp, ...overrides };
  const params = new URLSearchParams();
  if (merged.category) params.set("category", merged.category);
  if (merged.collection) params.set("collection", merged.collection);
  if (merged.sort) params.set("sort", merged.sort);
  if (merged.q) params.set("q", merged.q);
  if (merged.minPrice) params.set("minPrice", merged.minPrice);
  if (merged.maxPrice) params.set("maxPrice", merged.maxPrice);
  if (merged.inStock === "1") params.set("inStock", "1");
  if (merged.onSale === "1") params.set("onSale", "1");
  const p = Number(merged.page) || 1;
  if (p > 1) params.set("page", String(p));
  const qs = params.toString();
  return `/shop${qs ? `?${qs}` : ""}`;
}

function clearFilterHref(sp: Params, keys: string[]) {
  const cleared: Params = { ...sp };
  for (const k of keys) delete cleared[k];
  cleared.page = undefined;
  return buildHref(cleared);
}

const SORT_OPTIONS: [string, string][] = [
  ["Featured", ""],
  ["Newest", "newest"],
  ["Price: Low → High", "price-asc"],
  ["Price: High → Low", "price-desc"],
  ["Top Rated", "rating"],
];

export function ShopToolbar({
  cats,
  collections,
  sp,
  priceMin,
  priceMax,
  totalProducts,
}: {
  cats: Category[];
  collections: Collection[];
  sp: Params;
  priceMin: number;
  priceMax: number;
  totalProducts: number;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const activeFilterCount = [
    sp.category,
    sp.collection,
    sp.minPrice,
    sp.maxPrice,
    sp.inStock === "1",
    sp.onSale === "1",
  ].filter(Boolean).length;

  const activeSortLabel = SORT_OPTIONS.find(([, val]) => (sp.sort ?? "") === val)?.[0] ?? "Featured";

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Filters */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="relative flex items-center gap-2 rounded-lg border border-border bg-surface/50 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              <SlidersHorizontal className="size-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex size-4.5 items-center justify-center rounded-full bg-primary px-1.5 text-[9px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Right: Sort + Count */}
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">
              {totalProducts} product{totalProducts !== 1 && "s"}
            </span>

            {/* Sort Dropdown */}
            <div ref={sortRef} className="relative">
              <button
                type="button"
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface/50 px-3.5 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                Sort: <span className="text-foreground">{activeSortLabel}</span>
                <ChevronDown className={`size-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full z-40 mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                  {SORT_OPTIONS.map(([label, val]) => {
                    const href = buildHref(sp, { sort: val || undefined, page: undefined });
                    const isActive = (sp.sort ?? "") === val;
                    return (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setSortOpen(false)}
                        className={`flex items-center justify-between px-4 py-2.5 text-xs transition-colors ${
                          isActive
                            ? "bg-primary/5 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-surface hover:text-foreground"
                        }`}
                      >
                        {label}
                        {isActive && <span className="size-1.5 rounded-full bg-primary" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(sp.category || sp.collection || sp.minPrice || sp.maxPrice || sp.inStock === "1" || sp.onSale === "1") && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {sp.category && (
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs">
                {cats.find((c) => c.slug === sp.category)?.name ?? sp.category}
                <Link href={clearFilterHref(sp, ["category"])} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3" />
                </Link>
              </span>
            )}
            {sp.collection && (
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs">
                {collections.find((c) => c.slug === sp.collection)?.name ?? sp.collection}
                <Link href={clearFilterHref(sp, ["collection"])} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3" />
                </Link>
              </span>
            )}
            {sp.minPrice && (
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs">
                Min ${sp.minPrice}
                <Link href={clearFilterHref(sp, ["minPrice"])} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3" />
                </Link>
              </span>
            )}
            {sp.maxPrice && (
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs">
                Max ${sp.maxPrice}
                <Link href={clearFilterHref(sp, ["maxPrice"])} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3" />
                </Link>
              </span>
            )}
            {sp.inStock === "1" && (
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs">
                In Stock
                <Link href={clearFilterHref(sp, ["inStock"])} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3" />
                </Link>
              </span>
            )}
            {sp.onSale === "1" && (
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs">
                On Sale
                <Link href={clearFilterHref(sp, ["onSale"])} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3" />
                </Link>
              </span>
            )}
            <Link
              href={buildHref(sp, { category: undefined, collection: undefined, minPrice: undefined, maxPrice: undefined, inStock: undefined, onSale: undefined, page: undefined })}
              className="text-xs text-primary hover:text-primary/80 font-medium"
            >
              Clear all
            </Link>
          </div>
        )}
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Panel */}
      <div
        ref={panelRef}
        className={`fixed inset-y-0 left-0 z-50 w-[340px] overflow-y-auto bg-background p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Filters</h2>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex size-8 items-center justify-center rounded-lg hover:bg-surface transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>
        <ShopSidebar
          cats={cats}
          collections={collections}
          sp={sp}
          priceMin={priceMin}
          priceMax={priceMax}
        />
      </div>
    </>
  );
}
