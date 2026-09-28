import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/catalog";

export default function ProjectsPage() {
  const trending = [...projects].sort((a, b) => b.views - a.views);
  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#d6ff4b]">🔥 Trending</p>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">Project library</h1>
        <p className="mt-2 text-[#b7b2a4]">Guides from BarX Lab and makers. Publishing from customer accounts lands in V5.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {trending.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
