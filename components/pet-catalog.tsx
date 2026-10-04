"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { defaultPetFilters, filterPets } from "@/lib/filter-pets";
import {
  BIOME_ORDER,
  RARITY_COLORS,
  RARITY_ORDER,
  pets,
  type PetBiome,
  type PetRarity,
} from "@/lib/pets";
import { cn } from "@/lib/utils";

export function PetCatalog() {
  const [filters, setFilters] = useState(defaultPetFilters);
  const visible = useMemo(() => filterPets(pets, filters), [filters]);

  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs font-extrabold tracking-[0.28em] text-amber-300 uppercase">
        Catalog
      </p>
      <h1 className="font-heading mt-1 text-4xl font-extrabold text-white sm:text-6xl">
        156 named pets
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
        Every hatchable pet in Pet Orbits. This is the Index from the game, not the
        Games list. Filter by rarity or biome. Coins listed are pen income per second.
      </p>

      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:p-5">
        <Input
          value={filters.query}
          onChange={(event) =>
            setFilters((current) => ({ ...current, query: event.target.value }))
          }
          placeholder="Search pets, biomes, hints"
          className="h-11 rounded-2xl border-white/15 bg-[#050814]/60 text-white placeholder:text-white/40"
          aria-label="Search pets"
        />
        <FilterRow
          label="Rarity"
          options={["all", ...RARITY_ORDER]}
          value={filters.rarity}
          names={{ all: "All", ...Object.fromEntries(RARITY_ORDER.map((r) => [r, r])) }}
          onChange={(rarity) =>
            setFilters((current) => ({ ...current, rarity: rarity as PetRarity | "all" }))
          }
        />
        <FilterRow
          label="Biome"
          options={["all", ...BIOME_ORDER]}
          value={filters.biome}
          names={{ all: "All", ...Object.fromEntries(BIOME_ORDER.map((b) => [b, b])) }}
          onChange={(biome) =>
            setFilters((current) => ({ ...current, biome: biome as PetBiome | "all" }))
          }
        />
      </div>

      <p className="mt-5 text-xs font-bold tracking-wider text-white/45 uppercase">
        {visible.length} of {pets.length} pets
      </p>

      {visible.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 py-16 text-center">
          <p className="font-heading text-2xl font-extrabold text-white">No pets in this filter</p>
          <p className="mt-2 text-sm text-white/65">Clear search or pick All.</p>
          <button
            type="button"
            className="mt-5 text-sm font-bold text-cyan-200 underline-offset-4 hover:underline"
            onClick={() => setFilters(defaultPetFilters)}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((pet) => (
            <li
              key={pet.id}
              className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 ring-1 ring-white/5"
            >
              <span
                className="mt-0.5 size-12 shrink-0 rounded-full shadow-[0_0_18px_rgba(255,255,255,0.12)] ring-2 ring-white/30"
                style={{ backgroundColor: pet.color }}
                aria-hidden
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="font-heading truncate text-lg font-extrabold text-white">
                    {pet.name}
                  </p>
                  <Badge
                    className="h-5 rounded-full border-0 px-2 text-[10px] font-bold text-[#052013]"
                    style={{ backgroundColor: RARITY_COLORS[pet.rarity] }}
                  >
                    {pet.rarity}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-white/55">
                  {pet.biome} | +{pet.income}/s
                </p>
                <p className="mt-1 text-sm text-white/75">{pet.hint}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FilterRow({
  label,
  options,
  value,
  names,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  names: Record<string, string>;
  onChange: (value: string) => void;
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
