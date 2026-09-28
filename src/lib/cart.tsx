"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "./types";
import { productById } from "./catalog";

type CartContextValue = {
  items: CartItem[];
  add: (productId: string, quantity?: number) => void;
  addMany: (lines: CartItem[]) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "barx-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const add = (productId: string, quantity = 1) => {
      setItems((prev) => {
        const found = prev.find((i) => i.productId === productId);
        if (found) {
          return prev.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [...prev, { productId, quantity }];
      });
    };
    const addMany = (lines: CartItem[]) => {
      setItems((prev) => {
        const next = [...prev];
        for (const line of lines) {
          const idx = next.findIndex((i) => i.productId === line.productId);
          if (idx >= 0) next[idx] = { ...next[idx], quantity: next[idx].quantity + line.quantity };
          else next.push({ ...line });
        }
        return next;
      });
    };
    const setQty = (productId: string, quantity: number) => {
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => i.productId !== productId)
          : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
    };
    const remove = (productId: string) => setItems((prev) => prev.filter((i) => i.productId !== productId));
    const clear = () => setItems([]);
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + (productById(i.productId)?.price ?? 0) * i.quantity, 0);
    return { items, add, addMany, setQty, remove, clear, count, subtotal };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
