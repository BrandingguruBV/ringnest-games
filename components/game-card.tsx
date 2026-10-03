"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PlayOnRoblox } from "@/components/play-on-roblox";
import { GENRE_LABELS, STATUS_LABELS, type Game } from "@/lib/games";
import { cn } from "@/lib/utils";

export function GameCard({ game }: { game: Game }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    node.style.setProperty("--tilt-x", `${(0.5 - y) * 10}deg`);
    node.style.setProperty("--tilt-y", `${(x - 0.5) * 12}deg`);
  };

  const onLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  };

  const live = game.status === "live";

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="game-tilt group h-full"
    >
      <Card
        className={cn(
          "h-full gap-0 overflow-hidden rounded-3xl border-0 bg-white/8 py-0 ring-1 ring-white/15 backdrop-blur-md",
          live && "shadow-[0_20px_60px_rgba(34,211,238,0.18)]",
        )}
      >
        <Link href={`/games/${game.slug}`} className="relative block aspect-[16/10] overflow-hidden">
          <Image
            src={game.thumbnail}
            alt={`${game.title} artwork`}
            fill
            className={cn(
              "object-cover transition duration-500",
              live ? "group-hover:scale-105" : "opacity-70 saturate-50",
            )}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-transparent to-transparent" />
          <Badge
            className={cn(
              "absolute top-3 left-3 h-6 rounded-full border-0 px-2.5 font-bold",
              live ? "bg-[#00e38c] text-[#052013]" : "bg-white/20 text-white",
            )}
          >
            {STATUS_LABELS[game.status]}
          </Badge>
        </Link>
        <CardContent className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <div className="flex flex-wrap gap-1.5">
              {game.genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className="h-5 rounded-full border-white/20 bg-white/5 text-[10px] font-semibold uppercase tracking-wider text-cyan-100"
                >
                  {GENRE_LABELS[genre]}
                </Badge>
              ))}
            </div>
            <h3 className="font-heading mt-2 text-2xl font-extrabold text-white drop-shadow">
              {game.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-white/70">{game.tagline}</p>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-3">
            <PlayOnRoblox href={game.playUrl} size="md" />
            <Link
              href={`/games/${game.slug}`}
              className="text-sm font-bold text-cyan-200 underline-offset-4 hover:text-white hover:underline"
            >
              View world
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
