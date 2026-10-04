import { PetCatalog } from "@/components/pet-catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "The Pet Orbits catalog: 156 named pets across 12 biomes, plus weekly Limiteds. Not the Games list.",
};

export default function CatalogPage() {
  return <PetCatalog />;
}
