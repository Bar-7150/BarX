"use client";

import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useState } from "react";

export function AddToCart({ product, quantity = 1, label = "Add to cart" }: { product: Product; quantity?: number; label?: string }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  const out = product.stock <= 0;

  return (
    <button
      disabled={out}
      onClick={() => {
        add(product.id, quantity);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className="btn-acid disabled:cursor-not-allowed disabled:opacity-40"
    >
      {out ? "Out of stock" : done ? "Added" : `${label} · ${inr(product.price * quantity)}`}
    </button>
  );
}
