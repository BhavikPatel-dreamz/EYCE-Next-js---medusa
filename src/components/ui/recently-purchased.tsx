"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const names = [
  "Alex M.", "Jordan K.", "Sam T.", "Riley P.", "Casey R.",
  "Morgan L.", "Taylor S.", "Quinn D.", "Avery B.", "Reese W.",
];

const cities = [
  "New York", "Los Angeles", "Chicago", "Austin", "Miami",
  "Portland", "Denver", "Seattle", "Boston", "Atlanta",
];

type ProductInfo = { name: string; image: string; price: number; slug: string };

export function RecentlyPurchasedPopup({
  products,
  interval = 12000,
}: {
  products: ProductInfo[];
  interval?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<ProductInfo | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [dismissed, setDismissed] = useState(false);

  const pickRandom = useCallback(() => {
    if (products.length === 0) return;
    const p = products[Math.floor(Math.random() * products.length)];
    const n = names[Math.floor(Math.random() * names.length)];
    const c = cities[Math.floor(Math.random() * cities.length)];
    setCurrent(p);
    setName(n);
    setCity(c);
  }, [products]);

  useEffect(() => {
    if (dismissed || products.length === 0) return;
    const show = () => {
      pickRandom();
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };
    const id = setInterval(show, interval);
    return () => clearInterval(id);
  }, [dismissed, interval, pickRandom, products.length]);

  if (!current) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 260 }}
          className="fixed bottom-6 left-6 z-50 max-w-xs"
        >
          <div className="relative rounded-xl border border-border bg-card shadow-2xl shadow-black/10">
            <button
              onClick={() => { setVisible(false); setDismissed(true); }}
              className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="size-3" />
            </button>
            <Link href={`/product/${current.slug}`} className="flex gap-3 p-3" onClick={() => setVisible(false)}>
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                <Image src={current.image} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{name}</span> from{" "}
                  <span className="font-medium text-foreground">{city}</span> purchased
                </p>
                <p className="mt-0.5 text-sm font-medium truncate">{current.name}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(current.price)}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground/60">Just now</p>
              </div>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RecentlyViewed({
  products,
  title = "Recently viewed",
}: {
  products: { name: string; image: string; slug: string; price: number; currency: string }[];
  title?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container-x">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">{title}</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/product/${p.slug}`}
              className="group flex-shrink-0 w-28"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
                <Image src={p.image} alt="" fill sizes="112px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <p className="mt-2 text-xs font-medium truncate">{p.name}</p>
              <p className="text-[11px] text-muted-foreground font-mono">{formatPrice(p.price, p.currency)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
