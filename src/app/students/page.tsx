import Link from "next/link";
import { projects } from "@/lib/catalog";
import { ProjectCard } from "@/components/project-card";

const tracks = [
  { slug: "mini", label: "Mini Projects" },
  { slug: "major", label: "Major Projects" },
  { slug: "final-year", label: "Final Year Projects" },
] as const;

const themes = ["Robotics", "IoT", "AI/ML", "Embedded", "Drone", "Agriculture"];

export default function StudentsPage() {
  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#d6ff4b]">Students</p>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">Kits you can learn from, not just submit</h1>
        <p className="mt-2 max-w-2xl text-[#b7b2a4]">
          Documentation, source, circuit, PCB notes, components, and support — packaged as a kit. We will not sell ghost-written reports.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {themes.map((t) => (
          <span key={t} className="btn-ghost text-sm">
            {t}
          </span>
        ))}
      </div>
      {tracks.map((track) => (
        <section key={track.slug}>
          <h2 className="text-2xl">{track.label}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {projects
              .filter((p) => p.studentTrack === track.slug)
              .map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
          </div>
        </section>
      ))}
      <Link href="/projects/autonomous-rover" className="panel block p-6 hover:border-[#d6ff4b]">
        <p className="font-mono text-xs text-[#d6ff4b]">FEATURED FINAL YEAR</p>
        <h2 className="mt-2 text-3xl">AI Robot kit bundle</h2>
        <p className="mt-2 text-[#b7b2a4]">Project kit · documentation · source · circuit · PCB · components · video · support</p>
      </Link>
    </div>
  );
}
