import Link from "next/link";
import { inr, stars } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="panel group flex flex-col p-4">
      <div className="mb-4 flex h-28 items-end rounded-xl bg-[#161911] p-3 font-mono text-[10px] uppercase tracking-widest text-[#d6ff4b]">
        {product.sku}
      </div>
      <p className="text-xs text-[#8d897c]">{product.category}</p>
      <h3 className="mt-1 text-lg leading-tight group-hover:text-[#d6ff4b]">{product.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-[#b7b2a4]">{product.short}</p>
      <div className="mt-auto flex items-end justify-between pt-4">
        <span className="text-xl font-semibold">{inr(product.price)}</span>
        <span className="text-xs text-[#e7a06a]">{stars(product.rating)}</span>
      </div>
      <p className="mt-1 font-mono text-[11px] text-[#8d897c]">
        {product.stock < 15 ? `Low stock · ${product.stock}` : `${product.stock} in stock`}
      </p>
    </Link>
  );
}
