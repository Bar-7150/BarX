import Link from "next/link";
import { categories, intents, popularCategorySlugs, products, projects } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { ProjectCard } from "@/components/project-card";

export default function HomePage() {
  const kits = products.filter((p) => p.isKit && p.featured);
  const popular = popularCategorySlugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter(Boolean);

  return (
    <div className="space-y-12 sm:space-y-16">
      <section className="grid-fade relative overflow-hidden rounded-[24px] border border-[#23251f] px-4 py-10 sm:px-6 sm:py-14 md:rounded-[28px] md:px-12 md:py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d6ff4b] sm:text-xs">Maker platform · India</p>
        <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-serif)] text-4xl italic leading-[1.05] sm:text-5xl md:text-7xl">
          Build. Learn. Invent.
        </h1>
        <p className="mt-4 max-w-xl text-base text-[#c9c4b6] sm:text-lg">Everything you need to build your idea — components, kits, guides, and lab services in one loop.</p>
        <form action="/shop" className="mt-8 max-w-xl">
          <input
            name="q"
            placeholder="Search components, projects, kits…"
            className="w-full rounded-full border border-[#2a2d24] bg-[#0c0e0a]/80 px-4 py-3 text-sm outline-none focus:border-[#d6ff4b] sm:px-5"
          />
        </form>
        <div className="mt-10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#8d897c] sm:text-xs">What are you building?</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {intents.map((i) => (
              <Link key={i.slug} href={`/build?intent=${i.slug}`} className="panel px-4 py-5 hover:border-[#d6ff4b]">
                <span className="text-2xl">{i.emoji}</span>
                <p className="mt-2 text-base sm:text-lg">{i.label}</p>
                <p className="text-xs text-[#8d897c]">{i.hint}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-serif)] text-2xl italic sm:text-3xl">Popular categories</h2>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {popular.map((c) => (
            <Link key={c!.slug} href={`/shop/${c!.slug}`} className="panel flex items-center justify-between px-4 py-4 hover:border-[#d6ff4b]">
              <span>{c!.name}</span>
              <span className="font-mono text-xs text-[#8d897c]">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl italic sm:text-3xl">Featured kits</h2>
          <Link href="/shop/kits" className="text-xs text-[#d6ff4b] sm:text-sm">
            All kits
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kits.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl italic sm:text-3xl">Popular projects</h2>
          <Link href="/projects" className="text-xs text-[#d6ff4b] sm:text-sm">
            Library
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {projects.slice(0, 4).map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section className="panel grid gap-6 p-5 sm:p-8 md:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#d6ff4b] sm:text-xs">Signature feature</p>
          <h2 className="mt-2 font-[family-name:var(--font-serif)] text-3xl italic sm:text-4xl">AI project builder</h2>
          <p className="mt-3 text-sm text-[#c9c4b6] sm:text-base">Describe a budget and a goal. We map it onto the live catalog and drop every part in the cart.</p>
          <Link href="/build/ai" className="btn-acid mt-6">
            Try the builder
          </Link>
        </div>
        <div className="rounded-2xl border border-[#23251f] bg-[#0b0d09] p-4 font-mono text-xs text-[#b7b2a4] sm:p-5 sm:text-sm">
          <p className="text-[#8d897c]">prompt</p>
          <p className="mt-2 text-[#f3efe4]">I want to build an automatic plant watering system under ₹1500.</p>
          <p className="mt-6 text-[#8d897c]">result</p>
          <p className="mt-2">ESP32 · soil · pump · relay · 12 V adapter</p>
          <p className="mt-2 text-[#d6ff4b]">₹1,287 · ADD ALL TO CART</p>
        </div>
      </section>
    </div>
  );
}
