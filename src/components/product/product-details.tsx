"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Heart, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart-store";
import { useWishlist } from "@/store/wishlist-store";
import type { Product } from "@/types/product";

export function ProductDetails({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const addingVariantId = useCart((s) => s.addingVariantId);
  const wl = useWishlist();

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const isAdding = addingVariantId === variant.id;

  const onAdd = () => {
    if (!variant.inStock || isAdding) return;
    add(
      {
        id: `${product.id}:${variant.id}`,
        productId: product.id,
        variantId: variant.id,
        slug: product.slug,
        name: product.name,
        variantName: variant.name,
        price: variant.price,
        currency: product.currency,
        image: product.images[0],
      },
      qty,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {product.new && <Badge variant="accent">New</Badge>}
          {product.bestseller && <Badge>Bestseller</Badge>}
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
          {product.name}
        </h1>
        <p className="mt-2 text-muted-foreground">{product.tagline}</p>
        <div className="mt-3"><Rating value={product.rating} count={product.reviewCount} /></div>
      </div>

      <div className="flex items-baseline gap-3">
        <div className="font-mono text-3xl">{formatPrice(variant.price, product.currency)}</div>
        {product.compareAtPrice && (
          <div className="text-lg text-muted-foreground line-through">
            {formatPrice(product.compareAtPrice, product.currency)}
          </div>
        )}
      </div>

      <p className="text-sm leading-relaxed text-foreground/80">{product.longDescription}</p>

      <Separator />

      <div>
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {product.category === "e-liquids" ? "Strength" : "Finish"}
        </div>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              disabled={!v.inStock}
              onClick={() => setVariantId(v.id)}
              className={cn(
                "rounded-md border px-4 py-2 text-sm transition-colors",
                v.id === variantId
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border hover:bg-muted",
                !v.inStock && "opacity-40 line-through",
              )}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-md border border-border">
          <button aria-label="Decrease" onClick={() => setQty(Math.max(1, qty - 1))} className="p-3">
            <Minus className="size-4" />
          </button>
          <div className="w-8 text-center text-sm tabular-nums">{qty}</div>
          <button aria-label="Increase" onClick={() => setQty(qty + 1)} className="p-3">
            <Plus className="size-4" />
          </button>
        </div>
        <Button size="lg" className="flex-1" onClick={onAdd} disabled={!variant.inStock || isAdding}>
          {isAdding ? <Loader2 className="size-5 animate-spin" /> : <ShoppingBag />}
          {isAdding ? "Adding..." : variant.inStock ? "Add to cart" : "Sold out"}
        </Button>
        <Button size="lg" variant="outline" aria-label="Wishlist" onClick={() => wl.toggle(product.id)}>
          <Heart className={cn(wl.ids.includes(product.id) && "fill-primary text-primary")} />
        </Button>
      </div>

      <ul className="grid gap-2 pt-2 sm:grid-cols-2">
        {product.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            {f}
          </li>
        ))}
      </ul>

      <Separator />

      <div>
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Specifications</div>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {product.specs.map((s) => (
            <div key={s.label} className="flex justify-between border-b border-border py-2 text-sm">
              <dt className="text-muted-foreground">{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
