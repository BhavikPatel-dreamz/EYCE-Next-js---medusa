"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Heart, Menu, Search, ShoppingBag, X, ChevronDown, User } from "lucide-react";
import { useCart } from "@/store/cart-store";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { motion, AnimatePresence } from "framer-motion";

const nav = [
  {
    label: "Shop All",
    href: "/shop",
    children: [
      { name: "Silicone Beaker Bong", href: "/shop?category=bongs" },
      { name: "Mini Beaker", href: "/shop?category=bongs" },
      { name: "Dab Rigs", href: "/shop?category=rigs" },
      { name: "Nectar Collectors", href: "/shop?category=rigs" },
    ],
  },
  {
    label: "Bongs",
    href: "/shop?category=bongs",
  },
  {
    label: "Rigs",
    href: "/shop?category=rigs",
  },
  {
    label: "Pipes",
    href: "/shop?category=pipes",
  },
  {
    label: "Accessories",
    href: "/shop?category=accessories",
    children: [
      { name: "Replacement Bowls", href: "/shop?category=accessories" },
      { name: "Quartz Bangers", href: "/shop?category=accessories" },
      { name: "Stash Containers", href: "/shop?category=accessories" },
      { name: "Cleaning Kits", href: "/shop?category=accessories" },
    ],
  },
  {
    label: "New",
    href: "/shop?featured=true",
    accent: true,
  },
];

export function Navbar() {
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const openCart = useCart((s) => s.open);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-[background,box-shadow] duration-200 ${
          scrolled
            ? "bg-background/96 backdrop-blur-sm shadow-[0_1px_0_0_hsl(var(--border)/0.8)]"
            : "bg-background/80 backdrop-blur-sm border-b border-border/60"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center shrink-0 mr-8">
            <Image
              src="/images/logo.svg"
              alt="EYCE"
              width={140}
              height={40}
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* Center: Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">
            {nav.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-3.5 py-2 text-[13.5px] font-medium rounded-md transition-colors ${
                    item.accent
                      ? "text-primary hover:text-primary/80"
                      : "text-foreground/75 hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className={`size-3 text-foreground/40 transition-transform duration-150 ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                <AnimatePresence>
                  {activeDropdown === item.label && item.children && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                      className="absolute left-0 top-full mt-1 z-50 min-w-[200px]"
                    >
                      <div className="rounded-lg border border-border/80 bg-card shadow-lg shadow-black/30 py-1 overflow-hidden">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="flex size-9 items-center justify-center rounded-md text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
              aria-label="Search"
            >
              <Search className="size-4.5" />
            </Link>

            <Link
              href="/account"
              className="hidden sm:flex size-9 items-center justify-center rounded-md text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
              aria-label="Account"
            >
              <User className="size-4.5" />
            </Link>

            <Link
              href="/wishlist"
              className="flex size-9 items-center justify-center rounded-md text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="size-4.5" />
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={openCart}
              aria-label="Cart"
              className="relative flex size-9 items-center justify-center rounded-md text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <ShoppingBag className="size-4.5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground leading-none">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden ml-1 flex size-9 items-center justify-center rounded-md text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <Menu className="size-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[300px] bg-background flex flex-col lg:hidden border-l border-border"
            >
              {/* Drawer header */}
              <div className="flex h-16 items-center justify-between px-5 border-b border-border/60">
                <Image src="/images/logo.svg" alt="EYCE" width={112} height={32} className="h-6 w-auto" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex size-9 items-center justify-center rounded-md text-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto py-4">
                {nav.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors hover:bg-white/5 ${
                        item.accent ? "text-primary" : "text-foreground/80"
                      }`}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="bg-white/[0.02] border-y border-border/40 py-1.5 mb-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-8 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Bottom actions */}
              <div className="border-t border-border/60 px-5 py-4 flex flex-col gap-2">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <User className="size-4" /> My Account
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Heart className="size-4" /> Wishlist
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}
