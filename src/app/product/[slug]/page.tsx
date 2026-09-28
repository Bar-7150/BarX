import { notFound } from "next/navigation";
import Link from "next/link";
import { productBySlug, products, projectsUsing } from "@/lib/catalog";
import { inr, stars } from "@/lib/format";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { ProjectCard } from "@/components/project-card";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();
  const related = product.alsoNeed.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  const usedIn = projectsUsing(product.id);

  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="panel flex min-h-72 flex-col justify-between p-8">
          <p className="font-mono text-xs tracking-widest text-[#d6ff4b]">{product.sku}</p>
          <p className="mt-auto font-[family-name:var(--font-serif)] text-6xl italic opacity-40">{product.name.split(" ")[0]}</p>
        </div>
        <div>
          <p className="text-sm text-[#8d897c]">
            <Link href={`/shop/${product.category}`} className="hover:text-[#d6ff4b]">
              {product.category}
            </Link>
          </p>
          <h1 className="mt-1 text-4xl">{product.name}</h1>
          <p className="mt-3 text-[#c9c4b6]">{product.description}</p>
          <p className="mt-4 text-3xl font-semibold">{inr(product.price)}</p>
          <p className="mt-1 text-[#e7a06a]">
            {stars(product.rating)} <span className="text-[#8d897c]">({product.reviews})</span>
          </p>
          <p className={`mt-3 font-mono text-sm ${product.stock < 15 ? "text-[#e7a06a]" : "text-[#d6ff4b]"}`}>
            {product.stock > 0 ? `IN STOCK · ${product.stock} at ${product.warehouse}` : "OUT OF STOCK"}
          </p>
          <div className="mt-6">
            <AddToCart product={product} />
          </div>
          <div className="mt-8">
            <p className="font-mono text-xs uppercase tracking-widest text-[#8d897c]">Compatible with</p>
            <ul className="mt-2 space-y-1 text-sm">
              {product.compatibleWith.map((c) => (
                <li key={c}>✓ {c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="panel p-6">
          <h2 className="text-xl">Specifications</h2>
          <dl className="mt-4 divide-y divide-[#23251f] font-mono text-sm">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <dt className="text-[#8d897c]">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="panel p-6">
          <h2 className="text-xl">Documents</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {product.documents.length === 0 && <li className="text-[#8d897c]">Datasheet landing with the first supplier upload.</li>}
            {product.documents.map((d) => (
              <li key={d.label}>
                <a href={d.href} className="hover:text-[#d6ff4b]">
                  📄 {d.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {usedIn.length > 0 && (
        <section>
          <h2 className="font-[family-name:var(--font-serif)] text-3xl italic">Projects using this product</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {usedIn.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section>
          <h2 className="font-[family-name:var(--font-serif)] text-3xl italic">You may also need</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p!.id} product={p!} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
