import Link from "next/link";
import { NestClubBand } from "@/components/nest-club";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import { Badge } from "@/components/ui/badge";
import { GameCard } from "@/components/game-card";
import { KeyArtHero } from "@/components/key-art-hero";
import { STATUS_LABELS, featuredGame, games } from "@/lib/games";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Play Ringnest games on Roblox. Pet Orbits is live. Browse the Catalog for 162 pets.",
};

export default function GamesPage() {
  const featured = featuredGame();
  const rest = games.filter((game) => game.slug !== featured.slug);
  const joinable = featured.publicJoin;

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-[13px] font-extrabold tracking-[0.2em] text-cyan-300 uppercase">Games</p>
      <h1 className="font-heading mt-1 text-4xl font-extrabold text-white sm:text-6xl">
        Play on Roblox
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/90 sm:text-base">
        Pet Orbits is live. Meet every pet in the{" "}
        <Link href="/catalog" className="font-bold text-cyan-200 underline-offset-4 hover:underline">
          Catalog
        </Link>
        .
      </p>

      <article className="mt-10">
        <KeyArtHero
          src={featured.thumbnail}
          alt={`${featured.title} artwork`}
          priority
        >
          <Badge
            className={
              joinable
                ? "h-7 rounded-full border-0 bg-[#00e38c] text-sm font-bold text-[#052013]"
                : "h-7 rounded-full border-0 bg-amber-300 text-sm font-bold text-[#3a2200]"
            }
          >
            {STATUS_LABELS[featured.status]}
          </Badge>
          <h2 className="font-heading mt-3 text-[2.2rem] leading-none font-extrabold text-white sm:text-5xl">
            {featured.title}
          </h2>
          <p className="mt-2 max-w-xl text-base font-semibold leading-snug text-white/94">
            {featured.tagline}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <PlayOnRoblox href={featured.playUrl} className="w-full sm:w-auto" />
            <Link
              href={`/games/${featured.slug}`}
              className="inline-flex h-12 items-center justify-center text-base font-bold text-white underline-offset-4 hover:underline sm:h-auto"
            >
              Inside the game
            </Link>
          </div>
        </KeyArtHero>
      </article>

      <NestClubBand className="mt-12 px-0 py-0 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] sm:px-0 sm:py-0 sm:pb-0" />

      <section className="mt-12">
        <h3 className="font-heading text-2xl font-extrabold text-white">Inside Pet Orbits</h3>
        <p className="mt-2 max-w-2xl text-base text-white/88">
          Crash, hatch, 12 biomes, 162 pets, Nest Club, 12 passes, and 14 packs. Read the
          full landing before you join.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {featured.highlights.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-white/10 bg-[#0b1428]/82 px-4 py-3 text-sm font-semibold text-white/92"
            >
              {item}
            </li>
          ))}
        </ul>
        <Link
          href="/games/pet-orbits"
          className="mt-6 inline-flex h-12 items-center rounded-2xl bg-white/10 px-5 text-sm font-extrabold text-white ring-1 ring-white/15 hover:bg-white/16"
        >
          Open the Pet Orbits landing
        </Link>
      </section>

      {rest.length > 0 ? (
        <section className="mt-14">
          <h3 className="font-heading text-2xl font-extrabold text-white">Coming soon</h3>
          <p className="mt-2 text-base text-white/88">New Ringnest games land here.</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {rest.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
