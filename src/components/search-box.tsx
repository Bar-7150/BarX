"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBox() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search components, projects, kits…"
        className="w-full rounded-full border border-[#2a2d24] bg-[#0c0e0a] px-4 py-2 text-sm outline-none placeholder:text-[#6f6b61] focus:border-[#d6ff4b]"
      />
    </form>
  );
}
