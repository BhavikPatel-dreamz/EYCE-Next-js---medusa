"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
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
        <div className="space-y-0.5">
          <SidebarRadio
            name="category"
            value=""
            defaultChecked={!sp.category}
            label="All products"
          />
          {cats.map((c) => (
            <SidebarRadio
              key={c.slug}
              name="category"
              value={c.slug}
              defaultChecked={sp.category === c.slug}
              label={c.name}
            />
          ))}
        </div>
      </SidebarFilterSection>

      {collections.length > 0 && (
        <SidebarFilterSection title="Collections">
          <div className="space-y-0.5">
            <SidebarRadio
              name="collection"
              value=""
              defaultChecked={!sp.collection}
              label="All collections"
            />
            {collections.map((col) => (
              <SidebarRadio
                key={col.slug}
                name="collection"
                value={col.slug}
                defaultChecked={sp.collection === col.slug}
                label={col.name}
              />
            ))}
          </div>
        </SidebarFilterSection>
      )}

      <SidebarFilterSection title="Price Range" defaultOpen>
        <PriceRangeSlider
          min={priceMin}
          max={priceMax}
          initialMin={Number(sp.minPrice) || priceMin}
          initialMax={Number(sp.maxPrice) || priceMax}
        />
      </SidebarFilterSection>

      <SidebarFilterSection title="Availability" defaultOpen>
        <div className="space-y-0.5">
          <SidebarCheckbox
            name="inStock"
            value="1"
            defaultChecked={sp.inStock === "1"}
            label="In Stock"
          />
          <SidebarCheckbox
            name="onSale"
            value="1"
            defaultChecked={sp.onSale === "1"}
            label="On Sale"
          />
        </div>
      </SidebarFilterSection>

      <div className="border-t border-border pt-6 mt-6">
        <button
          type="submit"
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}

function SidebarRadio({
  name,
  value,
  defaultChecked,
  label,
}: {
  name: string;
  value: string;
  defaultChecked: boolean;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <input
          type="radio"
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span className="size-4 rounded-full border border-border peer-checked:border-primary transition-colors" />
        <Check className="absolute size-2.5 text-primary opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
      </span>
      {label}
    </label>
  );
}

function SidebarCheckbox({
  name,
  value,
  defaultChecked,
  label,
}: {
  name: string;
  value: string;
  defaultChecked: boolean;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span className="size-4 rounded border border-border peer-checked:border-primary peer-checked:bg-primary transition-colors" />
        <Check className="absolute size-2.5 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
      </span>
      {label}
    </label>
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
    <div className="border-t border-border pt-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
      >
        {title}
        <ChevronDown
          className={`size-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
