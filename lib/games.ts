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
  live: "Play now",
  private: "Play now",
  "coming-soon": "Coming soon",
};

export const PET_ORBITS_UNIVERSE_ID = 10769197443;
export const PET_ORBITS_PLACE_ID = 85407099788309;
export const PET_ORBITS_PLAY_URL = `https://www.roblox.com/games/${PET_ORBITS_PLACE_ID}/Pet-Orbits`;
export const NEST_CLUB_ID = "EXP-152779782063522385";

function petOrbitsPlayUrl(): string {
  const override = process.env.NEXT_PUBLIC_PET_ORBITS_PLAY_URL;
  if (override) return override;
  const placeId = process.env.NEXT_PUBLIC_PET_ORBITS_PLACE_ID ?? String(PET_ORBITS_PLACE_ID);
  return `https://www.roblox.com/games/${placeId}/Pet-Orbits`;
}

function nestClubSubscribeUrl(): string {
  const override = process.env.NEXT_PUBLIC_NEST_CLUB_SUBSCRIBE_URL;
  if (override) return override;
  return `${petOrbitsPlayUrl()}#!/store`;
}

export const nestClub = {
  id: NEST_CLUB_ID,
  name: "Nest Club",
  price: "199 Robux a month",
  subscribeUrl: nestClubSubscribeUrl(),
  headline: "Extra coins, extra nest grace, a Lucky Egg each month.",
  body: "Nest Club is the Pet Orbits monthly. Subscribe on Roblox to keep the perks while you play. Cosmetics drop if you cancel. Fast Hatch and Extra Pens stay separate. The full game stays free.",
  perks: [
    "+25% coins while subscribed",
    "+2 seconds HOME grace on nests",
    "1 Lucky Egg each month",
    "Nest Wake trail and Club title",
  ],
};

export const games: Game[] = [
  {
    slug: "pet-orbits",
    title: "Pet Orbits",
    shortTitle: "Pet Orbits",
    tagline: "Crash orbits. Hatch 162 pets. Run 12 biome nests.",
    description:
      "One pet orbits you. Leave the safe zone and bump orbs to grow. Hatch 162 named pets into pens that pay coins. Claim a base. Sprint through 12 biome nests and get the egg home before the guardian catches you. 14-day seasons, weekly Limited pets, Nest Club, and a VIP shop. Playable free. Made by Ringnest for phone and PC.",
    status: "live",
    publicJoin: true,
    genres: ["adventure", "simulator"],
    thumbnail: "/games/pet-orbits-thumb.jpg",
    icon: "/games/pet-orbits-icon.jpg",
    playUrl: petOrbitsPlayUrl(),
    universeId: PET_ORBITS_UNIVERSE_ID,
    placeId: PET_ORBITS_PLACE_ID,
    highlights: [
      "Crash orbits to grow mass",
      "162 named pets, 6 weekly Limited, 6 Apex",
      "12 biome nests from Meadow to Celestial",
      "16 bases with coin-earning pens",
      "Hatch, shop, and trade in the safe zone",
      "14-day seasons, Nest Club, missions, crews",
    ],
    stats: [
      { label: "Pets", value: "162" },
      { label: "Biomes", value: "12" },
      { label: "Bases", value: "16" },
    ],
    accent: "#22d3ee",
  },
  {
    slug: "next-world",
    title: "New adventure",
    shortTitle: "New adventure",
    tagline: "A new Ringnest adventure is on the way.",
    description:
      "A new Ringnest game is on the way. It will have its own look, pets, and Play on Roblox button.",
    status: "coming-soon",
    publicJoin: false,
    genres: ["adventure"],
    thumbnail: "/brand/banner.jpg",
    icon: "/brand/mark.jpg",
    playUrl: null,
    highlights: [
      "Made by Ringnest",
      "A new world to explore",
      "New pets in the Catalog",
    ],
    stats: [
      { label: "Status", value: "Coming soon" },
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
