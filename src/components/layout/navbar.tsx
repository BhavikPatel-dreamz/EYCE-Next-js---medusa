"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart-store";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { motion, AnimatePresence } from "framer-motion";

const nav = [
  { href: "/shop", label: "Shop all" },
];

export function Navbar() {
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const openCart = useCart((s) => s.open);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between gap-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="font-display text-xl font-bold tracking-tight">
              EYCE<span className="text-primary">.</span>
            </Link>
            <nav className="hidden items-center gap-7 md:flex">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/search">
              <Button variant="ghost" size="icon" aria-label="Search"><Search /></Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" aria-label="Wishlist"><Heart /></Button>
            </Link>
            <Button variant="ghost" size="icon" aria-label="Cart" onClick={openCart} className="relative">
              <ShoppingBag />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Menu" onClick={() => setMobileOpen(true)} className="md:hidden">
              <Menu />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background lg:hidden"
          >
            <div className="container-x flex h-16 items-center justify-between border-b border-border">
              <Link href="/" onClick={() => setMobileOpen(false)} className="font-display text-xl font-bold tracking-tight">
                EYCE<span className="text-primary">.</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}><X /></Button>
            </div>
            <nav className="container-x mt-6 flex flex-col gap-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border py-4 font-display text-2xl font-bold tracking-tight"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 border-b border-border py-4 font-display text-2xl font-bold tracking-tight"
              >
                <Heart className="size-5" /> Wishlist
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}
