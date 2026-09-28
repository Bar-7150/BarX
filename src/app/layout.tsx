import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "BarX — Build. Learn. Invent.",
  description: "Robotics components, project kits, learning labs and engineering services.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${newsreader.variable} ${plex.variable} antialiased`}>
        <Providers>
          <SiteHeader />
          <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 pb-20 pt-6">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
