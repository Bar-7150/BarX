import Link from "next/link";
import { learnTopics, lessons } from "@/lib/catalog";
import { notFound } from "next/navigation";

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const meta = learnTopics.find((t) => t.slug === topic);
  if (!meta) notFound();
  const list = lessons.filter((l) => l.topic === topic);

  return (
    <div className="space-y-6">
      <Link href="/learn" className="font-mono text-xs text-[#8d897c]">
        ← Learn
      </Link>
      <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">{meta.name}</h1>
      {list.length === 0 ? (
        <p className="text-[#8d897c]">Curriculum for this track ships with V2 docs. Follow ESP32 for the working BOM loop.</p>
      ) : (
        <ol className="space-y-2">
          {list.map((l) => (
            <li key={l.slug}>
              <Link href={`/learn/${topic}/${l.slug}`} className="panel block p-4 hover:border-[#d6ff4b]">
                {l.title}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
