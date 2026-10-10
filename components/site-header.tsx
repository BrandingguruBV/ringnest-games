"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import { featuredGame } from "@/lib/games";
import { desktopNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const featured = featuredGame();

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    const syncSoon = () => {
      window.requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", syncSoon);
    document.addEventListener("click", syncSoon);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", syncSoon);
      document.removeEventListener("click", syncSoon);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050814]/88 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-[4.25rem] sm:gap-4 sm:px-6">
        <Link prefetch={false} href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/brand/mark.jpg"
            alt="Ringnest"
            width={40}
            height={40}
            className="size-9 rounded-full ring-2 ring-cyan-300/70 sm:size-10"
           
            unoptimized
          />
          <span className="font-heading text-base font-extrabold tracking-[0.18em] text-white sm:text-xl">
            RINGNEST
          </span>
        </Link>
        <nav className="ml-1 hidden items-center gap-0.5 lg:gap-1 md:flex" aria-label="Site">
          {desktopNav.map((link) => {
            const active = link.match(pathname, hash);
            return (
              <Link prefetch={false}
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-base font-semibold text-white/92 transition hover:bg-white/10 hover:text-white",
                  active && "bg-white/12 text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto hidden md:block">
          <PlayOnRoblox
            href={featured.playUrl}
            size="md"
            label="Play"
            className="h-10 rounded-xl px-4 text-sm shadow-[0_6px_0_#0a7a3e] sm:h-11 sm:rounded-xl sm:px-5 sm:text-base sm:shadow-[0_10px_0_#0a7a3e,0_18px_40px_rgba(0,176,111,0.35)]"
          />
        </div>
      </div>
    </header>
  );
}
