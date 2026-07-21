"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createCart as apiCreateCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  getCart as apiGetCart,
  type MedusaCart,
} from "@/lib/api";
import type { CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
  cartId: string | null;
  isOpen: boolean;
  loading: boolean;
  addingVariantId: string | null;
  removingItemId: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
  update: (id: string, quantity: number) => Promise<void>;
  pendingMutations: () => Promise<void>;
  sync: () => Promise<void>;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

function syncCartItems(
  cart: MedusaCart,
  prev: CartItem[],
  addedItem?: CartItem,
): CartItem[] {
  return cart.items.map((li) => {
    const product = li.variant?.product;
    const prevItem =
      prev.find((p) => p.variantId === li.variant_id) ??
      (addedItem?.variantId === li.variant_id ? addedItem : undefined);
    return {
      id: li.id,
      productId: product?.id ?? prevItem?.productId ?? "",
      variantId: li.variant_id,
      slug: product?.handle ?? prevItem?.slug ?? "",
      name: product?.title ?? prevItem?.name ?? li.title,
      variantName: li.variant?.title ?? prevItem?.variantName ?? "",
      price: Math.round(li.unit_price / 100),
      image: product?.thumbnail ?? prevItem?.image ?? "",
      quantity: li.quantity,
    };
  });
}

let cartCreationPromise: Promise<string> | null = null;
let mutationQueue: Promise<void> = Promise.resolve();

async function ensureCartId(get: () => CartState, set: (partial: Partial<CartState>) => void): Promise<string> {
  const { cartId } = get();
  if (cartId) return cartId;

  if (!cartCreationPromise) {
    cartCreationPromise = apiCreateCart()
      .then((cart) => {
        set({ cartId: cart.id });
        return cart.id;
      })
      .finally(() => {
        cartCreationPromise = null;
      });
  }

  return cartCreationPromise;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      isOpen: false,
      loading: false,
      addingVariantId: null,
      removingItemId: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      add: async (item, qty = 1) => {
        mutationQueue = mutationQueue.then(async () => {
          const prevItems = get().items;
          const existing = prevItems.find((i) => i.variantId === item.variantId);

          if (existing) {
            set((s) => ({
              items: s.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + qty }
                  : i,
              ),
              isOpen: true,
              addingVariantId: item.variantId,
            }));
          } else {
            set((s) => ({
              items: [...s.items, { ...item, quantity: qty }],
              isOpen: true,
              addingVariantId: item.variantId,
            }));
          }

          try {
            const cartId = await ensureCartId(get, set);
            const cart = await apiAddToCart(cartId, item.variantId, qty);
            set((s) => ({
              items: syncCartItems(cart, s.items, { ...item, quantity: qty }),
              addingVariantId: null,
            }));
          } catch (err) {
            console.error("Failed to add item to Medusa cart:", err);
            set({ items: prevItems, addingVariantId: null });
          }
        });
        return mutationQueue;
      },

      remove: async (id) => {
        mutationQueue = mutationQueue.then(async () => {
          const { cartId } = get();
          const removedItem = get().items.find((i) => i.id === id);

          set({ removingItemId: id });
          set((s) => ({
            items: s.items.filter((i) => i.id !== id),
          }));

          if (!cartId) {
            set({ removingItemId: null });
            return;
          }

          try {
            await apiRemoveCartItem(cartId, id);
          } catch (err) {
            console.error("Failed to remove item from Medusa cart:", err);
            if (removedItem) {
              set((s) => ({ items: [...s.items, removedItem] }));
            }
          } finally {
            set({ removingItemId: null });
          }
        });
        return mutationQueue;
      },

      update: async (id, quantity) => {
        mutationQueue = mutationQueue.then(async () => {
          const { cartId } = get();
          if (quantity <= 0) {
            return get().remove(id);
          }

          const prevItem = get().items.find((i) => i.id === id);

          set((s) => ({
            items: s.items
              .map((i) => (i.id === id ? { ...i, quantity } : i))
              .filter((i) => i.quantity > 0),
          }));

          if (!cartId) return;

          try {
            await apiUpdateCartItem(cartId, id, quantity);
          } catch (err) {
            console.error("Failed to update cart item:", err);
            if (prevItem) {
              set((s) => ({
                items: s.items.map((i) => (i.id === id ? prevItem : i)),
              }));
            }
          }
        });
        return mutationQueue;
      },

      clear: () => set({ items: [], cartId: null }),

      pendingMutations: () => mutationQueue,

      sync: async () => {
        const { cartId } = get();
        if (!cartId) return;
        try {
          const cart = await apiGetCart(cartId);
          set({ items: syncCartItems(cart, get().items) });
        } catch (err) {
          console.error("Failed to sync cart:", err);
        }
      },
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: "vn-cart" },
  ),
);

if (typeof window !== "undefined") {
  const { cartId } = useCart.getState();
  if (!cartId) {
    ensureCartId(useCart.getState.bind(useCart), useCart.setState.bind(useCart)).catch(() => {});
  }
}
