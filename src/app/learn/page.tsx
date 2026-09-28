import Link from "next/link";
import { learnTopics, lessons } from "@/lib/catalog";

export default function LearnPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#d6ff4b]">Learn</p>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">Labs, not just listings</h1>
        <p className="mt-2 text-[#b7b2a4]">Every path can dump a BOM into the cart. ESP32 is filled in for V1.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {learnTopics.map((t) => (
          <Link key={t.slug} href={`/learn/${t.slug}`} className="panel p-5 hover:border-[#d6ff4b]">
            {t.name}
          </Link>
        ))}
      </div>
      <section>
        <h2 className="text-xl">ESP32 path</h2>
        <ol className="mt-4 space-y-2">
          {lessons.map((l) => (
            <li key={l.slug}>
              <Link href={`/learn/${l.topic}/${l.slug}`} className="panel flex justify-between p-4 hover:border-[#d6ff4b]">
                <span>{l.title}</span>
                <span className="font-mono text-xs text-[#8d897c]">{l.minutes} min</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
