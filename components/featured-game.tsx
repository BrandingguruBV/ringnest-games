import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import type { Game } from "@/lib/games";

export function FeaturedGame({ game }: { game: Game }) {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-3 pb-6 sm:px-6 sm:pb-8">
      <div className="overflow-hidden rounded-[1.5rem] ring-1 ring-white/15 shadow-[0_30px_80px_rgba(34,211,238,0.16)] sm:rounded-[2rem]">
        <div className="relative aspect-[4/5] min-h-[320px] sm:aspect-[2/1] sm:min-h-[360px] md:aspect-[16/9]">
          <Image
            src={game.thumbnail}
            alt={`${game.title} key art`}
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="100vw"
          />
          <div className="media-scrim absolute inset-0" />
          <div className="media-copy absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-10">
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
            <h2 className="font-heading mt-3 text-4xl font-extrabold text-white sm:text-6xl">
              {game.title}
            </h2>
            <p className="mt-2 max-w-xl text-base font-semibold leading-relaxed text-white sm:text-lg">
              {game.tagline}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PlayOnRoblox href={game.playUrl} />
              <Link
                href={`/games/${game.slug}`}
                className="inline-flex h-14 items-center rounded-2xl px-5 text-base font-extrabold text-white/90 underline-offset-4 hover:underline"
              >
                Inside the game
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
