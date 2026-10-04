import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { KeyArtHero } from "@/components/key-art-hero";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import type { Game } from "@/lib/games";

export function FeaturedGame({ game }: { game: Game }) {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-3 pb-6 sm:px-6 sm:pb-8">
      <KeyArtHero
        src={game.thumbnail}
        alt={`${game.title} key art`}
        priority
        className="shadow-[0_30px_80px_rgba(34,211,238,0.16)]"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            className={
              game.status === "coming-soon"
                ? "h-7 rounded-full border-0 bg-white/20 px-2.5 text-sm font-bold text-white"
                : "h-7 rounded-full border-0 bg-[#00e38c] px-2.5 text-sm font-bold text-[#052013]"
            }
          >
            {game.status === "coming-soon" ? "Coming soon" : "Live now"}
          </Badge>
          <Badge className="h-7 rounded-full border-0 bg-white/20 px-2.5 text-sm font-bold text-white">
            A Ringnest game
          </Badge>
        </div>
        <h2 className="font-heading mt-3 text-[2.2rem] leading-none font-extrabold text-white sm:text-5xl md:text-6xl">
          {game.title}
        </h2>
        <p className="mt-2 max-w-xl text-base font-semibold leading-snug text-white/94 sm:text-lg">
          {game.tagline}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <PlayOnRoblox href={game.playUrl} className="w-full sm:w-auto" />
          <Link
            href={`/games/${game.slug}`}
            className="inline-flex h-12 items-center justify-center rounded-2xl px-2 text-base font-extrabold text-white/90 underline-offset-4 hover:underline sm:h-14 sm:px-5"
          >
            Inside the game
          </Link>
        </div>
      </KeyArtHero>
    </section>
  );
}
