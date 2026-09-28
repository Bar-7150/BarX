"use client";

import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { inr } from "@/lib/format";
import Link from "next/link";

const statuses: OrderStatus[] = ["confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = () =>
    fetch("/api/orders?admin=1")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []));

  useEffect(() => {
    void load();
  }, []);

  const patch = async (id: string, status: OrderStatus) => {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    void load();
  };

  return (
    <div className="space-y-6">
      <Link href="/admin" className="font-mono text-xs text-[#8d897c]">
        ← Dashboard
      </Link>
      <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">Orders</h1>
      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="panel p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Link href={`/account/orders/${o.id}`} className="font-mono hover:text-[#d6ff4b]">
                  #{o.id}
                </Link>
                <p className="text-sm text-[#8d897c]">
                  {o.name} · {o.email} · {inr(o.total)}
                </p>
              </div>
              <select
                value={o.status}
                onChange={(e) => patch(o.id, e.target.value as OrderStatus)}
                className="rounded-lg border border-[#23251f] bg-[#0c0e0a] px-2 py-1 text-sm"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
