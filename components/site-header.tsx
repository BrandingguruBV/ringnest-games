"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import { featuredGame } from "@/lib/games";
import { cn } from "@/lib/utils";

const links = [
  { href: "/games", label: "Games", match: (p: string) => p === "/games" || p.startsWith("/games/") },
  { href: "/catalog", label: "Catalog", match: (p: string) => p.startsWith("/catalog") },
  { href: "/about", label: "About", match: (p: string) => p.startsWith("/about") },
];

export function SiteHeader() {
  const pathname = usePathname();
  const featured = featuredGame();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050814]/70 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-[4.25rem] sm:gap-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/brand/mark.jpg"
            alt="Ringnest"
            width={40}
            height={40}
            className="size-9 rounded-full ring-2 ring-cyan-300/70 sm:size-10"
            priority
            unoptimized
          />
          <span className="font-heading text-base font-extrabold tracking-[0.18em] text-white sm:text-xl">
            RINGNEST
          </span>
        </Link>
        <nav className="ml-1 hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white",
                  active && "bg-white/10 text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto hidden sm:block">
          <PlayOnRoblox
            href={featured.playUrl}
            size="md"
            label="Play"
          />
        </div>
      </div>
    </header>
  );
}
