import { GamesCatalog } from "@/components/games-catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Every Ringnest game in one nest. Pet Orbits is live with Play on Roblox. More worlds will filter in as they hatch.",
};

export default function GamesPage() {
  return <GamesCatalog heading="The nest" />;
}
