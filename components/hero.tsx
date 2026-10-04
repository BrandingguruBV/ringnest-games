import { PlayOnRoblox } from "@/components/play-on-roblox";
import { featuredGame } from "@/lib/games";
import { site } from "@/lib/site";
import Link from "next/link";

export function Hero() {
  const featured = featuredGame();

  return (
    <section className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col justify-end px-4 pb-[calc(6.25rem+env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:justify-center sm:px-6 sm:py-16 sm:pb-16 md:min-h-[calc(100svh-4.25rem)]">
      <div className="relative z-10 max-w-3xl rounded-[1.75rem] bg-[#0b1428]/92 p-4 ring-1 ring-white/12 sm:bg-transparent sm:p-0 sm:ring-0">
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/50 bg-cyan-300/15 px-3 py-1.5 text-[13px] font-extrabold tracking-[0.18em] text-cyan-100 uppercase">
          <span className="size-1.5 rounded-full bg-[#00e38c] shadow-[0_0_12px_#00e38c]" />
          Live on Roblox
        </p>
        <h1 className="font-heading mt-4 text-[clamp(2.6rem,14vw,3.6rem)] leading-[0.92] font-extrabold tracking-tight text-white sm:mt-5 sm:text-7xl md:text-8xl">
          RINGNEST
        </h1>
        <p className="font-heading mt-3 max-w-xl text-xl font-bold text-amber-200 sm:mt-4 sm:text-3xl">
          {site.tagline}
        </p>
        <p className="mt-3 max-w-xl text-base font-semibold leading-relaxed text-white sm:mt-5 sm:text-lg">
          Play Pet Orbits on phone and PC. Crash orbits, hatch 162 pets, and run 12
          biome nests.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <PlayOnRoblox
              href={featured.playUrl}
              className="w-full sm:w-auto"
            />
          <Link
            href="/games/pet-orbits"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/20 bg-white/8 px-6 text-base font-extrabold text-white backdrop-blur hover:bg-white/14 sm:h-14"
          >
            Inside Pet Orbits
          </Link>
        </div>
      </div>
      <OrbStack />
    </section>
  );
}

function OrbStack() {
  // Keep decorative orbs off the brand wordmark on narrow phones.
  return (
    <div className="pointer-events-none absolute top-[10%] right-2 hidden w-[38vw] max-w-[200px] opacity-90 sm:top-1/2 sm:right-6 sm:block sm:w-[280px] sm:max-w-none sm:-translate-y-1/2 lg:w-[320px]">
      <div className="relative h-[200px] sm:h-[300px] lg:h-[340px]">
        <span className="orb orb-gold absolute top-6 left-10 size-24 animate-bob sm:top-8 sm:left-16 sm:size-36" />
        <span className="orb orb-cyan absolute top-20 left-1 size-20 animate-bob-delayed sm:top-28 sm:left-4 sm:size-28" />
        <span className="orb orb-lime absolute top-2 right-2 size-12 animate-bob sm:top-4 sm:right-8 sm:size-16" />
      </div>
    </div>
  );
}
