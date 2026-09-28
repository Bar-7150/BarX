"use client";

import { FormEvent, useState } from "react";
import { buildFromPrompt } from "@/lib/ai";
import { inr } from "@/lib/format";
import { useCart } from "@/lib/cart";
import Link from "next/link";

export default function AiBuilderPage() {
  const [prompt, setPrompt] = useState("I want to build an automatic plant watering system under ₹1500.");
  const [result, setResult] = useState<ReturnType<typeof buildFromPrompt> | null>(null);
  const { addMany } = useCart();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResult(buildFromPrompt(prompt));
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#d6ff4b]">Signature feature</p>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">AI project builder</h1>
        <p className="mt-2 max-w-2xl text-[#b7b2a4]">
          V1 is catalog-aware rules, not a paid LLM yet. It still maps your sentence onto real BarX SKUs so the cart is honest.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-[#23251f] bg-[#0c0e0a] p-4 outline-none focus:border-[#d6ff4b]"
        />
        <button className="btn-acid">Generate BOM</button>
      </form>
      {result && (
        <div className="panel p-6">
          <p className="font-mono text-xs text-[#8d897c]">PROJECT</p>
          <h2 className="text-3xl">{result.title}</h2>
          <p className="mt-1 text-[#8d897c]">
            Budget {inr(result.budget)} · Estimate {inr(result.total)}{" "}
            {result.withinBudget ? <span className="text-[#d6ff4b]">within budget</span> : <span className="text-[#e7a06a]">over budget — trim chassis/kit parts</span>}
          </p>
          <ul className="mt-6 space-y-2">
            {result.lines.map((l) => (
              <li key={l.product.id} className="flex justify-between border-b border-[#23251f] py-2 text-sm">
                <Link href={`/product/${l.product.slug}`} className="hover:text-[#d6ff4b]">
                  {l.product.name} {l.quantity > 1 ? `× ${l.quantity}` : ""}
                </Link>
                <span className="font-mono">{inr(l.product.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <button
            className="btn-acid mt-6"
            onClick={() => addMany(result.lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })))}
          >
            Add all to cart
          </button>
        </div>
      )}
    </div>
  );
}
