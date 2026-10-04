import { AboutBand } from "@/components/about-band";
import { FeaturedGame } from "@/components/featured-game";
import { Hero } from "@/components/hero";
import { WorldsGrid } from "@/components/worlds-grid";
import { featuredGame } from "@/lib/games";

export default function HomePage() {
  const featured = featuredGame();

  return (
    <>
      <Hero />
      <FeaturedGame game={featured} />
      <WorldsGrid />
      <AboutBand />
    </>
  );
}
