import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { NestClubBand } from "@/components/nest-club";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import { GENRE_LABELS, STATUS_LABELS, games, getGameBySlug } from "@/lib/games";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: "Game" };
  return {
    title: game.title,
    description: game.tagline,
    openGraph: {
      title: `${game.title} | Ringnest`,
      description: game.tagline,
      images: [game.thumbnail],
    },
  };
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const joinable = game.publicJoin;

  return (
    <article className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <Link
        href="/games"
        className="text-sm font-bold text-cyan-200 underline-offset-4 hover:text-white hover:underline"
      >
        Back to games
      </Link>

      <div className="mt-6 overflow-hidden rounded-[2rem] ring-1 ring-white/15">
        <div className="relative aspect-[16/9] min-h-[240px]">
          <Image
            src={game.thumbnail}
            alt={`${game.title} artwork`}
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/20 to-transparent" />
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge
              className={
                joinable
                  ? "h-6 rounded-full border-0 bg-[#00e38c] font-bold text-[#052013]"
                  : game.status === "private"
                    ? "h-6 rounded-full border-0 bg-amber-300 font-bold text-[#3a2200]"
                    : "h-6 rounded-full border-0 bg-white/15 font-bold text-white"
              }
            >
              {STATUS_LABELS[game.status]}
            </Badge>
            {game.genres.map((genre) => (
              <Badge
                key={genre}
                variant="outline"
                className="h-6 rounded-full border-white/20 bg-white/5 font-semibold text-cyan-100"
              >
                {GENRE_LABELS[genre]}
              </Badge>
            ))}
          </div>
          <h1 className="font-heading mt-4 text-4xl font-extrabold text-white sm:text-6xl">
            {game.title}
          </h1>
          <p className="mt-3 text-lg text-amber-200 sm:text-xl">{game.tagline}</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75">
            {game.description}
          </p>
          <div className="mt-8">
            <PlayOnRoblox href={game.playUrl} />
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {game.highlights.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <aside className="h-fit rounded-[1.6rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <p className="text-xs font-extrabold tracking-[0.22em] text-white/45 uppercase">
            At a glance
          </p>
          <dl className="mt-4 grid grid-cols-3 gap-3">
            {game.stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-[#050814]/60 p-3 text-center">
                <dt className="text-[10px] font-bold tracking-wider text-white/50 uppercase">
                  {stat.label}
                </dt>
                <dd className="font-heading mt-1 text-2xl font-extrabold text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="relative mt-6 overflow-hidden rounded-2xl ring-1 ring-white/10">
            <Image
              src={game.icon}
              alt=""
              width={640}
              height={640}
              unoptimized
              className="h-auto w-full"
            />
          </div>
        </aside>
      </div>
      {game.slug === "pet-orbits" ? (
        <NestClubBand className="mt-12 px-0 py-0 sm:px-0 sm:py-0" />
      ) : null}
    </article>
  );
}
