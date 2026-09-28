"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/catalog";
import { inr } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders?admin=1")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []));
  }, []);

  const revenue = orders.reduce((n, o) => n + o.total, 0);
  const sold = orders.reduce((n, o) => n + o.items.reduce((m, i) => m + i.quantity, 0), 0);
  const customers = new Set(orders.map((o) => o.email)).size;
  const low = products.filter((p) => p.stock < 15).sort((a, b) => a.stock - b.stock);

  const byDay = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      const d = o.createdAt.slice(0, 10);
      map.set(d, (map.get(d) ?? 0) + o.total);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [orders]);
  const max = Math.max(1, ...byDay.map(([, v]) => v));

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#e7a06a]">Admin · local demo</p>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">Today</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["Orders", String(orders.length)],
          ["Revenue", inr(revenue)],
          ["Products sold", String(sold)],
          ["Customers", String(customers)],
        ].map(([k, v]) => (
          <div key={k} className="panel p-4">
            <p className="text-xs text-[#8d897c]">{k}</p>
            <p className="mt-1 text-2xl">{v}</p>
          </div>
        ))}
      </div>
      <div className="panel p-6">
        <h2 className="text-lg">Revenue</h2>
        <div className="mt-4 flex h-32 items-end gap-2">
          {byDay.length === 0 && <p className="text-sm text-[#8d897c]">Place an order to see the first bar.</p>}
          {byDay.map(([d, v]) => (
            <div key={d} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t bg-[#d6ff4b]" style={{ height: `${(v / max) * 100}%` }} />
              <span className="font-mono text-[10px] text-[#8d897c]">{d.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="panel p-6">
          <h2 className="text-lg">Low stock</h2>
          <ul className="mt-4 space-y-2 font-mono text-sm">
            {low.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.name}</span>
                <span className="text-[#e7a06a]">{p.stock}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel p-6">
          <h2 className="text-lg">Navigate</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {["Orders", "Products", "Inventory", "Suppliers", "Customers", "Projects", "Kits", "Coupons", "Returns", "Shipping", "Reviews", "Analytics"].map(
              (item) => (
                <Link
                  key={item}
                  href={item === "Orders" ? "/admin/orders" : item === "Inventory" || item === "Products" ? "/admin/inventory" : "/admin"}
                  className="rounded-lg border border-[#23251f] px-3 py-2 hover:border-[#d6ff4b]"
                >
                  {item}
                </Link>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
