import { PlayOnRoblox } from "@/components/play-on-roblox";
import { featuredGame } from "@/lib/games";
import { site } from "@/lib/site";
import Link from "next/link";

export function Hero() {
  const featured = featuredGame();

  return (
    <section className="relative mx-auto flex min-h-[calc(100svh-4.25rem)] w-full max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
      <div className="max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-[11px] font-extrabold tracking-[0.22em] text-cyan-200 uppercase">
          <span className="size-1.5 rounded-full bg-[#00e38c] shadow-[0_0_12px_#00e38c]" />
          {site.domain}
        </p>
        <h1 className="font-heading mt-5 text-5xl leading-[0.9] font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl">
          RINGNEST
        </h1>
        <p className="font-heading mt-4 max-w-xl text-2xl font-bold text-amber-200 sm:text-3xl">
          {site.tagline}
        </p>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          A Roblox studio for worlds that feel huge on the first join. Hatch.
          Crash. Sprint home. Right now that world is Pet Orbits.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <PlayOnRoblox href={featured.playUrl} />
          <Link
            href="#games"
            className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/8 px-6 text-base font-extrabold text-white backdrop-blur hover:bg-white/14"
          >
            Browse games
          </Link>
        </div>
      </div>
      <OrbStack />
    </section>
  );
}

function OrbStack() {
  return (
    <div className="pointer-events-none absolute top-1/2 right-6 hidden w-[320px] -translate-y-1/2 lg:block">
      <div className="relative h-[340px]">
        <span className="orb orb-gold absolute top-8 left-16 size-36 animate-bob" />
        <span className="orb orb-cyan absolute top-28 left-4 size-28 animate-bob-delayed" />
        <span className="ring-spin absolute top-12 left-10 size-44 rounded-full" />
        <span className="orb orb-lime absolute top-4 right-8 size-16 animate-bob" />
      </div>
    </div>
  );
}
