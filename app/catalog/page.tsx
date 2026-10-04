import { PetCatalog } from "@/components/pet-catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "156 named pets from Pet Orbits. Search by rarity, biome, and name.",
};

export default function CatalogPage() {
  return <PetCatalog />;
}
