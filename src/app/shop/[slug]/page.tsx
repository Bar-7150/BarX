import { categories, categoryProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const list = categoryProducts(slug);
  const children = categories.filter((c) => c.parent === slug);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/shop" className="font-mono text-xs text-[#8d897c]">
          ← Shop
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-serif)] text-4xl italic">{cat.name}</h1>
        <p className="mt-2 text-[#b7b2a4]">{cat.blurb}</p>
      </div>
      {children.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {children.map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`} className="btn-ghost text-sm">
              {c.name}
            </Link>
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {list.length === 0 && <p className="text-[#8d897c]">Nothing stocked in this aisle yet — try Sensors or ESP32.</p>}
    </div>
  );
}
