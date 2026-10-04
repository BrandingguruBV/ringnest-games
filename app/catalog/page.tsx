import { PetCatalog } from "@/components/pet-catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "162 named pets from Pet Orbits. Search by rarity, biome, and name. Open the Pet Orbits landing for nests, Nest Club, passes, and packs.",
};

export default function CatalogPage() {
  return <PetCatalog />;
}
