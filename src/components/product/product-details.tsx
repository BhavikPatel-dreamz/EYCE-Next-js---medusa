"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Heart, Check, Loader2, Zap, Share2, Truck, Shield, RotateCcw } from "lucide-react";
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
  const router = useRouter();

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const isAdding = addingVariantId === variant.id;
  const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPct = hasDiscount ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) : 0;

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

  const onBuyNow = async () => {
    if (!variant.inStock || isAdding) return;
    const ok = await add(
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
    if (ok) router.push("/checkout");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
      {/* Badges & Share */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {product.new && <Badge variant="accent">New</Badge>}
          {product.bestseller && <Badge>Bestseller</Badge>}
          {hasDiscount && (
            <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-bold text-red-500">
              Save {discountPct}%
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
          aria-label="Share"
        >
          <Share2 className="size-4" />
        </button>
      </div>

      {/* Title */}
      <div>
        <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{product.tagline}</p>
        <div className="mt-3"><Rating value={product.rating} count={product.reviewCount} /></div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-3xl font-bold tracking-tight">
          {formatPrice(variant.price, product.currency)}
        </span>
        {hasDiscount && (
          <span className="font-mono text-lg text-muted-foreground line-through">
            {formatPrice(product.compareAtPrice!, product.currency)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-foreground/70">{product.longDescription}</p>

      <Separator />

      {/* Variant Selector */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {product.category === "e-liquids" ? "Strength" : "Finish"}
          </span>
          <span className="text-xs text-muted-foreground">{variant.name}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              disabled={!v.inStock}
              onClick={() => setVariantId(v.id)}
              className={cn(
                "relative rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200",
                v.id === variantId
                  ? "border-primary bg-primary/5 text-foreground shadow-sm shadow-primary/10"
                  : "border-border hover:border-foreground/20 hover:bg-surface",
                !v.inStock && "opacity-30 line-through cursor-not-allowed",
              )}
            >
              {v.name}
              {v.id === variantId && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity + Add to Cart */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* Quantity */}
          <div className="flex items-center rounded-lg border border-border bg-surface/50">
            <button
              aria-label="Decrease"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="flex size-11 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Minus className="size-4" />
            </button>
            <div className="w-10 text-center text-sm font-semibold tabular-nums">{qty}</div>
            <button
              aria-label="Increase"
              onClick={() => setQty(qty + 1)}
              className="flex size-11 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="size-4" />
            </button>
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            className="flex-1 h-12 rounded-lg font-semibold shadow-lg shadow-primary/20"
            onClick={onAdd}
            disabled={!variant.inStock || isAdding}
          >
            {isAdding ? <Loader2 className="size-5 animate-spin" /> : <ShoppingBag className="size-5" />}
            {isAdding ? "Adding..." : variant.inStock ? "Add to cart" : "Sold out"}
          </Button>
        </div>

        {/* Buy Now */}
        <Button
          size="lg"
          variant="outline"
          className="h-12 rounded-lg font-semibold"
          onClick={onBuyNow}
          disabled={!variant.inStock || isAdding}
        >
          <Zap className="size-5" />
          Buy it now
        </Button>

        {/* Wishlist */}
        <Button
          size="lg"
          variant="ghost"
          className="rounded-lg font-medium"
          onClick={() => wl.toggle(product.id)}
        >
          <Heart className={cn("size-5", wl.ids.includes(product.id) && "fill-primary text-primary")} />
          {wl.ids.includes(product.id) ? "In wishlist" : "Add to wishlist"}
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 rounded-xl border border-border/60 bg-surface/30 p-4">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Truck className="size-4 text-primary" />
          <span className="text-[10px] text-muted-foreground leading-tight">Free shipping<br />$60+</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Shield className="size-4 text-primary" />
          <span className="text-[10px] text-muted-foreground leading-tight">Lifetime<br />warranty</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <RotateCcw className="size-4 text-primary" />
          <span className="text-[10px] text-muted-foreground leading-tight">30-day<br />returns</span>
        </div>
      </div>

      {/* Features */}
      {product.features.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-surface/30 p-5">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Key Features
          </h3>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="size-2.5 text-primary" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
