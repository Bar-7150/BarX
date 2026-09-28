import Link from "next/link";
import { inr } from "@/lib/format";
import type { Project } from "@/lib/types";
import { projectCost } from "@/lib/catalog";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="panel p-5">
      <div className="flex items-start justify-between">
        <span className="text-3xl">{project.emoji}</span>
        <span className="font-mono text-xs text-[#8d897c]">{project.views.toLocaleString("en-IN")} views</span>
      </div>
      <h3 className="mt-3 text-xl">{project.title}</h3>
      <p className="mt-1 text-sm text-[#b7b2a4]">{project.summary}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-[#d6ff4b]">{project.difficulty}</span>
        <span>{inr(projectCost(project))}</span>
      </div>
    </Link>
  );
}
