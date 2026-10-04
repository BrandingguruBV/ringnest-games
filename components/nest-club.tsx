import { Button } from "@/components/ui/button";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import { featuredGame, nestClub } from "@/lib/games";
import { cn } from "@/lib/utils";
import Link from "next/link";

function ClubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <circle cx="24" cy="24" r="22" fill="#042016" />
      <circle cx="24" cy="24" r="16" fill="none" stroke="#84e85a" strokeWidth="2.4" />
      <circle cx="24" cy="24" r="6" fill="#00e38c" />
      <circle cx="38" cy="14" r="4.5" fill="#ffd84a" />
    </svg>
  );
}

export function NestClubBand({ className }: { className?: string }) {
  return (
    <section
      id="nest-club"
      className={cn(
        "relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[2rem] border border-lime-300/25 bg-[linear-gradient(160deg,rgba(0,227,140,0.16),rgba(5,8,20,0.92)_42%,rgba(255,216,74,0.12))] p-6 shadow-[0_24px_70px_rgba(0,227,140,0.16)] sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-lime-300/40 bg-lime-300/10 px-3 py-1 text-[11px] font-extrabold tracking-[0.22em] text-lime-200 uppercase">
              <span className="size-1.5 rounded-full bg-[#00e38c] shadow-[0_0_12px_#00e38c]" />
              Monthly on Roblox
            </p>
            <h2 className="font-heading mt-4 text-3xl font-extrabold text-white sm:text-5xl">
              {nestClub.name}
            </h2>
            <p className="mt-2 text-lg font-extrabold text-amber-200 sm:text-xl">
              {nestClub.price}
            </p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {nestClub.headline}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
              {nestClub.body}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-2xl border-0 bg-[#ffd84a] px-7 text-lg font-extrabold tracking-wide text-[#3a2200] shadow-[0_10px_0_#b8860b,0_18px_40px_rgba(255,216,74,0.28)] hover:bg-[#ffe37a] hover:text-[#3a2200]"
              >
                <a
                  href={nestClub.subscribeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Subscribe to ${nestClub.name} on Roblox`}
                >
                  Subscribe on Roblox
                </a>
              </Button>
              <PlayOnRoblox href={featuredGame().playUrl} />
              <Link
                href="/games/pet-orbits#shop"
                className="inline-flex h-14 items-center justify-center rounded-2xl px-5 text-base font-extrabold text-white/90 underline-offset-4 hover:underline"
              >
                Every pass and pack
              </Link>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {nestClub.perks.map((perk) => (
              <li
                key={perk}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#050814]/55 px-4 py-3 text-sm font-semibold text-white/90"
              >
                <ClubMark className="mt-0.5 size-8 shrink-0" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
