export type GameStatus = "live" | "coming-soon";
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
  universeId?: number;
  highlights: string[];
  stats: { label: string; value: string }[];
  accent: string;
};

export const GENRE_LABELS: Record<GameGenre, string> = {
  adventure: "Adventure",
  simulator: "Simulator",
};

export const STATUS_LABELS: Record<GameStatus, string> = {
  live: "Live",
  "coming-soon": "Coming soon",
};

export const PET_ORBITS_UNIVERSE_ID = 10769197443;

function petOrbitsPlayUrl(): string {
  const override = process.env.NEXT_PUBLIC_PET_ORBITS_PLAY_URL;
  if (override) return override;
  const placeId = process.env.NEXT_PUBLIC_PET_ORBITS_PLACE_ID;
  if (placeId) {
    return `https://www.roblox.com/games/${placeId}/Pet-Orbits`;
  }
  return `https://www.roblox.com/games/start?universeId=${PET_ORBITS_UNIVERSE_ID}`;
}

export const games: Game[] = [
  {
    slug: "pet-orbits",
    title: "Pet Orbits",
    shortTitle: "Pet Orbits",
    tagline: "Crash orbits. Hatch 156 pets. Run biome nests.",
    description:
      "One pet orbits you. Leave the SAFE ZONE and bump orbs to grow. Hatch named pets into pens that pay coins. Claim a base. Sprint through 12 biome nests and get the egg home before the guardian catches you. Made by Ringnest for phone and PC.",
    status: "live",
    genres: ["adventure", "simulator"],
    thumbnail: "/games/pet-orbits-thumb.jpg",
    icon: "/games/pet-orbits-icon.jpg",
    playUrl: petOrbitsPlayUrl(),
    universeId: PET_ORBITS_UNIVERSE_ID,
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
      "Pet Orbits is live first. The next Ringnest game will land here with its own thumbnail, filters, and Play on Roblox button. Same studio. New rules.",
    status: "coming-soon",
    genres: ["adventure"],
    thumbnail: "/brand/banner.jpg",
    icon: "/brand/mark.jpg",
    playUrl: null,
    highlights: [
      "Same Ringnest studio",
      "Will appear in this grid",
      "Filters will sort it the day it ships",
    ],
    stats: [
      { label: "Status", value: "Nesting" },
      { label: "Studio", value: "Ringnest" },
    ],
    accent: "#84e85a",
  },
];

export function getLiveGames(): Game[] {
  return games.filter((game) => game.status === "live");
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

export function featuredGame(): Game {
  return getLiveGames()[0] ?? games[0];
}
