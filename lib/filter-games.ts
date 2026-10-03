import type { Game, GameGenre, GameStatus } from "@/lib/games";

export type GameFilters = {
  status: GameStatus | "all";
  genre: GameGenre | "all";
  query: string;
};

export const defaultFilters: GameFilters = {
  status: "all",
  genre: "all",
  query: "",
};

export function filterGames(catalog: Game[], filters: GameFilters): Game[] {
  const needle = filters.query.trim().toLowerCase();

  return catalog.filter((game) => {
    if (filters.status !== "all" && game.status !== filters.status) {
      return false;
    }
    if (filters.genre !== "all" && !game.genres.includes(filters.genre)) {
      return false;
    }
    if (!needle) return true;
    const haystack = [
      game.title,
      game.tagline,
      game.description,
      ...game.genres,
      game.status,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}
