"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/session";
import { productById } from "@/lib/catalog";
import { inr } from "@/lib/format";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { session, signIn } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (items.length === 0) {
      setError("Cart is empty.");
      return;
    }
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      address: String(form.get("address") || ""),
      city: String(form.get("city") || ""),
      pincode: String(form.get("pincode") || ""),
      items,
    };
    setBusy(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not place order");
      return;
    }
    signIn(payload.name, payload.email);
    clear();
    router.push(`/account/orders/${data.order.id}`);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">Checkout</h1>
        <p className="text-sm text-[#8d897c]">Cash on delivery for this V1. Razorpay plugs in later.</p>
        {["name", "email", "phone", "address", "city", "pincode"].map((field) => (
          <label key={field} className="block text-sm">
            <span className="capitalize text-[#b7b2a4]">{field}</span>
            <input
              required
              name={field}
              type={field === "email" ? "email" : "text"}
              defaultValue={field === "email" ? session?.email : field === "name" ? session?.name : ""}
              className="mt-1 w-full rounded-xl border border-[#23251f] bg-[#0c0e0a] px-3 py-2"
            />
          </label>
        ))}
        {error && <p className="text-sm text-[#e7a06a]">{error}</p>}
        <button className="btn-acid" disabled={busy}>
          {busy ? "Placing…" : `Place order · ${inr(subtotal)}`}
        </button>
      </form>
      <aside className="panel h-fit p-6">
        <h2 className="text-lg">Your BOM</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((i) => {
            const p = productById(i.productId);
            if (!p) return null;
            return (
              <li key={i.productId} className="flex justify-between">
                <span>
                  {p.name} × {i.quantity}
                </span>
                <span className="font-mono">{inr(p.price * i.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-right text-2xl">{inr(subtotal)}</p>
      </aside>
    </div>
  );
}
