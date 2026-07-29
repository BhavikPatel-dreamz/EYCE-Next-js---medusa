"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Heart, Menu, Search, ShoppingBag, X, ChevronDown, ChevronRight, User, ArrowRight, Star, Package, Zap, Droplets, Wrench } from "lucide-react";
import { useCart } from "@/store/cart-store";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { motion, AnimatePresence } from "framer-motion";

const megaMenuData: Record<string, {
  featured: { name: string; image: string; href: string; tag?: string }[];
  columns: { title: string; links: { name: string; href: string }[] }[];
}> = {
  "Disposable": {
    featured: [
      { name: "Geek Bar Pulse", image: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=400&auto=format&fit=crop&q=85", href: "/shop?category=disposable", tag: "Bestseller" },
      { name: "Elf Bar BC5000", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&auto=format&fit=crop&q=85", href: "/shop?category=disposable", tag: "Popular" },
      { name: "Lost Mary MO5000", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=85", href: "/shop?category=disposable" },
    ],
    columns: [
      { title: "Brands", links: [
        { name: "Geek Bar", href: "/shop?q=Geek+Bar" },
        { name: "Elf Bar", href: "/shop?q=Elf+Bar" },
        { name: "Lost Mary", href: "/shop?q=Lost+Mary" },
        { name: "All Disposables", href: "/shop?category=disposable" },
      ]},
      { title: "Shop By", links: [
        { name: "New Arrivals", href: "/shop?sort=newest" },
        { name: "Bestsellers", href: "/shop" },
        { name: "On Sale", href: "/shop?onSale=1" },
        { name: "All Products", href: "/shop" },
      ]},
    ],
  },
  "Pods": {
    featured: [
      { name: "SMOK Novo 5", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&auto=format&fit=crop&q=85", href: "/shop?category=pods", tag: "Bestseller" },
      { name: "Vaporesso XROS 3", image: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=400&auto=format&fit=crop&q=85", href: "/shop?category=pods", tag: "New" },
    ],
    columns: [
      { title: "Brands", links: [
        { name: "SMOK", href: "/shop?q=SMOK" },
        { name: "Vaporesso", href: "/shop?q=Vaporesso" },
        { name: "Uwell", href: "/shop?q=Uwell" },
        { name: "All Pod Systems", href: "/shop?category=pods" },
      ]},
    ],
  },
  "E-Liquids": {
    featured: [
      { name: "Naked 100", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=85", href: "/shop?category=e-liquid", tag: "Popular" },
      { name: "Juice Head", image: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=400&auto=format&fit=crop&q=85", href: "/shop?category=e-liquid" },
    ],
    columns: [
      { title: "Flavors", links: [
        { name: "Fruit", href: "/shop?q=fruit" },
        { name: "Menthol", href: "/shop?q=menthol" },
        { name: "Dessert", href: "/shop?q=dessert" },
        { name: "All E-Liquids", href: "/shop?category=e-liquid" },
      ]},
    ],
  },
};

const nav = [
  { label: "Disposable", href: "/shop?category=disposable", mega: true },
  { label: "Pods", href: "/shop?category=pods", mega: true },
  { label: "E-Liquids", href: "/shop?category=e-liquid", mega: true },
  { label: "Starter Kits", href: "/shop?category=kits" },
  { label: "Accessories", href: "/shop?category=accessories" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const openCart = useCart((s) => s.open);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/85 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-border/50"
            : "bg-background"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/logo.svg"
              alt="EYCE"
              width={140}
              height={40}
              priority
              className="h-7 w-auto"
            />
          </Link>

          {/* Center: Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {nav.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.mega && handleMouseEnter(item.label)}
                onMouseLeave={() => item.mega && handleMouseLeave()}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                    activeDropdown === item.label
                      ? "text-foreground bg-surface"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
                  }`}
                >
                  {item.label}
                  {item.mega && (
                    <ChevronDown
                      className={`size-3 transition-transform duration-200 ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Mega Menu */}
                {item.mega && megaMenuData[item.label] && (
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50"
                        onMouseEnter={() => handleMouseEnter(item.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="w-[520px] rounded-xl border border-border bg-card shadow-xl shadow-black/5 overflow-hidden">
                          <div className="p-6">
                            <div className="flex gap-6">
                              {/* Links */}
                              <div className="flex-1 flex gap-6">
                                {megaMenuData[item.label].columns.map((col) => (
                                  <div key={col.title}>
                                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                                      {col.title}
                                    </div>
                                    <ul className="space-y-1">
                                      {col.links.map((link) => (
                                        <li key={link.name}>
                                          <Link
                                            href={link.href}
                                            className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-surface rounded-md transition-colors"
                                          >
                                            {link.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>

                              {/* Featured */}
                              <div className="w-[180px] shrink-0">
                                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                                  Featured
                                </div>
                                <div className="space-y-2.5">
                                  {megaMenuData[item.label].featured.map((f) => (
                                    <Link
                                      key={f.name}
                                      href={f.href}
                                      className="group flex gap-3 rounded-lg p-2 hover:bg-surface transition-colors"
                                    >
                                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                                        <Image
                                          src={f.image}
                                          alt={f.name}
                                          fill
                                          sizes="56px"
                                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                      </div>
                                      <div className="flex flex-col justify-center min-w-0">
                                        <span className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                                          {f.name}
                                        </span>
                                        {f.tag && (
                                          <span className="mt-1 inline-flex w-fit items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                                            <Star className="size-2 fill-primary" />
                                            {f.tag}
                                          </span>
                                        )}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="border-t border-border bg-surface/30 px-6 py-3">
                            <Link
                              href="/shop"
                              className="flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                              View all products
                              <ArrowRight className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-0.5">
            {/* Search trigger */}
            <Link
              href="/search"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              aria-label="Search"
            >
              <Search className="size-[18px]" />
            </Link>

            <Link
              href="/account"
              className="hidden sm:flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              aria-label="Account"
            >
              <User className="size-[18px]" />
            </Link>

            <Link
              href="/wishlist"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="size-[18px]" />
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={openCart}
              aria-label="Cart"
              className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
            >
              <ShoppingBag className="size-[18px]" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground leading-none">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden ml-1 flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-lg"
            onClick={() => setSearchOpen(false)}
          >
            <div className="container-x pt-24" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, flavors..."
                  className="w-full h-14 rounded-xl border border-border bg-card pl-12 pr-14 text-lg font-display placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-surface text-muted-foreground"
                >
                  <X className="size-5" />
                </button>
              </form>

              {!searchQuery && (
                <div className="mt-8 max-w-2xl mx-auto grid gap-8 sm:grid-cols-2">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                      Popular categories
                    </div>
                    <div className="space-y-1">
                      {[
                        { name: "Vaporizers", slug: "vaporizers", icon: Zap },
                        { name: "Pods & Mods", slug: "pods-and-mods", icon: Package },
                        { name: "E-Liquids", slug: "e-liquids", icon: Droplets },
                        { name: "Accessories", slug: "accessories", icon: Wrench },
                      ].map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <Link
                            key={cat.slug}
                            href={`/shop?category=${cat.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-surface rounded-lg transition-colors"
                          >
                            <Icon className="size-4 text-primary" />
                            {cat.name}
                          </Link>
                        );
                      })}
                      <Link
                        href="/shop"
                        onClick={() => setSearchOpen(false)}
                        className="block px-2 py-1.5 text-sm font-medium text-primary hover:bg-surface rounded-lg transition-colors"
                      >
                        Browse all →
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                      Quick links
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["New arrivals", "Best sellers", "On sale", "Silicone", "Gift cards", "Bundles"].map((term) => (
                        <Link
                          key={term}
                          href={`/search?q=${encodeURIComponent(term)}`}
                          onClick={() => setSearchOpen(false)}
                          className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
                        >
                          {term}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {searchQuery && (
                <div className="mt-6 max-w-2xl mx-auto">
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-surface transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="size-4 text-muted-foreground" />
                      <span className="text-sm">
                        Search for &ldquo;<span className="font-medium">{searchQuery}</span>&rdquo;
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Enter</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[320px] bg-background flex flex-col lg:hidden border-l border-border shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex h-16 items-center justify-between px-5 border-b border-border/60">
                <Image src="/images/logo.svg" alt="EYCE" width={112} height={32} className="h-6 w-auto" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto py-3">
                {nav.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-5 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-surface transition-colors"
                    >
                      {item.label}
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </Link>
                    {item.mega && megaMenuData[item.label] && (
                      <div className="bg-surface/30 border-y border-border/30 py-1.5 mb-1">
                        {megaMenuData[item.label].columns.flatMap((col) => col.links).slice(0, 4).map((child) => (
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
              <div className="border-t border-border/60 px-5 py-4 flex flex-col gap-1">
                <Link
                  href="/search"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-surface px-2"
                >
                  <Search className="size-4" /> Search
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-surface px-2"
                >
                  <User className="size-4" /> My Account
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-surface px-2"
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
