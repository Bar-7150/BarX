"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { productById } from "@/lib/catalog";
import { inr } from "@/lib/format";
import { suggestionsFor } from "@/lib/ai";
import { AddToCart } from "@/components/add-to-cart";

export default function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();
  const lines = items.map((i) => ({ ...i, product: productById(i.productId) })).filter((l) => l.product);
  const suggestions = suggestionsFor(items.map((i) => i.productId));

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">Cart</h1>
        {lines.length === 0 ? (
          <p className="mt-6 text-[#b7b2a4]">
            Empty. Start from a{" "}
            <Link href="/build" className="text-[#d6ff4b]">
              project
            </Link>{" "}
            or the{" "}
            <Link href="/shop" className="text-[#d6ff4b]">
              shop
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {lines.map((l) => (
              <li key={l.productId} className="panel flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <Link href={`/product/${l.product!.slug}`} className="text-lg hover:text-[#d6ff4b]">
                    {l.product!.name}
                  </Link>
                  <p className="font-mono text-xs text-[#8d897c]">{inr(l.product!.price)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={l.quantity}
                    onChange={(e) => setQty(l.productId, Number(e.target.value))}
                    className="w-16 rounded-lg border border-[#23251f] bg-transparent px-2 py-1"
                  />
                  <button onClick={() => remove(l.productId)} className="text-sm text-[#e7a06a]">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {suggestions.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl">Complete your project</h2>
            <p className="mt-1 text-sm text-[#8d897c]">People building with these parts also add:</p>
            <div className="mt-4 space-y-3">
              {suggestions.map((p) => (
                <div key={p.id} className="panel flex items-center justify-between gap-3 p-4">
                  <div>
                    <Link href={`/product/${p.slug}`} className="hover:text-[#d6ff4b]">
                      {p.name}
                    </Link>
                    <p className="font-mono text-xs text-[#8d897c]">{inr(p.price)}</p>
                  </div>
                  <AddToCart product={p} label="Add" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <aside className="panel h-fit p-6">
        <p className="text-[#8d897c]">Subtotal</p>
        <p className="mt-1 text-3xl font-semibold">{inr(subtotal)}</p>
        <p className="mt-2 text-sm text-[#8d897c]">Shipping calculated at checkout. COD available for V1.</p>
        <Link href="/checkout" className={`btn-acid mt-6 w-full ${lines.length === 0 ? "pointer-events-none opacity-40" : ""}`}>
          Checkout
        </Link>
      </aside>
    </div>
  );
}
