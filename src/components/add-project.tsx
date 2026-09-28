"use client";

import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";
import type { Project } from "@/lib/types";
import { productById } from "@/lib/catalog";

export function AddProjectToCart({ project, label = "Add project to cart" }: { project: Project; label?: string }) {
  const { addMany } = useCart();
  return (
    <button
      className="btn-acid"
      onClick={() => addMany(project.components.map((c) => ({ productId: c.productId, quantity: c.quantity })))}
    >
      {label}
      <span className="font-normal opacity-70">
        {inr(
          project.components.reduce((n, c) => n + (productById(c.productId)?.price ?? 0) * c.quantity, 0),
        )}
      </span>
    </button>
  );
}
