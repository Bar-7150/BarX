"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { SearchBox } from "./search-box";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/build", label: "Build" },
  { href: "/circuit", label: "Circuit Lab" },
  { href: "/projects", label: "Projects" },
  { href: "/learn", label: "Learn" },
  { href: "/students", label: "Students" },
  { href: "/services", label: "Services" },
];

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-[#23251f] bg-[#07080a]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-3 py-3 sm:gap-4 sm:px-4">
        <Link href="/" className="shrink-0 font-[family-name:var(--font-serif)] text-2xl italic tracking-tight">
          BarX
        </Link>

        <nav className="hidden items-center gap-4 text-sm text-[#c9c4b6] md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[#d6ff4b]">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="order-3 hidden w-full md:order-none md:ml-auto md:block md:max-w-md md:flex-1">
          <SearchBox />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link href="/account" className="text-xs text-[#c9c4b6] hover:text-white sm:text-sm">
            Account
          </Link>
          <Link href="/cart" className="relative rounded-full border border-[#23251f] px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm">
            Cart
            {count > 0 && (
              <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d6ff4b] px-1 text-[10px] font-bold text-black sm:h-5 sm:min-w-5">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="border-t border-[#1b1d18] px-3 py-2 md:hidden">
        <SearchBox />
        <div className="mt-2 flex gap-3 overflow-x-auto text-xs text-[#c9c4b6]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
