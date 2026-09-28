import { notFound } from "next/navigation";
import Link from "next/link";
import { projectBySlug, projectCost } from "@/lib/catalog";
import { inr, stars } from "@/lib/format";
import { BomList } from "@/components/bom-list";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <Link href="/projects" className="font-mono text-xs text-[#8d897c]">
          ← Library
        </Link>
        <p className="text-5xl">{project.emoji}</p>
        <h1 className="text-4xl">{project.title}</h1>
        <p className="text-[#b7b2a4]">{project.summary}</p>
        <dl className="grid grid-cols-2 gap-3 font-mono text-sm md:grid-cols-4">
          <div className="panel p-3">
            <dt className="text-[#8d897c]">Difficulty</dt>
            <dd>{project.difficulty}</dd>
          </div>
          <div className="panel p-3">
            <dt className="text-[#8d897c]">Est. cost</dt>
            <dd>{inr(projectCost(project))}</dd>
          </div>
          <div className="panel p-3">
            <dt className="text-[#8d897c]">Build time</dt>
            <dd>{project.buildTime}</dd>
          </div>
          <div className="panel p-3">
            <dt className="text-[#8d897c]">Author</dt>
            <dd>{project.author}</dd>
          </div>
        </dl>
        <p className="text-[#e7a06a]">{stars(project.rating)}</p>
        <section className="panel p-6">
          <h2 className="text-xl">Build instructions</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-[#c9c4b6]">
            {project.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
        <section className="panel p-6">
          <h2 className="text-xl">Circuit · Code · Video</h2>
          <p className="mt-2 text-sm text-[#8d897c]">
            Placeholders for schematic SVG, Git repo, and a YouTube embed. The buy path already works.
          </p>
          <Link href={`/learn/esp32/weather-station`} className="mt-3 inline-block text-[#d6ff4b]">
            Open related lesson →
          </Link>
        </section>
      </div>
      <BomList project={project} />
    </div>
  );
}
