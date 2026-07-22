"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

export function CartDrawer() {
  const { isOpen, close, items, update, remove, removingItemId } = useCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="font-display text-xl font-bold">Your bag</div>
              <button onClick={close} aria-label="Close" className="rounded-md p-2 hover:bg-muted transition-colors">
                <X className="size-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag className="size-10 text-muted-foreground" />
                <div>
                  <div className="font-display text-lg font-bold">Your bag is empty</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Explore our bongs, rigs, and pipes.
                  </p>
                </div>
                <Button asChild onClick={close}>
                  <Link href="/shop">Shop all</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="divide-y divide-border">
                    {items.map((i) => (
                      <li key={i.id} className="flex gap-4 py-4">
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-surface">
                          <Image src={i.image} alt={i.name} fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <div>
                              <div className="text-sm font-medium">{i.name}</div>
                              <div className="text-xs text-muted-foreground">{i.variantName}</div>
                            </div>
                            <div className="font-mono text-sm">{formatPrice(i.price * i.quantity, i.currency)}</div>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-md border border-border">
                              <button className="p-1.5" onClick={() => update(i.id, i.quantity - 1)} aria-label="Decrease">
                                <Minus className="size-3" />
                              </button>
                              <div className="w-8 text-center text-xs tabular-nums">{i.quantity}</div>
                              <button className="p-1.5" onClick={() => update(i.id, i.quantity + 1)} aria-label="Increase">
                                <Plus className="size-3" />
                              </button>
                            </div>
                            <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary disabled:opacity-50 transition-colors" onClick={() => remove(i.id)} disabled={removingItemId === i.id}>
                              {removingItemId === i.id ? <Loader2 className="size-3 animate-spin" /> : null}
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-border px-6 py-5">
                  <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span><span>Calculated at checkout</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Subtotal</span>
                    <span className="font-display text-2xl font-bold">{formatPrice(subtotal, items[0]?.currency)}</span>
                  </div>
                  <Separator className="my-4" />
                  <Button asChild size="lg" className="w-full" onClick={close}>
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
