"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { featuredGame } from "@/lib/games";
import { cn } from "@/lib/utils";
import { PlayOnRoblox } from "@/components/play-on-roblox";

const tabs = [
  { href: "/", label: "Home", icon: HomeIcon, match: (p: string) => p === "/" },
  {
    href: "/games",
    label: "Games",
    icon: GamesIcon,
    match: (p: string) => p.startsWith("/games"),
  },
  {
    href: "/catalog",
    label: "Catalog",
    icon: CatalogIcon,
    match: (p: string) => p.startsWith("/catalog"),
  },
];

export function MobileAppShell() {
  const pathname = usePathname();
  const featured = featuredGame();

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[env(safe-area-inset-top)] bg-[#050814]/85 md:hidden" />
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#050814]/92 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl md:hidden"
        aria-label="App navigation"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4 items-end gap-1">
          {tabs.map((tab) => {
            const active = tab.match(pathname);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-2xl px-2 py-2 text-[11px] font-extrabold tracking-wide",
                  active ? "text-[#00e38c]" : "text-white/55",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-2xl",
                    active ? "bg-[#00e38c]/15 ring-1 ring-[#00e38c]/40" : "bg-white/5",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                {tab.label}
              </Link>
            );
          })}
          <div className="flex flex-col items-center">
            <PlayOnRoblox
              href={featured.playUrl}
              size="md"
              label=""
              className="relative z-[51] size-11 rounded-2xl px-0 shadow-[0_8px_0_#0a7a3e]"
            />
            <span className="mt-0.5 text-[11px] font-extrabold tracking-wide text-[#00e38c]">
              Play
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GamesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="8" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.5" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M10.5 12c1.4-2.2 3.2-3.4 5.2-3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CatalogIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="4" y="5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="14" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="14" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
