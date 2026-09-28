"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { inr } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const steps: OrderStatus[] = ["confirmed", "packed", "shipped", "out_for_delivery", "delivered"];

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch(`/api/orders?id=${params.id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order ?? null));
  }, [params.id]);

  if (!order) return <p className="text-[#8d897c]">Loading order…</p>;
  const idx = steps.indexOf(order.status);

  return (
    <div className="space-y-8">
      <Link href="/account" className="font-mono text-xs text-[#8d897c]">
        ← Account
      </Link>
      <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">Order #{order.id}</h1>
      <p className="text-[#8d897c]">
        {order.name} · {order.city} {order.pincode}
      </p>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s} className={i <= idx ? "text-[#d6ff4b]" : "text-[#5c594f]"}>
            {i <= idx ? "✓" : "○"} {s.replaceAll("_", " ")}
            {s === "out_for_delivery" && i === idx ? " 🚚" : ""}
          </li>
        ))}
      </ol>
      <ul className="panel divide-y divide-[#23251f] p-4">
        {order.items.map((i) => (
          <li key={i.productId} className="flex justify-between py-2 text-sm">
            <span>
              {i.name} × {i.quantity}
            </span>
            <span className="font-mono">{inr(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="text-right text-2xl">{inr(order.total)}</p>
    </div>
  );
}
