import {
  BIOME_ORDER,
  RARITY_ORDER,
  pets,
  type CatalogPet,
  type PetBiome,
  type PetRarity,
} from "@/lib/pets";

export type PetFilters = {
  rarity: PetRarity | "all";
  biome: PetBiome | "all";
  query: string;
};

export const defaultPetFilters: PetFilters = {
  rarity: "all",
  biome: "all",
  query: "",
};

export function filterPets(list: CatalogPet[], filters: PetFilters): CatalogPet[] {
  const needle = filters.query.trim().toLowerCase();
  return list.filter((pet) => {
    if (filters.rarity !== "all" && pet.rarity !== filters.rarity) return false;
    if (filters.biome !== "all" && pet.biome !== filters.biome) return false;
    if (!needle) return true;
    const haystack = [pet.name, pet.id, pet.rarity, pet.biome, pet.hint].join(" ").toLowerCase();
    return haystack.includes(needle);
  });
}

export { BIOME_ORDER, RARITY_ORDER, pets };
