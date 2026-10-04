export type GameStatus = "live" | "private" | "coming-soon";
export type GameGenre = "adventure" | "simulator";

export type Game = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  status: GameStatus;
  genres: GameGenre[];
  thumbnail: string;
  icon: string;
  playUrl: string | null;
  publicJoin: boolean;
  universeId?: number;
  placeId?: number;
  dashboardUrl?: string;
  highlights: string[];
  stats: { label: string; value: string }[];
  accent: string;
};

export const GENRE_LABELS: Record<GameGenre, string> = {
  adventure: "Adventure",
  simulator: "Simulator",
};

export const STATUS_LABELS: Record<GameStatus, string> = {
  live: "Live on Roblox",
  private: "Private on Roblox",
  "coming-soon": "Coming soon",
};

export const PET_ORBITS_UNIVERSE_ID = 10769197443;
export const PET_ORBITS_PLACE_ID = 85407099788309;
export const PET_ORBITS_PLAY_URL = `https://www.roblox.com/games/${PET_ORBITS_PLACE_ID}/Pet-Orbits`;
export const PET_ORBITS_DASHBOARD = `https://create.roblox.com/dashboard/creations/experiences/${PET_ORBITS_UNIVERSE_ID}/overview`;

function petOrbitsPlayUrl(): string {
  const override = process.env.NEXT_PUBLIC_PET_ORBITS_PLAY_URL;
  if (override) return override;
  const placeId = process.env.NEXT_PUBLIC_PET_ORBITS_PLACE_ID ?? String(PET_ORBITS_PLACE_ID);
  return `https://www.roblox.com/games/${placeId}/Pet-Orbits`;
}

export const games: Game[] = [
  {
    slug: "pet-orbits",
    title: "Pet Orbits",
    shortTitle: "Pet Orbits",
    tagline: "Crash orbits. Hatch 156 pets. Run biome nests.",
    description:
      "One pet orbits you. Leave the SAFE ZONE and bump orbs to grow. Hatch named pets into pens that pay coins. Claim a base. Sprint through 12 biome nests and get the egg home before the guardian catches you. Made by Ringnest for phone and PC.",
    status: "private",
    publicJoin: false,
    genres: ["adventure", "simulator"],
    thumbnail: "/games/pet-orbits-thumb.jpg",
    icon: "/games/pet-orbits-icon.jpg",
    playUrl: petOrbitsPlayUrl(),
    universeId: PET_ORBITS_UNIVERSE_ID,
    placeId: PET_ORBITS_PLACE_ID,
    dashboardUrl: PET_ORBITS_DASHBOARD,
    highlights: [
      "Orbit crash combat: bump orbs to steal mass",
      "156 named pets plus a weekly Limited egg",
      "12 biome nests from Meadow to Celestial",
      "16 claimable bases with coin pens",
      "SAFE ZONE hatch, shop, and trade",
      "Season track, crews, missions, and rebirth",
    ],
    stats: [
      { label: "Pets", value: "156" },
      { label: "Biomes", value: "12" },
      { label: "Bases", value: "16" },
    ],
    accent: "#22d3ee",
  },
  {
    slug: "next-world",
    title: "Next world",
    shortTitle: "Next world",
    tagline: "Another Ringnest world is forming in the nest.",
    description:
      "Pet Orbits is the first Ringnest game. The next world will land here with its own thumbnail, catalog entries, and Play on Roblox button. Same studio. New rules.",
    status: "coming-soon",
    publicJoin: false,
    genres: ["adventure"],
    thumbnail: "/brand/banner.jpg",
    icon: "/brand/mark.jpg",
    playUrl: null,
    highlights: [
      "Same Ringnest studio",
      "Will appear on Games the day it ships",
      "Pets and items will join the Catalog",
    ],
    stats: [
      { label: "Status", value: "Nesting" },
      { label: "Studio", value: "Ringnest" },
    ],
    accent: "#84e85a",
  },
];

export function getLiveGames(): Game[] {
  return games.filter((game) => game.status === "live" || game.status === "private");
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

export function featuredGame(): Game {
  return getLiveGames()[0] ?? games[0];
}
