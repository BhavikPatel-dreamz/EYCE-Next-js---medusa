"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

const slides = [
  {
    tag: "Premium Disposable Vapes",
    title: "Flavor That\nPacks a Punch",
    desc: "Discover our curated collection of premium disposable vapes. Big clouds, bold flavors, zero hassle.",
    cta: "Shop Now",
    href: "/shop?category=disposable",
    bg: "from-cyan-500/10 via-background to-background",
    accent: "cyan",
    productIdx: 1,
  },
  {
    tag: "Next-Gen Pod Systems",
    title: "Sleek Design.\nMassive Flavor.",
    desc: "Refillable pod systems engineered for the perfect MTL draw. Compact, stylish, and built to last.",
    cta: "Explore Pods",
    href: "/shop?category=pods",
    bg: "from-violet-500/10 via-background to-background",
    accent: "violet",
    productIdx: 2,
  },
  {
    tag: "E-Liquids",
    title: "Craft Nicotine\nPerfected.",
    desc: "From icy menthols to dessert clouds — 100+ premium e-liquid flavors made in the USA.",
    cta: "Browse Flavors",
    href: "/shop?category=e-liquid",
    bg: "from-amber-500/10 via-background to-background",
    accent: "amber",
    productIdx: 4,
  },
];

export function HeroSlider({ products }: { products?: Product[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  }, [current]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[current];
  const product = products?.[slide.productIdx] ?? products?.[current] ?? null;

  return (
    <section className="relative overflow-hidden bg-background">
      <video
        autoPlay muted loop playsInline
        preload="metadata"
        className="absolute inset-0 size-full object-cover opacity-20"
      >
        <source src="https://www.eyce.com/cdn/shop/videos/c/vp/76845b7ddce4478f917e513764c33ebc/76845b7ddce4478f917e513764c33ebc.HD-720p-1.6Mbps-18896941.mp4" type="video/mp4" />
      </video>
      <div className={cn("relative", slide.bg)}>
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-primary/15 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -right-32 top-1/3 size-80 rounded-full bg-violet/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 size-64 rounded-full bg-amber/8 blur-3xl animate-float-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-primary)_0%,_transparent_50%)] opacity-[0.07]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_oklch(0.6_0.2_200)_0%,_transparent_50%)] opacity-[0.04]" />

        <div className="container-x relative z-10">
          <div className="grid items-center gap-10 min-h-[70vh] lg:grid-cols-2 lg:gap-16">
            {/* Left — Copy */}
            <div>
              <motion.span
                key={`tag-${current}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-5 block"
              >
                {slide.tag}
              </motion.span>

              <motion.h1
                key={`title-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl whitespace-pre-line gradient-text"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                key={`desc-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-5 max-w-md text-base text-muted-foreground leading-relaxed"
              >
                {slide.desc}
              </motion.p>

              <motion.div
                key={`cta-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link
                  href={slide.href}
                  className="group inline-flex items-center gap-2 rounded-xl gradient-btn px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg"
                >
                  {slide.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center rounded-xl border border-border px-7 py-3.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  View all products
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                key={`stats-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 flex gap-8 border-t border-border/60 pt-8"
              >
                <div>
                  <p className="font-display text-2xl font-bold">50k+</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Happy customers</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold">Free ship</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">On orders $60+</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold">100%</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Authentic products</p>
                </div>
              </motion.div>
            </div>

            {/* Right — Image / Video */}
            <motion.div
              key={`img-${current}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface shadow-2xl">
                {product?.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-violet/20">
                    <span className="font-display text-4xl font-bold gradient-text">EYCE</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Glass card overlay */}
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl px-5 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold text-white/80 backdrop-blur-sm">
                      Featured
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    {product?.name ?? "Premium Vape Collection"}
                  </p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {product
                      ? formatPrice(product.price, product.currency)
                      : "Shop the collection"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex size-11 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground hover:bg-background transition-all shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex size-11 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground hover:bg-background transition-all shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === current ? "w-8 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground",
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
