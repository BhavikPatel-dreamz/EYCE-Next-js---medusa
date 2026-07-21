"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

export function Hero({ product }: { product?: Product | null }) {
  const img = product?.images?.[0] || "";
  return (
    <section className="relative overflow-hidden">
      <div className="container-x grid items-end gap-10 py-14 md:grid-cols-12 md:pb-28 md:pt-20">
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Silicone-first &middot; Est. 2013
            </div>
            <h1 className="mt-6 font-display text-6xl font-bold leading-[0.95] md:text-8xl">
              Built to<br />bounce.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Bongs, rigs, and pipes engineered from platinum-cured silicone. Drop them, freeze them, live with them.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/shop">Shop all <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/shop?category=bongs">Bongs</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative md:col-span-5"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface">
            {img ? (
              <Image
                src={img}
                alt="EYCE products"
                fill
                className="object-cover"
                sizes="600px"
                priority
              />
            ) : null}
          </div>
        </motion.div>
      </div>
      <div className="border-t border-border">
        <div className="container-x flex flex-wrap gap-x-10 gap-y-2 py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <span>Free ship over $60</span>
          <span>Lifetime warranty</span>
          <span>Ships in 24h</span>
          <span>Dishwasher safe</span>
        </div>
      </div>
    </section>
  );
}
