import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#23251f] py-8 text-sm text-[#8d897c] sm:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-[family-name:var(--font-serif)] text-xl italic text-[#f3efe4]">BarX</p>
          <p className="mt-2 max-w-xs text-sm">Maker hardware, project kits, and engineering services. Own the whole journey from idea to cart to community.</p>
        </div>
        <div className="space-y-2">
          <p className="text-[#f3efe4]">Shop</p>
          <Link href="/shop/esp32" className="block hover:text-[#d6ff4b]">ESP32</Link>
          <Link href="/shop/kits" className="block hover:text-[#d6ff4b]">Kits</Link>
          <Link href="/shop/sensors" className="block hover:text-[#d6ff4b]">Sensors</Link>
        </div>
        <div className="space-y-2">
          <p className="text-[#f3efe4]">Build</p>
          <Link href="/build" className="block hover:text-[#d6ff4b]">Project wizard</Link>
          <Link href="/build/ai" className="block hover:text-[#d6ff4b]">AI project builder</Link>
          <Link href="/projects" className="block hover:text-[#d6ff4b]">Library</Link>
        </div>
        <div className="space-y-2">
          <p className="text-[#f3efe4]">Company</p>
          <Link href="/services" className="block hover:text-[#d6ff4b]">PCB / 3D / Prototype</Link>
          <Link href="/admin" className="block hover:text-[#d6ff4b]">Admin</Link>
          <Link href="/account" className="block hover:text-[#d6ff4b]">Orders</Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-4 font-mono text-[10px] text-[#8d897c] sm:text-xs">V1 storefront · catalog is seeded locally · plug in Supabase when you are ready.</p>
    </footer>
  );
}
