"use client";

import { useMemo, useState } from "react";
import { GameCard } from "@/components/game-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { defaultFilters, filterGames } from "@/lib/filter-games";
import {
  GENRE_LABELS,
  STATUS_LABELS,
  games,
  type GameGenre,
  type GameStatus,
} from "@/lib/games";
import { cn } from "@/lib/utils";

const statusOptions: Array<GameStatus | "all"> = ["all", "live", "coming-soon"];
const genreOptions: Array<GameGenre | "all"> = ["all", "adventure", "simulator"];

export function GamesCatalog({
  heading = "All Ringnest games",
  compact = false,
}: {
  heading?: string;
  compact?: boolean;
}) {
  const [filters, setFilters] = useState(defaultFilters);
  const visible = useMemo(() => filterGames(games, filters), [filters]);

  return (
    <section id="games" className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold tracking-[0.28em] text-cyan-300 uppercase">
            Games
          </p>
          <h2 className="font-heading mt-1 text-3xl font-extrabold text-white sm:text-5xl">
            {heading}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/65 sm:text-base">
            One live world today. Filters are ready for the rest of the nest.
          </p>
        </div>
        <Badge className="h-7 w-fit rounded-full border-0 bg-white/10 px-3 text-xs font-bold text-white">
          {visible.length} {visible.length === 1 ? "world" : "worlds"}
        </Badge>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:p-5">
        <Input
          value={filters.query}
          onChange={(event) =>
            setFilters((current) => ({ ...current, query: event.target.value }))
          }
          placeholder="Search games"
          className="h-11 rounded-2xl border-white/15 bg-[#050814]/60 text-white placeholder:text-white/40"
          aria-label="Search games"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FilterRow
            label="Status"
            options={statusOptions}
            value={filters.status}
            names={{ all: "All", ...STATUS_LABELS }}
            onChange={(status) => setFilters((current) => ({ ...current, status }))}
          />
          <FilterRow
            label="Genre"
            options={genreOptions}
            value={filters.genre}
            names={{ all: "All", ...GENRE_LABELS }}
            onChange={(genre) => setFilters((current) => ({ ...current, genre }))}
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 py-16 text-center">
          <p className="font-heading text-2xl font-extrabold text-white">No worlds in this filter</p>
          <p className="mt-2 text-sm text-white/65">
            Clear search or pick All. More Ringnest games will land in this grid.
          </p>
          <button
            type="button"
            className="mt-5 text-sm font-bold text-cyan-200 underline-offset-4 hover:underline"
            onClick={() => setFilters(defaultFilters)}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "mt-8 grid gap-6",
            compact ? "sm:grid-cols-1" : "sm:grid-cols-2",
          )}
        >
          {visible.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      )}
    </section>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  names,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  names: Record<string, string>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-extrabold tracking-[0.2em] text-white/45 uppercase">
        {label}
      </span>
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "h-8 rounded-full px-3 text-xs font-bold transition",
              active
                ? "bg-[#00e38c] text-[#052013] shadow-[0_4px_0_#0a7a3e]"
                : "bg-white/8 text-white/80 ring-1 ring-white/10 hover:bg-white/14",
            )}
          >
            {names[option] ?? option}
          </button>
        );
      })}
    </div>
  );
}
