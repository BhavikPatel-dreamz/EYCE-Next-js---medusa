"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/product";
import { useGsapStagger, useGsapReveal } from "@/hooks/use-gsap";

export function Categories({ categories }: { categories: Category[] }) {
  const headerRef = useGsapReveal({ y: 25, duration: 0.6 });
  const gridRef = useGsapStagger(".cat-card", { y: 30, stagger: 0.1 });

  return (
    <section className="container-x py-20">
      <div ref={headerRef} className="mb-10 flex items-end justify-between gap-6 opacity-0">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary mb-2">
            Shop by category
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Pick your <span className="gradient-text">shape.</span>
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden md:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View all <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c, i) => {
          const gradients = [
            "from-primary/20 via-violet/10 to-transparent",
            "from-violet/20 via-rose/10 to-transparent",
            "from-amber/20 via-rose/10 to-transparent",
            "from-teal/20 via-primary/10 to-transparent",
          ];
          return (
            <div key={c.id} className="cat-card opacity-0">
              <Link
                href={`/shop?category=${c.slug}`}
                className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl bg-surface card-hover"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t", gradients[i % gradients.length])} />
                <div className="relative mt-auto p-5">
                  <p className="font-display text-xl font-bold text-white">{c.name}</p>
                  <p className="mt-1 text-xs text-white/60">{c.description}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
