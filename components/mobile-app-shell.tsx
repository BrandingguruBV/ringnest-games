"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import { featuredGame } from "@/lib/games";
import { isMobileMoreActive, isNestClubHash, mobileMoreLinks } from "@/lib/nav";
import { cn } from "@/lib/utils";

type Tab = {
  href?: string;
  label: string;
  kind: "link" | "more" | "play";
  match: (pathname: string, hash: string, moreOpen: boolean) => boolean;
  icon?: (props: { className?: string }) => ReactNode;
};

const tabs: Tab[] = [
  {
    kind: "link",
    href: "/",
    label: "Home",
    icon: HomeIcon,
    match: (p, h) => p === "/" && !isNestClubHash(h),
  },
  {
    kind: "link",
    href: "/games/pet-orbits",
    label: "Orbits",
    icon: OrbitsIcon,
    match: (p, h) => p.startsWith("/games/") && !isNestClubHash(h),
  },
  {
    kind: "link",
    href: "/catalog",
    label: "Catalog",
    icon: CatalogIcon,
    match: (p) => p.startsWith("/catalog"),
  },
  {
    kind: "more",
    label: "More",
    icon: MoreIcon,
    match: (p, h, moreOpen) => moreOpen || isMobileMoreActive(p, h),
  },
  {
    kind: "play",
    label: "Play",
    match: () => false,
  },
];

export function MobileAppShell() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const featured = featuredGame();
  const titleId = useId();
  const dialogId = useId();

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

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!moreOpen) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMoreOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[env(safe-area-inset-top)] bg-[#050814]/85 md:hidden" />

      {moreOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/65 supports-backdrop-filter:backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          <div
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-x-0 bottom-0 max-h-[min(78dvh,34rem)] overflow-y-auto rounded-t-[1.75rem] border border-white/10 bg-[#0a1022] px-4 pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-24px_80px_rgba(0,0,0,0.55)]"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-extrabold tracking-[0.22em] text-cyan-300 uppercase">
                  Ringnest
                </p>
                <h2 id={titleId} className="font-heading text-2xl font-extrabold text-white">
                  Menu
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="rounded-2xl bg-white/8 px-3 py-2 text-sm font-extrabold text-white/80 ring-1 ring-white/10"
              >
                Close
              </button>
            </div>

            <ul className="grid gap-2">
              {mobileMoreLinks.map((link) => {
                const active = link.match(pathname, hash);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex min-h-16 items-center justify-between gap-3 rounded-2xl px-4 py-3 ring-1 transition",
                        active
                          ? "bg-[#00e38c]/14 text-white ring-[#00e38c]/40"
                          : "bg-white/5 text-white ring-white/10 active:bg-white/10",
                      )}
                    >
                      <span>
                        <span className="block text-base font-extrabold">{link.label}</span>
                        {link.hint ? (
                          <span className="mt-0.5 block text-sm font-semibold text-white/55">
                            {link.hint}
                          </span>
                        ) : null}
                      </span>
                      <span className="text-lg font-extrabold text-white/35" aria-hidden>
                        ›
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4">
              <PlayOnRoblox
                href={featured.playUrl}
                size="lg"
                label="Play on Roblox"
                className="w-full justify-center"
              />
            </div>
          </div>
        </div>
      ) : null}

      <nav
        className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-[#050814]/94 px-1.5 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl md:hidden"
        aria-label="App navigation"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 items-end gap-0.5">
          {tabs.map((tab) => {
            const active = tab.match(pathname, hash, moreOpen);
            const Icon = tab.icon;

            if (tab.kind === "play") {
              return (
                <div key="play" className="flex flex-col items-center">
                  <PlayOnRoblox
                    href={featured.playUrl}
                    size="md"
                    label=""
                    className="relative z-[71] size-11 rounded-2xl px-0 shadow-[0_8px_0_#0a7a3e]"
                  />
                  <span className="mt-0.5 text-[11px] font-extrabold tracking-wide text-[#00e38c]">
                    Play
                  </span>
                </div>
              );
            }

            if (tab.kind === "more") {
              return (
                <button
                  key="more"
                  type="button"
                  aria-expanded={moreOpen}
                  aria-controls={dialogId}
                  onClick={() => setMoreOpen((open) => !open)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[11px] font-extrabold tracking-wide",
                    active ? "text-[#00e38c]" : "text-white/55",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-2xl",
                      active ? "bg-[#00e38c]/15 ring-1 ring-[#00e38c]/40" : "bg-white/5",
                    )}
                  >
                    {Icon ? <Icon className="size-5" /> : null}
                  </span>
                  {tab.label}
                </button>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href!}
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[11px] font-extrabold tracking-wide",
                  active ? "text-[#00e38c]" : "text-white/55",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-2xl",
                    active ? "bg-[#00e38c]/15 ring-1 ring-[#00e38c]/40" : "bg-white/5",
                  )}
                >
                  {Icon ? <Icon className="size-5" /> : null}
                </span>
                {tab.label}
              </Link>
            );
          })}
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

function OrbitsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      <ellipse
        cx="12"
        cy="12"
        rx="8.5"
        ry="4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        transform="rotate(-28 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="8.5"
        ry="4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        transform="rotate(38 12 12)"
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

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="5" cy="12" r="1.8" fill="currentColor" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <circle cx="19" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}
