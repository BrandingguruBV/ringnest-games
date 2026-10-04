import Image from "next/image";
import Link from "next/link";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import { Badge } from "@/components/ui/badge";
import { GameCard } from "@/components/game-card";
import { STATUS_LABELS, featuredGame, games } from "@/lib/games";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Ringnest games on Roblox. Pet Orbits is the first world. Catalog is the 156-pet Index, not this page.",
};

export default function GamesPage() {
  const featured = featuredGame();
  const rest = games.filter((game) => game.slug !== featured.slug);
  const joinable = featured.publicJoin;

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs font-extrabold tracking-[0.28em] text-cyan-300 uppercase">Games</p>
      <h1 className="font-heading mt-1 text-4xl font-extrabold text-white sm:text-6xl">
        Play Ringnest worlds
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
        This page is the lineup of Ringnest games. For named pets, eggs, and biomes, open{" "}
        <Link href="/catalog" className="font-bold text-cyan-200 underline-offset-4 hover:underline">
          Catalog
        </Link>
        .
      </p>

      <article className="mt-10 overflow-hidden rounded-[2rem] ring-1 ring-white/15">
        <div className="relative aspect-[16/9] min-h-[220px]">
          <Image
            src={featured.thumbnail}
            alt={`${featured.title} artwork`}
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <Badge
              className={
                joinable
                  ? "h-6 rounded-full border-0 bg-[#00e38c] font-bold text-[#052013]"
                  : "h-6 rounded-full border-0 bg-amber-300 font-bold text-[#3a2200]"
              }
            >
              {STATUS_LABELS[featured.status]}
            </Badge>
            <h2 className="font-heading mt-3 text-4xl font-extrabold text-white sm:text-5xl">
              {featured.title}
            </h2>
            <p className="mt-2 max-w-xl text-white/80">{featured.tagline}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PlayOnRoblox href={featured.playUrl} publicJoin={featured.publicJoin} />
              <Link
                href={`/games/${featured.slug}`}
                className="text-sm font-bold text-white underline-offset-4 hover:underline"
              >
                How it plays
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="mt-12">
        <h3 className="font-heading text-2xl font-extrabold text-white">How Pet Orbits plays</h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {featured.highlights.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {rest.length > 0 ? (
        <section className="mt-14">
          <h3 className="font-heading text-2xl font-extrabold text-white">Still in the nest</h3>
          <p className="mt-2 text-sm text-white/65">Not playable yet. They stay on this page so the studio list is honest.</p>
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
