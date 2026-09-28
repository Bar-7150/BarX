import { products } from "@/lib/catalog";
import { inr } from "@/lib/format";
import Link from "next/link";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin" className="font-mono text-xs text-[#8d897c]">
        ← Dashboard
      </Link>
      <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">Inventory</h1>
      <p className="text-sm text-[#8d897c]">Seeded catalog. Wire these rows to Supabase `products` + `inventory` next.</p>
      <div className="overflow-x-auto rounded-2xl border border-[#23251f]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-[#10120e] font-mono text-xs text-[#8d897c]">
            <tr>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Warehouse</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-[#23251f]">
                <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2 text-[#8d897c]">{p.warehouse}</td>
                <td className={`px-3 py-2 ${p.stock < 15 ? "text-[#e7a06a]" : ""}`}>{p.stock}</td>
                <td className="px-3 py-2">{inr(p.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
