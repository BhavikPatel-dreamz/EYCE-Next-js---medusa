"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { X, Minus, Plus, ShoppingBag, Loader2, Tag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShippingBar } from "@/components/ui/shipping-bar";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, close, items, update, remove, removingItemId } = useCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = useCallback(() => {
    if (coupon.trim().toUpperCase() === "VAPE20") {
      setCouponApplied(true);
    }
  }, [coupon]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="font-display text-xl font-bold">
                Your bag
                {items.length > 0 && (
                  <span className="ml-2 text-sm font-mono text-muted-foreground">
                    ({items.reduce((a, i) => a + i.quantity, 0)})
                  </span>
                )}
              </div>
              <button onClick={close} aria-label="Close" className="rounded-md p-2 hover:bg-muted transition-colors">
                <X className="size-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-surface">
                  <ShoppingBag className="size-8 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-display text-lg font-bold">Your bag is empty</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Time to stock up on your favorites.
                  </p>
                </div>
                <Button asChild onClick={close}>
                  <Link href="/shop">Shop all</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {/* Shipping bar */}
                  <ShippingBar subtotal={subtotal} className="mb-4" />

                  <ul className="divide-y divide-border">
                    {items.map((i) => (
                      <li key={i.id} className="flex gap-4 py-4">
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface shadow-sm">
                          <Image src={i.image} alt={i.name} fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/product/${i.slug}`}
                                className="text-sm font-medium hover:text-primary transition-colors line-clamp-1"
                              >
                                {i.name}
                              </Link>
                              <div className="text-xs text-muted-foreground mt-0.5">{i.variantName}</div>
                            </div>
                            <div className="font-mono text-sm font-medium shrink-0">
                              {formatPrice(i.price * i.quantity, i.currency)}
                            </div>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-md border border-border bg-surface/30">
                              <button
                                className="p-1.5 hover:text-foreground transition-colors"
                                onClick={() => update(i.id, i.quantity - 1)}
                                aria-label="Decrease"
                              >
                                <Minus className="size-3" />
                              </button>
                              <div className="w-8 text-center text-xs tabular-nums">{i.quantity}</div>
                              <button
                                className="p-1.5 hover:text-foreground transition-colors"
                                onClick={() => update(i.id, i.quantity + 1)}
                                aria-label="Increase"
                              >
                                <Plus className="size-3" />
                              </button>
                            </div>
                            <button
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive disabled:opacity-50 transition-colors"
                              onClick={() => remove(i.id)}
                              disabled={removingItemId === i.id}
                            >
                              {removingItemId === i.id ? <Loader2 className="size-3 animate-spin" /> : null}
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Coupon */}
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => { setCoupon(e.target.value); setCouponApplied(false); }}
                          placeholder="Coupon code"
                          className="w-full h-9 rounded-lg border border-border bg-surface/50 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!coupon.trim() || couponApplied}
                        className={cn(
                          "h-9 rounded-lg px-4 text-xs font-semibold transition-all",
                          couponApplied
                            ? "bg-success/10 text-success border border-success/30"
                            : "bg-primary text-primary-foreground hover:bg-primary/90",
                        )}
                      >
                        {couponApplied ? "Applied!" : "Apply"}
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="mt-1.5 text-[10px] text-success">20% discount applied!</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-border px-6 py-5 bg-surface/20">
                  {couponApplied && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Discount (20%)</span>
                      <span className="text-success font-medium">-{formatPrice(subtotal * 0.2, items[0]?.currency)}</span>
                    </div>
                  )}
                  <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Total</span>
                    <span className="font-display text-2xl font-bold">
                      {formatPrice(couponApplied ? subtotal * 0.8 : subtotal, items[0]?.currency)}
                    </span>
                  </div>
                  <Separator className="my-4" />
                  <Button asChild size="lg" className="w-full rounded-xl shadow-lg shadow-primary/20" onClick={close}>
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                  <Button asChild variant="ghost" className="mt-2 w-full" onClick={close}>
                    <Link href="/cart">View bag</Link>
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
