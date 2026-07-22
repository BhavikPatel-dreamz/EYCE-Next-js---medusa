"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart-store";
import { useWishlist } from "@/store/wishlist-store";
import type { Product } from "@/types/product";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const has = useWishlist((s) => s.ids.includes(product.id));
  const toggle = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const addingVariantId = useCart((s) => s.addingVariantId);

  const variant = product.variants[0];
  const isAdding = addingVariantId === variant?.id;
  const isSoldOut = product.variants.every((v) => !v.inStock);

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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {isSoldOut && <Badge variant="muted">Sold out</Badge>}
            {!isSoldOut && product.new && <Badge variant="accent">New</Badge>}
            {!isSoldOut && product.bestseller && <Badge>Bestseller</Badge>}
            {!isSoldOut && product.compareAtPrice && <Badge variant="outline">Sale</Badge>}
          </div>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); toggle(product.id); }}
            aria-label="Add to wishlist"
            className="absolute right-3 top-3 rounded-md bg-background/70 p-2 backdrop-blur hover:bg-background transition-colors"
          >
            <Heart className={cn("size-4", has && "fill-primary text-primary")} />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || isSoldOut}
            aria-label="Add to cart"
            className="absolute bottom-3 right-3 rounded-md bg-background/70 p-2 backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
          >
            {isAdding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShoppingBag className="size-4" />
            )}
          </button>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <div className="min-w-0">
            <div className="font-display font-semibold">{product.name}</div>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">{product.tagline}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm">{formatPrice(product.price, product.currency)}</div>
            {product.compareAtPrice && (
              <div className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
