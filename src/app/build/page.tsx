import Link from "next/link";
import { intents, projects, robotTypes } from "@/lib/catalog";
import { ProjectCard } from "@/components/project-card";

export default async function BuildPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const selected = intents.find((i) => i.slug === intent);

  const list = intent
    ? projects.filter((p) => p.category === intent || (intent === "drone" && p.category === "robot"))
    : projects;

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#d6ff4b]">Build a project</p>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">I want to build…</h1>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {intents.map((i) => (
          <Link
            key={i.slug}
            href={`/build?intent=${i.slug}`}
            className={`panel p-4 ${intent === i.slug ? "border-[#d6ff4b]" : ""}`}
          >
            <span className="text-2xl">{i.emoji}</span>
            <p className="mt-2">{i.label}</p>
          </Link>
        ))}
      </div>

      {selected?.slug === "robot" && (
        <section>
          <h2 className="text-xl">What type?</h2>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {robotTypes.map((t) => (
              <Link key={t.slug} href={`/projects/${t.mapsTo}`} className="panel px-4 py-3 hover:border-[#d6ff4b]">
                ○ {t.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl">{selected ? `${selected.label} builds` : "All guided builds"}</h2>
        <Link href="/build/ai" className="text-sm text-[#d6ff4b]">
          Prefer typing? Use AI builder →
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {list.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
