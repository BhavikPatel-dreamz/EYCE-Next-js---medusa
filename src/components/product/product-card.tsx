"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, ShoppingBag, Loader2, Eye, Star, GitCompare, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart-store";
import { useWishlist } from "@/store/wishlist-store";
import type { Product } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const has = useWishlist((s) => s.ids.includes(product.id));
  const toggle = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const addingVariantId = useCart((s) => s.addingVariantId);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const variant = product.variants[0];
  const isAdding = addingVariantId === variant?.id;
  const isSoldOut = product.variants.every((v) => !v.inStock);
  const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPct = hasDiscount ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) : 0;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: (index % 4) * 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      },
    );

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant?.inStock || isAdding) return;
    add({
      id: `${product.id}:${variant.id}`,
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      variantName: variant.name,
      price: variant.price,
      currency: product.currency,
      image: product.images[0],
    });
  };

  return (
    <div ref={cardRef} className="group relative opacity-0">
      <Link
        href={`/product/${product.slug}`}
        className="block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface shadow-sm group-hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-700 ease-out",
              hovered && "scale-[1.05]",
            )}
          />

          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300",
            hovered ? "opacity-100" : "opacity-0",
          )} />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {isSoldOut && <Badge variant="muted" className="text-[10px] px-2 py-0.5">Sold out</Badge>}
            {!isSoldOut && product.new && <Badge variant="accent" className="text-[10px] px-2 py-0.5"><span className="animate-pulse-soft">●</span> New</Badge>}
            {!isSoldOut && product.bestseller && <Badge variant="amber" className="text-[10px] px-2 py-0.5"><span className="animate-wiggle inline-block">🔥</span> Bestseller</Badge>}
            {hasDiscount && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose to-destructive px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
                <Zap className="size-2.5" />
                -{discountPct}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className={cn(
            "absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300",
            hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3",
          )}>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); toggle(product.id); }}
              aria-label="Add to wishlist"
              className="flex size-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background transition-all hover:scale-105"
            >
              <Heart className={cn("size-4", has && "fill-primary text-primary")} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); window.open(`/product/${product.slug}`, '_blank'); }}
              aria-label="Quick view"
              className="flex size-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background transition-all hover:scale-105"
            >
              <Eye className="size-4" />
            </button>
          </div>

          {/* Quick Add Button */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-3 transition-all duration-300",
            hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
          )}>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || isSoldOut}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-background/95 backdrop-blur-sm py-3 text-xs font-semibold shadow-lg transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-60 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAdding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShoppingBag className="size-4" />
              )}
              {isAdding ? "Adding..." : isSoldOut ? "Sold out" : "Quick add"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3.5 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-sm font-semibold leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                {product.tagline}
              </p>
            </div>
          </div>

          <Rating value={product.rating} count={product.reviewCount} className="mt-1.5" />

          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-mono text-sm font-bold">
              {formatPrice(product.price, product.currency)}
            </span>
            {hasDiscount && (
              <span className="font-mono text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!, product.currency)}
              </span>
            )}
          </div>

          {/* Color dots */}
          {product.variants.length > 1 && (
            <div className="mt-2 flex items-center gap-1">
              {product.variants.slice(0, 4).map((v) => (
                <span
                  key={v.id}
                  className="size-3 rounded-full border border-border"
                  title={v.name}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="text-[10px] text-muted-foreground">+{product.variants.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
