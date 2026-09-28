import { productById } from "@/lib/catalog";
import { inr } from "@/lib/format";
import type { Project } from "@/lib/types";
import { AddProjectToCart } from "./add-project";
import { AddToCart } from "./add-to-cart";
import Link from "next/link";

export function BomList({ project }: { project: Project }) {
  const lines = project.components.map((c) => ({ ...c, product: productById(c.productId)! })).filter((l) => l.product);
  const total = lines.reduce((n, l) => n + l.product.price * l.quantity, 0);

  return (
    <div className="panel p-5">
      <h3 className="text-lg">Required components</h3>
      <ul className="mt-4 space-y-3">
        {lines.map((l) => (
          <li key={l.productId} className="flex items-center justify-between gap-3 text-sm">
            <Link href={`/product/${l.product.slug}`} className="hover:text-[#d6ff4b]">
              ✓ {l.product.name} {l.quantity > 1 ? `× ${l.quantity}` : ""}
            </Link>
            <span className="font-mono text-[#b7b2a4]">{inr(l.product.price * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between border-t border-[#23251f] pt-4">
        <span>Total</span>
        <span className="text-xl font-semibold">{inr(total)}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <AddProjectToCart project={project} label="Buy components" />
        {project.kitProductId && (
          <AddToCart product={productById(project.kitProductId)!} label="Buy complete kit" />
        )}
      </div>
    </div>
  );
}
