"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import { featuredGame } from "@/lib/games";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#games", label: "Games" },
  { href: "/games", label: "Catalog" },
  { href: "/#studio", label: "Studio" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const featured = featuredGame();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050814]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:h-[4.25rem] sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/brand/mark.jpg"
            alt=""
            width={40}
            height={40}
            className="size-9 rounded-full ring-2 ring-cyan-300/70 sm:size-10"
          />
          <span className="font-heading hidden text-lg font-extrabold tracking-[0.18em] text-white min-[420px]:inline sm:text-xl">
            RINGNEST
          </span>
        </Link>
        <nav className="ml-1 flex items-center gap-0.5 sm:ml-2 sm:gap-1">
          {links.map((link) => {
            const active =
              link.href === "/games"
                ? pathname.startsWith("/games")
                : false;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-2.5 py-1.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white sm:px-3",
                  link.label === "Catalog" && "hidden sm:inline-flex",
                  active && "bg-white/10 text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto">
          <PlayOnRoblox href={featured.playUrl} size="md" label="Play" />
        </div>
      </div>
    </header>
  );
}
