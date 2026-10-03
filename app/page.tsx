import { FeaturedGame } from "@/components/featured-game";
import { GamesCatalog } from "@/components/games-catalog";
import { Hero } from "@/components/hero";
import { StudioBand } from "@/components/studio-band";
import { featuredGame } from "@/lib/games";

export default function HomePage() {
  const featured = featuredGame();

  return (
    <>
      <Hero />
      <FeaturedGame game={featured} />
      <GamesCatalog />
      <StudioBand />
    </>
  );
}
