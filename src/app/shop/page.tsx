import { categories, categoryProducts, products } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase() ?? "";
  const list = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.short.toLowerCase().includes(query) ||
          p.category.includes(query),
      )
    : products;

  const roots = categories.filter((c) => !c.parent);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#d6ff4b]">Shop</p>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">Components, boards, kits</h1>
        {query && <p className="mt-2 text-[#b7b2a4]">{list.length} results for “{q}”</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {roots.map((c) => (
          <Link key={c.slug} href={`/shop/${c.slug}`} className="btn-ghost text-sm">
            {c.name}
            <span className="ml-2 font-mono text-[10px] text-[#8d897c]">{categoryProducts(c.slug).length}</span>
          </Link>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
