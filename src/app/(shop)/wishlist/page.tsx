"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { useWishlist } from "@/store/wishlist-store";
import { getProductsByIds } from "@/lib/api";
import type { Product } from "@/types/product";

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductsByIds(ids)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ids]);

  if (loading) {
    return (
      <div className="container-x flex min-h-[60vh] items-center justify-center py-16">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 md:py-24 text-center">
        <Heart className="size-12 text-muted-foreground" />
        <h1 className="font-display text-4xl font-bold">Your wishlist is empty</h1>
        <p className="max-w-md text-muted-foreground">
          Save your favorite products and come back to them later.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/shop">Explore products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-x py-14">
      <h1 className="mb-2 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        Wishlist
      </h1>
      <p className="mb-10 text-muted-foreground">{products.length} saved product{products.length !== 1 ? "s" : ""}</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
