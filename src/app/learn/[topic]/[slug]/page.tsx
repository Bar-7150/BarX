import Link from "next/link";
import { notFound } from "next/navigation";
import { lessons, projectBySlug } from "@/lib/catalog";
import { BomList } from "@/components/bom-list";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}) {
  const { topic, slug } = await params;
  const lesson = lessons.find((l) => l.topic === topic && l.slug === slug);
  if (!lesson) notFound();
  const project = lesson.projectSlug ? projectBySlug(lesson.projectSlug) : null;
  const siblings = lessons.filter((l) => l.topic === topic);

  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <aside className="space-y-2 text-sm">
        <Link href={`/learn/${topic}`} className="font-mono text-xs text-[#8d897c]">
          ← {topic}
        </Link>
        {siblings.map((l) => (
          <Link
            key={l.slug}
            href={`/learn/${topic}/${l.slug}`}
            className={`block rounded-lg px-2 py-1 ${l.slug === slug ? "bg-[#161911] text-[#d6ff4b]" : "text-[#b7b2a4]"}`}
          >
            {l.title}
          </Link>
        ))}
      </aside>
      <article className="space-y-6">
        <p className="font-mono text-xs text-[#8d897c]">{lesson.minutes} min</p>
        <h1 className="text-4xl">{lesson.title}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[#c9c4b6]">{lesson.body}</p>
        {project && (
          <div>
            <h2 className="mb-3 text-xl">Build this — add the BOM</h2>
            <BomList project={project} />
          </div>
        )}
      </article>
    </div>
  );
}
