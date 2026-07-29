"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";
import { useGsapReveal } from "@/hooks/use-gsap";
import { useLazyVideo } from "@/hooks/use-lazy-video";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

const SALE_END = new Date(Date.now() + 86400000 * 2 + 3600000 * 5 + 60000 * 30);

export function FlashSale({ products = [] }: { products?: Product[] }) {
  const ref = useGsapReveal({ y: 20 });
  const videoRef = useLazyVideo();

  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-border/60">
      <video
        ref={videoRef}
        muted loop playsInline
        preload="none"
        className="absolute inset-0 size-full object-cover opacity-30"
      >
        <source src="https://www.eyce.com/cdn/shop/videos/c/vp/76845b7ddce4478f917e513764c33ebc/76845b7ddce4478f917e513764c33ebc.HD-720p-1.6Mbps-18896941.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-rose/10 via-amber/5 to-rose/10" />
      <div className="absolute inset-0 animate-gradient bg-[length:200%_200%] bg-[radial-gradient(ellipse_at_20%_50%,_var(--color-rose)_0%,_transparent_50%),_radial-gradient(ellipse_at_80%_50%,_var(--color-amber)_0%,_transparent_50%)] opacity-[0.06]" />
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-rose/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-amber/10 blur-3xl" />
      <div ref={ref} className="container-x relative py-16 md:py-20 opacity-0">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose/20 to-amber/20 px-4 py-1.5 mb-4 animate-countdown">
            <Zap className="size-4 text-rose" />
            <span className="text-xs font-bold text-rose uppercase tracking-wider">Flash Sale</span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl gradient-text">Limited time offers</h2>
          <p className="mt-2 text-sm text-muted-foreground">Grab these deals before they&apos;re gone</p>
          <CountdownTimer target={SALE_END} size="lg" className="mt-4" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => {
            const hasDiscount = p.compareAtPrice != null && p.compareAtPrice > p.price;
            const discountPct = hasDiscount
              ? Math.round(((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100)
              : 0;
            return (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group relative rounded-xl border border-border bg-card overflow-hidden card-hover"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-rose to-destructive px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                      <Zap className="size-3" />
                      -{discountPct}%
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{p.name}</h3>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="font-mono text-sm font-bold text-rose">
                      {formatPrice(p.price, p.currency)}
                    </span>
                    {hasDiscount && (
                      <span className="font-mono text-xs text-muted-foreground line-through">
                        {formatPrice(p.compareAtPrice!, p.currency)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/shop?onSale=1"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all deals <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
