"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Category, Collection } from "@/types/product";
import { PriceRangeSlider } from "./price-range-slider";

type Params = Record<string, string | undefined>;

export function ShopSidebar({
  cats,
  collections,
  sp,
  priceMin,
  priceMax,
}: {
  cats: Category[];
  collections: Collection[];
  sp: Params;
  priceMin: number;
  priceMax: number;
}) {
  return (
    <form method="get" className="space-y-0">
      {sp.sort && <input type="hidden" name="sort" value={sp.sort} />}
      {sp.q && <input type="hidden" name="q" value={sp.q} />}

      <SidebarFilterSection title="Categories" defaultOpen>
        <div className="space-y-1">
          <label className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted">
            <input
              type="radio"
              name="category"
              value=""
              defaultChecked={!sp.category}
              className="size-4 border-border accent-primary"
            />
            All
          </label>
          {cats.map((c) => (
            <label key={c.slug} className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted">
              <input
                type="radio"
                name="category"
                value={c.slug}
                defaultChecked={sp.category === c.slug}
                className="size-4 border-border accent-primary"
              />
              {c.name}
            </label>
          ))}
        </div>
      </SidebarFilterSection>

      {collections.length > 0 && (
        <SidebarFilterSection title="Collections">
          <div className="space-y-1">
            <label className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted">
              <input
                type="radio"
                name="collection"
                value=""
                defaultChecked={!sp.collection}
                className="size-4 border-border accent-primary"
              />
              All
            </label>
            {collections.map((col) => (
              <label key={col.slug} className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted">
                <input
                  type="radio"
                  name="collection"
                  value={col.slug}
                  defaultChecked={sp.collection === col.slug}
                  className="size-4 border-border accent-primary"
                />
                {col.name}
              </label>
            ))}
          </div>
        </SidebarFilterSection>
      )}

      <SidebarFilterSection title="Price Range">
        <PriceRangeSlider
          min={priceMin}
          max={priceMax}
          initialMin={Number(sp.minPrice) || priceMin}
          initialMax={Number(sp.maxPrice) || priceMax}
        />
      </SidebarFilterSection>

      <SidebarFilterSection title="Availability">
        <div className="space-y-1">
          <label className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted">
            <input
              type="checkbox"
              name="inStock"
              value="1"
              defaultChecked={sp.inStock === "1"}
              className="size-4 rounded border-border accent-primary"
            />
            In Stock
          </label>
          <label className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted">
            <input
              type="checkbox"
              name="onSale"
              value="1"
              defaultChecked={sp.onSale === "1"}
              className="size-4 rounded border-border accent-primary"
            />
            On Sale
          </label>
        </div>
      </SidebarFilterSection>

      <div className="border-t border-border pt-6">
        <button
          type="submit"
          className="w-full rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}

function SidebarFilterSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-border pt-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
      >
        {title}
        <ChevronRight
          className={`size-4 shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
