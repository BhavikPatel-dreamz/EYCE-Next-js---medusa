"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/product";
import { useGsapHero } from "@/hooks/use-gsap";

const HERO_FALLBACK =
  "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=1000&auto=format&fit=crop&q=85";

export function Hero({ product }: { product?: Product | null }) {
  const heroRef = useGsapHero();
  const img = product?.images?.[0] || HERO_FALLBACK;

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-background">
      <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">

        {/* Left — copy */}
        <div>
          <p className="hero-tag font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-5 opacity-0">
            Silicone-first · Est. 2013
          </p>

          <h1 className="hero-title font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl opacity-0">
            Built to<br />bounce.
          </h1>

          <p className="hero-desc mt-5 max-w-md text-base text-muted-foreground leading-relaxed opacity-0">
            Bongs, rigs, and hand pipes made from 100% platinum-cured silicone.
            Drop them, freeze them, throw them in the dishwasher — they&apos;ll outlast any glass piece you&apos;ve ever owned.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="hero-cta inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors opacity-0"
            >
              Shop all gear <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/shop?category=bongs"
              className="hero-cta inline-flex items-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-foreground/40 hover:bg-black/5 transition-colors opacity-0"
            >
              Bongs &amp; Rigs
            </Link>
          </div>

          {/* Quick stats */}
          <div className="hero-stats mt-10 flex gap-8 border-t border-border/60 pt-8 opacity-0">
            <div>
              <p className="font-display text-2xl font-bold text-foreground">40k+</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Happy customers</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">Lifetime</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Warranty</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">100%</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Silicone</p>
            </div>
          </div>
        </div>

        {/* Right — product image */}
        <div className="hero-image relative opacity-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
            <Image
              src={img}
              alt="EYCE silicone products"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />

            {/* Floating product callout */}
            <div className="hero-callout absolute bottom-5 left-5 right-5 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md px-4 py-3 opacity-0">
              <p className="text-[11px] font-mono uppercase tracking-widest text-white/50 mb-0.5">Featured</p>
              <p className="text-sm font-semibold text-white">
                {product?.name ?? "Molino Beaker Bong"}
              </p>
              <p className="text-xs text-white/50 mt-0.5">Platinum silicone · Lifetime warranty</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div className="border-t border-border/60">
        <div className="container-x flex flex-wrap items-center gap-x-8 gap-y-2 py-3.5">
          {["Free shipping over $60", "Lifetime warranty", "Ships in 24h", "Dishwasher safe"].map((item) => (
            <span key={item} className="hero-strip-item flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground opacity-0">
              <span className="size-1 rounded-full bg-primary/70 shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
