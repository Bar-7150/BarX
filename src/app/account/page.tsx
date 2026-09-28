"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "@/lib/session";
import { inr } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function AccountPage() {
  const { session, signIn, signOut } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/orders?email=${encodeURIComponent(session.email)}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []));
  }, [session]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    signIn(String(form.get("name")), String(form.get("email")));
  };

  if (!session) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">My account</h1>
        <p className="mt-2 text-sm text-[#8d897c]">V1 uses a local session. Swap this for Supabase Auth later.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input name="name" required placeholder="Name" className="w-full rounded-xl border border-[#23251f] bg-[#0c0e0a] px-3 py-2" />
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-[#23251f] bg-[#0c0e0a] px-3 py-2" />
          <button className="btn-acid">Continue</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs text-[#d6ff4b]">SIGNED IN</p>
          <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">{session.name}</h1>
          <p className="text-[#8d897c]">{session.email}</p>
        </div>
        <button onClick={signOut} className="btn-ghost text-sm">
          Sign out
        </button>
      </div>
      <nav className="flex flex-wrap gap-3 text-sm text-[#b7b2a4]">
        {["Orders", "Wishlist", "Projects", "Downloads", "Support", "Addresses"].map((item) => (
          <span key={item} className="rounded-full border border-[#23251f] px-3 py-1">
            {item}
          </span>
        ))}
      </nav>
      <section>
        <h2 className="text-xl">Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-[#8d897c]">No orders yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.id}`} className="panel flex items-center justify-between p-4 hover:border-[#d6ff4b]">
                  <div>
                    <p className="font-mono">#{o.id}</p>
                    <p className="text-sm text-[#8d897c]">{o.status.replaceAll("_", " ")}</p>
                  </div>
                  <p>{inr(o.total)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
