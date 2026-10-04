"use client";

import Link from "next/link";
import { GameCard } from "@/components/game-card";
import { games } from "@/lib/games";

export function WorldsGrid({
  heading = "Play now",
  kicker = "Games",
  intro = "Pet Orbits is live on Roblox. Meet every pet in the Catalog.",
}: {
  heading?: string;
  kicker?: string;
  intro?: string;
}) {
  return (
    <section id="games" className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold tracking-[0.28em] text-cyan-300 uppercase">
            {kicker}
          </p>
          <h2 className="font-heading mt-1 text-3xl font-extrabold text-white sm:text-5xl">
            {heading}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/65 sm:text-base">{intro}</p>
        </div>
        <Link
          href="/games"
          className="text-sm font-bold text-cyan-200 underline-offset-4 hover:text-white hover:underline"
        >
          See all games
        </Link>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </section>
  );
}
